import { act, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { veApp } from '@/test/ve-app';
import { giaSupabase } from '@/test/gia-supabase';
import type { CongNgheTomTat } from '@/lib/curriculum';

const INDEX: CongNgheTomTat[] = [
  {
    id: 'python', name: 'Python', icon: '🐍', color: '#3776AB', gradient: '', category: 'language', description: 'Ngôn ngữ đa năng',
    levels: [
      { id: 'newbie', name: 'Newbie', desc: 'Nền tảng', lessons: [{ id: 'a', title: 'Biến' }, { id: 'b', title: 'Vòng lặp' }] },
      { id: 'junior', name: 'Junior', desc: 'Hàm và module', lessons: [{ id: 'c', title: 'Hàm' }] }
    ]
  },
  {
    id: 'cybersecurity', name: 'An ninh mạng', icon: '🛡️', color: '#f00', gradient: '', category: 'concept', description: 'Bảo mật',
    levels: [{ id: 'newbie', name: 'Newbie', lessons: [{ id: 'x', title: 'Linux' }] }]
  }
];
const JSON_GIA = { '/curriculum/index.json': INDEX, '/api/health': { aiEnabled: true } };

const daDangNhap = (them: Record<string, unknown[]> = {}) => giaSupabase({
  nguoiDung: { id: 'u1' },
  bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }], ...them }
});
const XONG = (lesson: string) => ({ tech_id: 'python', level_id: 'newbie', lesson_id: lesson, completed: true });

afterEach(() => vi.unstubAllGlobals());

test('roadmap: ten, mo ta, tien do tong, tung cap co x/y; bai la link sang trang bai hoc', async () => {
  veApp('/roadmap/python', { gia: daDangNhap({ lesson_progress: [XONG('a')] }), json: JSON_GIA });
  const main = await screen.findByRole('main');
  expect(await within(main).findByRole('heading', { level: 1, name: /Python/ })).toBeInTheDocument();
  expect(within(main).getByText('Ngôn ngữ đa năng')).toBeInTheDocument();
  await waitFor(() => expect(within(main).getByText('1/3 bài học · 33%')).toBeInTheDocument());
  const newbie = within(main).getByRole('region', { name: /Newbie/ });
  expect(within(newbie).getByText('1/2')).toBeInTheDocument();
  expect(within(newbie).getByText('Nền tảng')).toBeInTheDocument();
  expect(within(newbie).getByRole('link', { name: /Biến.*Hoàn thành/ })).toHaveAttribute('href', '/lesson/python/newbie/a');
  expect(within(newbie).getByRole('link', { name: 'Vòng lặp' })).toHaveAttribute('href', '/lesson/python/newbie/b');
  expect(document.title).toBe('Học Python Từ Cơ Bản Đến Nâng Cao — 3 Bài | DevMaster Hub');
});

test('roadmap an ninh mang co loi vao trang Thu thach', async () => {
  veApp('/roadmap/cybersecurity', { gia: daDangNhap(), json: JSON_GIA });
  const link = await screen.findByRole('link', { name: /Thử thách/ });
  expect(link).toHaveAttribute('href', '/challenge');
});

test('roadmap/:tech/:level danh dau cap trong URL', async () => {
  veApp('/roadmap/python/junior', { gia: daDangNhap(), json: JSON_GIA });
  const junior = await screen.findByRole('region', { name: /Junior/ });
  expect(junior).toHaveAttribute('aria-current', 'true');
  expect(screen.getByRole('region', { name: /Newbie/ })).not.toHaveAttribute('aria-current');
});

test('id la (constructor, khong co) thi bao khong tim thay kem link Dashboard, khong vang loi', async () => {
  for (const p of ['/roadmap/constructor', '/roadmap/khong-co']) {
    const { unmount } = veApp(p, { gia: daDangNhap(), json: JSON_GIA });
    const main = await screen.findByRole('main');
    expect(await within(main).findByRole('heading', { name: 'Không tìm thấy trang này' })).toBeInTheDocument();
    expect(within(main).getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/');
    unmount();
  }
});

test('/roadmap tran thi ve Dashboard', async () => {
  const { router } = veApp('/roadmap', { gia: daDangNhap(), json: JSON_GIA });
  await waitFor(() => expect(router.state.location.pathname).toBe('/'));
});

test('the cong nghe o Dashboard va link sidebar di bang router, khong tai lai trang', async () => {
  const u = userEvent.setup();
  const { router } = veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  const main = await screen.findByRole('main');
  await u.click(await within(main).findByRole('link', { name: /Python/ }));
  await waitFor(() => expect(router.state.location.pathname).toBe('/roadmap/python'));
  await u.click(within(await screen.findByRole('navigation')).getByRole('link', { name: /An ninh mạng/ }));
  await waitFor(() => expect(router.state.location.pathname).toBe('/roadmap/cybersecurity'));
});

test('Escape tren roadmap ve Dashboard (giong app cu), tru khi dang go chu', async () => {
  const u = userEvent.setup();
  const { router } = veApp('/roadmap/python', { gia: daDangNhap(), json: JSON_GIA });
  await screen.findByRole('heading', { level: 1, name: /Python/ });
  await u.keyboard('{Escape}');
  await waitFor(() => expect(router.state.location.pathname).toBe('/'));
});

test('dien thoai: chon roadmap trong menu thi menu dong lai', async () => {
  const u = userEvent.setup();
  veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  await u.click(await screen.findByRole('button', { name: 'Mở menu' }));
  const menu = await screen.findByRole('dialog');
  await u.click(await within(menu).findByRole('link', { name: /An ninh mạng/ }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
});

test('di sang trang khac bang router thi cuon len dau; doi tab bai hoc thi khong', async () => {
  const u = userEvent.setup();
  const cuon = vi.fn();
  window.scrollTo = cuon as unknown as typeof window.scrollTo;
  veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  const main = await screen.findByRole('main');
  cuon.mockClear();
  await u.click(await within(main).findByRole('link', { name: /Python/ }));
  await screen.findByRole('heading', { level: 1, name: /Python/ });
  await waitFor(() => expect(cuon).toHaveBeenCalledWith(0, 0));
});

test('chua dang nhap mo link roadmap duoc chia se: dang nhap xong quay lai dung trang do', async () => {
  const u = userEvent.setup();
  const gia = giaSupabase({ bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }] } });
  const { router } = veApp('/roadmap/python/junior', { gia, json: JSON_GIA });
  await u.type(await screen.findByLabelText('Tên đăng nhập'), 'an');
  await u.type(screen.getByLabelText('Mật khẩu'), 'dung-mat-khau');
  await u.click(screen.getByRole('button', { name: 'Đăng nhập' }));
  await waitFor(() => expect(router.state.location.pathname).toBe('/roadmap/python/junior'));
});

test('dia chi quay lai la link ngoai (//evil.com) thi ve Dashboard', async () => {
  const u = userEvent.setup();
  const gia = giaSupabase({ bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }] } });
  const { router } = veApp('/auth', { gia, json: JSON_GIA });
  await act(() => router.navigate('/auth', { state: { from: '//evil.com/x' } }));
  await u.type(await screen.findByLabelText('Tên đăng nhập'), 'an');
  await u.type(screen.getByLabelText('Mật khẩu'), 'dung-mat-khau');
  await u.click(screen.getByRole('button', { name: 'Đăng nhập' }));
  await waitFor(() => expect(router.state.location.pathname).toBe('/'));
});
