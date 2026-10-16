const { test } = require('node:test');
const assert = require('node:assert');
const { chuanHoaYeuCauAi, GIOI_HAN } = require('../lib/ai-guard.js');

const hopLe = (them = {}) => ({
  system: 'Ban la gia su.',
  messages: [{ role: 'user', content: 'Xin chao' }],
  ...them
});

test('bo qua model do client gui, khong de nguoi dung tu chon model dat tien', () => {
  const kq = chuanHoaYeuCauAi(hopLe({ model: 'openai/o1-pro' }));
  assert.ok(!kq.loi);
  assert.strictEqual('model' in kq, false);
});

test('ep max_tokens ve trong gioi han', () => {
  assert.strictEqual(chuanHoaYeuCauAi(hopLe({ max_tokens: 100000 })).maxTokens, GIOI_HAN.maxTokens);
  assert.strictEqual(chuanHoaYeuCauAi(hopLe({ max_tokens: -5 })).maxTokens, 1);
  assert.strictEqual(chuanHoaYeuCauAi(hopLe({ max_tokens: 'abc' })).maxTokens, 4096);
  assert.strictEqual(chuanHoaYeuCauAi(hopLe({ max_tokens: 1024 })).maxTokens, 1024);
});

test('ep temperature ve khoang an toan', () => {
  assert.strictEqual(chuanHoaYeuCauAi(hopLe({ temperature: 9 })).temperature, GIOI_HAN.temperature);
  assert.strictEqual(chuanHoaYeuCauAi(hopLe({ temperature: -1 })).temperature, 0);
  assert.strictEqual(chuanHoaYeuCauAi(hopLe()).temperature, 0.7);
});

test('taskType la thi quy ve general', () => {
  assert.strictEqual(chuanHoaYeuCauAi(hopLe({ taskType: 'quiz' })).taskType, 'quiz');
  assert.strictEqual(chuanHoaYeuCauAi(hopLe({ taskType: 'hackModel' })).taskType, 'general');
  assert.strictEqual(chuanHoaYeuCauAi(hopLe({ taskType: '__proto__' })).taskType, 'general');
});

test('tu choi messages sai dang', () => {
  assert.ok(chuanHoaYeuCauAi(hopLe({ messages: 'xin chao' })).loi);
  assert.ok(chuanHoaYeuCauAi(hopLe({ messages: [] })).loi);
  assert.ok(chuanHoaYeuCauAi(hopLe({ messages: [{ role: 'system', content: 'x' }] })).loi);
  assert.ok(chuanHoaYeuCauAi(hopLe({ messages: [{ role: 'user', content: 42 }] })).loi);
  assert.ok(chuanHoaYeuCauAi(hopLe({ system: { x: 1 } })).loi);
});

test('tu choi yeu cau qua dai', () => {
  const dai = 'a'.repeat(GIOI_HAN.tongKyTu + 1);
  assert.ok(chuanHoaYeuCauAi(hopLe({ messages: [{ role: 'user', content: dai }] })).loi);
});

test('doan y dinh link (crawlIntent): Gemini Flash, suy nghi muc thap; viec khac giu muc cao', () => {
  const { MO_HINH_THEO_VIEC, suyNghiCho } = require('../lib/ai-guard.js');
  assert.strictEqual(MO_HINH_THEO_VIEC.crawlIntent, 'google/gemini-3.8-flash');
  assert.strictEqual(suyNghiCho('crawlIntent').muc, 'low');
  assert.strictEqual(suyNghiCho('tutor').muc, 'high');
});
