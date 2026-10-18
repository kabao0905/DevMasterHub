import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth, type SupabaseLike } from './auth';
import { giaSupabase } from '@/test/gia-supabase';
import { chupViecDangLam, KHOA_VIEC_REACT } from './viec-dang-lam';

function moAuth(client: SupabaseLike) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}><AuthProvider client={client}>{children}</AuthProvider></QueryClientProvider>
  );
  return { qc, ...renderHook(() => useAuth(), { wrapper }) };
}

test('dang nhap sai nem ma loi authWrongCredentials (trang dich theo ngon ngu); ten dang nhap duoc chuan hoa thanh email noi bo', async () => {
  const { client } = giaSupabase({ loiDangNhap: 'Invalid login credentials' });
  const { result } = moAuth(client);
  await expect(result.current.login('  An_01 ', 'sai')).rejects.toThrow('authWrongCredentials');
  expect(client.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'an_01@devmaster.hub', password: 'sai' });
});

test('dang ky kiem tra dau vao truoc khi goi Supabase', async () => {
  const { client } = giaSupabase();
  const { result } = moAuth(client);
  await expect(result.current.register('ab', '123456')).rejects.toThrow('authUsernameShort');
  await expect(result.current.register('an binh', '123456')).rejects.toThrow('authUsernameChars');
  await expect(result.current.register('anbinh', '123')).rejects.toThrow('authPasswordShort');
  expect(client.auth.signUp).not.toHaveBeenCalled();
});

test('dang xuat xoa cache truy van, cache localStorage va viec dang lam do app cu cat tam', async () => {
  const { client, phat } = giaSupabase();
  const { result, qc } = moAuth(client);
  act(() => phat('SIGNED_IN', { user: { id: 'u1' } }));
  await waitFor(() => expect(result.current.user?.id).toBe('u1'));
  qc.setQueryData(['progress', 'u1'], ['python.newbie.a']);
  localStorage.setItem('devmaster_hub_progress_cache', '{"python.newbie.a":true}');
  localStorage.setItem('devmaster_hub_profile_cache', '{}');
  sessionStorage.setItem('devmaster_hub_legacy_session', '{"uid":"u1","viec":{}}');
  sessionStorage.setItem(KHOA_VIEC_REACT, '{"uid":"u1","ds":[]}');

  await act(() => result.current.logout());

  expect(result.current.user).toBeNull();
  expect(qc.getQueryData(['progress', 'u1'])).toBeUndefined();
  expect(localStorage.getItem('devmaster_hub_progress_cache')).toBeNull();
  expect(localStorage.getItem('devmaster_hub_profile_cache')).toBeNull();
  expect(sessionStorage.getItem('devmaster_hub_legacy_session')).toBeNull();
  expect(sessionStorage.getItem(KHOA_VIEC_REACT)).toBeNull();
});

test('roi trang (pagehide) thi cat viec dang lam; dang nhap lai cung nguoi o trang moi thi nap lai', async () => {
  const { client, phat } = giaSupabase();
  const a = moAuth(client);
  act(() => phat('SIGNED_IN', { user: { id: 'u1' } }));
  await waitFor(() => expect(a.result.current.user?.id).toBe('u1'));
  a.qc.setQueryData(['exercise', 'u1', 'python.newbie.a'], { answers: { 0: 'class Stack' } });
  act(() => { window.dispatchEvent(new PageTransitionEvent('pagehide')); });
  a.unmount();

  const b = giaSupabase();
  const moiTrang = moAuth(b.client);
  act(() => b.phat('SIGNED_IN', { user: { id: 'u1' } }));
  await waitFor(() => expect(moiTrang.result.current.user?.id).toBe('u1'));
  expect(moiTrang.qc.getQueryData(['exercise', 'u1', 'python.newbie.a'])).toMatchObject({ answers: { 0: 'class Stack' } });
});

test('Back tra lai trang React tu bfcache: nap ban chup moi hon do trang React sau ghi', async () => {
  const { client, phat } = giaSupabase();
  const { result, qc } = moAuth(client);
  act(() => phat('SIGNED_IN', { user: { id: 'u1' } }));
  await waitFor(() => expect(result.current.user?.id).toBe('u1'));
  qc.setQueryData(['exercise', 'u1', 'k'], { answers: { 0: 'cu' } });
  const trangSau = new QueryClient();
  trangSau.setQueryData(['exercise', 'u1', 'k'], { answers: { 0: 'cu + moi' } });
  chupViecDangLam(trangSau, 'u1');

  act(() => { window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })); });
  expect(qc.getQueryData(['exercise', 'u1', 'k'])).toMatchObject({ answers: { 0: 'cu + moi' } });
});

test('dang xuat tu tab khac (su kien SIGNED_OUT) cung xoa cache', async () => {
  const { client, phat } = giaSupabase();
  const { result, qc } = moAuth(client);
  act(() => phat('SIGNED_IN', { user: { id: 'u1' } }));
  await waitFor(() => expect(result.current.user?.id).toBe('u1'));
  qc.setQueryData(['progress', 'u1'], ['x']);
  act(() => phat('SIGNED_OUT', null));
  await waitFor(() => expect(result.current.user).toBeNull());
  expect(qc.getQueryData(['progress', 'u1'])).toBeUndefined();
});

test('nap ho so cua nguoi dang dang nhap', async () => {
  const { client, phat } = giaSupabase({ bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }] } });
  const { result } = moAuth(client);
  act(() => phat('SIGNED_IN', { user: { id: 'u1' } }));
  await waitFor(() => expect(result.current.profile?.username).toBe('an'));
});

test('mo trang ma phien cu da het han (INITIAL_SESSION rong, khong co SIGNED_OUT) cung xoa cache cua nguoi truoc', async () => {
  localStorage.setItem('devmaster_hub_progress_cache', '{"python.newbie.a":true}');
  localStorage.setItem('devmaster_hub_profile_cache', '{"id":"u1"}');
  const { client, phat } = giaSupabase();
  client.auth.getSession.mockImplementation(() => new Promise(() => {}));
  moAuth(client);
  act(() => phat('INITIAL_SESSION', null));
  await waitFor(() => expect(localStorage.getItem('devmaster_hub_progress_cache')).toBeNull());
  expect(localStorage.getItem('devmaster_hub_profile_cache')).toBeNull();
});

test('getSession tra ve rong luc mo trang cung xoa cache cua nguoi truoc', async () => {
  localStorage.setItem('devmaster_hub_progress_cache', '{"python.newbie.a":true}');
  const { client } = giaSupabase();
  const { result } = moAuth(client);
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(localStorage.getItem('devmaster_hub_progress_cache')).toBeNull();
});

test('dang xuat chi xoa du lieu cua nguoi dung, giu ban dich va giao trinh (khong tai lai)', async () => {
  const { client, phat } = giaSupabase();
  const { result, qc } = moAuth(client);
  act(() => phat('SIGNED_IN', { user: { id: 'u1' } }));
  await waitFor(() => expect(result.current.user?.id).toBe('u1'));
  qc.setQueryData(['i18n', 'vi'], { ui: {} });
  qc.setQueryData(['curriculum', 'index'], []);
  qc.setQueryData(['profile', 'u1'], { id: 'u1' });
  await act(() => result.current.logout());
  expect(qc.getQueryData(['profile', 'u1'])).toBeUndefined();
  expect(qc.getQueryData(['i18n', 'vi'])).toBeDefined();
  expect(qc.getQueryData(['curriculum', 'index'])).toBeDefined();
});

test('dang xuat xoa tien do phong lab tren may (truoc day dung chung moi tai khoan tren trinh duyet)', async () => {
  const { client, phat } = giaSupabase();
  const { result } = moAuth(client);
  act(() => phat('SIGNED_IN', { user: { id: 'u1' } }));
  await waitFor(() => expect(result.current.user?.id).toBe('u1'));
  localStorage.setItem('dmh_lab_progress', '{"nginx.newbie.intro":["nginx-intro-1"]}');
  await act(() => result.current.logout());
  expect(localStorage.getItem('dmh_lab_progress')).toBeNull();
});
