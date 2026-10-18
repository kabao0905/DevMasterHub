import { chuanHoa, docTienDo, kiemNhiemVu, luuTienDo, soKhop, timLab, tinhDiem, type BuocGiai, type NhiemVu } from './lab';
import { LABS_NGINX } from './labs-nginx';
import { createTerminal, type MayTerminal } from './terminal';

test('chuanHoa bo khoang trang thua va khong phan biet hoa thuong', () => {
  expect(chuanHoa('  /Etc/Nginx/NGINX.conf  ')).toBe('/etc/nginx/nginx.conf');
  expect(chuanHoa('80   ')).toBe('80');
  expect(chuanHoa(null)).toBe('');
});

test('soKhop chap nhan nhieu bien the dap an, khong chap nhan chuoi rong', () => {
  expect(soKhop(['80', '80/tcp'], '80/TCP')).toBe(true);
  expect(soKhop('/etc/nginx/nginx.conf', ' /etc/nginx/nginx.conf ')).toBe(true);
  expect(soKhop('80', '8080')).toBe(false);
  expect(soKhop('80', '   ')).toBe(false);
});

test('tinhDiem cong dung diem cua nhiem vu da xong, bo qua id la', () => {
  const lab = { tasks: [{ id: 'a', diem: 10 }, { id: 'b', diem: 10 }, { id: 'c', diem: 15 }, { id: 'd', diem: 25 }] };
  expect(tinhDiem(lab, ['a', 'b'])).toEqual({ xong: 2, tong: 4, diem: 20, tongDiem: 60 });
  expect(tinhDiem(lab, [])).toEqual({ xong: 0, tong: 4, diem: 0, tongDiem: 60 });
  expect(tinhDiem({ tasks: [{ id: 'a', diem: 10 }] }, ['a', 'khong-ton-tai']).diem).toBe(10);
});

test('luu va doc lai tien do (cung khoa va dinh dang voi app cu)', () => {
  luuTienDo('nginx.newbie.intro', ['a', 'b']);
  expect(docTienDo('nginx.newbie.intro')).toEqual(['a', 'b']);
  expect(docTienDo('bai.khac')).toEqual([]);
  expect(JSON.parse(localStorage.getItem('dmh_lab_progress')!)).toEqual({ 'nginx.newbie.intro': ['a', 'b'] });
});

test('timLab: bai chua co lab (ke ca ten trung thuoc tinh object) tra null', () => {
  expect(timLab('react.newbie.jsx')).toBeNull();
  expect(timLab('constructor')).toBeNull();
  expect(timLab('nginx.newbie.intro')?.tasks).toHaveLength(4);
});

const KHOA = 'nginx.newbie.intro';
const lab = LABS_NGINX[KHOA];
const dapAnDau = (nv: NhiemVu) => (nv.kieu === 'traLoi' ? (Array.isArray(nv.dapAn) ? nv.dapAn[0] : nv.dapAn) : '');

function chayBuoc(T: MayTerminal, buoc: BuocGiai) {
  if (typeof buoc === 'object') {
    expect(T.luuTuSoanThao(buoc.nano, buoc.noiDung)).toBeNull();
    return;
  }
  expect(T.executeCommand(buoc), `loi giai dung lenh chua cai: ${buoc}`).not.toContain('command not found');
}

test('phong lab bai 1: du 4 nhiem vu, tong 60 diem, co goi y va id rieng', () => {
  expect(lab.tasks).toHaveLength(4);
  expect(lab.tasks.reduce((s, t) => s + t.diem, 0)).toBe(60);
  expect(lab.tasks.some(t => t.kieu === 'trangThai')).toBe(true);
  expect(new Set(lab.tasks.map(t => t.id)).size).toBe(4);
  for (const t of lab.tasks) {
    expect(t.goiY.length).toBeGreaterThanOrEqual(1);
    expect(t.cau.length).toBeGreaterThan(10);
  }
});

test('dap an cua nhiem vu tra loi co that trong he thong tep', () => {
  const T = createTerminal();
  T.loadFs(lab.fs);
  const duong = T.executeCommand('find /').split('\n').filter(Boolean);
  const kho = duong.join('\n') + '\n' + duong.map(p => T.executeCommand('cat ' + p)).join('\n');
  for (const t of lab.tasks) {
    if (t.kieu !== 'traLoi') continue;
    const nhan = Array.isArray(t.dapAn) ? t.dapAn : [t.dapAn];
    expect(nhan.some(d => kho.includes(d)), t.id).toBe(true);
  }
});

test('CHAY LOI GIAI MAU: moi nhiem vu deu dat', () => {
  const T = createTerminal();
  T.loadFs(lab.fs);
  for (const buoc of lab.loiGiai ?? []) chayBuoc(T, buoc);
  for (const nv of lab.tasks) expect(kiemNhiemVu(nv, T.getFs(), dapAnDau(nv)).dat, nv.id).toBe(true);
});

test('KHONG QUA DUOC bang cach khong lam gi; truot thi noi ro thieu gi', () => {
  const T = createTerminal();
  T.loadFs(lab.fs);
  for (const nv of lab.tasks) {
    const kq = kiemNhiemVu(nv, T.getFs(), '');
    expect(kq.dat, nv.id).toBe(false);
    expect(kq.nhan, nv.id).toBeTruthy();
  }
});

test('he thong tep cua lab khong co muc treo', () => {
  const T = createTerminal();
  T.loadFs(lab.fs);
  const duong = T.executeCommand('find /').split('\n').filter(Boolean);
  const treo = duong.filter(d => {
    const a = T.executeCommand('cat ' + d);
    const b = T.executeCommand('cd ' + d);
    T.executeCommand('cd /');
    return a.includes('No such file') && b.includes('No such file');
  });
  expect(treo).toEqual([]);
});
