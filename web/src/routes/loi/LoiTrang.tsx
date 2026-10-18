import { useEffect, useState } from 'react';
import { useRouteError } from 'react-router';
import { RotateCw } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { dieuHuong } from '@/lib/dieu-huong';
import { laLoiTaiChunk, taiLaiMotLan } from '@/lib/tai-lai-chunk';
import { Button } from '@/components/ui/button';

export function LoiTrang({ trongKhung = false }: { trongKhung?: boolean }) {
  const loi = useRouteError();
  const { t } = useT();
  const chunk = laLoiTaiChunk(loi);
  const [trangThai, datTrangThai] = useState<'cho' | 'taiLai' | 'loi'>(chunk ? 'cho' : 'loi');
  useEffect(() => {
    if (chunk) datTrangThai(taiLaiMotLan() ? 'taiLai' : 'loi');
  }, [chunk]);
  usePageMeta({ title: `${t('pageLoadError')} | DevMaster Hub` });
  const Vo = trongKhung ? 'div' : 'main';

  if (trangThai !== 'loi') {
    return (
      <Vo className="grid min-h-[50dvh] place-items-center px-5" aria-busy="true">
        <p className="text-muted-foreground" role="status">{trangThai === 'taiLai' ? t('appUpdatedReloading') : ''}</p>
      </Vo>
    );
  }

  return (
    <Vo className="mx-auto grid min-h-[50dvh] max-w-md content-center px-5 py-12">
      <div className="grid gap-6 rounded-3xl bg-card p-6 shadow-soft sm:p-8">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance">{t('pageLoadError')}</h1>
          <p className="text-muted-foreground">{t('pageLoadErrorHint')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="h-10 rounded-full bg-signal px-5 text-signal-foreground hover:bg-signal hover:brightness-105" onClick={() => dieuHuong.taiLai()}>
            <RotateCw aria-hidden="true" /> {t('reloadPage')}
          </Button>
          <Button asChild size="lg" variant="outline" className="h-10 rounded-full px-5">
            <a href="/">{t('dashboard')}</a>
          </Button>
        </div>
      </div>
    </Vo>
  );
}
