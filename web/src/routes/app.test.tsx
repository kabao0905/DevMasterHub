import { act, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { veApp } from '@/test/ve-app';
import { giaSupabase } from '@/test/gia-supabase';
import type { CongNgheTomTat, MucTimKiem } from '@/lib/curriculum';
import { dieuHuong } from '@/lib/dieu-huong';

const INDEX: CongNgheTomTat[] = [
  {
    id: 'python', name: 'Python', icon: '🐍', color: '#3776AB', gradient: '', category: 'language', description: 'Ngôn ngữ đa năng',
    levels: [
      { id: 'newbie', name: 'Newbie', lessons: [{ id: 'a', title: 'Biến' }, { id: 'b', title: 'Vòng lặp' }] },
      { id: 'junior', name: 'Junior', lessons: [{ id: 'c', title: 'Hàm' }] }
    ]
  },
  {
    id: 'react', name: 'React', icon: '⚛️', color: '#61dafb', gradient: '', category: 'framework', description: 'Thư viện UI',
    levels: [{ id: 'newbie', name: 'Newbie', lessons: [{ id: 'x', title: 'JSX' }] }]
  }
];
const SEARCH: MucTimKiem[] = [
  { t: 'python', l: 'newbie', s: 'b', title: 'Vòng lặp', text: 'for và while' },
  { t: 'react', l: 'newbie', s: 'x', title: 'JSX', text: 'cú pháp giống HTML' }
];
const JSON_GIA = { '/curriculum/index.json': INDEX, '/curriculum/search.json': SEARCH, '/api/health': { aiEnabled: true } };

const daDangNhap = (them: Record<string, unknown[]> = {}) => giaSupabase({
  nguoiDung: { id: 'u1' },
  bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }], ...them }
});

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

test('chua dang nhap vao / thi chuyen ve trang dang nhap', async () => {
  const { router } = veApp('/', { gia: giaSupabase(), json: JSON_GIA });
  expect(await screen.findByRole('button', { name: 'Đăng nhập' })).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/auth');
});

test('dang nhap sai: thay loi, nut tro lai trang thai Dang nhap', async () => {
  const u = userEvent.setup();
  veApp('/auth', { gia: giaSupabase({ loiDangNhap: 'Invalid login credentials' }), json: JSON_GIA });
  await u.type(await screen.findByLabelText('Tên đăng nhập'), 'an');
  await u.type(screen.getByLabelText('Mật khẩu'), 'sai-mat-khau');
  await u.click(screen.getByRole('button', { name: 'Đăng nhập' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Sai tên đăng nhập hoặc mật khẩu');
  expect(screen.getByRole('button', { name: 'Đăng nhập' })).toBeEnabled();
});

test('dang nhap dung thi vao Dashboard ngay', async () => {
  const u = userEvent.setup();
  const gia = giaSupabase({ bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }] } });
  const { router } = veApp('/auth', { gia, json: JSON_GIA });
  await u.type(await screen.findByLabelText('Tên đăng nhập'), 'an');
  await u.type(screen.getByLabelText('Mật khẩu'), 'dung-mat-khau');
  await u.click(screen.getByRole('button', { name: 'Đăng nhập' }));
  expect(await screen.findByRole('heading', { name: /Dashboard/ })).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/');
});

test('dang ky: mat khau nhap lai khong khop thi bao loi va khong goi Supabase', async () => {
  const u = userEvent.setup();
  const gia = giaSupabase();
  veApp('/auth', { gia, json: JSON_GIA });
  await u.click(await screen.findByRole('tab', { name: 'Đăng ký' }));
  await u.type(screen.getByLabelText('Tên đăng nhập'), 'binh');
  await u.type(screen.getByLabelText('Mật khẩu'), '123456');
  await u.type(screen.getByLabelText('Nhập lại mật khẩu'), '654321');
  await u.click(screen.getByRole('button', { name: 'Đăng ký' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Mật khẩu không khớp');
  expect(gia.client.auth.signUp).not.toHaveBeenCalled();
});

test('dashboard: the cong nghe theo nhom, phan tram tien do, link sang roadmap', async () => {
  veApp('/', { gia: daDangNhap({ lesson_progress: [{ tech_id: 'python', level_id: 'newbie', lesson_id: 'a', completed: true }] }), json: JSON_GIA });
  const main = await screen.findByRole('main');
  const thePy = await within(main).findByRole('link', { name: /Python/ });
  expect(thePy).toHaveAttribute('href', '/roadmap/python');
  await waitFor(() => expect(within(thePy).getByText('33%')).toBeInTheDocument());
  expect(within(main).getByRole('heading', { name: '💻 Ngôn ngữ lập trình' })).toBeInTheDocument();
  expect(within(main).getByRole('heading', { name: '🎨 Frontend Development' })).toBeInTheDocument();
});

test('dashboard: o Hoc tiep tro toi bai dau tien chua xong cua cong nghe dang hoc', async () => {
  veApp('/', { gia: daDangNhap({ lesson_progress: [{ tech_id: 'python', level_id: 'newbie', lesson_id: 'a', completed: true }] }), json: JSON_GIA });
  const nut = await screen.findByRole('link', { name: /Vào bài học/ });
  expect(nut).toHaveAttribute('href', '/lesson/python/newbie/b');
  expect(screen.getByText('Vòng lặp')).toBeInTheDocument();
});

test('tim kiem: go khong dau ra bai co dau; khong co ket qua thi noi ro tu khoa', async () => {
  const u = userEvent.setup();
  veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  const o = await screen.findByRole('searchbox');
  await u.type(o, 'vong lap');
  const kq = await screen.findByRole('link', { name: /Vòng lặp/ });
  expect(kq).toHaveAttribute('href', '/lesson/python/newbie/b');
  expect(screen.getByText('Tìm thấy 1 kết quả')).toBeInTheDocument();
  await u.clear(o);
  await u.type(o, 'xyz');
  expect(await screen.findByText('Không tìm thấy kết quả phù hợp cho "xyz"')).toBeInTheDocument();
});

test('sidebar: muc chua chuyen la link thuong sang app cu; doi ngon ngu ghi khoa dung chung', async () => {
  const u = userEvent.setup();
  veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  const nav = await screen.findByRole('navigation');
  expect(within(nav).getByRole('link', { name: /Project Lab/ })).toHaveAttribute('href', '/project');
  expect(within(nav).getByRole('link', { name: /Dự án của tôi/ })).toHaveAttribute('href', '/my-projects');
  expect(within(nav).getByRole('link', { name: /Tư vấn Việc làm/ })).toHaveAttribute('href', '/career');
  expect(await within(nav).findByRole('link', { name: /React/ })).toHaveAttribute('href', '/roadmap/react');
  await u.selectOptions(screen.getByRole('combobox', { name: 'Ngôn ngữ' }), 'en');
  expect(localStorage.getItem('devmaster_hub_lang')).toBe('en');
});

test('dang xuat thi ve trang dang nhap', async () => {
  const u = userEvent.setup();
  vi.stubGlobal('confirm', () => true);
  const { router } = veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  await u.click(await screen.findByRole('button', { name: 'Đăng xuất' }));
  await waitFor(() => expect(router.state.location.pathname).toBe('/auth'));
});

test('URL la ma server da giao cho React (vd /index.html) thi bao khong tim thay, khong tai lai trang', async () => {
  const thay = vi.spyOn(dieuHuong, 'thay').mockImplementation(() => {});
  veApp('/index.html', { gia: daDangNhap(), json: JSON_GIA });
  expect(await screen.findByRole('heading', { name: 'Không tìm thấy trang này' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/');
  expect(thay).not.toHaveBeenCalled();
});

test('dang o trong app ma di toi URL cua app cu thi tai trang that de server tra app cu', async () => {
  const thay = vi.spyOn(dieuHuong, 'thay').mockImplementation(() => {});
  const { router } = veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  await screen.findByRole('main');
  await act(() => router.navigate('/career?x=1'));
  await waitFor(() => expect(thay).toHaveBeenCalledWith('/career?x=1'));
});
