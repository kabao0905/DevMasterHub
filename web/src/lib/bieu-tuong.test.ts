import { tachBieuTuong } from './bieu-tuong';

test('tach emoji dau tieu de ra rieng de lam hoat anh, phan chu giu nguyen', () => {
  expect(tachBieuTuong('🚀 Dashboard')).toEqual(['🚀', 'Dashboard']);
  expect(tachBieuTuong('🚀 ダッシュボード')).toEqual(['🚀', 'ダッシュボード']);
  expect(tachBieuTuong('❤️ Yêu thích')).toEqual(['❤️', 'Yêu thích']);
});

test('tieu de khong mo dau bang emoji thi tra nguyen van', () => {
  expect(tachBieuTuong('Dashboard')).toEqual(['', 'Dashboard']);
  expect(tachBieuTuong('3 bài học')).toEqual(['', '3 bài học']);
  expect(tachBieuTuong('')).toEqual(['', '']);
});
