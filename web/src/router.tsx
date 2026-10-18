import { createBrowserRouter, Navigate, useParams, type RouteObject } from 'react-router';
import { AppShell } from '@/components/AppShell';
import { RequireAuth } from '@/components/RequireAuth';
import { AuthPage } from '@/routes/auth/AuthPage';
import { DashboardPage } from '@/routes/dashboard/DashboardPage';
import { NotFoundPage } from '@/routes/not-found/NotFoundPage';
import { RoadmapPage } from '@/routes/roadmap/RoadmapPage';
import { LoiTrang } from '@/routes/loi/LoiTrang';
import { Skeleton } from '@/components/ui/skeleton';
import { useT } from '@/lib/i18n';

function TaiTrang() {
  const { t } = useT();
  return (
    <div className="grid min-h-dvh place-items-center" aria-busy="true">
      <Skeleton className="h-10 w-48" />
      <span role="status" className="sr-only">{t('loading')}</span>
    </div>
  );
}

function VeRoadmap() {
  const { tech, level } = useParams();
  return <Navigate to={level ? `/roadmap/${tech}/${level}` : `/roadmap/${tech}`} replace />;
}

export const cacRoute: RouteObject[] = [
  { path: '/auth', element: <AuthPage />, errorElement: <LoiTrang /> },
  {
    element: <RequireAuth><AppShell /></RequireAuth>,
    HydrateFallback: TaiTrang,
    errorElement: <LoiTrang />,
    children: [{
      errorElement: <LoiTrang trongKhung />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'roadmap', element: <Navigate to="/" replace /> },
        { path: 'roadmap/:tech/:level?', element: <RoadmapPage /> },
        { path: 'lesson', element: <Navigate to="/" replace /> },
        { path: 'lesson/:tech/:level?', element: <VeRoadmap /> },
        { path: 'lesson/:tech/:level/:lesson', lazy: async () => ({ Component: (await import('@/routes/lesson/LessonPage')).LessonPage }) },
        { path: 'challenge', lazy: async () => ({ Component: (await import('@/routes/challenge/ChallengePage')).ChallengePage }) },
        { path: 'project', lazy: async () => ({ Component: (await import('@/routes/project/ProjectHubPage')).ProjectHubPage }) },
        { path: 'project-level/:level?', lazy: async () => ({ Component: (await import('@/routes/project/ProjectLevelPage')).ProjectLevelPage }) },
        { path: 'project-topic/:topic?', lazy: async () => ({ Component: (await import('@/routes/project/ProjectTopicPage')).ProjectTopicPage }) },
        { path: 'saved-ideas', lazy: async () => ({ Component: (await import('@/routes/project/SavedIdeasPage')).SavedIdeasPage }) },
        { path: 'my-projects/:id?', lazy: async () => ({ Component: (await import('@/routes/project/MyProjectsPage')).MyProjectsPage }) },
        { path: 'career', lazy: async () => ({ Component: (await import('@/routes/career/CareerPage')).CareerPage }) }
      ]
    }]
  },
  { path: '*', element: <NotFoundPage /> }
];

export const taoRouter = () => createBrowserRouter(cacRoute);
