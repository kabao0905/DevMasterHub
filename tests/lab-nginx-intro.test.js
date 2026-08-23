const { test } = require('node:test');
const assert = require('node:assert');
const { hopCat, napFile, napTerminal } = require('./helper.js');

const KHOA = 'nginx.newbie.intro';

function napLab() {
  const sb = hopCat();
  return napFile(sb, 'labs-nginx.js', 'LABS_NGINX')[KHOA];
}

/** Chuan hoa giong lab-runner: bo khoang trang thua, khong phan biet hoa thuong */
function chuanHoa(s) {
  return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');
}

function chamNhiemVu(nv, T, nhap) {
  if (nv.kieu === 'trangThai') return nv.kiem(T.getFs());
  const nhan = Array.isArray(nv.dapAn) ? nv.dapAn : [nv.dapAn];
  return { dat: nhan.some(x => chuanHoa(x) === chuanHoa(nhap)) };
}

/** Chay mot buoc trong loi giai: chuoi la lenh, object {nano,noiDung} la sua tep */
function chayBuoc(T, buoc) {
  if (typeof buoc === 'object' && buoc.nano) {
    const loi = T.luuTuSoanThao(buoc.nano, buoc.noiDung);
    assert.strictEqual(loi, null, `khong ghi duoc ${buoc.nano}: ${loi}`);
    return;
  }
  const ra = String(T.executeCommand(buoc) || '');
  assert.ok(!ra.includes('command not found'), `loi giai dung lenh chua cai: "${buoc}"`);
}

test('phong lab bai 1 ton tai va du 4 nhiem vu', () => {
  const lab = napLab();
  assert.ok(lab, 'khong tim thay phong lab ' + KHOA);
  assert.strictEqual(lab.tasks.length, 4);
  assert.strictEqual(lab.tasks.reduce((s, t) => s + t.diem, 0), 60, 'tong diem phai la 60');
  assert.ok(lab.tasks.some(t => t.kieu === 'trangThai'),
    'phai co it nhat mot nhiem vu kieu kiem trang thai');
});

test('moi nhiem vu deu co goi y va id rieng', () => {
  const lab = napLab();
  const ids = lab.tasks.map(t => t.id);
  assert.strictEqual(new Set(ids).size, ids.length, 'id nhiem vu bi trung');
  for (const t of lab.tasks) {
    assert.ok(t.goiY && t.goiY.length >= 1, 'nhiem vu ' + t.id + ' khong co goi y');
    assert.ok(t.cau && t.cau.length > 10, 'nhiem vu ' + t.id + ' cau hoi qua ngan');
  }
});

test('dap an cua nhiem vu tra loi phai co that trong he thong tep', () => {
  const lab = napLab();
  const T = napTerminal();
  T.loadFs(lab.fs);
  const duong = String(T.executeCommand('find /')).split('\n').filter(Boolean);
  const kho = duong.join('\n') + '\n'
    + duong.map(p => String(T.executeCommand('cat ' + p))).join('\n');
  for (const t of lab.tasks.filter(x => x.kieu === 'traLoi')) {
    const nhan = Array.isArray(t.dapAn) ? t.dapAn : [t.dapAn];
    assert.ok(nhan.some(d => kho.includes(d)),
      `dap an "${nhan[0]}" cua ${t.id} khong xuat hien o dau trong he thong tep`);
  }
});

test('CHAY LOI GIAI MAU: moi nhiem vu deu dat', () => {
  const lab = napLab();
  const T = napTerminal();
  T.loadFs(lab.fs);

  for (const buoc of lab.loiGiai) chayBuoc(T, buoc);

  for (const nv of lab.tasks) {
    const kq = chamNhiemVu(nv, T, nv.kieu === 'traLoi'
      ? (Array.isArray(nv.dapAn) ? nv.dapAn[0] : nv.dapAn)
      : null);
    assert.ok(kq.dat, `nhiem vu ${nv.id} khong dat sau khi chay loi giai: ${kq.nhan || ''}`);
  }
});

test('KHONG QUA DUOC bang cach khong lam gi', () => {
  const lab = napLab();
  const T = napTerminal();
  T.loadFs(lab.fs);
  for (const nv of lab.tasks.filter(x => x.kieu === 'trangThai')) {
    const kq = nv.kiem(T.getFs());
    assert.strictEqual(kq.dat, false,
      `nhiem vu ${nv.id} dat ngay tu dau — khong bat hoc vien lam gi ca`);
    assert.ok(kq.nhan, `nhiem vu ${nv.id} truot ma khong noi ro thieu gi`);
  }
});

test('he thong tep cua lab khong co muc treo', () => {
  const lab = napLab();
  const T = napTerminal();
  T.loadFs(lab.fs);
  const duong = String(T.executeCommand('find /')).split('\n').filter(Boolean);
  const treo = duong.filter(d => {
    const a = String(T.executeCommand('cat ' + d));
    const b = String(T.executeCommand('cd ' + d));
    T.executeCommand('cd /');
    return a.includes('No such file') && b.includes('No such file');
  });
  assert.deepStrictEqual(treo, []);
});
