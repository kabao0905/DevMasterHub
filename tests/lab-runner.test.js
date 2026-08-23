const { test } = require('node:test');
const assert = require('node:assert');
const { hopCat, napFile } = require('./helper.js');

// LabRunner chay trong hop cat vm — mot realm JavaScript khac. Mang va object
// no tra ve co prototype rieng, nen deepStrictEqual se bao "same structure but
// not reference-equal". Trai ra truoc khi so de chuyen ve realm hien tai.
const raHost = x => (Array.isArray(x) ? [...x] : { ...x });

function napRunner() {
  const sb = hopCat();
  return napFile(sb, 'lab-runner.js', 'LabRunner');
}

test('chuanHoa bo khoang trang thua va khong phan biet hoa thuong', () => {
  const R = napRunner();
  assert.strictEqual(R.chuanHoa('  /Etc/Nginx/NGINX.conf  '), '/etc/nginx/nginx.conf');
  assert.strictEqual(R.chuanHoa('80   '), '80');
  assert.strictEqual(R.chuanHoa(null), '');
});

test('soKhop chap nhan nhieu bien the dap an', () => {
  const R = napRunner();
  assert.ok(R.soKhop(['80', '80/tcp'], '80/TCP'));
  assert.ok(R.soKhop('/etc/nginx/nginx.conf', ' /etc/nginx/nginx.conf '));
  assert.ok(!R.soKhop('80', '8080'));
});

test('soKhop khong chap nhan chuoi rong', () => {
  const R = napRunner();
  assert.ok(!R.soKhop('80', ''));
  assert.ok(!R.soKhop('80', '   '));
});

test('tinhDiem cong dung diem cua cac nhiem vu da xong', () => {
  const R = napRunner();
  const lab = { tasks: [
    { id: 'a', diem: 10 }, { id: 'b', diem: 10 },
    { id: 'c', diem: 15 }, { id: 'd', diem: 25 }
  ] };
  assert.deepStrictEqual(raHost(R.tinhDiem(lab, ['a', 'b'])),
    { xong: 2, tong: 4, diem: 20, tongDiem: 60 });
  assert.deepStrictEqual(raHost(R.tinhDiem(lab, [])),
    { xong: 0, tong: 4, diem: 0, tongDiem: 60 });
});

test('tinhDiem bo qua id la khong co trong lab', () => {
  const R = napRunner();
  const lab = { tasks: [{ id: 'a', diem: 10 }] };
  assert.strictEqual(R.tinhDiem(lab, ['a', 'khong-ton-tai']).diem, 10);
});

test('luu va doc lai tien do', () => {
  const R = napRunner();
  R.luuTienDo('nginx.newbie.intro', ['a', 'b']);
  assert.deepStrictEqual(raHost(R.docTienDo('nginx.newbie.intro')), ['a', 'b']);
  assert.deepStrictEqual(raHost(R.docTienDo('bai.khac')), []);
});

test('timLab tra ve null khi bai hoc chua co phong lab', () => {
  const R = napRunner();
  assert.strictEqual(R.timLab('react.newbie.jsx'), null);
});
