import { doManhMatKhau } from './mat-khau';

test('rong thi chua cham', () => {
  expect(doManhMatKhau('')).toBeNull();
});

test('ngan hoac chi mot loai ky tu la yeu', () => {
  expect(doManhMatKhau('123456')).toBe('yeu');
  expect(doManhMatKhau('abcdefgh')).toBe('yeu');
});

test('du dai va co chu lan so la trung binh', () => {
  expect(doManhMatKhau('matkhau123')).toBe('trungBinh');
});

test('dai, co hoa, thuong, so va ky hieu la manh', () => {
  expect(doManhMatKhau('MatKhau@2026!')).toBe('manh');
});
