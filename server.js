const express = require('express');
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const net = require('net');
const dns = require('dns').promises;

function isBlockedAddress(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a >= 224) return true;
    return false;
  }
  const v6 = ip.toLowerCase();
  if (v6 === '::' || v6 === '::1') return true;
  if (v6.startsWith('fc') || v6.startsWith('fd')) return true;
  if (v6.startsWith('fe80')) return true;
  if (v6.startsWith('::ffff:')) return isBlockedAddress(v6.slice(7));
  return false;
}

const app = express();
const PORT = process.env.PORT || 3000;

let GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
let GROQ_API_KEY = process.env.GROQ_API_KEY || '';
let OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
let CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';
let JSEARCH_API_KEY = process.env.JSEARCH_API_KEY || '';

try {

  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8').replace(/^\uFEFF/, '');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const geminiM = line.match(/^GEMINI_API_KEY=(.+)$/);
    if (geminiM) GEMINI_API_KEY = geminiM[1].trim();
    const deepseekM = line.match(/^DEEPSEEK_API_KEY=(.+)$/);
    if (deepseekM) DEEPSEEK_API_KEY = deepseekM[1].trim();
    const groqM = line.match(/^GROQ_API_KEY=(.+)$/);
    if (groqM) GROQ_API_KEY = groqM[1].trim();
    const openrouterM = line.match(/^OPENROUTER_API_KEY=(.+)$/);
    if (openrouterM) OPENROUTER_API_KEY = openrouterM[1].trim();
    const claudeMatch = line.match(/^CLAUDE_API_KEY=(.+)$/);
    if (claudeMatch) CLAUDE_API_KEY = claudeMatch[1].trim();
    const jsearchMatch = line.match(/^JSEARCH_API_KEY=(.+)$/);
    if (jsearchMatch) JSEARCH_API_KEY = jsearchMatch[1].trim();
  }
} catch (e) {
  console.warn('ℹ️ Running without local .env file. Reading from process.env');
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nlkljhpqwepabglrqkmz.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_0s-SglEeMENWRqgbC2QWuQ_w0pzWJMe';

const PUBLIC_DIR = path.join(__dirname, 'public');
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

app.use(express.static(PUBLIC_DIR, {
  index: false,
  dotfiles: 'ignore',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.txt')) res.type('text/plain; charset=utf-8');

    // File .js/.css/anh duoc gan ?v=<mtime> trong index.html nen cache dai han an toan.
    // Rieng .html KHONG the phá cache bang query (nguoi dung go thang URL),
    // nen phai revalidate moi lan — neu khong, sua trang la nguoi dung ket ban cu.
    if (/[.](html?)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

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

async function callGemini(system, messages, temperature = 0.7, maxTokens = 4096) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

  const formattedContents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    system_instruction: system ? { parts: [{ text: system }] } : undefined,
    contents: formattedContents,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API Error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return replyText;
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
    })
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
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API Error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callOpenRouter(system, messages, temperature = 0.7, maxTokens = 4096, taskType = 'general', requestedModel = null) {
  if (!OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY not configured');

  const modelMap = {
    tutor: 'google/gemini-3.7-flash',
    quiz: 'google/gemini-3.7-flash',
    exercise: 'google/gemini-3.7-flash',
    checkCode: 'deepseek/deepseek-v4-pro-0813',
    checkAnswer: 'deepseek/deepseek-v4-pro-0813',
    projectIdea: 'deepseek/deepseek-v4-pro-0813',
    projectChat: 'deepseek/deepseek-v4-pro-0813',
    projectReview: 'deepseek/deepseek-v4-pro-0813',
    career: 'anthropic/claude-sonnet-4.5',
    general: 'google/gemini-3.7-flash'
  };

  const selectedModel = requestedModel || modelMap[taskType] || 'google/gemini-3.7-flash';
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
    body: JSON.stringify({
      model: selectedModel,
      messages: formattedMessages,
      temperature,
      max_tokens: maxTokens
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter API Error ${res.status} (${selectedModel}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callClaude(system, messages, temperature = 0.7, maxTokens = 4096) {
  if (!CLAUDE_API_KEY) throw new Error('CLAUDE_API_KEY not configured');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      temperature,
      system: system || 'You are a programming instructor. Always respond in helpful structured format.',
      messages: messages || []
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API Error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || '';
}

app.post('/api/ai', sameOrigin, requireUser, rateLimit({ max: 30, scope: 'ai' }), async (req, res) => {
  const { system, messages, temperature = 0.7, max_tokens = 4096, taskType = 'general', model = null } = req.body;

  const providers = [
    { name: 'OpenRouter (' + (taskType || 'default') + ')', fn: () => callOpenRouter(system, messages, temperature, max_tokens, taskType, model), enabled: !!OPENROUTER_API_KEY },
    { name: 'Gemini (Google)', fn: () => callGemini(system, messages, temperature, max_tokens), enabled: !!GEMINI_API_KEY },
    { name: 'DeepSeek', fn: () => callDeepSeek(system, messages, temperature, max_tokens), enabled: !!DEEPSEEK_API_KEY },
    { name: 'Claude (Anthropic)', fn: () => callClaude(system, messages, temperature, max_tokens), enabled: !!CLAUDE_API_KEY },
    { name: 'Groq (Llama 3.3)', fn: () => callGroq(system, messages, temperature, max_tokens), enabled: !!GROQ_API_KEY }
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

app.get('/api/jobs', sameOrigin, rateLimit({ max: 20, scope: 'jobs' }), async (req, res) => {
  try {
    const { search, location = '', limit = 15 } = req.query;
    const lang = (req.query.lang || 'vi').toLowerCase();
    const isVi = lang === 'vi';
    if (!search) return res.json({ jobs: [] });

    const queryLower = (search + ' ' + (location || '')).toLowerCase().trim();
    console.log(`[Jobs] Smart Search: "${search}" location: "${location}"`);

    let targetCity = null;
    if (queryLower.includes('hcm') || queryLower.includes('hồ chí minh') || queryLower.includes('ho chi minh') || queryLower.includes('tp.hcm') || queryLower.includes('tp hcm') || queryLower.includes('sài gòn') || queryLower.includes('sai gon')) {
      targetCity = 'hcm';
    } else if (queryLower.includes('hà nội') || queryLower.includes('ha noi') || queryLower.includes('hn')) {
      targetCity = 'hanoi';
    } else if (queryLower.includes('đà nẵng') || queryLower.includes('da nang')) {
      targetCity = 'danang';
    } else if (queryLower.includes('remote') || queryLower.includes('từ xa') || queryLower.includes('nước ngoài') || queryLower.includes('global') || queryLower.includes('quốc tế')) {
      targetCity = 'remote';
    }

    const cleanTechQuery = queryLower
      .replace(/\b(vietnam|viet nam|vn|hcm|ho chi minh|tp\.hcm|tp hcm|ha noi|hanoi|da nang|danang|remote|global|sài gòn|sai gon)\b/gi, '')
      .replace(/\b(tui|muốn|tìm|việc|về|ở|tại|công việc|việc làm|tuyển dụng|parttime|part time|fulltime|full time)\b/gi, '')
      .trim() || 'developer';

    const coreTech = cleanTechQuery.replace(/\b(developer|engineer|programmer|intern|fresher|junior|senior|lead|chuyên viên|kỹ sư|lập trình viên)\b/gi, '').trim() || cleanTechQuery;

    let rawJobs = [];

    try {
      let vnWorksRes = await fetch('https://ms.vietnamworks.com/job-search/v1.0/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        body: JSON.stringify({
          query: cleanTechQuery || 'developer',
          page: 0,
          size: 25
        })
      });
      let vnData = vnWorksRes.ok ? await vnWorksRes.json() : { data: [] };
      let vnItems = vnData.data || [];

      if (vnItems.length === 0 && coreTech && coreTech !== cleanTechQuery) {
        console.log(`[Jobs] VietnamWorks 0 results for "${cleanTechQuery}", retrying with coreTech "${coreTech}"`);
        const fallbackRes = await fetch('https://ms.vietnamworks.com/job-search/v1.0/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          },
          body: JSON.stringify({
            query: coreTech,
            page: 0,
            size: 25
          })
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          vnItems = fallbackData.data || [];
        }
      }

      vnItems.forEach(j => {
        const cityId = j.workingLocations?.[0]?.cityId;
        const cityName = ((j.workingLocations?.[0]?.cityNameVI || j.workingLocations?.[0]?.cityName || '') + ' ' + (j.address || '')).toLowerCase();

        let isHcm = (cityId === 29 || cityName.includes('hồ chí minh') || cityName.includes('ho chi minh') || cityName.includes('hcm') || cityName.includes('sài gòn') || cityName.includes('thủ đức'));
        let isHn = (cityId === 24 || cityName.includes('hà nội') || cityName.includes('ha noi'));
        let isDanang = (cityId === 17 || cityName.includes('đà nẵng') || cityName.includes('da nang'));
        let isRemote = (cityId === 70 || cityName.includes('quốc tế') || (j.jobTitle || '').toLowerCase().includes('remote') || cityName.includes('remote'));

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

        const isPartTime = (j.typeWorkingId === 2 || (j.jobTitle || '').toLowerCase().includes('part time') || (j.jobTitle || '').toLowerCase().includes('part-time'));
        const isIntern = (j.jobTitle || '').toLowerCase().includes('intern') || (j.jobTitle || '').toLowerCase().includes('fresher') || (j.jobTitle || '').toLowerCase().includes('thực tập');

        rawJobs.push({
          title: j.jobTitle || 'Software Engineer',
          company_name: j.companyName || (isVi ? 'Công ty Công nghệ' : 'Tech Company'),
          company_logo: j.companyLogo || null,
          url: j.alias ? `https://www.vietnamworks.com/${j.alias}-${j.jobId}-jv` : `https://www.vietnamworks.com/${j.jobId}-jv`,
          location: displayLoc,
          isHcm,
          isHn,
          isDanang,
          is_remote: isRemote,
          employment_type: isIntern ? 'INTERN' : (isPartTime ? 'PARTTIME' : 'FULLTIME'),
          salary: salaryStr,
          description_snippet: (j.jobDescription || j.summary || '').replace(/<[^>]*>/g, '').substring(0, 220) + '...',
          posted_at: j.prettyApprovedOn || j.approvedOnText || '',
          source: 'VietnamWorks',
          tags: (j.skills || []).map(s => s.skillName).filter(Boolean)
        });
      });
    } catch (e) {
      console.warn('[Jobs] VietnamWorks fetch failed:', e.message);
    }

    try {
      const rokRes = await fetch(`https://remoteok.com/api?tag=${encodeURIComponent(coreTech || cleanTechQuery)}`, {
        headers: { 'User-Agent': 'DevMasterHub/1.0' }
      });
        if (rokRes.ok) {
          const rokData = await rokRes.json();
          if (Array.isArray(rokData)) {
            rokData.filter(j => j.id).slice(0, 10).forEach(j => {
              rawJobs.push({
                title: j.position || 'Software Engineer',
                company_name: j.company || 'Tech Company',
                company_logo: j.company_logo || null,
                url: j.url || '#',
                location: j.location || 'Remote Global',
                isHcm: false,
                isHn: false,
                isDanang: false,
                is_remote: true,
                employment_type: 'FULLTIME',
                salary: j.salary_min && j.salary_max ? `$${j.salary_min.toLocaleString()} - $${j.salary_max.toLocaleString()}` : '',
                description_snippet: (j.description || '').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                posted_at: j.date || '',
                source: 'RemoteOK',
                tags: j.tags || []
              });
            });
          }
        }
      } catch (e) {
        console.warn('[Jobs] RemoteOK fetch failed:', e.message);
      }

      try {
        const arbRes = await fetch(`https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(cleanTechQuery)}`);
        if (arbRes.ok) {
          const arbData = await arbRes.json();
          (arbData.data || []).slice(0, 8).forEach(j => {
            rawJobs.push({
              title: j.title || 'Developer',
              company_name: j.company_name || 'Tech Company',
              company_logo: null,
              url: j.url || '#',
              location: j.location || 'Remote Global',
              isHcm: false,
              isHn: false,
              isDanang: false,
              is_remote: j.remote || false,
              employment_type: 'FULLTIME',
              salary: '',
              description_snippet: (j.description || '').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
              posted_at: j.created_at || '',
              source: 'Arbeitnow',
              tags: j.tags || []
            });
          });
        }
      } catch (e) {
        console.warn('[Jobs] Arbeitnow fetch failed:', e.message);
      }

      try {
        const remRes = await fetch(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(cleanTechQuery)}&limit=10`);
        if (remRes.ok) {
          const remData = await remRes.json();
          (remData.jobs || []).slice(0, 8).forEach(j => {
            rawJobs.push({
              title: j.title || 'Developer',
              company_name: j.company_name || 'Tech Company',
              company_logo: j.company_logo || null,
              url: j.url || '#',
              location: j.candidate_required_location || 'Remote Global',
              isHcm: false,
              isHn: false,
              isDanang: false,
              is_remote: true,
              employment_type: j.job_type || 'full_time',
              salary: j.salary || '',
              description_snippet: (j.description || '').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
              posted_at: j.publication_date || '',
              source: 'Remotive',
              tags: [j.category, ...(j.tags || [])].filter(Boolean)
            });
          });
        }
      } catch (e) {
        console.warn('[Jobs] Remotive fetch failed:', e.message);
      }

      try {
        const wwrRes = await fetch('https://weworkremotely.com/categories/remote-programming-jobs.rss', {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (wwrRes.ok) {
          const xml = await wwrRes.text();
          const items = xml.split('<item>').slice(1);
          items.slice(0, 15).forEach(chunk => {
            const titleMatch = chunk.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || chunk.match(/<title>(.*?)<\/title>/i);
            const linkMatch = chunk.match(/<link>(.*?)<\/link>/i);
            const descMatch = chunk.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || chunk.match(/<description>([\s\S]*?)<\/description>/i);
            const regionMatch = chunk.match(/<region>(.*?)<\/region>/i);

            if (titleMatch && linkMatch) {
              const rawTitle = titleMatch[1];
              const parts = rawTitle.split(':');
              const company = parts.length > 1 ? parts[0].trim() : 'Tech Company';
              const position = parts.length > 1 ? parts.slice(1).join(':').trim() : rawTitle;

              rawJobs.push({
                title: position,
                company_name: company,
                company_logo: null,
                url: linkMatch[1],
                location: regionMatch ? regionMatch[1] : 'Remote Global',
                isHcm: false,
                isHn: false,
                isDanang: false,
                is_remote: true,
                employment_type: 'FULLTIME',
                salary: '',
                description_snippet: (descMatch ? descMatch[1] : '').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                posted_at: '',
                source: 'WeWorkRemotely',
                tags: [company, position]
              });
            }
          });
        }
      } catch (e) {
        console.warn('[Jobs] WeWorkRemotely fetch failed:', e.message);
      }

    let synonyms = [cleanTechQuery, queryLower];
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
    res.json({ jobs: uniqueJobs.slice(0, parseInt(limit)) });
  } catch (err) {
    console.error('[Jobs] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/crawl', sameOrigin, requireUser, rateLimit({ max: 10, scope: 'crawl' }), async (req, res) => {
  try {
    const { url } = req.body;

    let target;
    try { target = new URL(String(url)); }
    catch { return res.status(400).json({ error: 'URL không hợp lệ' }); }

    if (!['http:', 'https:'].includes(target.protocol)) {
      return res.status(400).json({ error: 'Chỉ hỗ trợ http và https' });
    }

    let resolved;
    try { resolved = await dns.lookup(target.hostname); }
    catch { return res.status(400).json({ error: 'Không phân giải được tên miền' }); }

    if (isBlockedAddress(resolved.address)) {
      return res.status(403).json({ error: 'Không được phép truy cập địa chỉ nội bộ' });
    }

    console.log(`[Crawl] Fetching live webpage: ${target.href}`);
    const crawlRes = await fetch(target.href, {

      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8'
      },
      signal: AbortSignal.timeout(9000)
    });

    if (crawlRes.status >= 300 && crawlRes.status < 400) {
      return res.status(400).json({ error: 'Trang này chuyển hướng, không thể đọc trực tiếp' });
    }
    if (!crawlRes.ok) {
      return res.status(crawlRes.status).json({ error: `Không thể tải trang (HTTP ${crawlRes.status})` });
    }

    const ctype = crawlRes.headers.get('content-type') || '';
    if (!/text\/html|text\/plain|application\/xhtml/i.test(ctype)) {
      return res.status(415).json({ error: 'Chỉ đọc được trang HTML' });
    }

    const html = (await crawlRes.text()).slice(0, 2_000_000);

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : 'Trang tuyển dụng';

    let cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    const textSnippet = cleanText.substring(0, 6500);

    res.json({
      success: true,
      url,
      pageTitle,
      content: textSnippet
    });
  } catch (err) {
    console.error('[Crawl] Error:', err.message);
    res.status(500).json({ error: 'Lỗi cào dữ liệu: ' + err.message });
  }
});

function loadCurriculum() {
  try {
    const names = fs.readdirSync(PUBLIC_DIR);
    const ordered = [
      'data.js',
      ...names.filter(f => /^data-.*\.js$/.test(f) && f !== 'data-extra.js').sort(),
      'data-extra.js'
    ].filter(f => names.includes(f));

    const sandbox = { console: { log() {}, warn() {}, error() {} } };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    const ctx = vm.createContext(sandbox);
    for (const f of ordered) {
      vm.runInContext(fs.readFileSync(path.join(PUBLIC_DIR, f), 'utf8'), ctx, { filename: f });
    }
    vm.runInContext('globalThis.__C = typeof CURRICULUM !== "undefined" ? CURRICULUM : null;', ctx);
    return { ...(sandbox.CURRICULUM || {}), ...(ctx.__C || {}) };
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

// Du an khong co buoc build nen ten file khong kem hash. Khong co cach nao
// phan biet ban cu voi ban moi -> trinh duyet se giu code cu rat lau.
// Giai phap: gan ?v=<thoi diem sua file> vao URL. Sua file la URL doi, cache tu het hieu luc.
function assetVersion(relPath) {
  try {
    return fs.statSync(path.join(PUBLIC_DIR, relPath)).mtimeMs.toString(36);
  } catch {
    return null;
  }
}

function addAssetVersions(html) {
  return html.replace(/(src|href)="\/([A-Za-z0-9._/-]+\.(?:js|css))"/g, (m, attr, rel) => {
    const v = assetVersion(rel);
    return v ? `${attr}="/${rel}?v=${v}"` : m;
  });
}

const INDEX_HTML = addAssetVersions(fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8'));

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderIndex(urlPath) {
  const { title, desc, url } = metaForPath(urlPath);
  const t = escapeAttr(title), d = escapeAttr(desc), u = escapeAttr(url);
  return INDEX_HTML
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${u}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${u}`)
    .replace(/(<meta name="twitter:url" content=")[^"]*/, `$1${u}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${t}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${t}`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${d}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${d}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${d}`);
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

app.get('*', (req, res) => {

  const looksLikeFile = /[.][a-z0-9]{1,8}$/i.test(req.path);
  const hasDotSegment = req.path.split('/').some(seg => seg.startsWith('.'));
  if (looksLikeFile || hasDotSegment) {
    return res.status(404).type('text/plain; charset=utf-8').send('404 Not Found');
  }
  res.type('html').set('Cache-Control', 'no-cache').send(renderIndex(req.path));
});

app.listen(PORT, () => {
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
  console.log(`  ║   💼 Jobs:       ${JSEARCH_API_KEY ? '✅ JSearch API' : '⚡ Free Fallbacks'}                       ║`);
  console.log('  ╚══════════════════════════════════════════════════════════╝');
  console.log('');
});
