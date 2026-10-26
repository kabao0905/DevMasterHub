const { test } = require('node:test');
const assert = require('node:assert');
const { taoBoNhoTam } = require('../lib/bo-nho-tam.js');

test('cung khoa dang chay thi dung chung mot lan goi; con han thi tra ban luu', async () => {
  let gio = 0;
  let goi = 0;
  const bn = taoBoNhoTam({ songMs: 1000, toiDa: 10, bayGio: () => gio });
  const tao = async () => { goi++; return goi; };
  const [a, b] = await Promise.all([bn.lay('k', tao), bn.lay('k', tao)]);
  assert.deepStrictEqual([a, b, goi], [1, 1, 1]);
  gio = 999;
  assert.strictEqual(await bn.lay('k', tao), 1);
  gio = 1001;
  assert.strictEqual(await bn.lay('k', tao), 2);
});

test('vuot toiDa thi bo muc it dung nhat; loi hoac nenLuu=false thi khong luu', async () => {
  const bn = taoBoNhoTam({ songMs: 60_000, toiDa: 2 });
  let goi = 0;
  const tao = k => async () => { goi++; return k; };
  await bn.lay('a', tao('a'));
  await bn.lay('b', tao('b'));
  await bn.lay('a', tao('a'));
  await bn.lay('c', tao('c'));
  assert.strictEqual(bn.kichThuoc, 2);
  goi = 0;
  await bn.lay('a', tao('a'));
  await bn.lay('b', tao('b'));
  assert.strictEqual(goi, 1);

  await assert.rejects(bn.lay('x', async () => { throw new Error('mat mang'); }));
  assert.strictEqual(await bn.lay('x', async () => 'ok'), 'ok');
  await bn.lay('y', async () => 'rong', { nenLuu: () => false });
  assert.strictEqual(await bn.lay('y', async () => 'moi'), 'moi');
});
