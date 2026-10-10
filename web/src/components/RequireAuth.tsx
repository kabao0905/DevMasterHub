import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center" aria-busy="true">
        <Skeleton className="h-10 w-48" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}
