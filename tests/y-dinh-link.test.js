const { test } = require('node:test');
const assert = require('node:assert');
const { doanYDinh } = require('../lib/y-dinh-link.js');

test('Gemini doc cau hoi tieng Viet + loai trang, tra y dinh; prompt co cau hoi va loai trang', async () => {
  const goi = [];
  const hoiAi = async (system, user) => { goi.push({ system, user }); return '```json\n{"y_dinh": "ca_web"}\n```'; };
  const kq = await doanYDinh({ cauHoi: 'xem toàn bộ việc làm IT ở web này, cái nào hợp với tôi', loaiTrang: 'danh_sach', hoiAi });
  assert.deepStrictEqual(kq, { yDinh: 'ca_web', nguon: 'gemini' });
  assert.match(goi[0].user, /xem toàn bộ việc làm IT ở web này/);
  assert.match(goi[0].user, /danh_sach/);
  assert.match(goi[0].system, /mot_tin.*danh_sach.*ca_web/s);
});

test('Gemini tra linh tinh hoac loi thi doan theo loai trang', async () => {
  const linhTinh = async () => 'Mình nghĩ là bạn muốn xem nhiều việc';
  assert.deepStrictEqual(await doanYDinh({ cauHoi: 'x', loaiTrang: 'danh_sach', hoiAi: linhTinh }), { yDinh: 'danh_sach', nguon: 'code' });
  const hong = async () => { throw new Error('OpenRouter 402'); };
  assert.deepStrictEqual(await doanYDinh({ cauHoi: 'x', loaiTrang: 'mot_tin', hoiAi: hong }), { yDinh: 'mot_tin', nguon: 'code' });
  assert.deepStrictEqual(await doanYDinh({ cauHoi: 'x', loaiTrang: 'khac', hoiAi: hong }), { yDinh: 'ca_web', nguon: 'code' });
});
