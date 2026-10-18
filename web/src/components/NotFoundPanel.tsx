import { Link } from 'react-router';
import { useT } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

export function NotFoundPanel({ ve = '/', nhanVe }: { ve?: string; nhanVe?: string }) {
  const { t } = useT();
  return (
    <div className="rounded-3xl border-2 border-dashed p-8">
      <h1 className="font-display text-2xl font-extrabold">{t('pageNotFound')}</h1>
      <Button asChild variant="outline" className="mt-5">
        <Link to={ve}>{nhanVe ?? t('dashboard')}</Link>
      </Button>
    </div>
  );
}
