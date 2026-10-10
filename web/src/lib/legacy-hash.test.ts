import { duongDanTuHashCu } from './legacy-hash';

test('link hash cua app cu duoc chuyen thanh duong dan that', () => {
  expect(duongDanTuHashCu('#roadmap/python')).toBe('/roadmap/python');
  expect(duongDanTuHashCu('#/lesson/python/newbie/bien')).toBe('/lesson/python/newbie/bien');
  expect(duongDanTuHashCu('#career')).toBe('/career');
});

test('hash khong phai route cua app thi bo qua', () => {
  expect(duongDanTuHashCu('')).toBeNull();
  expect(duongDanTuHashCu('#')).toBeNull();
  expect(duongDanTuHashCu('#muc-luc')).toBeNull();
  expect(duongDanTuHashCu('#dashboard')).toBe('/');
});
