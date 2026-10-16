const { test } = require('node:test');
const assert = require('node:assert');
const { nhenViec } = require('../lib/nhen-viec.js');

const theViec = (i, ten) => `<div><a href="/vi/tim-viec-lam/${ten}-${i}.AB${1000 + i}C.html">${ten} ${i}</a><span>Cty ${i}</span><b>Lương ${i} triệu</b></div>`;
const danhSach = (tu, den, ten = 'lap-trinh-vien-react') => `<html><body><a href="/vi/dang-nhap">Đăng nhập</a>${
  Array.from({ length: den - tu + 1 }, (_, k) => theViec(tu + k, ten)).join('')}</body></html>`;

/** tai gia: map URL -> HTML; URL khong co thi 404. Ghi lai thu tu goi */
function giaTai(trang) {
  const da = [];
  const tai = async url => {
    da.push(url);
    return trang[url] != null ? { status: 200, url, body: trang[url], headers: { 'content-type': 'text/html' } } : { status: 404, url, body: '', headers: {} };
  };
  return { tai, da };
}

/** Jev gia: cham link theo tu trong link, cham viec theo so thu tu (viec so lon phu hop hon), laIT theo ten */
function giaJev({ hong = false } = {}) {
  const goi = [];
  return {
    goi, sanSang: true,
    async hoi(state, questions) {
      goi.push({ state, questions });
      if (hong) throw Object.assign(new Error('Jev lỗi HTTP 402'), { code: 'EJEV' });
      const ra = {};
      for (const [id, q] of Object.entries(questions)) {
        const s = JSON.stringify(q.instructions);
        if (id.startsWith('link')) ra[id] = { type: 'noul', noul: /cntt|phan-mem|it-/.test(s) ? 0.92 : 0.05 };
        else if (id.startsWith('fit')) ra[id] = { type: 'score', score: Number((s.match(/ (\d+)\\?"/) || [0, 0])[1]) % 4, confidence: 0.8 };
        else if (id.startsWith('it')) ra[id] = { type: 'noul', noul: /ke-toan/.test(s) ? 0.03 : 0.95 };
      }
      return ra;
    }
  };
}

const HOSO = { level: 'junior', skills: ['react', 'javascript'], completedLessons: 12 };
const BASE = 'https://careerviet.vn/viec-lam/cntt-phan-mem-c1-vi.html';
const mau = n => `https://careerviet.vn/viec-lam/cntt-phan-mem-c1-trang-${n}-vi.html`;

test('trang danh sach: doc trang 1, lat trang theo mau -trang-N, dung khi trang khong co tin moi', async () => {
  const { tai, da } = giaTai({ [BASE]: danhSach(1, 6), [mau(2)]: danhSach(7, 12), [mau(3)]: danhSach(7, 12) });
  const kq = await nhenViec({ url: BASE, yDinh: 'danh_sach', hoSo: HOSO, tai, jev: giaJev(), cho: async () => {} });
  assert.strictEqual(kq.batDau, BASE);
  assert.strictEqual(kq.soTrang, 2);
  assert.strictEqual(kq.tongViec, 12);
  assert.strictEqual(kq.dungVi, 'het_tin_moi');
  assert.deepStrictEqual(da, [BASE, mau(2), mau(3)]);
});

test('mau doan sai (trang 2 tra lai trang 1) thi thu mau ke tiep', async () => {
  const goc = 'https://x.vn/jobs';
  const { tai } = giaTai({ [goc]: danhSach(1, 6), [`${goc}?page=2`]: danhSach(1, 6), 'https://x.vn/jobs/page/2': danhSach(7, 9), 'https://x.vn/jobs/page/3': danhSach(10, 11) });
  const kq = await nhenViec({ url: goc, yDinh: 'danh_sach', hoSo: HOSO, tai, jev: giaJev(), cho: async () => {} });
  assert.strictEqual(kq.tongViec, 11);
  assert.strictEqual(kq.soTrang, 3);
});

test('gioi han so trang: khong doc qua toiDaTrang', async () => {
  const trang = { [BASE]: danhSach(1, 6) };
  for (let n = 2; n <= 9; n++) trang[mau(n)] = danhSach(n * 10, n * 10 + 5);
  const { tai, da } = giaTai(trang);
  const kq = await nhenViec({ url: BASE, yDinh: 'danh_sach', hoSo: HOSO, tai, jev: giaJev(), cho: async () => {}, toiDaTrang: 3 });
  assert.strictEqual(kq.soTrang, 3);
  assert.strictEqual(kq.dungVi, 'gioi_han_trang');
  assert.strictEqual(da.length, 3);
});

test('Jev cham viec: xep theo do phu hop, bo viec khong phai IT, tra toi da toiDaViec; hoi Jev bang tieng Anh kem ho so', async () => {
  const html = danhSach(1, 6).replace('</body>', theViec(7, 'ke-toan-truong') + theViec(8, 'ke-toan-vien') + '</body>');
  const jev = giaJev();
  const { tai } = giaTai({ [BASE]: html });
  const kq = await nhenViec({ url: BASE, yDinh: 'danh_sach', hoSo: HOSO, tai, jev, cho: async () => {}, toiDaViec: 4 });
  assert.strictEqual(kq.nguonDiem, 'jev');
  assert.strictEqual(kq.viec.length, 4);
  assert.ok(kq.viec.every(v => !/ke-toan/.test(v.url)));
  const diem = kq.viec.map(v => v.diem);
  assert.deepStrictEqual(diem, [...diem].sort((a, b) => b - a));
  const cham = jev.goi.find(g => Object.keys(g.questions).some(k => k.startsWith('fit')));
  assert.deepStrictEqual(cham.state.learner.skills, ['react', 'javascript']);
  assert.match(JSON.stringify(cham.questions), /How well/);
});

test('Jev loi (het credit...): van tra viec, cham bang code theo ky nang trong ten viec', async () => {
  const html = danhSach(1, 3).replace('</body>', theViec(4, 'backend-java') + theViec(5, 'backend-java') + theViec(6, 'backend-java') + '</body>');
  const { tai } = giaTai({ [BASE]: html });
  const kq = await nhenViec({ url: BASE, yDinh: 'danh_sach', hoSo: HOSO, tai, jev: giaJev({ hong: true }), cho: async () => {} });
  assert.strictEqual(kq.nguonDiem, 'code');
  assert.strictEqual(kq.tongViec, 6);
  assert.match(kq.viec[0].url, /react/);
});

test('link la mot tin nhung hoi ca web: Jev chon link dan toi danh sach viec IT tu trang chu', async () => {
  const tin = 'https://careerviet.vn/vi/tim-viec-lam/react-dev.AB1001C.html';
  const chu = 'https://careerviet.vn/';
  const trangChu = `<html><body><a href="/viec-lam/ke-toan-c3-vi.html">Kế toán</a><a href="/viec-lam/ban-hang-c5-vi.html">Bán hàng</a><a href="/viec-lam/cntt-phan-mem-c1-vi.html">CNTT - Phần mềm</a></body></html>`;
  const { tai } = giaTai({ [tin]: '<h1>React dev</h1><p>Mô tả</p>', [chu]: trangChu, [BASE]: danhSach(1, 6) });
  const jev = giaJev();
  const kq = await nhenViec({ url: tin, yDinh: 'ca_web', hoSo: HOSO, tai, jev, cho: async () => {} });
  assert.strictEqual(kq.batDau, BASE);
  assert.strictEqual(kq.tongViec, 6);
});

test('khong tim duoc danh sach viec nao thi bao loi ro rang', async () => {
  const { tai } = giaTai({ 'https://x.vn/': '<a href="/gioi-thieu">Giới thiệu</a>' });
  await assert.rejects(nhenViec({ url: 'https://x.vn/', yDinh: 'ca_web', hoSo: HOSO, tai, jev: giaJev(), cho: async () => {} }), { code: 'EKHONGDANHSACH' });
});

test('trang chu co muc "viec noi bat" khong coi la danh sach: di vao danh sach viec IT', async () => {
  const chu = 'https://careerviet.vn/';
  const trangChu = danhSach(1, 6, 'viec-hot').replace('</body>', '<a href="/viec-lam/cntt-phan-mem-c1-vi.html">CNTT - Phần mềm</a></body>');
  const { tai } = giaTai({ [chu]: trangChu, [BASE]: danhSach(1, 6) });
  const kq = await nhenViec({ url: chu, hoSo: HOSO, tai, jev: giaJev(), cho: async () => {} });
  assert.strictEqual(kq.batDau, BASE);
});

test('khong co link danh sach IT (menu dung bang JS) thi vao danh sach viec chung; Jev loc viec IT sau', async () => {
  const chu = 'https://careerviet.vn/';
  const tatCa = 'https://careerviet.vn/viec-lam/tat-ca-viec-lam-vi.html';
  const trangChu = '<html><body><a href="/vi/gioi-thieu">Giới thiệu</a><a href="/viec-lam/tat-ca-viec-lam-vi.html">Xem việc làm mới cập nhật</a></body></html>';
  const { tai } = giaTai({ [chu]: trangChu, [tatCa]: danhSach(1, 4).replace('</body>', theViec(5, 'ke-toan') + theViec(6, 'ke-toan-truong') + '</body>') });
  const kq = await nhenViec({ url: chu, hoSo: HOSO, tai, jev: giaJev(), cho: async () => {} });
  assert.strictEqual(kq.batDau, tatCa);
  assert.strictEqual(kq.tongViec, 6);
  assert.ok(kq.viec.every(v => !/ke-toan/.test(v.url)));
});
