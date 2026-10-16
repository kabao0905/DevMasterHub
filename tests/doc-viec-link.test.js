const { test } = require('node:test');
const assert = require('node:assert');
const { chuanHoaYeuCauDocViec, docViecTuLink } = require('../lib/doc-viec-link.js');

const theViec = i => `<div><a href="/vi/tim-viec-lam/react-dev-${i}.AB${1000 + i}C.html">React dev ${i}</a><span>Cty ${i}</span></div>`;
const DS = 'https://careerviet.vn/viec-lam/cntt-phan-mem-c1-vi.html';
const TIN = 'https://careerviet.vn/vi/tim-viec-lam/react-dev.AB1001C.html';
const TRANG = {
  [DS]: `<html><head><title>Việc IT</title></head><body>${[1, 2, 3, 4, 5, 6].map(theViec).join('')}</body></html>`,
  [TIN]: '<html><head><title>React dev | CareerViet</title></head><body><h1>React dev</h1><p>Yêu cầu 2 năm React, TypeScript.</p></body></html>'
};
function giaTai() {
  const da = [];
  return { da, tai: async url => { da.push(url); return TRANG[url] ? { status: 200, url, body: TRANG[url], headers: { 'content-type': 'text/html' } } : { status: 404, url, body: '', headers: {} }; } };
}
const jevGia = { sanSang: true, hoi: async (_s, q) => Object.fromEntries(Object.keys(q).map(k => [k, k.startsWith('fit') ? { score: 2 } : { noul: 0.9 }])) };
const hoiAiTra = y => async () => `{"y_dinh": "${y}"}`;

test('chuan hoa body: can URL http(s); ky nang la mang chuoi ngan; bo truong la', () => {
  assert.ok(chuanHoaYeuCauDocViec({}).loi);
  assert.ok(chuanHoaYeuCauDocViec({ url: 'ftp://x' }).loi);
  const ok = chuanHoaYeuCauDocViec({ url: DS, cauHoi: 'xem hết', hoSo: { level: 'junior', skills: ['react', 42, 'x'.repeat(200)], completedLessons: '7', hack: 1 } });
  assert.deepStrictEqual(ok, { url: DS, cauHoi: 'xem hết', hoSo: { level: 'junior', skills: ['react'], completedLessons: 7 } });
});

test('hoi ve mot tin: doc dung trang do (tieu de + noi dung), khong lat trang', async () => {
  const { tai, da } = giaTai();
  const kq = await docViecTuLink({ url: TIN, cauHoi: 'tin này có hợp với mình không', hoSo: {} }, { tai, hoiAi: hoiAiTra('mot_tin'), jev: jevGia, cho: async () => {} });
  assert.strictEqual(kq.cheDo, 'mot_tin');
  assert.strictEqual(kq.pageTitle, 'React dev | CareerViet');
  assert.match(kq.content, /Yêu cầu 2 năm React/);
  assert.deepStrictEqual(da, [TIN]);
});

test('xem ca danh sach: nhen doc danh sach, trang dau chi tai mot lan (dung lai ban da tai)', async () => {
  const { tai, da } = giaTai();
  const kq = await docViecTuLink({ url: DS, cauHoi: 'xem toàn bộ việc IT ở web này', hoSo: { skills: ['react'] } }, { tai, hoiAi: hoiAiTra('ca_web'), jev: jevGia, cho: async () => {} });
  assert.strictEqual(kq.cheDo, 'danh_sach');
  assert.strictEqual(kq.yDinh, 'ca_web');
  assert.strictEqual(kq.tongViec, 6);
  assert.strictEqual(kq.viec.length, 6);
  assert.strictEqual(da.filter(u => u === DS).length, 1);
});

test('muon xem danh sach nhung khong tim thay trang danh sach: quay ve doc trang da gui, kem ghi chu', async () => {
  const { tai } = giaTai();
  const kq = await docViecTuLink({ url: TIN, cauHoi: 'xem hết việc ở web này', hoSo: {} }, { tai, hoiAi: hoiAiTra('ca_web'), jev: jevGia, cho: async () => {} });
  assert.strictEqual(kq.cheDo, 'mot_tin');
  assert.match(kq.ghiChu, /Không tìm thấy trang danh sách/);
});

test('trang dau khong tai duoc thi nem loi cua tai (route doi thanh ma HTTP)', async () => {
  const tai = async () => { throw Object.assign(new Error('Địa chỉ bị chặn'), { code: 'EBLOCKED' }); };
  await assert.rejects(docViecTuLink({ url: 'http://10.0.0.1/', cauHoi: '', hoSo: {} }, { tai, hoiAi: hoiAiTra('mot_tin'), jev: jevGia }), { code: 'EBLOCKED' });
});
