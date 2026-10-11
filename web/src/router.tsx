import { useEffect } from 'react';
import { createBrowserRouter, Navigate, useLocation, useParams, type RouteObject } from 'react-router';
import { AppShell } from '@/components/AppShell';
import { RequireAuth } from '@/components/RequireAuth';
import { AuthPage } from '@/routes/auth/AuthPage';
import { DashboardPage } from '@/routes/dashboard/DashboardPage';
import { NotFoundPage } from '@/routes/not-found/NotFoundPage';
import { RoadmapPage } from '@/routes/roadmap/RoadmapPage';
import { LoiTrang } from '@/routes/loi/LoiTrang';
import { dieuHuong } from '@/lib/dieu-huong';
import { Skeleton } from '@/components/ui/skeleton';

/** URL khong thuoc app React: tai trang that de server tra app cu (xem lib/route-owner.js) */
function SangAppCu() {
  const { pathname, search, key } = useLocation();
  // key "default" = lan tai trang dau: server da chon React cho URL nay, tai lai se nhan lai
  // chinh trang nay mai mai. Chi tai trang that khi di toi day tu ben trong app.
  const moThang = key === 'default';
  useEffect(() => { if (!moThang) dieuHuong.thay(pathname + search); }, [moThang, pathname, search]);
  return moThang ? <NotFoundPage /> : null;
}

/** Trong luc tai chunk cua route luoi o lan mo trang dau: khong de trang trang */
function TaiTrang() {
  return (
    <div className="grid min-h-dvh place-items-center" aria-busy="true">
      <Skeleton className="h-10 w-48" />
    </div>
  );
}

/** /lesson/<tech>[/<cap>] thieu bai: ve roadmap tuong ung */
function VeRoadmap() {
  const { tech, level } = useParams();
  return <Navigate to={level ? `/roadmap/${tech}/${level}` : `/roadmap/${tech}`} replace />;
}

export const cacRoute: RouteObject[] = [
  { path: '/auth', element: <AuthPage />, errorElement: <LoiTrang /> },
  {
    element: <RequireAuth><AppShell /></RequireAuth>,
    HydrateFallback: TaiTrang,
    // Loi o chinh khung app (thanh ben...)
    errorElement: <LoiTrang />,
    children: [{
      // Loi o mot trang (chunk lazy hong sau deploy, loi khi ve): hien trong khung, thanh ben van dung duoc
      errorElement: <LoiTrang />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'roadmap', element: <Navigate to="/" replace /> },
        { path: 'roadmap/:tech/:level?', element: <RoadmapPage /> },
        { path: 'lesson', element: <Navigate to="/" replace /> },
        { path: 'lesson/:tech/:level?', element: <VeRoadmap /> },
        // Trang bai hoc va Thu thach (Prism, AI, terminal, IDE) tach chunk rieng
        { path: 'lesson/:tech/:level/:lesson', lazy: async () => ({ Component: (await import('@/routes/lesson/LessonPage')).LessonPage }) },
        { path: 'challenge', lazy: async () => ({ Component: (await import('@/routes/challenge/ChallengePage')).ChallengePage }) },
        // Project Lab, idea da luu, du an cua toi
        { path: 'project', lazy: async () => ({ Component: (await import('@/routes/project/ProjectHubPage')).ProjectHubPage }) },
        { path: 'project-level/:level?', lazy: async () => ({ Component: (await import('@/routes/project/ProjectLevelPage')).ProjectLevelPage }) },
        { path: 'project-topic/:topic?', lazy: async () => ({ Component: (await import('@/routes/project/ProjectTopicPage')).ProjectTopicPage }) },
        { path: 'saved-ideas', lazy: async () => ({ Component: (await import('@/routes/project/SavedIdeasPage')).SavedIdeasPage }) },
        { path: 'my-projects/:id?', lazy: async () => ({ Component: (await import('@/routes/project/MyProjectsPage')).MyProjectsPage }) },
        { path: 'career', lazy: async () => ({ Component: (await import('@/routes/career/CareerPage')).CareerPage }) }
      ]
    }]
  },
  { path: '*', element: <SangAppCu /> }
];

export const taoRouter = () => createBrowserRouter(cacRoute);
