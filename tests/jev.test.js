const { test } = require('node:test');
const assert = require('node:assert');
const { taoJev } = require('../lib/jev.js');

const traLoi = (answers, status = 200, them = {}) => ({
  ok: status >= 200 && status < 300, status,
  headers: { get: k => (them[k.toLowerCase()] ?? null) },
  json: async () => ({ model: 'typesafe/jev-1.13-20260917', answers, usage: { input_tokens: 10, cost: 0.0000004 } }),
  text: async () => JSON.stringify({ error: { message: 'loi' } })
});

test('goi OpenRouter System One: dung endpoint, khoa, model ghim va gui state + questions', async () => {
  const goi = [];
  const jev = taoJev({ khoa: 'sk-or-x', fetch: async (url, init) => { goi.push({ url, init }); return traLoi({ a: { type: 'noul', noul: 0.9 } }); } });
  const kq = await jev.hoi({ goal: 'x' }, { a: { type: 'noul', instructions: 'Is it?' } });
  assert.deepStrictEqual(kq, { a: { type: 'noul', noul: 0.9 } });
  assert.strictEqual(goi[0].url, 'https://openrouter.ai/api/v1/systemone');
  assert.strictEqual(goi[0].init.headers.Authorization, 'Bearer sk-or-x');
  const than = JSON.parse(goi[0].init.body);
  assert.strictEqual(than.model, 'typesafe/jev-1.13');
  assert.deepStrictEqual(than.state, { goal: 'x' });
  assert.ok(than.questions.a);
});

test('429 / 529 thi cho roi thu lai (theo retry-after), het luot thi bao loi', async () => {
  let n = 0;
  const cho = [];
  const jev = taoJev({ khoa: 'k', cho: async ms => { cho.push(ms); }, fetch: async () => (++n < 3 ? traLoi({}, n === 1 ? 429 : 529, { 'retry-after': '2' }) : traLoi({ a: { noul: 1 } })) });
  assert.deepStrictEqual(await jev.hoi('s', { a: { type: 'noul', instructions: 'q' } }), { a: { noul: 1 } });
  assert.deepStrictEqual(cho, [2000, 2000]);
  const hong = taoJev({ khoa: 'k', cho: async () => {}, fetch: async () => traLoi({}, 529) });
  await assert.rejects(hong.hoi('s', { a: { type: 'noul', instructions: 'q' } }), { code: 'EJEV' });
});

test('loi khong thu lai duoc (401, 402 het credit) bao ngay, khong thu lai', async () => {
  let n = 0;
  const jev = taoJev({ khoa: 'k', cho: async () => {}, fetch: async () => { n++; return traLoi({}, 402); } });
  await assert.rejects(jev.hoi('s', { a: { type: 'noul', instructions: 'q' } }), { code: 'EJEV', status: 402 });
  assert.strictEqual(n, 1);
});

test('khong co khoa thi bao loi ngay, khong goi mang', async () => {
  const jev = taoJev({ khoa: '', fetch: async () => { throw new Error('khong duoc goi'); } });
  assert.strictEqual(jev.sanSang, false);
  await assert.rejects(jev.hoi('s', {}), { code: 'EJEV' });
});
