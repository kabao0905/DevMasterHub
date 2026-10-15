const { test } = require('node:test');
const assert = require('node:assert');
const { moPhongBi } = require('../lib/phong-bi.js');

const goi = obj => ({ b64: Buffer.from(JSON.stringify(obj), 'utf8').toString('base64') });

function chay(body) {
  const req = { body };
  let maLoi = null, json = null, quaTiep = false;
  const res = { status(c) { maLoi = c; return this; }, json(j) { json = j; return this; } };
  moPhongBi(req, res, () => { quaTiep = true; });
  return { req, maLoi, json, quaTiep };
}

test('mo phong bi base64: body that duoc dat lai vao req.body, giu nguyen tieng Viet', () => {
  const goc = { messages: [{ role: 'user', content: 'Gia sư: ../../etc/passwd ${jndi:x} → đúng' }] };
  const { req, quaTiep } = chay(goi(goc));
  assert.ok(quaTiep);
  assert.deepStrictEqual(req.body, goc);
});

test('body thuong (khong boc) di qua nguyen ven — client cu van chay', () => {
  const goc = { messages: [{ role: 'user', content: 'xin chao' }] };
  const { req, quaTiep } = chay(goc);
  assert.ok(quaTiep);
  assert.strictEqual(req.body, goc);
});

test('phong bi hong (khong phai base64 JSON) thi tra 400, khong di tiep', () => {
  const { maLoi, quaTiep } = chay({ b64: Buffer.from('khong phai json').toString('base64') });
  assert.strictEqual(maLoi, 400);
  assert.strictEqual(quaTiep, false);
});

test('phong bi chua mang hoac so thi tra 400', () => {
  assert.strictEqual(chay(goi([1, 2])).maLoi, 400);
  assert.strictEqual(chay({ b64: 42 }).maLoi, 400);
});
