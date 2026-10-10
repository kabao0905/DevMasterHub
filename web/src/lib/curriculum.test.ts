import { nhomCongNghe, timBaiHoc, type MucTimKiem } from './curriculum';

test('nhom cong nghe giong sidebar cua app cu', () => {
  expect(nhomCongNghe({ id: 'dart', category: 'language' })).toBe('mobile');
  expect(nhomCongNghe({ id: 'dsa', category: 'language' })).toBe('tool');
  expect(nhomCongNghe({ id: 'react', category: 'framework' })).toBe('frontend');
  expect(nhomCongNghe({ id: 'sql', category: 'database' })).toBe('backend');
  expect(nhomCongNghe({ id: 'docker', category: 'devops' })).toBe('tool');
  expect(nhomCongNghe({ id: 'x', category: 'concept' })).toBe('tool');
  expect(nhomCongNghe({ id: 'python', category: 'language' })).toBe('language');
  expect(nhomCongNghe({ id: 'y', category: 'la-hoac' })).toBe('language');
});

const DS: MucTimKiem[] = [
  { t: 'python', l: 'newbie', s: 'bien', title: 'Biến và kiểu dữ liệu', text: 'Python có int, float, str' },
  { t: 'js', l: 'newbie', s: 'vong-lap', title: 'Vòng lặp', text: 'for và while trong JavaScript' }
];

test('tim kiem khop tieu de hoac ly thuyet, khong phan biet hoa thuong', () => {
  expect(timBaiHoc(DS, 'VÒNG').map(x => x.s)).toEqual(['vong-lap']);
  expect(timBaiHoc(DS, 'float').map(x => x.s)).toEqual(['bien']);
});

test('go khong dau van tim ra bai co dau', () => {
  expect(timBaiHoc(DS, 'kieu du lieu').map(x => x.s)).toEqual(['bien']);
  expect(timBaiHoc(DS, 'vong lap').map(x => x.s)).toEqual(['vong-lap']);
});

test('chuoi rong hoac chi khoang trang thi khong co ket qua; gioi han so ket qua', () => {
  expect(timBaiHoc(DS, '   ')).toEqual([]);
  expect(timBaiHoc(DS, 'a', 1)).toHaveLength(1);
});
