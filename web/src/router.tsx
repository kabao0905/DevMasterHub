import { useEffect } from 'react';
import { createBrowserRouter, useLocation, type RouteObject } from 'react-router';
import { AppShell } from '@/components/AppShell';
import { RequireAuth } from '@/components/RequireAuth';
import { AuthPage } from '@/routes/auth/AuthPage';
import { DashboardPage } from '@/routes/dashboard/DashboardPage';
import { NotFoundPage } from '@/routes/not-found/NotFoundPage';
import { dieuHuong } from '@/lib/dieu-huong';

/** URL khong thuoc app React: tai trang that de server tra app cu (xem lib/route-owner.js) */
function SangAppCu() {
  const { pathname, search, key } = useLocation();
  // key "default" = lan tai trang dau: server da chon React cho URL nay, tai lai se nhan lai
  // chinh trang nay mai mai. Chi tai trang that khi di toi day tu ben trong app.
  const moThang = key === 'default';
  useEffect(() => { if (!moThang) dieuHuong.thay(pathname + search); }, [moThang, pathname, search]);
  return moThang ? <NotFoundPage /> : null;
}

export const cacRoute: RouteObject[] = [
  { path: '/auth', element: <AuthPage /> },
  {
    element: <RequireAuth><AppShell /></RequireAuth>,
    children: [{ index: true, element: <DashboardPage /> }]
  },
  { path: '*', element: <SangAppCu /> }
];

export const taoRouter = () => createBrowserRouter(cacRoute);
