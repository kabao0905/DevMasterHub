import { useLocation } from 'react-router';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';

/** Server giao URL nay cho React nhung router khong co trang tuong ung */
export function NotFoundPage() {
  const { t } = useT();
  const { pathname } = useLocation();
  usePageMeta({ title: `${t('pageNotFound')} | DevMaster Hub` });

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-sm space-y-6">
        <BrandMark />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t('pageNotFound')}</h1>
          <p className="truncate font-mono text-sm text-muted-foreground">{pathname}</p>
        </div>
        <Button asChild size="lg" className="h-10 bg-brand px-5 text-white hover:opacity-90">
          <a href="/">{t('dashboard')}</a>
        </Button>
      </div>
    </main>
  );
}
