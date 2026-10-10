import { renderHook } from '@testing-library/react';
import { usePageMeta } from './page-meta';

test('cap nhat title va description khi doi trang trong SPA', () => {
  document.head.innerHTML = '<meta name="description" content="cu"><link rel="canonical" href="cu">';
  renderHook(() => usePageMeta({ title: 'Dashboard | DevMaster Hub', description: 'Mô tả mới', url: 'https://x.vn/' }));
  expect(document.title).toBe('Dashboard | DevMaster Hub');
  expect(document.querySelector('meta[name="description"]')!.getAttribute('content')).toBe('Mô tả mới');
  expect(document.querySelector('link[rel="canonical"]')!.getAttribute('href')).toBe('https://x.vn/');
});
