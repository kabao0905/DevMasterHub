import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AuthProvider } from './auth';
import { useProgress } from './use-progress';
import { giaSupabase } from '@/test/gia-supabase';

function moHook(gia: ReturnType<typeof giaSupabase>) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}><AuthProvider client={gia.client}>{children}</AuthProvider></QueryClientProvider>
  );
  return renderHook(() => useProgress(), { wrapper });
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
