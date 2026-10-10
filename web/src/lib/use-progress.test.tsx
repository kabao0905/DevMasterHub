import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth';
import { I18nProvider } from './i18n';
import { useProgress, useToggleComplete } from './use-progress';
import { giaSupabase } from '@/test/gia-supabase';
import { BAN_DICH_VI } from '@/test/ban-dich-vi';
import { Toaster } from '@/components/ui/sonner';

function boc(gia: ReturnType<typeof giaSupabase>) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}><AuthProvider client={gia.client}>{children}</AuthProvider></QueryClientProvider>
  );
}

/** Them ban dich va noi hien toast cho hook co bao loi */
function bocDayDu(gia: ReturnType<typeof giaSupabase>) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  localStorage.setItem('devmaster_hub_lang', 'vi');
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>
      <I18nProvider taiBanDich={async () => BAN_DICH_VI}>
        <AuthProvider client={gia.client}>{children}</AuthProvider>
        <Toaster />
      </I18nProvider>
    </QueryClientProvider>
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

const XONG_A = { user_id: 'u1', tech_id: 'python', level_id: 'newbie', lesson_id: 'a', completed: true };
const ghiTienDo = (gia: ReturnType<typeof giaSupabase>) => gia.truyVan.filter(q => q.bang === 'lesson_progress' && q.op === 'upsert');

async function moDanhDau(gia: ReturnType<typeof giaSupabase>) {
  const kq = renderHook(() => ({ p: useProgress(), d: useToggleComplete() }), { wrapper: bocDayDu(gia) });
  await waitFor(() => expect(kq.result.current).not.toBeNull());
  act(() => gia.phat('SIGNED_IN', { user: { id: 'u1' } }));
  await waitFor(() => expect(kq.result.current.p.loading).toBe(false));
  return kq;
}

test('danh dau hoan thanh: ghi dung mot dong, co completed_at, va cache cho app cu', async () => {
  const gia = giaSupabase({ bang: { lesson_progress: [] } });
  const { result } = await moDanhDau(gia);
  let tha!: () => void;
  gia.treo.lesson_progress = new Promise<void>(r => { tha = r; });
  act(() => result.current.d.toggle('python', 'newbie', 'b'));
  // Doi tren giao dien ngay, chua can server tra loi
  await waitFor(() => expect(result.current.p.isDone('python', 'newbie', 'b')).toBe(true));
  tha();
  await waitFor(() => expect(ghiTienDo(gia)).toHaveLength(1));
  const [q] = ghiTienDo(gia);
  expect(q.payload).toMatchObject({ user_id: 'u1', tech_id: 'python', level_id: 'newbie', lesson_id: 'b', completed: true });
  expect(typeof (q.payload as { completed_at: unknown }).completed_at).toBe('string');
  expect(q.tuyChon).toEqual({ onConflict: 'user_id,tech_id,level_id,lesson_id' });
  await waitFor(() => expect(JSON.parse(localStorage.getItem('devmaster_hub_progress_cache')!)).toEqual({ 'python.newbie.b': true }));
});

test('bo danh dau: completed false, completed_at null, cache khong con bai do', async () => {
  const gia = giaSupabase({ bang: { lesson_progress: [XONG_A] } });
  const { result } = await moDanhDau(gia);
  await waitFor(() => expect(result.current.p.isDone('python', 'newbie', 'a')).toBe(true));
  act(() => result.current.d.toggle('python', 'newbie', 'a'));
  await waitFor(() => expect(ghiTienDo(gia)).toHaveLength(1));
  expect(ghiTienDo(gia)[0].payload).toMatchObject({ lesson_id: 'a', completed: false, completed_at: null });
  await waitFor(() => expect(JSON.parse(localStorage.getItem('devmaster_hub_progress_cache')!)).toEqual({}));
});

test('Supabase tu choi ghi: hoan tac va bao loi', async () => {
  const gia = giaSupabase({ bang: { lesson_progress: [] }, loiGhi: { lesson_progress: 'permission denied' } });
  const { result } = await moDanhDau(gia);
  act(() => result.current.d.toggle('python', 'newbie', 'b'));
  expect(await screen.findByText('Không lưu được tiến độ. Thử lại sau.')).toBeInTheDocument();
  expect(result.current.p.isDone('python', 'newbie', 'b')).toBe(false);
});

test('bam hai lan lien tiep: hai lan ghi chay tuan tu, ket qua cuoi la chua xong', async () => {
  const gia = giaSupabase({ bang: { lesson_progress: [] } });
  const { result } = await moDanhDau(gia);
  let tha!: () => void;
  gia.treo.lesson_progress = new Promise<void>(r => { tha = r; });
  act(() => result.current.d.toggle('python', 'newbie', 'b'));
  act(() => result.current.d.toggle('python', 'newbie', 'b'));
  await waitFor(() => expect(ghiTienDo(gia)).toHaveLength(1));
  expect(result.current.p.isDone('python', 'newbie', 'b')).toBe(false);
  await act(async () => { tha(); await new Promise(r => setTimeout(r, 20)); });
  await waitFor(() => expect(ghiTienDo(gia)).toHaveLength(2));
  expect(ghiTienDo(gia).map(q => (q.payload as { completed: boolean }).completed)).toEqual([true, false]);
  expect(result.current.p.isDone('python', 'newbie', 'b')).toBe(false);
});

test('bam lien tiep (bat, tat, bat) ma lan ghi dau loi: cuoi cung giao dien va cache khop server', async () => {
  let lan = 0;
  const gia = giaSupabase({ bang: { lesson_progress: [] }, loiGhi: { lesson_progress: () => (lan++ === 0 ? 'mang chap chon' : undefined) } });
  const { result } = await moDanhDau(gia);
  act(() => result.current.d.toggle('python', 'newbie', 'b'));
  act(() => result.current.d.toggle('python', 'newbie', 'b'));
  act(() => result.current.d.toggle('python', 'newbie', 'b'));
  await waitFor(() => expect(ghiTienDo(gia)).toHaveLength(3));
  // Server: lan 1 loi, lan 2 ghi false, lan 3 ghi true
  await waitFor(() => expect(result.current.p.isDone('python', 'newbie', 'b')).toBe(true));
  await waitFor(() => expect(JSON.parse(localStorage.getItem('devmaster_hub_progress_cache')!)).toEqual({ 'python.newbie.b': true }));
});

test('chua tai duoc tien do tu server (loi) thi khong cho bam, khong ghi de cache cua may', async () => {
  const gia = giaSupabase({ bang: { lesson_progress: [] } });
  // Doc tien do loi (mat mang luc tai), ghi van duoc
  gia.client.from.mockImplementation(() => ({
    select: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'mat mang' } }) }),
    upsert: () => Promise.resolve({ data: null, error: null })
  }) as never);
  const kq = renderHook(() => ({ p: useProgress(), d: useToggleComplete() }), { wrapper: bocDayDu(gia) });
  await waitFor(() => expect(kq.result.current).not.toBeNull());
  act(() => gia.phat('SIGNED_IN', { user: { id: 'u1' } }));
  // Cache tren may (vd app cu vua ghi) co nhieu bai hon nhung gi giao dien dang thay
  localStorage.setItem('devmaster_hub_progress_cache', '{"python.newbie.a":true,"python.newbie.c":true}');
  await new Promise(r => setTimeout(r, 50));
  expect(kq.result.current.p.loading).toBe(true);
  act(() => kq.result.current.d.toggle('python', 'newbie', 'b'));
  await new Promise(r => setTimeout(r, 50));
  // Khong doi gi tren giao dien (khong biet trang thai that), khong dung den cache tren may
  expect(kq.result.current.p.isDone('python', 'newbie', 'b')).toBe(false);
  expect(JSON.parse(localStorage.getItem('devmaster_hub_progress_cache')!)).toEqual({ 'python.newbie.a': true, 'python.newbie.c': true });
});

test('dang xuat khi lan ghi chua xong: khong ghi tien do nguoi cu vao cache cua may', async () => {
  const gia = giaSupabase({ bang: { lesson_progress: [] } });
  const { result } = renderHook(() => ({ p: useProgress(), d: useToggleComplete(), a: useAuth() }), { wrapper: bocDayDu(gia) });
  await waitFor(() => expect(result.current).not.toBeNull());
  act(() => gia.phat('SIGNED_IN', { user: { id: 'u1' } }));
  await waitFor(() => expect(result.current.p.loading).toBe(false));
  let tha!: () => void;
  gia.treo.lesson_progress = new Promise<void>(r => { tha = r; });
  act(() => result.current.d.toggle('python', 'newbie', 'b'));
  await waitFor(() => expect(ghiTienDo(gia)).toHaveLength(1));
  await act(() => result.current.a.logout());
  await act(async () => { tha(); await new Promise(r => setTimeout(r, 30)); });
  expect(localStorage.getItem('devmaster_hub_progress_cache')).toBeNull();
});
