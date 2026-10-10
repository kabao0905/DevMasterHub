import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './auth';
import { useProgress } from './use-progress';
import { giaSupabase } from '@/test/gia-supabase';

function boc(gia: ReturnType<typeof giaSupabase>) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}><AuthProvider client={gia.client}>{children}</AuthProvider></QueryClientProvider>
  );
}

function moHook(gia: ReturnType<typeof giaSupabase>) {
  return renderHook(() => useProgress(), { wrapper: boc(gia) });
}

test('tai bai da xong cua nguoi dang dang nhap, bo bai chua xong, ghi cache cho app cu', async () => {
  const gia = giaSupabase({
    bang: {
      lesson_progress: [
        { tech_id: 'python', level_id: 'newbie', lesson_id: 'a', completed: true },
        { tech_id: 'python', level_id: 'newbie', lesson_id: 'b', completed: false }
      ]
    }
  });
  const { result } = moHook(gia);
  act(() => gia.phat('SIGNED_IN', { user: { id: 'u1' } }));

  await waitFor(() => expect(result.current.isDone('python', 'newbie', 'a')).toBe(true));
  expect(result.current.isDone('python', 'newbie', 'b')).toBe(false);
  const q = gia.truyVan.find(t => t.bang === 'lesson_progress')!;
  expect(q.dieuKien).toContainEqual(['user_id', 'u1']);
  expect(JSON.parse(localStorage.getItem('devmaster_hub_progress_cache')!)).toEqual({ 'python.newbie.a': true });
});

test('chua dang nhap thi khong goi Supabase va khong co bai nao xong', () => {
  const gia = giaSupabase();
  const { result } = moHook(gia);
  expect(result.current.done.size).toBe(0);
  expect(gia.truyVan.filter(t => t.bang === 'lesson_progress')).toHaveLength(0);
});

test('dang xuat trong luc dang tai tien do: ket qua ve muon khong ghi vao cache cua may', async () => {
  let tha!: () => void;
  const gia = giaSupabase({
    bang: { lesson_progress: [{ tech_id: 'python', level_id: 'newbie', lesson_id: 'a', completed: true }] },
    treo: { lesson_progress: new Promise<void>(r => { tha = r; }) }
  });
  const { result } = renderHook(() => ({ auth: useAuth(), p: useProgress() }), { wrapper: boc(gia) });
  act(() => gia.phat('SIGNED_IN', { user: { id: 'u1' } }));
  await waitFor(() => expect(gia.truyVan.some(t => t.bang === 'lesson_progress')).toBe(true));

  await act(() => result.current.auth.logout());
  await act(async () => { tha(); await new Promise(r => setTimeout(r, 20)); });

  expect(localStorage.getItem('devmaster_hub_progress_cache')).toBeNull();
});
