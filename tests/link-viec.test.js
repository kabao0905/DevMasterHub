const { test } = require('node:test');
const assert = require('node:assert');
const { layLink, nhomTinViec, doanLoaiTrang, mauTrangSau, trangThu } = require('../lib/link-viec.js');

const GOC = 'https://careerviet.vn/viec-lam/cntt-phan-mem-tai-ho-chi-minh-c1l8-vi.html';
const viec = (ten, ma, cty, luong) =>
  `<div class="job-item"><a href="/vi/tim-viec-lam/${ten}.${ma}.html" title="${ten}">${ten.replace(/-/g, ' ')}</a>
   <a href="/vi/nha-tuyen-dung/${cty}.html">${cty}</a><div class="salary">Lương: ${luong}</div><p>Hồ Chí Minh</p></div>`;
const trangDanhSach = (them = '') => `<html><body>
  <nav><a href="/vi/dang-nhap">Đăng nhập</a><a href="https://careerviet.vn/viec-lam/ke-toan-c3-vi.html">Kế toán</a>
  <a href="https://careerviet.vn/viec-lam/cntt-phan-mem-c1-vi.html">CNTT - Phần mềm</a><a href="https://facebook.com/careerviet">FB</a></nav>
  ${viec('lap-trinh-vien-react', '35C8AE31', 'cty-a', '20-30 triệu')}
  ${viec('backend-java-developer', '35C8AE32', 'cty-b', 'Thương lượng')}
  ${viec('devops-engineer', '35C8AE33', 'cty-c', '1500-2500 USD')}
  ${viec('tester-qa', '35C8AE34', 'cty-d', '15 triệu')}
  ${viec('data-engineer', '35C8AE35', 'cty-e', '40 triệu')}
  ${viec('mobile-flutter-dev', '35C8AE36', 'cty-f', '25 triệu')}
  ${them}<a href="/vi/tim-viec-lam/lap-trinh-vien-react.35C8AE31.html#apply">Ứng tuyển</a></body></html>`;

test('layLink: doi link tuong doi thanh tuyet doi, bo #, chi http(s), giu chu tren link', () => {
  const ds = layLink('<a href="/a/b.html#x">  Việc &amp; làm </a><a href="mailto:x@y.z">m</a><a href="javascript:void(0)">j</a><a href="https://k.vn/c">c</a>', GOC);
  assert.deepStrictEqual(ds.map(l => [l.url, l.text]), [['https://careerviet.vn/a/b.html', 'Việc & làm'], ['https://k.vn/c', 'c']]);
});

test('nhomTinViec: nhan ra nhom link tin tuyen dung lap lai (cung khuon duong dan), bo nav va link trung', () => {
  const nhom = nhomTinViec(layLink(trangDanhSach(), GOC), GOC);
  assert.strictEqual(nhom.length, 6);
  assert.ok(nhom.every(l => l.url.startsWith('https://careerviet.vn/vi/tim-viec-lam/')));
  assert.strictEqual(nhom[0].text, 'lap trinh vien react');
});

test('doanLoaiTrang: danh sach / mot tin / khac', () => {
  assert.strictEqual(doanLoaiTrang(GOC, trangDanhSach()), 'danh_sach');
  const motTin = '<html><body><h1>Lập trình viên React</h1><p>Mô tả công việc...</p><a href="/vi/tim-viec-lam/khac.35C8AE40.html">Việc tương tự</a></body></html>';
  assert.strictEqual(doanLoaiTrang('https://careerviet.vn/vi/tim-viec-lam/lap-trinh-vien-react.35C8AE31.html', motTin), 'mot_tin');
  assert.strictEqual(doanLoaiTrang('https://careerviet.vn/', '<a href="/vi/gioi-thieu">Giới thiệu</a>'), 'khac');
});

test('mauTrangSau: lay tu link so trang tren trang; khong co thi doan theo kieu URL pho bien', () => {
  const coLink = layLink('<a href="/viec-lam/it-c1-trang-2-vi.html">2</a><a href="/viec-lam/it-c1-trang-3-vi.html">3</a>', 'https://careerviet.vn/viec-lam/it-c1-vi.html');
  assert.deepStrictEqual(mauTrangSau('https://careerviet.vn/viec-lam/it-c1-vi.html', coLink)[0], 'https://careerviet.vn/viec-lam/it-c1-trang-{n}-vi.html');
  const doan = mauTrangSau(GOC, []);
  assert.ok(doan.includes('https://careerviet.vn/viec-lam/cntt-phan-mem-tai-ho-chi-minh-c1l8-trang-{n}-vi.html'));
  assert.ok(doan.includes(`${GOC}?page={n}`));
  // URL da co so trang thi chi thay so
  assert.deepStrictEqual(mauTrangSau('https://x.vn/jobs?page=1&q=it', []), ['https://x.vn/jobs?page={n}&q=it']);
});

test('trangThu: dien so trang vao mau', () => {
  assert.strictEqual(trangThu('https://x.vn/a-trang-{n}-vi.html', 3), 'https://x.vn/a-trang-3-vi.html');
});

test('trichTheViec: chu tung the tin (ten, cong ty, luong), khong lot icon SVG hay the cat do', () => {
  const html = trangDanhSach().replace('<p>Hồ Chí Minh</p>', '<svg viewBox="0 0 10 10"><path d="M12.39 0.35"/></svg><p>Hồ Chí Minh</p>');
  const the = require('../lib/link-viec.js').trichTheViec(html, nhomTinViec(layLink(html, GOC), GOC));
  assert.strictEqual(the.length, 6);
  assert.match(the[0].snippet, /^lap trinh vien react cty-a Lương: 20-30 triệu Hồ Chí Minh/);
  assert.doesNotMatch(the.map(t => t.snippet).join(' '), /path|viewBox|M12/);
});

test('link danh muc / dia diem (khong co ma tin) khong phai nhom tin viec', () => {
  const html = ['ho-chi-minh-l8', 'ha-noi-l4', 'cntt-phan-mem-c1', 'ke-toan-c3', 'ban-hang-c5', 'marketing-c7']
    .map(s => `<a href="/viec-lam/${s}-vi.html">${s}</a>`).join('');
  assert.deepStrictEqual(nhomTinViec(layLink(html, GOC), GOC), []);
  assert.strictEqual(doanLoaiTrang('https://careerviet.vn/', html), 'khac');
});

test('trang chi tiet tin co muc "viec tuong tu" (cung khuon link voi chinh no) la mot tin, khong phai danh sach', () => {
  const tin = 'https://careerviet.vn/vi/tim-viec-lam/project-manager.35C8AE31.html';
  const html = `<h1>Project manager</h1><p>Mô tả</p>${[1, 2, 3, 4, 5, 6].map(i => `<a href="/vi/tim-viec-lam/viec-tuong-tu-${i}.35C8AF0${i}.html">Việc tương tự ${i}</a>`).join('')}`;
  assert.strictEqual(doanLoaiTrang(tin, html), 'mot_tin');
});

test('kieu ITviec: link loc (ky nang, thanh pho) chung khuon voi link tin; chi lay link co ma so, gop link trung khac tham so theo doi', () => {
  const goc = 'https://itviec.com/it-jobs/reactjs';
  const loc = ['java', 'python', 'ha-noi', 'ho-chi-minh-hcm', 'php', 'golang', 'nodejs'].map(s => `<a href="/it-jobs/${s}">${s}</a>`).join('');
  const tin = [5536, 5051, 4137, 2723].map(n => `<a href="/it-jobs/react-developer-cty-${n}?lab_feature=preview_jd_page">React dev ${n}</a>`).join('')
    + '<a href="/it-jobs/react-developer-cty-5536?track_action=Click">React dev 5536 (lap)</a>';
  const nhom = nhomTinViec(layLink(loc + tin, goc), goc);
  assert.deepStrictEqual(nhom.map(l => l.text), ['React dev 5536', 'React dev 5051', 'React dev 4137', 'React dev 2723']);
});

test('the tin khong co chu tren link (chi co anh) thi lay ten tu duong dan', () => {
  const html = [11111, 22222, 33333].map(n => `<a href="/vi/tim-viec-lam/senior-react-developer.AB${n}.html"><img src="x.png"></a>`).join('');
  const the = require('../lib/link-viec.js').trichTheViec(html, nhomTinViec(layLink(html, GOC), GOC));
  assert.strictEqual(the[0].title, 'senior react developer');
});
