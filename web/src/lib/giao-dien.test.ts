import { act, renderHook } from '@testing-library/react';
import { apGiaoDien, docGiaoDien, KHOA_GIAO_DIEN, useGiaoDien } from './giao-dien';

afterEach(() => {
  localStorage.clear();
  apGiaoDien('co-dien');
});

test('mac dinh la giao dien co dien (toi); gia tri la trong localStorage thi van co dien', () => {
  expect(docGiaoDien()).toBe('co-dien');
  localStorage.setItem(KHOA_GIAO_DIEN, 'hack');
  expect(docGiaoDien()).toBe('co-dien');
});

test('ap pastel: <html> co data-giao-dien="pastel", bo lop dark, doi mau thanh trinh duyet; quay ve co dien thi nguoc lai', () => {
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  document.head.appendChild(meta);
  apGiaoDien('pastel');
  expect(document.documentElement.dataset.giaoDien).toBe('pastel');
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  expect(meta.content).toBe('#dff3f8');
  apGiaoDien('co-dien');
  expect(document.documentElement.dataset.giaoDien).toBe('co-dien');
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(meta.content).toBe('#0a0e17');
  meta.remove();
});

test('useGiaoDien: doi giao dien thi luu, ap len trang va moi noi dung hook deu cap nhat', () => {
  const a = renderHook(() => useGiaoDien());
  const b = renderHook(() => useGiaoDien());
  expect(a.result.current[0]).toBe('co-dien');
  act(() => a.result.current[1]('pastel'));
  expect(localStorage.getItem(KHOA_GIAO_DIEN)).toBe('pastel');
  expect(document.documentElement.dataset.giaoDien).toBe('pastel');
  expect(b.result.current[0]).toBe('pastel');
});
