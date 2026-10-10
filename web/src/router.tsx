import { useEffect } from 'react';
import { createBrowserRouter, useLocation, type RouteObject } from 'react-router';
import { AppShell } from '@/components/AppShell';
import { RequireAuth } from '@/components/RequireAuth';
import { AuthPage } from '@/routes/auth/AuthPage';
import { DashboardPage } from '@/routes/dashboard/DashboardPage';

/** URL khong thuoc app React: tai trang that de server tra app cu (xem lib/route-owner.js) */
function SangAppCu() {
  const { pathname, search } = useLocation();
  useEffect(() => { window.location.replace(pathname + search); }, [pathname, search]);
  return null;
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
