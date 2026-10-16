// Chon kieu giao dien: Co dien (sidebar trai, toi) <-> Pastel (thanh dieu huong den tren cung, sang).
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { veApp } from '@/test/ve-app';
import { giaSupabase } from '@/test/gia-supabase';
import { apGiaoDien, KHOA_GIAO_DIEN } from '@/lib/giao-dien';
import type { CongNgheTomTat } from '@/lib/curriculum';

const INDEX: CongNgheTomTat[] = [
  { id: 'python', name: 'Python', icon: '🐍', color: '#3776AB', gradient: '', category: 'language', description: 'x',
    levels: [{ id: 'newbie', name: 'Newbie', lessons: [{ id: 'a', title: 'Biến' }] }] },
  { id: 'react', name: 'React', icon: '⚛️', color: '#61dafb', gradient: '', category: 'framework', description: 'y',
    levels: [{ id: 'newbie', name: 'Newbie', lessons: [{ id: 'x', title: 'JSX' }] }] }
];
const JSON_GIA = { '/curriculum/index.json': INDEX, '/api/health': { aiEnabled: true } };
/** Thanh tren cung: header co dieu huong (jsdom tinh moi <header> la banner, ke ca header cua trang) */
const thanhTren = async () => (await screen.findAllByRole('banner')).find(h => within(h).queryByRole('navigation'))!;
const daDangNhap = () => giaSupabase({ nguoiDung: { id: 'u1' }, bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }] } });

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.removeItem(KHOA_GIAO_DIEN);
  apGiaoDien('co-dien');
});

test('mac dinh co dien: co sidebar; chon Pastel o sidebar thi doi ngay sang thanh dieu huong tren cung, luu lua chon', async () => {
  const u = userEvent.setup();
  veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  const sidebar = await screen.findByRole('complementary');
  await u.click(within(sidebar).getByRole('radio', { name: /Pastel/ }));
  expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  const thanh = await thanhTren();
  const nav = within(thanh).getByRole('navigation', { name: 'DevMaster Hub' });
  expect(within(nav).getByRole('link', { name: /Dashboard/ })).toHaveAttribute('href', '/');
  expect(within(nav).getByRole('link', { name: /Project Lab/ })).toHaveAttribute('href', '/project');
  expect(within(nav).getByRole('link', { name: /Tư vấn Việc làm/ })).toHaveAttribute('href', '/career');
  expect(document.documentElement.dataset.giaoDien).toBe('pastel');
  expect(localStorage.getItem(KHOA_GIAO_DIEN)).toBe('pastel');
});

test('da chon Pastel tu truoc: mo app la thanh tren cung; menu Lo trinh co cac cong nghe; doi lai Co dien tu menu tai khoan', async () => {
  const u = userEvent.setup();
  localStorage.setItem(KHOA_GIAO_DIEN, 'pastel');
  apGiaoDien('pastel');
  veApp('/', { gia: daDangNhap(), json: JSON_GIA });
  const thanh = await thanhTren();
  expect(screen.queryByRole('complementary')).not.toBeInTheDocument();

  await u.click(within(thanh).getByRole('button', { name: /Lộ trình/ }));
  expect(await screen.findByRole('menuitem', { name: /React/ })).toHaveAttribute('href', '/roadmap/react');
  await u.keyboard('{Escape}');

  await u.click(within(thanh).getByRole('button', { name: /Tài khoản/ }));
  await u.click(await screen.findByRole('menuitemradio', { name: /Cổ điển/ }));
  expect(await screen.findByRole('complementary')).toBeInTheDocument();
  expect(document.documentElement.dataset.giaoDien).toBe('co-dien');
});
