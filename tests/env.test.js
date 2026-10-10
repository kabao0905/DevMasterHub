const { test } = require('node:test');
const assert = require('node:assert');
const { phanTichEnv, napEnv } = require('../lib/env.js');

test('doc moi bien trong .env, khong chi 6 khoa AI', () => {
  const kq = phanTichEnv([
    '﻿# ghi chu',
    'SUPABASE_URL=https://abc.supabase.co',
    'BASE_URL = https://devmaster.vn ',
    'PORT=4000\r',
    'export GEMINI_API_KEY=g-123',
    'TRONG=',
    'khong co dau bang'
  ].join('\n'));
  assert.strictEqual(kq.SUPABASE_URL, 'https://abc.supabase.co');
  assert.strictEqual(kq.BASE_URL, 'https://devmaster.vn');
  assert.strictEqual(kq.PORT, '4000');
  assert.strictEqual(kq.GEMINI_API_KEY, 'g-123');
  assert.strictEqual(kq.TRONG, '');
  assert.strictEqual(Object.keys(kq).length, 5);
});

test('bo cap dau nhay bao quanh gia tri', () => {
  const kq = phanTichEnv('A="co dau cach"\nB=\'don\'\nC="x=1#2"');
  assert.strictEqual(kq.A, 'co dau cach');
  assert.strictEqual(kq.B, 'don');
  assert.strictEqual(kq.C, 'x=1#2');
});

test('bien da co trong moi truong thi khong bi .env ghi de', () => {
  const env = { PORT: '8080' };
  napEnv('PORT=3000\nBASE_URL=https://a.vn', env);
  assert.strictEqual(env.PORT, '8080');
  assert.strictEqual(env.BASE_URL, 'https://a.vn');
});
