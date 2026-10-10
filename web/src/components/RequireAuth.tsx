import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center" aria-busy="true">
        <Skeleton className="h-10 w-48" />
      </div>
    );
  }
  // Nho trang dang mo (link duoc chia se) de dang nhap xong quay lai dung cho
  if (!user) return <Navigate to="/auth" replace state={{ from: location.pathname + location.search }} />;
  return children;
}
