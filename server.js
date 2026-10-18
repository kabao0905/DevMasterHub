const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { napEnv } = require('./lib/env.js');
const { napGiaoTrinh } = require('./lib/curriculum.js');
const { laUrlReact } = require('./lib/route-owner.js');
const { chuanHoaYeuCauAi, MO_HINH_THEO_VIEC, SUY_NGHI_GEMINI, suyNghiCho, laGemini3 } = require('./lib/ai-guard.js');
const { taoJev } = require('./lib/jev.js');
const { chuanHoaYeuCauDocViec, docViecTuLink } = require('./lib/doc-viec-link.js');
const { doanThanhPho, lamSachTuKhoa, chiNhanHttp } = require('./lib/job-query.js');
const { chuanHoaYeuCauChay, chayCpp } = require('./lib/chay-cpp.js');
const { taiTheoChuyenHuong, layTieuDe } = require('./lib/net-guard.js');
const { trichNoiDungTrang } = require('./lib/trich-trang.js');
const { moPhongBi } = require('./lib/phong-bi.js');

try {
  napEnv(fs.readFileSync(path.join(__dirname, '.env'), 'utf8'));
} catch (e) {
  console.warn('ℹ️ Running without local .env file. Reading from process.env');
}

const app = express();
const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';

const AI_TIMEOUT_MS = 90000;
const JOBS_TIMEOUT_MS = 8000;
const coHan = ms => AbortSignal.timeout(ms);

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nlkljhpqwepabglrqkmz.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_0s-SglEeMENWRqgbC2QWuQ_w0pzWJMe';

const DIST_DIR = process.env.DIST_DIR || path.join(__dirname, 'dist');
const CHE_DO_DEV = process.argv.includes('--dev');
const REACT_HTML = CHE_DO_DEV ? null : (() => {
  try { return fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8'); } catch { return null; }
})();
let vite = null;
const coAppReact = () => (CHE_DO_DEV ? !!vite : !!REACT_HTML);
const BASE_URL = (process.env.BASE_URL || 'https://devmaster-hub.onrender.com').replace(/\/$/, '');
const ALLOWED_ORIGINS = [BASE_URL, 'http://localhost:' + PORT, 'http://127.0.0.1:' + PORT];

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.get('/index.html', (req, res) => {
  const q = req.originalUrl.indexOf('?');
  res.redirect(301, q === -1 ? '/' : '/' + req.originalUrl.slice(q));
});

app.use((req, res, next) => (vite && !req.path.startsWith('/api') ? vite.middlewares(req, res, next) : next()));

if (!CHE_DO_DEV) {
  app.use(express.static(DIST_DIR, {
    index: false,
    setHeaders: (res, filePath) => {
      const coHash = /[\\/]assets[\\/][^\\/]+-[A-Za-z0-9_-]{6,}\.[a-z0-9]+$/i.test(filePath);
      res.setHeader('Cache-Control', coHash ? 'public, max-age=31536000, immutable' : 'no-cache');
    }
  }));
}


const rateLimitMap = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, rec] of rateLimitMap) if (now > rec.resetAt) rateLimitMap.delete(key);
}, 60000).unref();

function rateLimit({ max, windowMs = 60000, scope }) {
  return (req, res, next) => {
    const key = scope + ':' + (req.user ? 'u_' + req.user.id : 'ip_' + req.ip);
    const now = Date.now();
    let rec = rateLimitMap.get(key);
    if (!rec || now > rec.resetAt) rec = { count: 0, resetAt: now + windowMs };
    rec.count++;
    rateLimitMap.set(key, rec);
    if (rec.count > max) {
      res.setHeader('Retry-After', Math.ceil((rec.resetAt - now) / 1000));
      return res.status(429).json({ error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.' });
    }
    next();
  };
}

function sameOrigin(req, res, next) {
  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

async function requireUser(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) {
    return res.status(401).json({ error: 'Bạn cần đăng nhập để dùng tính năng AI.', code: 'AUTH_REQUIRED' });
  }
  try {
    const r = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: { Authorization: 'Bearer ' + token, apikey: SUPABASE_ANON_KEY },
      signal: AbortSignal.timeout(5000)
    });
    if (!r.ok) {
      return res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', code: 'AUTH_EXPIRED' });
    }
    req.user = await r.json();
    next();
  } catch (err) {
    console.error('[Auth] Không xác thực được token:', err.message);
    return res.status(503).json({ error: 'Không xác thực được. Vui lòng thử lại.' });
  }
}

async function callGemini(system, messages, maxTokens = 4096) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

  const formattedContents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent';
  const payload = {
    system_instruction: system ? { parts: [{ text: system }] } : undefined,
    contents: formattedContents,
    generationConfig: {
      maxOutputTokens: maxTokens + SUY_NGHI_GEMINI.themToken,
      thinkingConfig: { thinkingLevel: SUY_NGHI_GEMINI.muc }
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
    body: JSON.stringify(payload),
    signal: coHan(AI_TIMEOUT_MS)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API Error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  return parts.filter(p => !p.thought && typeof p.text === 'string').map(p => p.text).join('');
}

async function callDeepSeek(system, messages, temperature = 0.7, maxTokens = 4096) {
  if (!DEEPSEEK_API_KEY) throw new Error('DEEPSEEK_API_KEY not configured');

  const formattedMessages = [];
  if (system) formattedMessages.push({ role: 'system', content: system });
  messages.forEach(m => formattedMessages.push({ role: m.role, content: m.content }));

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: formattedMessages,
      temperature,
      max_tokens: maxTokens
    }),
    signal: coHan(AI_TIMEOUT_MS)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`DeepSeek API Error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callGroq(system, messages, temperature = 0.7, maxTokens = 4096) {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured');

  const formattedMessages = [];
  if (system) formattedMessages.push({ role: 'system', content: system });
  messages.forEach(m => formattedMessages.push({ role: m.role, content: m.content }));

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: formattedMessages,
      temperature,
      max_tokens: maxTokens
    }),
    signal: coHan(AI_TIMEOUT_MS)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API Error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callOpenRouter(system, messages, temperature = 0.7, maxTokens = 4096, taskType = 'general') {
  if (!OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY not configured');

  const selectedModel = MO_HINH_THEO_VIEC[taskType] || MO_HINH_THEO_VIEC.general;
  console.log(`[OpenRouter] Routing taskType="${taskType}" -> Model="${selectedModel}"`);

  const formattedMessages = [];
  if (system) formattedMessages.push({ role: 'system', content: system });
  messages.forEach(m => formattedMessages.push({ role: m.role, content: m.content }));

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://devmaster-hub.onrender.com',
      'X-Title': 'DevMaster Hub'
    },
    body: JSON.stringify(laGemini3(selectedModel)
      ? { model: selectedModel, messages: formattedMessages, max_tokens: maxTokens + suyNghiCho(taskType).themToken, reasoning: { effort: suyNghiCho(taskType).muc } }
      : { model: selectedModel, messages: formattedMessages, temperature, max_tokens: maxTokens }),
    signal: coHan(AI_TIMEOUT_MS)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter API Error ${res.status} (${selectedModel}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callClaude(system, messages, maxTokens = 4096) {
  if (!CLAUDE_API_KEY) throw new Error('CLAUDE_API_KEY not configured');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'server-side-fallback-2026-07-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-5-5',
      max_tokens: maxTokens,
      system: system || 'You are a programming instructor. Always respond in helpful structured format.',
      messages,
      fallbacks: 'default'
    }),
    signal: coHan(AI_TIMEOUT_MS)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API Error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  if (data.stop_reason === 'refusal') throw new Error('Claude từ chối yêu cầu (refusal)');
  return (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
}

app.post('/api/ai', sameOrigin, moPhongBi, requireUser, rateLimit({ max: 30, scope: 'ai' }), async (req, res) => {
  const yc = chuanHoaYeuCauAi(req.body);
  if (yc.loi) return res.status(400).json({ error: yc.loi });
  const { system, messages, temperature, maxTokens, taskType } = yc;

  const providers = [
    { name: 'OpenRouter (' + taskType + ')', fn: () => callOpenRouter(system, messages, temperature, maxTokens, taskType), enabled: !!OPENROUTER_API_KEY },
    { name: 'Gemini (Google)', fn: () => callGemini(system, messages, maxTokens), enabled: !!GEMINI_API_KEY },
    { name: 'DeepSeek', fn: () => callDeepSeek(system, messages, temperature, maxTokens), enabled: !!DEEPSEEK_API_KEY },
    { name: 'Claude (Anthropic)', fn: () => callClaude(system, messages, maxTokens), enabled: !!CLAUDE_API_KEY },
    { name: 'Groq (Llama 3.3)', fn: () => callGroq(system, messages, temperature, maxTokens), enabled: !!GROQ_API_KEY }
  ];

  const activeProviders = providers.filter(p => p.enabled);

  if (activeProviders.length === 0) {
    return res.status(400).json({
      error: 'Chưa cấu hình API Key AI nào. Vui lòng thêm GEMINI_API_KEY, DEEPSEEK_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY hoặc CLAUDE_API_KEY vào .env hoặc Render Environment Variables.'
    });
  }

  let lastError = null;
  for (const provider of activeProviders) {
    try {
      console.log(`[AI Router] Attempting provider: ${provider.name}...`);
      const text = await provider.fn();
      if (!text) throw new Error('Phản hồi rỗng');
      console.log(`[AI Router] Success with ${provider.name}!`);

      return res.json({
        content: [{ type: 'text', text }],
        provider: provider.name
      });
    } catch (err) {
      console.warn(`[AI Router] Provider ${provider.name} failed:`, err.message);
      lastError = err;

    }
  }

  res.status(500).json({
    error: 'Tất cả các nhà cung cấp AI đều đang bận hoặc lỗi. Vui lòng thử lại sau.',
    details: lastError ? lastError.message : 'Unknown error'
  });
});

app.post('/api/run-cpp', sameOrigin, moPhongBi, requireUser, rateLimit({ max: 20, scope: 'run-cpp' }), async (req, res) => {
  const yc = chuanHoaYeuCauChay(req.body);
  if (yc.loi) return res.status(400).json({ error: yc.loi });
  try {
    res.json(await chayCpp(yc));
  } catch (err) {
    console.error('[run-cpp] Error:', err && err.message);
    res.status(502).json({ error: 'Không chạy được code lúc này (dịch vụ biên dịch bận). Thử lại sau ít phút.' });
  }
});

app.get('/api/health', (req, res) => {
  const activeProviders = [];
  if (GEMINI_API_KEY) activeProviders.push('Gemini');
  if (DEEPSEEK_API_KEY) activeProviders.push('DeepSeek');
  if (GROQ_API_KEY) activeProviders.push('Groq');
  if (OPENROUTER_API_KEY) activeProviders.push('OpenRouter');
  if (CLAUDE_API_KEY) activeProviders.push('Claude');

  res.json({
    status: 'ok',
    aiEnabled: activeProviders.length > 0,
    activeProviders,
    timestamp: new Date().toISOString()
  });
});

const TECH_ROLE_SYNONYMS = {
  devops: ['devops', 'sre', 'site reliability', 'cloud', 'infrastructure', 'platform', 'kubernetes', 'docker', 'ci/cd', 'aws', 'terraform', 'sysadmin', 'system engineer', 'linux'],
  frontend: ['frontend', 'front-end', 'front end', 'react', 'vue', 'angular', 'javascript', 'typescript', 'ui/ux', 'web developer', 'html/css', 'next.js', 'tailwind'],
  react: ['react', 'frontend', 'front-end', 'javascript', 'typescript', 'next.js', 'web developer'],
  python: ['python', 'backend', 'django', 'fastapi', 'data engineer', 'machine learning', 'ai', 'data science'],
  backend: ['backend', 'back-end', 'back end', 'node', 'express', 'python', 'django', 'fastapi', 'java', 'spring', 'golang', 'rust', 'c#', '.net', 'api', 'ruby', 'rails', 'php', 'laravel', 'sql', 'database'],
  fullstack: ['fullstack', 'full-stack', 'full stack', 'software engineer', 'software developer', 'web developer'],
  mobile: ['mobile', 'flutter', 'react native', 'ios', 'android', 'swift', 'kotlin'],
  ai: ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'data scientist', 'data engineer', 'nlp', 'llm', 'mlops', 'computer vision'],
  data: ['data engineer', 'data analyst', 'data science', 'database', 'sql', 'etl', 'big data', 'bi', 'analytics'],
  security: ['security', 'cybersecurity', 'infosec', 'penetration tester', 'soc', 'appsec', 'cloud security'],
  firmware: ['embedded', 'nhúng', 'microcontroller', 'hardware', 'c++', 'c/c++', 'iot', 'stm32', 'rtos', 'arm', 'kỹ sư phần mềm nhúng'],
  embedded: ['firmware', 'nhúng', 'microcontroller', 'hardware', 'c++', 'c/c++', 'iot', 'stm32', 'rtos', 'arm', 'kỹ sư phần mềm nhúng'],
  qa: ['qa', 'tester', 'quality assurance', 'automation test', 'sdit', 'test engineer']
};

const NON_IT_BLACKLIST = [
  'writer', 'writing', 'copywriter', 'content creator', 'editor', 'translator', 'medical', 'nurse', 'patient', 'doctor', 'clinic', 'dentist',
  'accountant', 'accounting', 'accounts assistant', 'finance manager', 'bookkeeper',
  'sales', 'sales executive', 'account executive', 'cold outreach', 'lead generator',
  'marketing', 'seo specialist', 'social media', 'growth marketer', 'brand manager',
  'customer support', 'customer service', 'support agent', 'virtual assistant', 'receptionist',
  'pedreiro', 'driver', 'warehouse', 'cleaner', 'plumber', 'electrician', 'mechanic',
  'recruiter', 'hr manager', 'talent acquisition', 'payroll',
  'lawyer', 'legal counsel', 'paralegal'
];

const tomTat = (html, n) => String(html || '').replace(/<[^<>]*>/g, '').substring(0, n) + '...';

async function layVietnamWorks(cleanTechQuery, coreTech, isVi) {
  const tim = async query => {
    const r = await fetch('https://ms.vietnamworks.com/job-search/v1.0/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      body: JSON.stringify({ query, page: 0, size: 25 }),
      signal: coHan(JOBS_TIMEOUT_MS)
    });
    return r.ok ? ((await r.json()).data || []) : [];
  };

  let vnItems = await tim(cleanTechQuery || 'developer');
  if (vnItems.length === 0 && coreTech && coreTech !== cleanTechQuery) {
    console.log(`[Jobs] VietnamWorks 0 results for "${cleanTechQuery}", retrying with coreTech "${coreTech}"`);
    vnItems = await tim(coreTech);
  }

  return vnItems.map(j => {
    const cityId = j.workingLocations?.[0]?.cityId;
    const cityName = ((j.workingLocations?.[0]?.cityNameVI || j.workingLocations?.[0]?.cityName || '') + ' ' + (j.address || '')).toLowerCase();

    const isHcm = (cityId === 29 || cityName.includes('hồ chí minh') || cityName.includes('ho chi minh') || cityName.includes('hcm') || cityName.includes('sài gòn') || cityName.includes('thủ đức'));
    const isHn = (cityId === 24 || cityName.includes('hà nội') || cityName.includes('ha noi'));
    const isDanang = (cityId === 17 || cityName.includes('đà nẵng') || cityName.includes('da nang'));
    const isRemote = (cityId === 70 || cityName.includes('quốc tế') || (j.jobTitle || '').toLowerCase().includes('remote') || cityName.includes('remote'));

    let displayLoc = isVi ? 'Việt Nam' : 'Vietnam';
    if (isHcm) displayLoc = isVi ? 'TP. Hồ Chí Minh' : 'Ho Chi Minh City, VN';
    else if (isHn) displayLoc = isVi ? 'Hà Nội' : 'Hanoi, VN';
    else if (isDanang) displayLoc = isVi ? 'Đà Nẵng' : 'Da Nang, VN';
    else if (isRemote) displayLoc = 'Remote Global';

    let salaryStr = j.prettySalary || (j.salary ? j.salary : '');
    if (!isVi && salaryStr) {
      salaryStr = salaryStr
        .replace(/Thương lượng/gi, 'Negotiable')
        .replace(/Tới\s*/gi, 'Up to ')
        .replace(/Lên tới\s*/gi, 'Up to ')
        .replace(/đ\/tháng/gi, 'VND/mo')
        .replace(/triệu/gi, 'M')
        .replace(/tr/gi, 'M');
    }

    const tieuDe = (j.jobTitle || '').toLowerCase();
    const isPartTime = (j.typeWorkingId === 2 || tieuDe.includes('part time') || tieuDe.includes('part-time'));
    const isIntern = tieuDe.includes('intern') || tieuDe.includes('fresher') || tieuDe.includes('thực tập');

    return {
      title: j.jobTitle || 'Software Engineer',
      company_name: j.companyName || (isVi ? 'Công ty Công nghệ' : 'Tech Company'),
      company_logo: chiNhanHttp(j.companyLogo),
      url: j.alias ? `https://www.vietnamworks.com/${encodeURIComponent(j.alias)}-${encodeURIComponent(j.jobId)}-jv` : `https://www.vietnamworks.com/${encodeURIComponent(j.jobId)}-jv`,
      location: displayLoc,
      isHcm,
      isHn,
      isDanang,
      is_remote: isRemote,
      employment_type: isIntern ? 'INTERN' : (isPartTime ? 'PARTTIME' : 'FULLTIME'),
      salary: salaryStr,
      description_snippet: tomTat(j.jobDescription || j.summary, 220),
      posted_at: j.prettyApprovedOn || j.approvedOnText || '',
      source: 'VietnamWorks',
      tags: (j.skills || []).map(s => s.skillName).filter(Boolean)
    };
  });
}

const ngoaiVN = { isHcm: false, isHn: false, isDanang: false };

async function layRemoteOK(tuKhoa) {
  const r = await fetch(`https://remoteok.com/api?tag=${encodeURIComponent(tuKhoa)}`, {
    headers: { 'User-Agent': 'DevMasterHub/1.0' }, signal: coHan(JOBS_TIMEOUT_MS)
  });
  if (!r.ok) return [];
  const data = await r.json();
  if (!Array.isArray(data)) return [];
  return data.filter(j => j.id).slice(0, 10).map(j => ({
    ...ngoaiVN,
    title: j.position || 'Software Engineer',
    company_name: j.company || 'Tech Company',
    company_logo: chiNhanHttp(j.company_logo),
    url: chiNhanHttp(j.url),
    location: j.location || 'Remote Global',
    is_remote: true,
    employment_type: 'FULLTIME',
    salary: j.salary_min && j.salary_max ? `$${j.salary_min.toLocaleString()} - $${j.salary_max.toLocaleString()}` : '',
    description_snippet: tomTat(j.description, 200),
    posted_at: j.date || '',
    source: 'RemoteOK',
    tags: j.tags || []
  }));
}

async function layArbeitnow(tuKhoa) {
  const r = await fetch(`https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(tuKhoa)}`, { signal: coHan(JOBS_TIMEOUT_MS) });
  if (!r.ok) return [];
  return ((await r.json()).data || []).slice(0, 8).map(j => ({
    ...ngoaiVN,
    title: j.title || 'Developer',
    company_name: j.company_name || 'Tech Company',
    company_logo: null,
    url: chiNhanHttp(j.url),
    location: j.location || 'Remote Global',
    is_remote: j.remote || false,
    employment_type: 'FULLTIME',
    salary: '',
    description_snippet: tomTat(j.description, 200),
    posted_at: j.created_at || '',
    source: 'Arbeitnow',
    tags: j.tags || []
  }));
}

async function layRemotive(tuKhoa) {
  const r = await fetch(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(tuKhoa)}&limit=10`, { signal: coHan(JOBS_TIMEOUT_MS) });
  if (!r.ok) return [];
  return ((await r.json()).jobs || []).slice(0, 8).map(j => ({
    ...ngoaiVN,
    title: j.title || 'Developer',
    company_name: j.company_name || 'Tech Company',
    company_logo: chiNhanHttp(j.company_logo),
    url: chiNhanHttp(j.url),
    location: j.candidate_required_location || 'Remote Global',
    is_remote: true,
    employment_type: j.job_type || 'full_time',
    salary: j.salary || '',
    description_snippet: tomTat(j.description, 200),
    posted_at: j.publication_date || '',
    source: 'Remotive',
    tags: [j.category, ...(j.tags || [])].filter(Boolean)
  }));
}

async function layWeWorkRemotely() {
  const r = await fetch('https://weworkremotely.com/categories/remote-programming-jobs.rss', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, signal: coHan(JOBS_TIMEOUT_MS)
  });
  if (!r.ok) return [];
  const xml = await r.text();
  return xml.split('<item>').slice(1, 16).map(chunk => {
    const titleMatch = chunk.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || chunk.match(/<title>(.*?)<\/title>/i);
    const linkMatch = chunk.match(/<link>(.*?)<\/link>/i);
    const descMatch = chunk.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || chunk.match(/<description>([\s\S]*?)<\/description>/i);
    const regionMatch = chunk.match(/<region>(.*?)<\/region>/i);
    if (!titleMatch || !linkMatch) return null;

    const rawTitle = titleMatch[1];
    const parts = rawTitle.split(':');
    const company = parts.length > 1 ? parts[0].trim() : 'Tech Company';
    const position = parts.length > 1 ? parts.slice(1).join(':').trim() : rawTitle;
    return {
      ...ngoaiVN,
      title: position,
      company_name: company,
      company_logo: null,
      url: chiNhanHttp(linkMatch[1]),
      location: regionMatch ? regionMatch[1] : 'Remote Global',
      is_remote: true,
      employment_type: 'FULLTIME',
      salary: '',
      description_snippet: tomTat(descMatch ? descMatch[1] : '', 200),
      posted_at: '',
      source: 'WeWorkRemotely',
      tags: [company, position]
    };
  }).filter(Boolean);
}

app.get('/api/jobs', sameOrigin, rateLimit({ max: 20, scope: 'jobs' }), async (req, res) => {
  try {
    const { search, location = '', limit = 15 } = req.query;
    const lang = (req.query.lang || 'vi').toLowerCase();
    const isVi = lang === 'vi';
    if (!search) return res.json({ jobs: [] });

    const queryLower = (search + ' ' + (location || '')).toLowerCase().trim();
    console.log(`[Jobs] Smart Search: "${search}" location: "${location}"`);

    const targetCity = doanThanhPho(queryLower);
    const { cleanTechQuery, coreTech } = lamSachTuKhoa(queryLower);

    const tenNguon = ['VietnamWorks', 'RemoteOK', 'Arbeitnow', 'Remotive', 'WeWorkRemotely'];
    const ketQua = await Promise.allSettled([
      layVietnamWorks(cleanTechQuery, coreTech, isVi),
      layRemoteOK(coreTech || cleanTechQuery),
      layArbeitnow(cleanTechQuery),
      layRemotive(cleanTechQuery),
      layWeWorkRemotely()
    ]);
    const rawJobs = ketQua.flatMap((r, i) => {
      if (r.status === 'fulfilled') return r.value.filter(j => j.url);
      console.warn(`[Jobs] ${tenNguon[i]} fetch failed:`, r.reason && r.reason.message);
      return [];
    });

    let synonyms = [...new Set([cleanTechQuery, queryLower, coreTech].filter(Boolean))];
    for (const [k, synList] of Object.entries(TECH_ROLE_SYNONYMS)) {
      if (cleanTechQuery.includes(k) || synList.some(s => cleanTechQuery.includes(s))) {
        synonyms = [...new Set([...synonyms, ...synList])];
      }
    }

    const scoredJobs = rawJobs.map(j => {
      let score = 0;
      const title = (j.title || '').toLowerCase();
      const tags = (j.tags || []).map(t => String(t).toLowerCase());
      const snippet = (j.description_snippet || '').toLowerCase();
      const combinedText = (title + ' ' + tags.join(' ') + ' ' + snippet).toLowerCase();

      const hasDirectTechMatch = synonyms.some(syn => combinedText.includes(syn));
      if (!hasDirectTechMatch) {
        return null;
      }

      if (NON_IT_BLACKLIST.some(b => title.includes(b) && !cleanTechQuery.includes(b))) {
        return null;
      }

      const locStr = (j.location || '').toLowerCase();
      const isGlobalAnywhere = locStr.includes('anywhere') || locStr.includes('worldwide') || locStr.includes('global') || locStr.includes('all locations') || locStr.includes('vietnam') || locStr.includes('việt nam') || locStr.includes('apac') || locStr.includes('asia') || locStr === 'remote';

      const nonVnRegions = ['americas', 'usa', 'us only', 'europe', 'israel', 'uk only', 'canada', 'germany', 'latam', 'latin america', 'timezones', 'brazil', 'australia'];
      const isForeignRestricted = nonVnRegions.some(r => locStr.includes(r)) && !locStr.includes('vietnam') && !locStr.includes('anywhere') && !locStr.includes('worldwide');

      if (isForeignRestricted) {
        return null;
      }

      if (targetCity) {
        if (targetCity === 'hcm') {
          if (j.isHcm) score += 300;
          else if (isGlobalAnywhere) score += 20;
          else return null;
        } else if (targetCity === 'hanoi') {
          if (j.isHn) score += 300;
          else if (isGlobalAnywhere) score += 20;
          else return null;
        } else if (targetCity === 'danang') {
          if (j.isDanang) score += 300;
          else if (isGlobalAnywhere) score += 20;
          else return null;
        } else if (targetCity === 'remote') {
          if (isGlobalAnywhere) score += 100;
          else return null;
        }
      }

      if (title.includes(cleanTechQuery) || (coreTech && title.includes(coreTech))) score += 100;

      synonyms.forEach(syn => {
        if (title.includes(syn)) score += 40;
        if (tags.some(t => t.includes(syn))) score += 20;
      });

      if (title.includes('engineer') || title.includes('developer') || title.includes('architect') || title.includes('lead') || title.includes('chuyên viên') || title.includes('kỹ sư')) {
        score += 20;
      }

      if (!isVi && (j.is_remote || j.source !== 'VietnamWorks')) {
        score += 200;
      }

      return { ...j, score };
    })
    .filter(j => j && j.score >= 50);

    const seen = new Set();
    const uniqueJobs = scoredJobs.filter(j => {
      if (seen.has(j.url)) return false;
      seen.add(j.url);
      return true;
    });

    uniqueJobs.sort((a, b) => b.score - a.score);

    console.log(`[Jobs] Found ${uniqueJobs.length} strictly matched IT jobs for "${search}" (targetCity: ${targetCity || 'all'})`);
    const soLuong = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
    res.json({ jobs: uniqueJobs.slice(0, soLuong) });
  } catch (err) {
    console.error('[Jobs] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

const DAU_TRINH_DUYET = Object.freeze({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8'
});

app.post('/api/doc-viec-link', sameOrigin, moPhongBi, requireUser, rateLimit({ max: 6, scope: 'doc-viec' }), async (req, res) => {
  const yc = chuanHoaYeuCauDocViec(req.body);
  if (yc.loi) return res.status(400).json({ error: yc.loi });
  console.log(`[DocViec] ${yc.url.slice(0, 300)}`);
  try {
    const kq = await docViecTuLink(yc, {
      tai: u => taiTheoChuyenHuong(u, { toiDa: 3_000_000, thoiGian: 12000, headers: DAU_TRINH_DUYET }),
      hoiAi: (system, user) => callOpenRouter(system, [{ role: 'user', content: user }], 0, 200, 'crawlIntent'),
      jev: taoJev({ khoa: OPENROUTER_API_KEY })
    });
    console.log(`[DocViec] ${kq.cheDo}/${kq.yDinh}${kq.cheDo === 'danh_sach' ? ` ${kq.soTrang} trang, ${kq.tongViec} viec, diem: ${kq.nguonDiem}` : ''}`);
    res.json(kq);
  } catch (err) {
    if (err.code === 'EBLOCKED') return res.status(403).json({ error: err.message });
    if (['EINVALIDURL', 'EPROTOCOL', 'EREDIRECT'].includes(err.code)) return res.status(400).json({ error: err.message });
    if (err.code === 'ENOTFOUND') return res.status(400).json({ error: 'Không phân giải được tên miền' });
    if (err.code === 'ELOAI') return res.status(415).json({ error: err.message });
    if (err.code === 'ECHAN') return res.status(502).json({ error: err.message, code: 'CHAN' });
    if (['EHTTP', 'EKHONGTAI'].includes(err.code)) return res.status(502).json({ error: err.message });
    console.error('[DocViec] Error:', err.message);
    res.status(502).json({ error: 'Không thể đọc trang: ' + err.message });
  }
});

app.post('/api/crawl', sameOrigin, moPhongBi, requireUser, rateLimit({ max: 10, scope: 'crawl' }), async (req, res) => {
  const { url } = req.body || {};
  console.log(`[Crawl] Fetching live webpage: ${String(url).slice(0, 300)}`);

  let trang;
  try {
    trang = await taiTheoChuyenHuong(String(url), {
      toiDa: 2_000_000,
      thoiGian: 9000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8'
      }
    });
  } catch (err) {
    if (err.code === 'EBLOCKED') return res.status(403).json({ error: err.message });
    if (err.code === 'EINVALIDURL' || err.code === 'EPROTOCOL' || err.code === 'EREDIRECT') return res.status(400).json({ error: err.message });
    if (err.code === 'ENOTFOUND') return res.status(400).json({ error: 'Không phân giải được tên miền' });
    console.error('[Crawl] Error:', err.message);
    return res.status(502).json({ error: 'Không thể tải trang: ' + err.message });
  }

  if (trang.status === 403 || trang.status === 429) {
    return res.status(502).json({ error: `Trang này chặn truy cập tự động (HTTP ${trang.status})` });
  }
  if (trang.status < 200 || trang.status >= 300) {
    return res.status(502).json({ error: `Không thể tải trang (HTTP ${trang.status})` });
  }

  const ctype = String(trang.headers['content-type'] || '');
  if (!/text\/html|text\/plain|application\/xhtml/i.test(ctype)) {
    return res.status(415).json({ error: 'Chỉ đọc được trang HTML' });
  }

  res.json({
    success: true,
    url: trang.url,
    pageTitle: layTieuDe(trang.body) || 'Trang tuyển dụng',
    content: trichNoiDungTrang(trang.body).substring(0, 6500)
  });
});

function loadCurriculum() {
  try {
    return napGiaoTrinh();
  } catch (err) {
    console.warn('[SEO] Không nạp được CURRICULUM:', err.message);
    return {};
  }
}

const CURRICULUM = loadCurriculum();
console.log(`[SEO] Đã nạp ${Object.keys(CURRICULUM).length} công nghệ cho sitemap và meta`);

const DEFAULT_TITLE = 'DevMaster Hub \u2014 N\u1ec1n T\u1ea3ng H\u1ecdc L\u1eadp Tr\u00ecnh To\u00e0n Di\u1ec7n T\u1eeb Newbie \u0110\u1ebfn Senior';
const DEFAULT_DESC = 'H\u1ecdc l\u1eadp tr\u00ecnh th\u1ef1c chi\u1ebfn v\u1edbi 34 l\u1ed9 tr\u00ecnh v\u00e0 348 b\u00e0i h\u1ecdc: Python, JavaScript, React, Node.js, Java, C++, Go, Rust, DevOps, SQL. C\u00f3 tr\u00ecnh ch\u1ea1y code, tr\u1eafc nghi\u1ec7m v\u00e0 AI Tutor k\u00e8m 1-1.';

const ROUTE_META = {
  '/career': {
    title: 'C\u1ed1 V\u1ea5n Ngh\u1ec1 Nghi\u1ec7p IT \u2014 \u0110\u1ecbnh H\u01b0\u1edbng & T\u00ecm Vi\u1ec7c | DevMaster Hub',
    desc: 'Nh\u1eadn l\u1ed9 tr\u00ecnh ngh\u1ec1 nghi\u1ec7p ri\u00eang cho b\u1ea1n: ch\u1ecdn h\u01b0\u1edbng \u0111i, x\u00e2y d\u1ef1ng k\u1ef9 n\u0103ng c\u00f2n thi\u1ebfu v\u00e0 t\u00ecm vi\u1ec7c IT ph\u00f9 h\u1ee3p, c\u00f3 AI c\u1ed1 v\u1ea5n ph\u00e2n t\u00edch tr\u1ef1c ti\u1ebfp h\u1ed3 s\u01a1 c\u1ee7a b\u1ea1n.'
  },
  '/project': {
    title: 'Project Lab \u2014 L\u00e0m D\u1ef1 \u00c1n Th\u1ef1c T\u1ebf & Review Code | DevMaster Hub',
    desc: 'B\u1eaft tay l\u00e0m d\u1ef1 \u00e1n th\u1eadt theo tr\u00ecnh \u0111\u1ed9 c\u1ee7a b\u1ea1n, n\u1ed9p code v\u00e0 nh\u1eadn review chi ti\u1ebft t\u1eeb AI v\u1ec1 ch\u1ea5t l\u01b0\u1ee3ng, ki\u1ebfn tr\u00fac v\u00e0 c\u00e1ch c\u1ea3i thi\u1ec7n.'
  },
  '/my-projects': {
    title: 'D\u1ef1 \u00c1n C\u1ee7a T\u00f4i \u2014 Theo D\u00f5i Ti\u1ebfn \u0110\u1ed9 & \u0110i\u1ec3m Review | DevMaster Hub',
    desc: 'Xem l\u1ea1i to\u00e0n b\u1ed9 d\u1ef1 \u00e1n b\u1ea1n \u0111\u00e3 n\u1ed9p, \u0111i\u1ec3m s\u1ed1 t\u1eebng ti\u00eau ch\u00ed v\u00e0 nh\u1eefng g\u00f3p \u00fd c\u1ee5 th\u1ec3 \u0111\u1ec3 n\u00e2ng c\u1ea5p t\u1eebng s\u1ea3n ph\u1ea9m.'
  }
};

function metaForPath(urlPath) {
  const clean = urlPath.split('?')[0].replace(/\/+$/, '') || '/';
  if (ROUTE_META[clean]) return { ...ROUTE_META[clean], url: BASE_URL + clean };

  const seg = clean.split('/').filter(Boolean);

  if (seg[0] === 'roadmap' && CURRICULUM[seg[1]]) {
    const tech = CURRICULUM[seg[1]];
    const count = (tech.levels || []).reduce((n, l) => n + (l.lessons || []).length, 0);
    return {
      title: `H\u1ecdc ${tech.name} T\u1eeb C\u01a1 B\u1ea3n \u0110\u1ebfn N\u00e2ng Cao \u2014 ${count} B\u00e0i | DevMaster Hub`,
      desc: `L\u1ed9 tr\u00ecnh ${tech.name} g\u1ed3m ${count} b\u00e0i th\u1ef1c chi\u1ebfn chia theo ${(tech.levels || []).length} c\u1ea5p \u0111\u1ed9. H\u1ecdc l\u00fd thuy\u1ebft, ch\u1ea1y code ngay tr\u00ean tr\u00ecnh duy\u1ec7t, l\u00e0m tr\u1eafc nghi\u1ec7m v\u00e0 c\u00f3 AI Tutor k\u00e8m 1-1.`,
      url: `${BASE_URL}/roadmap/${tech.id}`
    };
  }

  if (seg[0] === 'lesson' && CURRICULUM[seg[1]]) {
    const tech = CURRICULUM[seg[1]];
    const level = (tech.levels || []).find(l => l.id === seg[2]);
    const lesson = (level?.lessons || []).find(ls => ls.id === seg[3]);
    if (lesson) {
      const plain = String(lesson.theory || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      return {
        title: `${lesson.title} \u2014 ${tech.name} | DevMaster Hub`,
        desc: plain ? plain.slice(0, 155).trim() + '\u2026'
                    : `H\u1ecdc b\u00e0i "${lesson.title}" trong l\u1ed9 tr\u00ecnh ${tech.name} (${level.name}) c\u00f9ng v\u00ed d\u1ee5 code v\u00e0 b\u00e0i t\u1eadp th\u1ef1c h\u00e0nh.`,
        url: `${BASE_URL}/lesson/${tech.id}/${level.id}/${lesson.id}`
      };
    }
  }

  return { title: DEFAULT_TITLE, desc: DEFAULT_DESC, url: BASE_URL + (clean === '/' ? '/' : clean) };
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function chenMeta(template, urlPath) {
  const { title, desc, url } = metaForPath(urlPath);
  const t = escapeAttr(title), d = escapeAttr(desc), u = escapeAttr(url);
  const gan = giaTri => (_, dau) => dau + giaTri;
  return template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${t}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*/, gan(u))
    .replace(/(<meta property="og:url" content=")[^"]*/, gan(u))
    .replace(/(<meta name="twitter:url" content=")[^"]*/, gan(u))
    .replace(/(<meta property="og:title" content=")[^"]*/, gan(t))
    .replace(/(<meta name="twitter:title" content=")[^"]*/, gan(t))
    .replace(/(<meta name="description" content=")[^"]*/, gan(d))
    .replace(/(<meta property="og:description" content=")[^"]*/, gan(d))
    .replace(/(<meta name="twitter:description" content=")[^"]*/, gan(d));
}

async function renderReact(req) {
  const template = CHE_DO_DEV
    ? await vite.transformIndexHtml(req.originalUrl, fs.readFileSync(path.join(__dirname, 'web', 'index.html'), 'utf8'))
    : REACT_HTML;
  return chenMeta(template, req.path);
}

app.get('/sitemap.xml', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: '/', freq: 'daily', pri: '1.0' },
    { loc: '/career', freq: 'weekly', pri: '0.9' },
    { loc: '/project', freq: 'weekly', pri: '0.8' }
  ];

  for (const tech of Object.values(CURRICULUM)) {
    if (!tech || !tech.id) continue;
    urls.push({ loc: `/roadmap/${tech.id}`, freq: 'weekly', pri: '0.9' });
    for (const level of tech.levels || []) {
      for (const lesson of level.lessons || []) {
        urls.push({ loc: `/lesson/${tech.id}/${level.id}/${lesson.id}`, freq: 'monthly', pri: '0.7' });
      }
    }
  }

  const body = urls.map(u =>
    `  <url>\n    <loc>${BASE_URL}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n` +
    `    <changefreq>${u.freq}</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`
  ).join('\n');

  res.type('application/xml; charset=utf-8')
     .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`);
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint không tồn tại' });
});

app.get('*', async (req, res, next) => {

  const looksLikeFile = /[.][a-z0-9]{1,8}$/i.test(req.path);
  const hasDotSegment = req.path.split('/').some(seg => seg.startsWith('.'));
  if (looksLikeFile || hasDotSegment) {
    return res.status(404).type('text/plain; charset=utf-8').send('404 Not Found');
  }
  if (!coAppReact()) {
    return res.status(503).type('text/plain; charset=utf-8').send('Chưa có bản build giao diện. Chạy: npm run build');
  }
  try {
    const html = await renderReact(req);
    res.status(laUrlReact(req.path) ? 200 : 404).type('html').set('Cache-Control', 'no-cache').send(html);
  } catch (err) {
    next(err);
  }
});

async function khoiDong() {
  const server = http.createServer(app);
  if (CHE_DO_DEV) {
    const { createServer } = await import('vite');
    vite = await createServer({
      configFile: path.join(__dirname, 'web', 'vite.config.mts'),
      server: { middlewareMode: true, hmr: { server } },
      appType: 'custom'
    });
  } else if (!REACT_HTML) {
    console.warn(`ℹ️ Chưa có bản build React (${path.join(DIST_DIR, 'index.html')}) — mọi trang trả 503. Chạy: npm run build`);
  }
  server.listen(PORT, inBangKhoiDong);
}

module.exports = app;
if (require.main === module) khoiDong();

function inBangKhoiDong() {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════════════════╗');
  console.log('  ║   🚀 DevMaster Hub — Smart AI Platform & Learning Hub   ║');
  console.log('  ╠══════════════════════════════════════════════════════════╣');
  console.log(`  ║   🌐 Port: http://localhost:${PORT}                           ║`);
  console.log(`  ║   🤖 Gemini:     ${GEMINI_API_KEY ? '✅ Enabled' : '❌ Disabled'}                              ║`);
  console.log(`  ║   🤖 DeepSeek:   ${DEEPSEEK_API_KEY ? '✅ Enabled' : '❌ Disabled'}                              ║`);
  console.log(`  ║   🤖 Groq:       ${GROQ_API_KEY ? '✅ Enabled' : '❌ Disabled'}                              ║`);
  console.log(`  ║   🤖 OpenRouter: ${OPENROUTER_API_KEY ? '✅ Enabled' : '❌ Disabled'}                              ║`);
  console.log(`  ║   🤖 Claude:     ${CLAUDE_API_KEY ? '✅ Enabled' : '❌ Disabled'}                              ║`);
  console.log(`  ║   ⚛️  React:     ${CHE_DO_DEV ? 'Vite dev (HMR)' : (REACT_HTML ? 'dist/ (bản build)' : 'chưa build — dùng app cũ')}`);
  console.log(`  ║   💼 Jobs:       ⚡ VietnamWorks, RemoteOK, Arbeitnow, Remotive ║`);
  console.log('  ╚══════════════════════════════════════════════════════════╝');
  console.log('');
}
