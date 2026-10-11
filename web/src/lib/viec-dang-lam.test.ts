import { QueryClient } from '@tanstack/react-query';
import { chupViecDangLam, napViecDangLam, KHOA_VIEC_REACT } from './viec-dang-lam';

const moi = () => new QueryClient();

test('chup roi nap cung nguoi dung: tra lai bai tap, quiz, gia su, de thu thach; co dang cho AI ve false; xoa ban chup', () => {
  const cu = moi();
  cu.setQueryData(['exercise', 'u1', 'python.newbie.a'], { aiExercises: [], activeExIdx: 0, answers: { 0: 'class Stack' }, feedback: {}, hienGoiY: {}, hienLoiGiai: {}, dangTao: true, dangCham: true });
  cu.setQueryData(['quiz', 'u1', 'python.newbie.a'], { questions: [{ question: 'Q' }], answers: { 0: 1 }, submitted: false });
  cu.setQueryData(['tutor', 'u1', 'python.newbie.a'], { tinNhan: [{ role: 'user', content: 'Hỏi' }], dangGui: true });
  cu.setQueryData(['challenge', 'u1', 'de'], { title: 'Đề AI' });
  chupViecDangLam(cu, 'u1');

  const moiQc = moi();
  napViecDangLam(moiQc, 'u1');
  expect(moiQc.getQueryData(['exercise', 'u1', 'python.newbie.a'])).toMatchObject({ answers: { 0: 'class Stack' }, dangTao: false, dangCham: false });
  expect(moiQc.getQueryData(['quiz', 'u1', 'python.newbie.a'])).toEqual({ questions: [{ question: 'Q' }], answers: { 0: 1 }, submitted: false });
  expect(moiQc.getQueryData(['tutor', 'u1', 'python.newbie.a'])).toEqual({ tinNhan: [{ role: 'user', content: 'Hỏi' }], dangGui: false });
  expect(moiQc.getQueryData(['challenge', 'u1', 'de'])).toEqual({ title: 'Đề AI' });
  expect(sessionStorage.getItem(KHOA_VIEC_REACT)).toBeNull();
});

test('chi chup viec dang lam cua nguoi dang dang nhap; bo tien do, ho so, may terminal (co ham)', () => {
  const cu = moi();
  cu.setQueryData(['exercise', 'u2', 'x'], { answers: { 0: 'cua nguoi khac' } });
  cu.setQueryData(['progress', 'u1'], ['python.newbie.a']);
  cu.setQueryData(['profile', 'u1'], { id: 'u1' });
  cu.setQueryData(['challenge', 'u1', 'may'], { may: { chay: () => 1 } });
  cu.setQueryData(['curriculum', 'index'], { techs: [] });
  chupViecDangLam(cu, 'u1');

  const moiQc = moi();
  napViecDangLam(moiQc, 'u1');
  expect(moiQc.getQueryCache().getAll()).toHaveLength(0);
});

test('nguoi dang nhap khac khong nhan viec cua nguoi truoc; ban chup bi xoa', () => {
  const cu = moi();
  cu.setQueryData(['exercise', 'u1', 'x'], { answers: { 0: 'bi mat' } });
  chupViecDangLam(cu, 'u1');

  const moiQc = moi();
  napViecDangLam(moiQc, 'u2');
  expect(moiQc.getQueryCache().getAll()).toHaveLength(0);
  expect(sessionStorage.getItem(KHOA_VIEC_REACT)).toBeNull();
});

test('roi trang khi chua dang nhap: xoa ban chup cu; ban chup hong khong lam vo trang', () => {
  const cu = moi();
  cu.setQueryData(['exercise', 'u1', 'x'], { answers: {} });
  chupViecDangLam(cu, 'u1');
  chupViecDangLam(cu, undefined);
  expect(sessionStorage.getItem(KHOA_VIEC_REACT)).toBeNull();

  sessionStorage.setItem(KHOA_VIEC_REACT, '{khong phai json');
  expect(() => napViecDangLam(moi(), 'u1')).not.toThrow();
  sessionStorage.setItem(KHOA_VIEC_REACT, JSON.stringify({ uid: 'u1', ds: 'sai' }));
  const moiQc = moi();
  expect(() => napViecDangLam(moiQc, 'u1')).not.toThrow();
  expect(moiQc.getQueryCache().getAll()).toHaveLength(0);
});

test('bo nho phien day (quota) thi bo qua, khong nem loi', () => {
  const cu = moi();
  cu.setQueryData(['exercise', 'u1', 'x'], { answers: {} });
  const ghi = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('day', 'QuotaExceededError'); });
  expect(() => chupViecDangLam(cu, 'u1')).not.toThrow();
  ghi.mockRestore();
});

test('cat ca khong gian Project Lab (idea, file, chat); bo co dang tao/gui/cham', () => {
  const cu = moi();
  cu.setQueryData(['project', 'u1', 'level'], { level: 'mid', topic: '', idea: { name: 'X' }, chat: [], files: [{ name: 'a.js', lang: 'javascript', code: 'x' }], tepDangMo: 0, ketQua: null, dangTao: true, dangGui: true, dangCham: true, tienDo: { buoc: 'module' } });
  chupViecDangLam(cu, 'u1');
  const moiQc = moi();
  napViecDangLam(moiQc, 'u1');
  expect(moiQc.getQueryData(['project', 'u1', 'level'])).toMatchObject({ idea: { name: 'X' }, files: [{ code: 'x' }], dangTao: false, dangGui: false, dangCham: false, tienDo: null });
});
