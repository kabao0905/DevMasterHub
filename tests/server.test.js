const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const fetchThat = globalThis.fetch;
const KHOA_AI = ['OPENROUTER_API_KEY', 'GEMINI_API_KEY', 'DEEPSEEK_API_KEY', 'CLAUDE_API_KEY', 'GROQ_API_KEY'];

async function moServer({ khoa = {}, traLoi }) {
  for (const k of KHOA_AI) process.env[k] = khoa[k] || '';
  const daGoi = [];
  globalThis.fetch = async (url, opts = {}) => {
    const u = String(url);
    if (u.startsWith('http://127.0.0.1:')) return fetchThat(url, opts);
    daGoi.push({ url: u, opts, body: opts.body ? JSON.parse(opts.body) : null });
    if (u.endsWith('/auth/v1/user')) {
      return new Response(JSON.stringify({ id: 'u1' }), { status: opts.headers.Authorization === 'Bearer tok' ? 200 : 401 });
    }
    const r = traLoi(u, opts);
    if (r) return r;
    return new Response('{}', { status: 500 });
  };
  const duongDan = path.join(__dirname, '..', 'server.js');
  delete require.cache[require.resolve(duongDan)];
  const app = require(duongDan);
  const sv = await new Promise(r => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  const goc = `http://127.0.0.1:${sv.address().port}`;
  return {
    daGoi,
    goc,
    dong: () => { sv.closeAllConnections(); sv.close(); globalThis.fetch = fetchThat; }
  };
}

const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

const goiAi = (goc, body) => fetch(goc + '/api/ai', {
  method: 'POST',
  headers: { 'content-type': 'application/json', authorization: 'Bearer tok' },
  body: JSON.stringify(body)
});

test('/api/ai bo qua model va max_tokens tuy y cua client', async () => {
  const s = await moServer({
    khoa: { OPENROUTER_API_KEY: 'or' },
    traLoi: u => u.includes('openrouter.ai') && json({ choices: [{ message: { content: 'ok' } }] })
  });
  try {
    const res = await goiAi(s.goc, {
      messages: [{ role: 'user', content: 'hi' }], model: 'openai/o1-pro', max_tokens: 100000
    });
    assert.strictEqual(res.status, 200);
    const or = s.daGoi.find(g => g.url.includes('openrouter.ai'));
    assert.strictEqual(or.body.model, 'google/gemini-3.8-flash');
    assert.deepStrictEqual(or.body.reasoning, { effort: 'high' });
    assert.strictEqual(or.body.max_tokens, 8192 + 16384);
    assert.strictEqual('temperature' in or.body, false, 'Gemini 3 nen de temperature mac dinh');
    assert.ok(or.opts.signal, 'goi nha cung cap AI phai co timeout');
  } finally { s.dong(); }
});

const sseTu = dong => new Response(new ReadableStream({
  start(c) { for (const d of dong) c.enqueue(new TextEncoder().encode(d)); c.close(); }
}), { status: 200, headers: { 'content-type': 'text/event-stream' } });

async function docSuKien(res) {
  const ds = [];
  for (const khoi of (await res.text()).split('\n\n')) {
    const dong = khoi.trim();
    if (dong.startsWith('data: ')) ds.push(JSON.parse(dong.slice(6)));
  }
  return ds;
}

test('/api/ai stream: chuyen tiep tung phan tu OpenRouter ve trinh duyet roi bao xong', async () => {
  const s = await moServer({
    khoa: { OPENROUTER_API_KEY: 'or', GEMINI_API_KEY: 'gk' },
    traLoi: u => u.includes('openrouter.ai') && sseTu([
      ': OPENROUTER PROCESSING\n\n',
      'data: {"choices":[{"delta":{"reasoning":"nghi"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"Xin "}}]}\n\ndata: {"choices":[{"delta":{"con',
      'tent":"chào"}}]}\n\n',
      'data: {"choices":[{"delta":{}}],"usage":{"prompt_tokens":10,"completion_tokens":2}}\n\n',
      'data: [DONE]\n\n'
    ])
  });
  try {
    const res = await goiAi(s.goc, { messages: [{ role: 'user', content: 'hi' }], taskType: 'tutor', stream: true });
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/event-stream/);
    const ds = await docSuKien(res);
    assert.strictEqual(ds.filter(d => d.t).map(d => d.t).join(''), 'Xin chào');
    assert.deepStrictEqual(ds.at(-1), { xong: true, provider: 'OpenRouter (tutor)' });
    assert.strictEqual(s.daGoi.find(g => g.url.includes('openrouter.ai')).body.stream, true);
    assert.strictEqual(s.daGoi.some(g => g.url.includes('generativelanguage')), false);
  } finally { s.dong(); }
});

test('/api/ai stream: OpenRouter loi truoc khi gui gi thi chuyen sang nha cung cap du phong, tra ca cau mot lan', async () => {
  const s = await moServer({
    khoa: { OPENROUTER_API_KEY: 'or', GEMINI_API_KEY: 'gk' },
    traLoi: u => (u.includes('openrouter.ai') ? json({ error: 'busy' }, 503)
      : u.includes('generativelanguage') && json({ candidates: [{ content: { parts: [{ text: 'Dự phòng' }] } }] }))
  });
  try {
    const ds = await docSuKien(await goiAi(s.goc, { messages: [{ role: 'user', content: 'hi' }], taskType: 'tutor', stream: true }));
    assert.deepStrictEqual(ds, [{ t: 'Dự phòng' }, { xong: true, provider: 'Gemini (Google)' }]);
  } finally { s.dong(); }
});

test('/api/ai khong xin stream thi van tra JSON nhu cu', async () => {
  const s = await moServer({
    khoa: { OPENROUTER_API_KEY: 'or' },
    traLoi: u => u.includes('openrouter.ai') && json({ choices: [{ message: { content: 'ok' } }] })
  });
  try {
    const res = await goiAi(s.goc, { messages: [{ role: 'user', content: 'hi' }], taskType: 'tutor' });
    assert.deepStrictEqual(await res.json(), { content: [{ type: 'text', text: 'ok' }], provider: 'OpenRouter (tutor)' });
    assert.strictEqual('stream' in s.daGoi.find(g => g.url.includes('openrouter.ai')).body, false);
  } finally { s.dong(); }
});

test('/api/ai: viec Career dung Claude Sonnet 5.5 qua OpenRouter, khong bat suy nghi Gemini', async () => {
  const s = await moServer({
    khoa: { OPENROUTER_API_KEY: 'or' },
    traLoi: u => u.includes('openrouter.ai') && json({ choices: [{ message: { content: 'ok' } }] })
  });
  try {
    await goiAi(s.goc, { messages: [{ role: 'user', content: 'hi' }], taskType: 'career', temperature: 0.5 });
    const or = s.daGoi.find(g => g.url.includes('openrouter.ai'));
    assert.strictEqual(or.body.model, 'anthropic/claude-sonnet-5.5');
    assert.strictEqual('reasoning' in or.body, false);
    assert.strictEqual(or.body.temperature, 0.5);
  } finally { s.dong(); }
});

test('Gemini goi truc tiep: 3.8 Flash, thinkingLevel high, bo phan suy nghi khi doc cau tra loi', async () => {
  const s = await moServer({
    khoa: { GEMINI_API_KEY: 'gk' },
    traLoi: u => u.includes('generativelanguage.googleapis.com') && json({
      candidates: [{ content: { parts: [{ text: 'dang nghi...', thought: true }, { text: 'Xin ' }, { text: 'chào' }] } }]
    })
  });
  try {
    const data = await (await goiAi(s.goc, { messages: [{ role: 'user', content: 'hi' }], max_tokens: 1000 })).json();
    assert.strictEqual(data.content[0].text, 'Xin chào');
    const gm = s.daGoi.find(g => g.url.includes('generativelanguage.googleapis.com'));
    assert.ok(gm.url.includes('/models/gemini-3.8-flash:generateContent'), gm.url);
    assert.deepStrictEqual(gm.body.generationConfig.thinkingConfig, { thinkingLevel: 'high' });
    assert.strictEqual(gm.body.generationConfig.maxOutputTokens, 1000 + 16384);
    assert.strictEqual('temperature' in gm.body.generationConfig, false);
  } finally { s.dong(); }
});

const goiChay = (goc, body, dangNhap = true) => fetch(goc + '/api/run-cpp', {
  method: 'POST',
  headers: { 'content-type': 'application/json', ...(dangNhap ? { authorization: 'Bearer tok' } : {}) },
  body: JSON.stringify(body)
});

test('/api/run-cpp: chay C++ qua Compiler Explorer, tra ve stdout va ma thoat', async () => {
  const s = await moServer({
    traLoi: u => u.includes('godbolt.org') && json({ didExecute: true, code: 0, stdout: [{ text: 'Xin chào' }, { text: '42' }], stderr: [], buildResult: { code: 0 } })
  });
  try {
    const res = await goiChay(s.goc, { code: 'int main() {}', stdin: '21' });
    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(await res.json(), { stdout: 'Xin chào\n42', stderr: '', maThoat: 0, trinhBienDich: 'x86-64 gcc 13.2', dichVu: 'godbolt' });
    const gb = s.daGoi.find(g => g.url.includes('godbolt.org'));
    assert.strictEqual(gb.body.source, 'int main() {}');
    assert.strictEqual(gb.body.options.executeParameters.stdin, '21');
    assert.ok(gb.opts.signal, 'goi dich vu bien dich phai co timeout');
  } finally { s.dong(); }
});

test('/api/run-cpp: loi bien dich tra ve chu de doc (bo ma mau ANSI), khong chay chuong trinh', async () => {
  const s = await moServer({
    traLoi: u => u.includes('godbolt.org') && json({ didExecute: false, code: -1, stdout: [], stderr: [{ text: 'Build failed' }],
      buildResult: { code: 1, stderr: [{ text: '\u001b[01m<source>:3:5:\u001b[m error: expected ;' }] } })
  });
  try {
    const data = await (await goiChay(s.goc, { code: 'int main() { int x }' })).json();
    assert.deepStrictEqual(data, { bienDichLoi: '<source>:3:5: error: expected ;', trinhBienDich: 'x86-64 gcc 13.2', dichVu: 'godbolt' });
  } finally { s.dong(); }
});

test('/api/run-cpp: Compiler Explorer hong thi chuyen sang Wandbox', async () => {
  const s = await moServer({
    traLoi: u => (u.includes('godbolt.org') ? new Response('loi', { status: 503 })
      : u.includes('wandbox.org') && json({ status: '0', program_output: 'ok\n', program_error: '' }))
  });
  try {
    const data = await (await goiChay(s.goc, { code: 'int main() {}' })).json();
    assert.deepStrictEqual(data, { stdout: 'ok\n', stderr: '', maThoat: 0, trinhBienDich: 'gcc-head', dichVu: 'wandbox' });
  } finally { s.dong(); }
});

test('/api/run-cpp: chua dang nhap thi 401; code rong hoac qua dai thi 400, khong goi dich vu ngoai', async () => {
  const s = await moServer({ traLoi: () => null });
  try {
    assert.strictEqual((await goiChay(s.goc, { code: 'int main() {}' }, false)).status, 401);
    assert.strictEqual((await goiChay(s.goc, { code: '   ' })).status, 400);
    assert.strictEqual((await goiChay(s.goc, { code: 'x'.repeat(60000) })).status, 400);
    assert.ok(!s.daGoi.some(g => /godbolt|wandbox/.test(g.url)));
  } finally { s.dong(); }
});

const goiRun = (goc, body) => fetch(goc + '/api/run', {
  method: 'POST',
  headers: { 'content-type': 'application/json', authorization: 'Bearer tok' },
  body: JSON.stringify(body)
});

const DS_JAVA = [
  { id: 'java2100', name: 'jdk 21.0.0', semver: '21.0.0', supportsExecute: true },
  { id: 'java2400', name: 'jdk 24.0.1', semver: '24.0.1', supportsExecute: true },
  { id: 'javatrunk', name: 'jdk trunk', semver: 'trunk', supportsExecute: true },
  { id: 'java2500', name: 'jdk 25.0.0', semver: '25.0.0', supportsExecute: false }
];

test('/api/run: Java tu do trinh bien dich Compiler Explorer moi nhat chay duoc, bo public o lop ngoai cung', async () => {
  const s = await moServer({
    traLoi: u => (u.includes('/api/compilers/java') ? json(DS_JAVA)
      : u.includes('/api/compiler/java2400/compile') && json({ didExecute: true, code: 0, stdout: [{ text: 'Hello' }], stderr: [], buildResult: { code: 0 } }))
  });
  try {
    const code = 'public class HelloWorld {\n  public static void main(String[] a) { System.out.println("Hello"); }\n}';
    const data = await (await goiRun(s.goc, { lang: 'java', code })).json();
    assert.deepStrictEqual(data, { stdout: 'Hello', stderr: '', maThoat: 0, trinhBienDich: 'jdk 24.0.1', dichVu: 'godbolt' });
    const gb = s.daGoi.find(g => g.url.endsWith('/compile'));
    assert.ok(gb.body.source.startsWith('class HelloWorld {'), gb.body.source);
    assert.ok(gb.body.source.includes('  public static void main'));
    assert.strictEqual(gb.body.lang, 'java');
    await goiRun(s.goc, { lang: 'java', code });
    assert.strictEqual(s.daGoi.filter(g => g.url.includes('/api/compilers/java')).length, 1, 'danh sach trinh bien dich phai duoc nho lai');
  } finally { s.dong(); }
});

test('/api/run: Compiler Explorer khong chay duoc thi tu chon trinh Wandbox theo ngon ngu', async () => {
  const s = await moServer({
    traLoi: u => (u.includes('godbolt.org') ? new Response('loi', { status: 503 })
      : u.endsWith('/api/list.json') ? json([
        { name: 'go-head', language: 'Go', version: 'head' },
        { name: 'go-1.21.4', language: 'Go', version: '1.21.4', 'display-name': 'go' },
        { name: 'go-1.23.1', language: 'Go', version: '1.23.1', 'display-name': 'go' },
        { name: 'rust-1.80.0', language: 'Rust', version: '1.80.0' }
      ])
      : u.endsWith('/api/compile.json') && json({ status: '0', program_output: 'ok 42\n', program_error: '' }))
  });
  try {
    const data = await (await goiRun(s.goc, { lang: 'golang', code: 'package main\nfunc main() {}', stdin: '5' })).json();
    assert.deepStrictEqual(data, { stdout: 'ok 42\n', stderr: '', maThoat: 0, trinhBienDich: 'go 1.23.1', dichVu: 'wandbox' });
    const wb = s.daGoi.find(g => g.url.endsWith('/api/compile.json'));
    assert.strictEqual(wb.body.compiler, 'go-1.23.1');
    assert.strictEqual(wb.body.stdin, '5');
  } finally { s.dong(); }
});

test('/api/run: Wandbox bao loi chuong trinh (ngon ngu thong dich) tra ve stderr va ma thoat', async () => {
  const s = await moServer({
    traLoi: u => (u.endsWith('/api/list.json') ? json([{ name: 'php-8.3.3', language: 'PHP', version: '8.3.3' }])
      : u.endsWith('/api/compile.json') && json({ status: '255', program_output: 'truoc\n', program_error: 'PHP Parse error: syntax error' }))
  });
  try {
    const data = await (await goiRun(s.goc, { lang: 'php', code: '<?php echo "truoc\n"; x(' })).json();
    assert.deepStrictEqual(data, { stdout: 'truoc\n', stderr: 'PHP Parse error: syntax error', maThoat: 255, trinhBienDich: 'PHP 8.3.3', dichVu: 'wandbox' });
    assert.ok(!s.daGoi.some(g => g.url.includes('godbolt.org')), 'PHP khong co tren Compiler Explorer thi khong goi');
  } finally { s.dong(); }
});

test('/api/run: ngon ngu khong ho tro tra 400, khong goi dich vu ngoai', async () => {
  const s = await moServer({ traLoi: () => null });
  try {
    const res = await goiRun(s.goc, { lang: 'cobol', code: 'DISPLAY "HI".' });
    assert.strictEqual(res.status, 400);
    assert.ok(!s.daGoi.some(g => /godbolt|wandbox/.test(g.url)));
  } finally { s.dong(); }
});

test('/api/run/tu-kiem: chay chuong trinh mau tung ngon ngu, bao ngon ngu nao chay duoc', async () => {
  const s = await moServer({
    traLoi: u => (u.includes('/api/compilers/rust') ? json([{ id: 'r1830', name: 'rustc 1.83.0', semver: '1.83.0', supportsExecute: true }])
      : u.includes('/api/compiler/r1830/compile') ? json({ didExecute: true, code: 0, stdout: [{ text: 'ok 42' }], stderr: [], buildResult: { code: 0 } })
      : u.endsWith('/api/list.json') ? json([{ name: 'ruby-3.3.0', language: 'Ruby', version: '3.3.0' }])
      : u.endsWith('/api/compile.json') ? json({ status: '1', program_output: '', program_error: 'boom' })
      : u.includes('godbolt.org') && new Response('loi', { status: 503 }))
  });
  try {
    const data = await (await fetch(s.goc + '/api/run/tu-kiem?lang=rust,rb,cobol')).json();
    assert.deepStrictEqual(Object.keys(data).sort(), ['ruby', 'rust']);
    assert.strictEqual(data.rust.ok, true);
    assert.strictEqual(data.rust.trinhBienDich, 'rustc 1.83.0');
    assert.strictEqual(data.ruby.ok, false);
  } finally { s.dong(); }
});

test('/api/ai tra 400 khi messages sai dang thay vi day xuong nha cung cap', async () => {
  const s = await moServer({ khoa: { OPENROUTER_API_KEY: 'or' }, traLoi: () => null });
  try {
    const res = await goiAi(s.goc, { messages: 'hi' });
    assert.strictEqual(res.status, 400);
    assert.ok(!s.daGoi.some(g => g.url.includes('openrouter.ai')));
  } finally { s.dong(); }
});

test('Claude: dung model hien hanh, khong gui temperature, doc khoi text sau khoi thinking', async () => {
  const s = await moServer({
    khoa: { CLAUDE_API_KEY: 'ck' },
    traLoi: u => u.includes('api.anthropic.com') && json({
      content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: 'Xin chào' }],
      stop_reason: 'end_turn'
    })
  });
  try {
    const res = await goiAi(s.goc, { messages: [{ role: 'user', content: 'hi' }], temperature: 0.3 });
    const data = await res.json();
    assert.strictEqual(data.content[0].text, 'Xin chào');
    const cl = s.daGoi.find(g => g.url.includes('api.anthropic.com'));
    assert.strictEqual(cl.body.model, 'claude-opus-5-5');
    assert.strictEqual('temperature' in cl.body, false);
    assert.ok(cl.opts.signal);
  } finally { s.dong(); }
});

test('Claude tu choi (refusal) thi chuyen sang nha cung cap ke tiep', async () => {
  const s = await moServer({
    khoa: { CLAUDE_API_KEY: 'ck', GROQ_API_KEY: 'gq' },
    traLoi: u => {
      if (u.includes('api.anthropic.com')) return json({ content: [], stop_reason: 'refusal' });
      if (u.includes('api.groq.com')) return json({ choices: [{ message: { content: 'tu groq' } }] });
      return null;
    }
  });
  try {
    const data = await (await goiAi(s.goc, { messages: [{ role: 'user', content: 'hi' }] })).json();
    assert.strictEqual(data.content[0].text, 'tu groq');
  } finally { s.dong(); }
});

function vnWorks(viec) {
  return u => {
    if (u.includes('vietnamworks')) return json({ data: viec });
    if (u.includes('remoteok')) return json([{ legal: 1 }, {
      id: 9, position: 'Technical Lead', company: 'X', url: 'javascript:alert(document.cookie)',
      company_logo: 'https://x.io/logo.png', tags: ['react'], location: 'Worldwide'
    }, {
      id: 10, position: 'React Developer', company: 'Y', url: 'https://remoteok.com/l/10',
      company_logo: 'javascript:alert(1)', tags: ['react'], location: 'Worldwide'
    }]);
    return null;
  };
}

test('/api/jobs: tu khoa "technical lead" khong bi loc nham theo Ha Noi', async () => {
  const s = await moServer({
    traLoi: vnWorks([{
      jobId: 1, alias: 'tech-lead', jobTitle: 'Technical Lead Engineer', companyName: 'ACME',
      workingLocations: [{ cityId: 29, cityNameVI: 'Hồ Chí Minh' }], skills: [{ skillName: 'Java' }]
    }])
  });
  try {
    const data = await (await fetch(s.goc + '/api/jobs?search=' + encodeURIComponent('technical lead'))).json();
    assert.ok(data.jobs.some(j => j.title === 'Technical Lead Engineer'), JSON.stringify(data.jobs.map(j => j.title)));
  } finally { s.dong(); }
});

test('/api/jobs: nguoi moi chua hoc bai nao (AI goi y "Intern Developer") van ra viec', async () => {
  const s = await moServer({
    traLoi: vnWorks([{
      jobId: 2, alias: 'fresher-java', jobTitle: 'Fresher Java Developer', companyName: 'ACME',
      workingLocations: [{ cityId: 29, cityNameVI: 'Hồ Chí Minh' }], skills: [{ skillName: 'Java' }]
    }])
  });
  try {
    const data = await (await fetch(s.goc + '/api/jobs?search=' + encodeURIComponent('Intern Developer'))).json();
    assert.ok(data.jobs.some(j => j.title === 'Fresher Java Developer'), JSON.stringify(data.jobs.map(j => j.title)));
  } finally { s.dong(); }
});

test('/api/jobs: link va logo tu nguon ngoai chi giu http/https', async () => {
  const s = await moServer({ traLoi: vnWorks([]) });
  try {
    const data = await (await fetch(s.goc + '/api/jobs?search=react')).json();
    assert.deepStrictEqual(data.jobs.map(j => j.title), ['React Developer'], 'viec co link javascript: phai bi bo');
    assert.strictEqual(data.jobs[0].company_logo, null);
    for (const j of data.jobs) {
      assert.ok(!/^\s*javascript:/i.test(j.url), 'url: ' + j.url);
      assert.ok(!j.company_logo || /^https?:/i.test(j.company_logo), 'logo: ' + j.company_logo);
    }
  } finally { s.dong(); }
});

test('/api/jobs: moi request ra nguon viec lam deu co timeout', async () => {
  const s = await moServer({ traLoi: vnWorks([]) });
  try {
    await fetch(s.goc + '/api/jobs?search=react');
    const ra = s.daGoi.filter(g => !g.url.endsWith('/auth/v1/user'));
    assert.ok(ra.length >= 4);
    for (const g of ra) assert.ok(g.opts.signal, g.url + ' thieu timeout');
  } finally { s.dong(); }
});

test("URL chua $' khong lam nhan doi noi dung trang HTML", async () => {
  const s = await moServer({ traLoi: () => null });
  try {
    const html = await (await fetch(s.goc + "/hoc-$'-$`")).text();
    assert.strictEqual(html.match(/<title>/g).length, 1, 'the <title> bi nhan ban');
    assert.strictEqual(html.match(/<\/html>/g).length, 1, 'tai lieu bi chen lap');
  } finally { s.dong(); }
});
