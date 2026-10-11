import { ngayDiaPhuong, tinhStreak } from './ngay-hoc';

const ngay = (...ds: string[]) => new Set(ds);
const HOM_NAY = new Date(2026, 9, 11, 9, 0); // 11/10/2026, gio may

test('ngayDiaPhuong lay ngay theo gio may, khong lech ngay nhu toISOString o mui gio +7', () => {
  expect(ngayDiaPhuong(new Date(2026, 9, 11, 0, 30))).toBe('2026-10-11');
  expect(ngayDiaPhuong(new Date(2026, 0, 5))).toBe('2026-01-05');
});

test('chua hoc ngay nao thi chuoi bang 0', () => {
  expect(tinhStreak(ngay(), HOM_NAY)).toEqual({ hienTai: 0, daiNhat: 0 });
});

test('hoc lien 3 ngay toi hom nay thi chuoi 3', () => {
  expect(tinhStreak(ngay('2026-10-09', '2026-10-10', '2026-10-11'), HOM_NAY).hienTai).toBe(3);
});

test('hom nay chua hoc nhung hom qua co hoc: chuoi van con (con ca ngay de giu)', () => {
  expect(tinhStreak(ngay('2026-10-09', '2026-10-10'), HOM_NAY).hienTai).toBe(2);
});

test('bo mot ngay thi chuoi dut', () => {
  expect(tinhStreak(ngay('2026-10-08', '2026-10-09'), HOM_NAY).hienTai).toBe(0);
});

test('chuoi qua dau thang va dau nam van lien', () => {
  const ds = ngay('2025-12-31', '2026-01-01', '2026-01-02');
  expect(tinhStreak(ds, new Date(2026, 0, 2)).hienTai).toBe(3);
});

test('daiNhat la chuoi dai nhat tung co, ke ca khi da dut', () => {
  const ds = ngay('2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-10-10', '2026-10-11');
  expect(tinhStreak(ds, HOM_NAY)).toEqual({ hienTai: 2, daiNhat: 4 });
});
