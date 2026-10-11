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

test('sidebar: link toi Project Lab, Du an cua toi, Career va roadmap; doi ngon ngu ghi khoa dung chung', async () => {
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
  // Trinh duyet nhung (vd. trong app) chan window.confirm: khong duoc dua vao no
  vi.stubGlobal('confirm', () => false);
  const { router } = veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  await u.click(await screen.findByRole('button', { name: 'Đăng xuất' }));
  const hop = await screen.findByRole('dialog', { name: 'Bạn muốn đăng xuất?' });
  await u.click(within(hop).getByRole('button', { name: 'Đăng xuất' }));
  await waitFor(() => expect(router.state.location.pathname).toBe('/auth'));
});

// Moi lan vao thang mot trang React (tu app cu qua location.assign, go URL) muc lich su dau deu co khoa "default"
const KHOA_CUON = 'react-router-scroll-positions';

test('vao thang trang React khong nhan vi tri cuon da luu cua mot trang khac', async () => {
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  // Lan truoc: dang o trang dau (khoa "default") cuon xuong 1234 roi di tiep, sang app cu
  sessionStorage.setItem(KHOA_CUON, JSON.stringify({ default: 1234 }));
  veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  await screen.findByRole('main');
  await waitFor(() => expect(window.scrollTo).toHaveBeenCalledWith(0, 0));
  await new Promise(r => setTimeout(r, 50));
  expect(window.scrollTo).not.toHaveBeenCalledWith(0, 1234);
});

test('tai lai dung trang do thi tra lai vi tri cuon cu', async () => {
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  sessionStorage.setItem(KHOA_CUON, JSON.stringify({ '/': 300 }));
  veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  await waitFor(() => expect(window.scrollTo).toHaveBeenCalledWith(0, 300));
});

test('mo thang URL la (vd /index.html) thi bao khong tim thay, khong tai lai trang', async () => {
  const taiLai = vi.spyOn(dieuHuong, 'taiLai').mockImplementation(() => {});
  veApp('/index.html', { gia: daDangNhap(), json: JSON_GIA });
  expect(await screen.findByRole('heading', { name: 'Không tìm thấy trang này' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/');
  expect(taiLai).not.toHaveBeenCalled();
});

test('dang o trong app ma di toi URL la thi bao khong tim thay ngay trong app, khong tai lai trang', async () => {
  const taiLai = vi.spyOn(dieuHuong, 'taiLai').mockImplementation(() => {});
  const { router } = veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  await screen.findByRole('main');
  await act(() => router.navigate('/trang-la?x=1'));
  expect(await screen.findByRole('heading', { name: 'Không tìm thấy trang này' })).toBeInTheDocument();
  expect(taiLai).not.toHaveBeenCalled();
});

test('chua dang nhap mo / thi giu tieu de trang chu (may tim kiem doc trang nay nhu nguoi chua dang nhap)', async () => {
  veApp('/', { gia: giaSupabase(), json: JSON_GIA });
  await screen.findByRole('button', { name: 'Đăng nhập' });
  await waitFor(() => expect(document.title).toBe('DevMaster Hub — Nền Tảng Học Lập Trình Toàn Diện Từ Newbie Đến Senior'));
});

const fetchTu = (json: Record<string, unknown>) => vi.fn(async (url: string) => (
  json[url] === undefined ? { ok: false, status: 503, json: async () => null } : { ok: true, status: 200, json: async () => json[url] }
));

test('dashboard: tai danh sach cong nghe loi thi bao loi kem nut Thu lai, khong hien trang rong', async () => {
  const u = userEvent.setup();
  veApp('/', { gia: daDangNhap(), json: { '/api/health': { aiEnabled: true } } });
  const main = await screen.findByRole('main');
  expect(await within(main).findByRole('alert')).toHaveTextContent('Không tải được dữ liệu');
  vi.stubGlobal('fetch', fetchTu(JSON_GIA));
  await u.click(within(main).getByRole('button', { name: 'Thử lại' }));
  expect(await within(main).findByRole('link', { name: /Python/ })).toBeInTheDocument();
});

test('tim kiem: tai chi muc loi thi bao loi, khong noi la khong co ket qua', async () => {
  const u = userEvent.setup();
  veApp('/', { gia: daDangNhap(), json: { '/curriculum/index.json': INDEX } });
  await u.type(await screen.findByRole('searchbox'), 'vong lap');
  const main = screen.getByRole('main');
  expect(await within(main).findByRole('alert')).toHaveTextContent('Không tải được dữ liệu');
  expect(within(main).queryByText(/Không tìm thấy kết quả/)).not.toBeInTheDocument();
  vi.stubGlobal('fetch', fetchTu(JSON_GIA));
  await u.click(within(main).getByRole('button', { name: 'Thử lại' }));
  expect(await within(main).findByRole('link', { name: /Vòng lặp/ })).toBeInTheDocument();
});

test('desktop: thu gon duoc sidebar, va van thu gon sau khi tai lai trang', async () => {
  const u = userEvent.setup();
  const lan1 = veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  expect(await screen.findByRole('complementary')).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: 'Thu gọn thanh bên' }));
  expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Mở thanh bên' })).toBeInTheDocument();
  lan1.unmount();

  // Sang trang app cu roi quay lai la tai trang moi: lua chon phai con
  veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  await u.click(await screen.findByRole('button', { name: 'Mở thanh bên' }));
  expect(screen.getByRole('complementary')).toBeInTheDocument();
});

const ghiNgayHoc = (gia: ReturnType<typeof giaSupabase>) => gia.truyVan.filter(q => q.bang === 'learning_sessions' && q.op === 'insert');

test('dashboard: lich hoc tich cac ngay da hoc va dem chuoi ngay lien tiep', async () => {
  const homQua = new Date(Date.now() - 86_400_000).toISOString();
  veApp('/', { gia: daDangNhap({ learning_sessions: [{ started_at: new Date().toISOString() }, { started_at: homQua }] }), json: JSON_GIA });
  const lich = await screen.findByRole('region', { name: 'Lịch học' });
  expect(await within(lich).findByText('2 ngày liên tiếp')).toBeInTheDocument();
  expect(within(lich).getByText('Dài nhất: 2 ngày')).toBeInTheDocument();
  // Ngay 1 dau thang thi hom qua thuoc thang truoc, khong nam tren lich thang nay
  const trongThang = new Date().getDate() > 1 ? 2 : 1;
  expect(within(lich).getAllByRole('img', { name: /đã học/ })).toHaveLength(trongThang);
});

test('mo mot mon hoc thi tich ngay hom nay, mo tiep mon khac cung ngay khong ghi lai', async () => {
  const gia = daDangNhap();
  const { router } = veApp('/roadmap/python', { gia, json: JSON_GIA });
  await waitFor(() => expect(ghiNgayHoc(gia)).toHaveLength(1));
  expect(ghiNgayHoc(gia)[0].payload).toMatchObject({ user_id: 'u1', tech_id: 'python' });
  await act(() => router.navigate('/roadmap/react'));
  await screen.findByRole('heading', { name: /React/ });
  expect(ghiNgayHoc(gia)).toHaveLength(1);
});

test('hoi AI cung tich ngay hoc hom nay', async () => {
  const gia = daDangNhap();
  veApp('/', { gia, json: JSON_GIA });
  const lich = await screen.findByRole('region', { name: 'Lịch học' });
  act(() => { window.dispatchEvent(new Event('dmh:hoi-ai')); });
  await waitFor(() => expect(ghiNgayHoc(gia)).toHaveLength(1));
  expect(ghiNgayHoc(gia)[0].payload).toMatchObject({ user_id: 'u1', tech_id: 'ai' });
  expect(await within(lich).findByText('1 ngày liên tiếp')).toBeInTheDocument();
});

test('o mat khau: nut hien/an doi qua lai kieu nhap', async () => {
  const u = userEvent.setup();
  veApp('/auth', { gia: giaSupabase(), json: JSON_GIA });
  const o = await screen.findByLabelText('Mật khẩu');
  expect(o).toHaveAttribute('type', 'password');
  await u.click(screen.getByRole('button', { name: 'Hiện mật khẩu' }));
  expect(o).toHaveAttribute('type', 'text');
  await u.click(screen.getByRole('button', { name: 'Ẩn mật khẩu' }));
  expect(o).toHaveAttribute('type', 'password');
});

test('dang ky: hien do manh mat khau khi go', async () => {
  const u = userEvent.setup();
  veApp('/auth', { gia: giaSupabase(), json: JSON_GIA });
  await u.click(await screen.findByRole('tab', { name: 'Đăng ký' }));
  const o = screen.getByLabelText('Mật khẩu');
  await u.type(o, '123456');
  expect(screen.getByText('Độ mạnh: Yếu')).toBeInTheDocument();
  await u.clear(o);
  await u.type(o, 'MatKhau@2026!');
  expect(screen.getByText('Độ mạnh: Mạnh')).toBeInTheDocument();
});
