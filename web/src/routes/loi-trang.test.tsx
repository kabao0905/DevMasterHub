import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RouteObject } from 'react-router';
import { cacRoute } from '@/router';
import { dieuHuong } from '@/lib/dieu-huong';
import { veApp } from '@/test/ve-app';
import { giaSupabase } from '@/test/gia-supabase';

const daDangNhap = () => giaSupabase({ nguoiDung: { id: 'u1' }, bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }] } });

function timRoute(ds: RouteObject[], duong: string): RouteObject {
  for (const r of ds) {
    if (r.path === duong) return r;
    if (r.children) { try { return timRoute(r.children, duong); } catch {} }
  }
  throw new Error('khong co route ' + duong);
}

const tra: (() => void)[] = [];
function thayLazy(duong: string, lazy: RouteObject['lazy']) {
  const r = timRoute(cacRoute, duong);
  const goc = r.lazy;
  r.lazy = lazy;
  tra.push(() => { r.lazy = goc; });
}
afterEach(() => { tra.splice(0).forEach(f => f()); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

const CHUNK_HONG = async () => { throw new TypeError('Failed to fetch dynamically imported module: http://localhost/assets/LessonPage-1a2b3c.js'); };

test('chunk trang da bi xoa sau khi deploy ban moi: bao dang tai lai va tai lai trang mot lan', async () => {
  const taiLai = vi.spyOn(dieuHuong, 'taiLai').mockImplementation(() => {});
  thayLazy('lesson/:tech/:level/:lesson', CHUNK_HONG);
  veApp('/lesson/python/newbie/a', { gia: daDangNhap() });
  expect(await screen.findByText('DevMaster Hub vừa có bản mới, đang tải lại trang…')).toBeInTheDocument();
  expect(taiLai).toHaveBeenCalledTimes(1);
});

test('vua tai lai ma chunk van hong: khong tai lai lien tuc; hien loi trong khung app, co nut tai lai va ve Dashboard', async () => {
  const u = userEvent.setup();
  const taiLai = vi.spyOn(dieuHuong, 'taiLai').mockImplementation(() => {});
  sessionStorage.setItem('devmaster_hub_tai_lai_chunk', String(Date.now()));
  thayLazy('lesson/:tech/:level/:lesson', CHUNK_HONG);
  veApp('/lesson/python/newbie/a', { gia: daDangNhap() });
  expect(await screen.findByRole('heading', { name: 'Không mở được trang này' })).toBeInTheDocument();
  expect(taiLai).not.toHaveBeenCalled();
  expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { name: 'Không mở được trang này' }));
  expect(screen.getAllByRole('navigation', { name: 'DevMaster Hub' }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('link', { name: 'Dashboard' }).some(a => a.getAttribute('href') === '/')).toBe(true);
  await u.click(screen.getByRole('button', { name: 'Tải lại trang' }));
  expect(taiLai).toHaveBeenCalledTimes(1);
});

test('trang nem loi khi ve (khong phai loi tai chunk): hien trang loi, khong tu tai lai', async () => {
  const taiLai = vi.spyOn(dieuHuong, 'taiLai').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  thayLazy('challenge', async () => ({ Component: () => { throw new Error('hong khi ve'); } }));
  veApp('/challenge', { gia: daDangNhap() });
  expect(await screen.findByRole('heading', { name: 'Không mở được trang này' })).toBeInTheDocument();
  await waitFor(() => expect(document.title).toContain('Không mở được trang này'));
  expect(taiLai).not.toHaveBeenCalled();
});
