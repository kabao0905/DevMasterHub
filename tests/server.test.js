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
    assert.deepStrictEqual(await res.json(), { stdout: 'Xin chào\n42', stderr: '', maThoat: 0, dichVu: 'godbolt' });
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
    assert.deepStrictEqual(data, { bienDichLoi: '<source>:3:5: error: expected ;', dichVu: 'godbolt' });
  } finally { s.dong(); }
});

test('/api/run-cpp: Compiler Explorer hong thi chuyen sang Wandbox', async () => {
  const s = await moServer({
    traLoi: u => (u.includes('godbolt.org') ? new Response('loi', { status: 503 })
      : u.includes('wandbox.org') && json({ status: '0', program_output: 'ok\n', program_error: '' }))
  });
  try {
    const data = await (await goiChay(s.goc, { code: 'int main() {}' })).json();
    assert.deepStrictEqual(data, { stdout: 'ok\n', stderr: '', maThoat: 0, dichVu: 'wandbox' });
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
