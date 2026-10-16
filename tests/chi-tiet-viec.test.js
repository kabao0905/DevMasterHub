const { test } = require('node:test');
const assert = require('node:assert');
const { docTinTuyenDung } = require('../lib/chi-tiet-viec.js');

const goi = obj => `<html><head><script type="application/ld+json">${JSON.stringify(obj)}</script></head><body>x</body></html>`;

test('CareerViet: cong ty, logo, dia diem, luong chu ("Cạnh tranh"), hinh thuc bi boc ngoac kep, ky nang chuoi phay', () => {
  const tin = docTinTuyenDung(goi({
    '@context': 'https://schema.org', '@type': 'JobPosting', title: 'Chuyên viên Phân tích nghiệp vụ',
    description: '<p>Phân tích <b>yêu cầu</b> nghiệp vụ</p>',
    hiringOrganization: { '@type': 'Organization', name: 'VCBS', logo: 'https://images.careerviet.vn/logo.png' },
    jobLocation: { '@type': 'Place', address: { addressRegion: 'Hà Nội', addressLocality: 'Hà Nội' } },
    baseSalary: { currency: 'LTT', value: { value: 'Cạnh tranh', unitText: 'MONTH' } },
    employmentType: ['"FULL_TIME"'], skills: 'IT, phân tích nghiệp vụ, BA, Tester, Kiểm thử, SQL',
    datePosted: '2026-10-16T07:58:44Z', validThrough: '2026-11-30T23:59:00Z'
  }));
  assert.deepStrictEqual(tin, {
    title: 'Chuyên viên Phân tích nghiệp vụ', congTy: 'VCBS', logo: 'https://images.careerviet.vn/logo.png',
    diaDiem: 'Hà Nội', luong: 'Cạnh tranh', hinhThuc: 'FULLTIME',
    kyNang: ['IT', 'phân tích nghiệp vụ', 'BA', 'Tester', 'Kiểm thử'], kinhNghiem: '',
    moTa: 'Phân tích yêu cầu nghiệp vụ', hanNop: '2026-11-30'
  });
});

test('ITviec: luong USD min-max, nhieu dia diem (bo "Not Available"), lam tu xa, kinh nghiem theo thang', () => {
  const tin = docTinTuyenDung(goi([{ '@type': 'Organization', name: 'x' }, {
    '@type': 'JobPosting', title: 'Agentic Engineer', hiringOrganization: { name: 'MB Bank', logo: { url: 'https://itviec.com/l.png' } },
    jobLocation: [{ address: { addressLocality: 'Not Available', addressRegion: 'Hà Nội' } }, { address: { addressRegion: 'Hồ Chí Minh' } }, { address: { addressRegion: 'Hà Nội' } }],
    jobLocationType: 'TELECOMMUTE',
    baseSalary: { currency: 'USD', value: { minValue: 800, maxValue: 2000, unitText: 'MONTH' } },
    employmentType: 'FULL_TIME', skills: ['Python', 'FastAPI', 'Golang'],
    experienceRequirements: { '@type': 'OccupationalExperienceRequirements', monthsOfExperience: 24 }
  }]));
  assert.strictEqual(tin.congTy, 'MB Bank');
  assert.strictEqual(tin.logo, 'https://itviec.com/l.png');
  assert.strictEqual(tin.diaDiem, 'Hà Nội, Hồ Chí Minh · Remote');
  assert.strictEqual(tin.luong, '800 - 2,000 USD');
  assert.deepStrictEqual(tin.kyNang, ['Python', 'FastAPI', 'Golang']);
  assert.strictEqual(tin.kinhNghiem, '2 năm');
});

test('luong VND doi ra trieu; luong mot con so; khong co luong thi rong', () => {
  const luong = baseSalary => docTinTuyenDung(goi({ '@type': 'JobPosting', title: 't', baseSalary })).luong;
  assert.strictEqual(luong({ currency: 'VND', value: { minValue: 15000000, maxValue: 25000000 } }), '15 - 25 triệu');
  assert.strictEqual(luong({ currency: 'VND', value: { value: 30000000 } }), '30 triệu');
  assert.strictEqual(luong(undefined), '');
});

test('trang khong co JobPosting (bai blog, trang loi) hoac JSON hong thi tra null', () => {
  assert.strictEqual(docTinTuyenDung('<html><script type="application/ld+json">{"@type":"Article","headline":"CV dài bao nhiêu?"}</script></html>'), null);
  assert.strictEqual(docTinTuyenDung('<script type="application/ld+json">{hong</script>'), null);
  assert.strictEqual(docTinTuyenDung(''), null);
});

test('dia chi kieu CareerViet (quan o addressRegion, thanh pho o addressLocality): ghi thanh pho kem quan', () => {
  const tin = docTinTuyenDung(goi({ '@type': 'JobPosting', title: 't',
    jobLocation: { address: { addressRegion: 'Quận 1', addressLocality: 'Hồ Chí Minh' } } }));
  assert.strictEqual(tin.diaDiem, 'Hồ Chí Minh (Quận 1)');
});

test('luong bang chu khong co so va khong phai "Cạnh tranh/Thương lượng" (ITviec "You\'ll love it") coi nhu khong ghi', () => {
  const luong = value => docTinTuyenDung(goi({ '@type': 'JobPosting', title: 't', baseSalary: { currency: 'VND', value: { value } } })).luong;
  assert.strictEqual(luong("You'll love it"), '');
  assert.strictEqual(luong('Thỏa thuận'), 'Thỏa thuận');
  assert.strictEqual(luong('14 – 16 million VND/month'), '14 – 16 million VND/month');
});
