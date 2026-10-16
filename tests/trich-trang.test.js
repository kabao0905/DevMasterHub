const { test } = require('node:test');
const assert = require('node:assert');
const { trichNoiDungTrang } = require('../lib/trich-trang.js');

const day = s => `self.__next_f.push(${JSON.stringify([1, s])})`;

test('trang Next.js (VietnamWorks): chu nam trong du lieu __next_f, ghep ca doan bi cat qua 2 lan push', () => {
  // Ban ghi van ban RSC "<id>:T<so byte UTF-8 dang hex>,<noi dung>", ban ghi sau dinh lien khong xuong dong
  const van = '<p><strong>Yêu cầu</strong></p><p>- 2 năm kinh nghiệm React, TypeScript</p>';
  const luong = `1:HL["/_next/static/media/a.woff2","font"]\n9:I[95751,["static/chunks/app.js"],""]\n1a:T${Buffer.byteLength(van).toString(16)},${van}2d:{"skillName":"HTML5","skillId":80349}\n`;
  const cat = luong.indexOf(', TypeScript');
  const html = `<html><head><title>Tuyển React</title></head><body><div id="app"></div>
    <script>${day(luong.slice(0, cat))}</script>
    <script>${day(luong.slice(cat))}</script></body></html>`;
  const s = trichNoiDungTrang(html);
  assert.match(s, /Yêu cầu - 2 năm kinh nghiệm React, TypeScript/);
  assert.doesNotMatch(s, /static\/chunks|skillId|woff2/);
});

test('ban ghi van ban la ma JS (gtag, analytics nhung vao trang) thi bo', () => {
  const ma = "var _gaq = _gaq || []; _gaq.push(['_setAccount', 'UA-1']); (function() { var ga = document.createElement('script'); })();";
  const van = '<p>Phúc lợi: bảo hiểm sức khoẻ, 13 tháng lương</p>';
  const luong = `1b:T${Buffer.byteLength(ma).toString(16)},${ma}1c:T${Buffer.byteLength(van).toString(16)},${van}`;
  const s = trichNoiDungTrang(`<script>${day(luong)}</script>`);
  assert.match(s, /Phúc lợi: bảo hiểm sức khoẻ/);
  assert.doesNotMatch(s, /_gaq|createElement/);
});

test('JSON-LD JobPosting: lay tieu de, cong ty, luong, dia diem, mo ta (bo the HTML)', () => {
  const ld = { '@context': 'https://schema.org', '@type': 'JobPosting', title: 'Backend Go', description: '<p>Xây API <b>Go</b></p>',
    hiringOrganization: { name: 'Cty A' }, jobLocation: { address: { addressLocality: 'Hà Nội' } },
    baseSalary: { currency: 'VND', value: { minValue: 20000000, maxValue: 30000000 } } };
  const html = `<html><body><p>ngắn</p><script type="application/ld+json">${JSON.stringify([ld])}</script></body></html>`;
  const s = trichNoiDungTrang(html);
  for (const x of ['Backend Go', 'Cty A', 'Hà Nội', 'Xây API Go', '20000000', '30000000']) assert.ok(s.includes(x), x);
});

test('chi co the meta mo ta thi van lay duoc', () => {
  const html = '<html><head><meta property="og:description" content="Tuyển dev Vue, lương 25 triệu &amp; thưởng"></head><body></body></html>';
  assert.match(trichNoiDungTrang(html), /Tuyển dev Vue, lương 25 triệu & thưởng/);
});

test('trang thuong nhieu chu: giu nguyen chu hien thi, khong chen them meta', () => {
  const than = 'Mô tả công việc chi tiết. '.repeat(40);
  const html = `<html><head><meta name="description" content="META-KHONG-CAN"></head><body><main>${than}</main><script>var x = 1;</script></body></html>`;
  const s = trichNoiDungTrang(html);
  assert.ok(s.startsWith('Mô tả công việc chi tiết.'));
  assert.doesNotMatch(s, /META-KHONG-CAN|var x/);
});

test('JSON-LD hong hoac __next_f hong khong lam sap', () => {
  const html = '<script type="application/ld+json">{hong</script><script>self.__next_f.push([1,"thieu ngoac</script>';
  assert.strictEqual(typeof trichNoiDungTrang(html), 'string');
});
