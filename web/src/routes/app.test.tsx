import { act, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { veApp } from '@/test/ve-app';
import { giaSupabase } from '@/test/gia-supabase';
import type { CongNgheTomTat, MucTimKiem } from '@/lib/curriculum';
import { dieuHuong } from '@/lib/dieu-huong';
import { apCheDo, KHOA_CHE_DO } from '@/lib/che-do';

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
  const thePy = await within(main).findByRole('link', { name: /^Python/ });
  expect(thePy).toHaveAttribute('href', '/roadmap/python');
  await waitFor(() => expect(within(thePy).getByText('33%')).toBeInTheDocument());
  expect(within(main).getByRole('heading', { name: 'Ngôn ngữ lập trình' })).toBeInTheDocument();
  expect(within(main).getByRole('heading', { name: 'Frontend Development' })).toBeInTheDocument();
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
  expect(await screen.findByText('Không tìm thấy kết quả phù hợp cho “xyz”')).toBeInTheDocument();
});

test('thanh tren: link toi Project Lab, Du an cua toi, Career; menu Lo trinh co roadmap; doi ngon ngu trong menu Tai khoan', async () => {
  const u = userEvent.setup();
  veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  const nav = await screen.findByRole('navigation', { name: 'DevMaster Hub' });
  expect(within(nav).getByRole('link', { name: /Project Lab/ })).toHaveAttribute('href', '/project');
  expect(within(nav).getByRole('link', { name: /Dự án của tôi/ })).toHaveAttribute('href', '/my-projects');
  expect(within(nav).getByRole('link', { name: /Tư vấn Việc làm/ })).toHaveAttribute('href', '/career');
  await u.click(within(nav).getByRole('button', { name: /Lộ trình/ }));
  expect(await screen.findByRole('menuitem', { name: /React/ })).toHaveAttribute('href', '/roadmap/react');
  await u.keyboard('{Escape}');
  await u.click(screen.getByRole('button', { name: /^Tài khoản/ }));
  await u.click(await screen.findByRole('menuitemradio', { name: /English/ }));
  expect(localStorage.getItem('devmaster_hub_lang')).toBe('en');
});

test('logo DevMaster Hub la loi vao Dashboard: thanh tren khong con muc Dashboard rieng; o Dashboard thi logo la trang hien tai', async () => {
  const { router } = veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  const nav = await screen.findByRole('navigation', { name: 'DevMaster Hub' });
  expect(within(nav).queryByRole('link', { name: /Dashboard/ })).not.toBeInTheDocument();
  const logo = screen.getByRole('link', { name: /DevMaster Hub/ });
  expect(logo).toHaveAttribute('href', '/');
  expect(logo).toHaveAccessibleName(/Dashboard/);
  expect(logo).toHaveAttribute('aria-current', 'page');
  await act(() => router.navigate('/career'));
  await waitFor(() => expect(screen.getByRole('link', { name: /DevMaster Hub/ })).not.toHaveAttribute('aria-current'));
});

test('dang xuat thi ve trang dang nhap', async () => {
  const u = userEvent.setup();
  vi.stubGlobal('confirm', () => false);
  const { router } = veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  await u.click(await screen.findByRole('button', { name: /^Tài khoản/ }));
  await u.click(await screen.findByRole('menuitem', { name: 'Đăng xuất' }));
  const hop = await screen.findByRole('dialog', { name: 'Bạn muốn đăng xuất?' });
  await u.click(within(hop).getByRole('button', { name: 'Đăng xuất' }));
  await waitFor(() => expect(router.state.location.pathname).toBe('/auth'));
});

const KHOA_CUON = 'react-router-scroll-positions';

test('vao thang trang React khong nhan vi tri cuon da luu cua mot trang khac', async () => {
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
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
  expect(await within(main).findByRole('link', { name: /^Python/ })).toBeInTheDocument();
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

test('cong tac sang / toi tren thanh tren: gat thi ca trang doi mau va nho lua chon khi tai lai; khong con sidebar co dien', async () => {
  const u = userEvent.setup();
  localStorage.setItem(KHOA_CHE_DO, 'sang');
  try {
    const lan1 = veApp('/', { gia: daDangNhap(), json: JSON_GIA });
    const congTac = await screen.findByRole('switch', { name: 'Chế độ tối' });
    expect(congTac).toHaveAttribute('aria-checked', 'false');
    expect(screen.queryAllByRole('complementary').some(a => within(a).queryByRole('navigation'))).toBe(false);
    await u.click(congTac);
    expect(congTac).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem(KHOA_CHE_DO)).toBe('toi');
    lan1.unmount();

    veApp('/', { gia: daDangNhap(), json: JSON_GIA });
    const lai = await screen.findByRole('switch', { name: 'Chế độ tối' });
    expect(lai).toHaveAttribute('aria-checked', 'true');
    await u.click(lai);
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem(KHOA_CHE_DO)).toBe('sang');
  } finally {
    apCheDo('sang');
  }
});

const ghiThoiGian = (gia: ReturnType<typeof giaSupabase>) => gia.truyVan.filter(q => q.bang === 'learning_sessions' && (q.op === 'insert' || q.op === 'update'));
const truocNgay = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

test('dashboard: lich chi tich ngay hoc du muc tieu, ngay hoc chua du to nhat, dem chuoi', async () => {
  veApp('/', { gia: daDangNhap({ learning_sessions: [
    { started_at: truocNgay(0), duration_seconds: 600 },
    { started_at: truocNgay(0), duration_seconds: 300 },
    { started_at: truocNgay(1), duration_seconds: 1200 },
    { started_at: truocNgay(2), duration_seconds: 300 }
  ] }), json: JSON_GIA });
  const lich = await screen.findByRole('region', { name: 'Lịch học' });
  expect(await within(lich).findByText('2 ngày liên tiếp')).toBeInTheDocument();
  const cotBen = lich;
  const tienDo = within(cotBen).getByRole('progressbar', { name: 'Hôm nay: 15/15 phút' });
  expect(tienDo).toHaveAttribute('aria-valuenow', '15');
  expect(tienDo).toHaveAttribute('aria-valuemax', '15');
  expect(within(cotBen).getByText(/Đạt mục tiêu/)).toBeInTheDocument();
  expect(within(cotBen).getByRole('button', { name: /Mục tiêu: 15 phút\/ngày/ })).toBeInTheDocument();
  const ngayThang = new Date().getDate();
  expect(within(lich).getAllByRole('img', { name: /đã học/ })).toHaveLength(ngayThang > 1 ? 2 : 1);
  if (ngayThang > 2) expect(within(lich).getByRole('img', { name: /học 5 phút/ })).toBeInTheDocument();
});

test('tao tai khoan xong: hien bang chao mung, chon so phut moi ngay roi vao hoc', async () => {
  const u = userEvent.setup();
  const gia = giaSupabase();
  veApp('/auth', { gia, json: JSON_GIA });
  await u.click(await screen.findByRole('tab', { name: 'Đăng ký' }));
  await u.type(screen.getByLabelText('Tên đăng nhập'), 'binh');
  await u.type(screen.getByLabelText('Mật khẩu'), 'MatKhau@2026');
  await u.type(screen.getByLabelText('Nhập lại mật khẩu'), 'MatKhau@2026');
  await u.click(screen.getByRole('button', { name: 'Đăng ký' }));
  const hop = await screen.findByRole('dialog', { name: /Chào mừng/ });
  await u.click(within(hop).getByRole('radio', { name: '30 phút' }));
  await u.click(within(hop).getByRole('button', { name: 'Bắt đầu học' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(gia.client.auth.updateUser).toHaveBeenCalledWith({ data: { daily_goal_minutes: 30 } });
  expect(await screen.findByRole('button', { name: /Mục tiêu: 30 phút\/ngày/ })).toBeInTheDocument();
});

test('da chon muc tieu thi khong hien lai bang chao mung; bam muc tieu tren lich de doi', async () => {
  const u = userEvent.setup();
  const gia = daDangNhap();
  veApp('/', { gia, json: JSON_GIA });
  const nut = await screen.findByRole('button', { name: /Mục tiêu: 15 phút\/ngày/ });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  await u.click(nut);
  const hop = await screen.findByRole('dialog', { name: 'Đổi mục tiêu học mỗi ngày' });
  await u.click(within(hop).getByRole('radio', { name: '45 phút' }));
  await u.click(within(hop).getByRole('button', { name: 'Lưu mục tiêu' }));
  expect(gia.client.auth.updateUser).toHaveBeenCalledWith({ data: { daily_goal_minutes: 45 } });
  expect(await screen.findByRole('button', { name: /Mục tiêu: 45 phút\/ngày/ })).toBeInTheDocument();
});

test('mo mot mon hoc thi dong ho chay va ghi thoi gian hoc cho mon do (5 phut/lan ghi)', async () => {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
  try {
    const gia = daDangNhap();
    veApp('/roadmap/python', { gia, json: JSON_GIA });
    await screen.findByRole('heading', { name: /Python/ });
    act(() => { vi.advanceTimersByTime(4 * 60_000); });
    expect(ghiThoiGian(gia)).toHaveLength(0);
    act(() => { vi.advanceTimersByTime(75_000); });
    vi.useRealTimers();
    await waitFor(() => expect(ghiThoiGian(gia)).toHaveLength(1));
    expect(ghiThoiGian(gia)[0].payload).toMatchObject({ user_id: 'u1', tech_id: 'python', duration_seconds: 300 });
  } finally {
    vi.useRealTimers();
    delete (document as { visibilityState?: unknown }).visibilityState;
  }
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
