import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth, type SupabaseLike } from './auth';
import { giaSupabase } from '@/test/gia-supabase';

function moAuth(client: SupabaseLike) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}><AuthProvider client={client}>{children}</AuthProvider></QueryClientProvider>
  );
  return { qc, ...renderHook(() => useAuth(), { wrapper }) };
}

test('dang nhap sai bao loi tieng Viet; ten dang nhap duoc chuan hoa thanh email noi bo', async () => {
  const { client } = giaSupabase({ loiDangNhap: 'Invalid login credentials' });
  const { result } = moAuth(client);
  await expect(result.current.login('  An_01 ', 'sai')).rejects.toThrow('Sai tên đăng nhập hoặc mật khẩu');
  expect(client.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'an_01@devmaster.hub', password: 'sai' });
});

test('dang ky kiem tra dau vao truoc khi goi Supabase', async () => {
  const { client } = giaSupabase();
  const { result } = moAuth(client);
  await expect(result.current.register('ab', '123456')).rejects.toThrow('Tên đăng nhập phải có ít nhất 3 ký tự');
  await expect(result.current.register('an binh', '123456')).rejects.toThrow('chỉ chứa chữ thường, số và dấu _');
  await expect(result.current.register('anbinh', '123')).rejects.toThrow('Mật khẩu phải có ít nhất 6 ký tự');
  expect(client.auth.signUp).not.toHaveBeenCalled();
});

test('dang xuat xoa cache truy van va cache localStorage cua nguoi vua thoat', async () => {
  const { client, phat } = giaSupabase();
  const { result, qc } = moAuth(client);
  act(() => phat('SIGNED_IN', { user: { id: 'u1' } }));
  await waitFor(() => expect(result.current.user?.id).toBe('u1'));
  qc.setQueryData(['progress', 'u1'], ['python.newbie.a']);
  localStorage.setItem('devmaster_hub_progress_cache', '{"python.newbie.a":true}');
  localStorage.setItem('devmaster_hub_profile_cache', '{}');

  await act(() => result.current.logout());

  expect(result.current.user).toBeNull();
  expect(qc.getQueryData(['progress', 'u1'])).toBeUndefined();
  expect(localStorage.getItem('devmaster_hub_progress_cache')).toBeNull();
  expect(localStorage.getItem('devmaster_hub_profile_cache')).toBeNull();
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
