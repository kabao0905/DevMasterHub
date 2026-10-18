import { useLocation } from 'react-router';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  const { t } = useT();
  const { pathname } = useLocation();
  usePageMeta({ title: `${t('pageNotFound')} | DevMaster Hub` });

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-sm space-y-6 rounded-3xl bg-card p-6 shadow-soft sm:p-8">
        <BrandMark />
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance">{t('pageNotFound')}</h1>
          <p translate="no" title={pathname} className="font-mono text-sm break-all text-muted-foreground">{pathname}</p>
        </div>
        <Button asChild size="lg" className="h-10 rounded-full bg-signal px-5 text-signal-foreground hover:bg-signal hover:brightness-105">
          <a href="/">{t('dashboard')}</a>
        </Button>
      </div>
    </main>
  );
}
