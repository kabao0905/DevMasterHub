import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useCurriculumIndex, useSearchIndex } from './use-curriculum';

function boc() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

afterEach(() => vi.unstubAllGlobals());

test('tai danh sach cong nghe tu /curriculum/index.json', async () => {
  const fetchGia = vi.fn(async () => ({ ok: true, json: async () => [{ id: 'python' }] }));
  vi.stubGlobal('fetch', fetchGia);
  const { result } = renderHook(() => useCurriculumIndex(), { wrapper: boc() });
  await waitFor(() => expect(result.current.data).toEqual([{ id: 'python' }]));
  expect(fetchGia).toHaveBeenCalledWith('/curriculum/index.json');
});

test('chi tai chi muc tim kiem khi nguoi dung bat dau tim', async () => {
  const fetchGia = vi.fn(async () => ({ ok: true, json: async () => [] }));
  vi.stubGlobal('fetch', fetchGia);
  const { rerender } = renderHook(({ bat }) => useSearchIndex(bat), { wrapper: boc(), initialProps: { bat: false } });
  expect(fetchGia).not.toHaveBeenCalled();
  rerender({ bat: true });
  await waitFor(() => expect(fetchGia).toHaveBeenCalledWith('/curriculum/search.json'));
});

test('loi HTTP thi bao loi ro rang', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 404, json: async () => null })));
  const { result } = renderHook(() => useCurriculumIndex(), { wrapper: boc() });
  await waitFor(() => expect(result.current.error?.message).toMatch(/404/));
});
