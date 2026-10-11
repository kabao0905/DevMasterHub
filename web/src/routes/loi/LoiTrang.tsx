import { useEffect, useState } from 'react';
import { useRouteError } from 'react-router';
import { RotateCw } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { dieuHuong } from '@/lib/dieu-huong';
import { laLoiTaiChunk, taiLaiMotLan } from '@/lib/tai-lai-chunk';
import { Button } from '@/components/ui/button';

/**
 * Trang loi cua router (errorElement). Chunk cua trang da bi xoa sau khi deploy ban moi: tai lai mot lan.
 * Loi khac (hoac vua tai lai ma van hong): noi ro, cho tai lai hoac ve Dashboard thay vi man hinh loi mac dinh.
 */
export function LoiTrang() {
  const loi = useRouteError();
  const { t } = useT();
  const chunk = laLoiTaiChunk(loi);
  const [trangThai, datTrangThai] = useState<'cho' | 'taiLai' | 'loi'>(chunk ? 'cho' : 'loi');
  useEffect(() => {
    if (chunk) datTrangThai(taiLaiMotLan() ? 'taiLai' : 'loi');
  }, [chunk]);
  usePageMeta({ title: `${t('pageLoadError')} | DevMaster Hub` });

  if (trangThai !== 'loi') {
    return (
      <div className="grid min-h-[50dvh] place-items-center px-5" aria-busy="true">
        {trangThai === 'taiLai' && <p className="text-muted-foreground" role="status">{t('appUpdatedReloading')}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto grid min-h-[50dvh] max-w-md content-center gap-6 px-5 py-12">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('pageLoadError')}</h1>
        <p className="text-muted-foreground">{t('pageLoadErrorHint')}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button size="lg" className="h-10 bg-brand px-5 text-white hover:opacity-90" onClick={() => dieuHuong.taiLai()}>
          <RotateCw /> {t('reloadPage')}
        </Button>
        {/* Tai trang that: neu loi do ban cu cua app thi Dashboard cung can ban moi */}
        <Button asChild size="lg" variant="outline" className="h-10 px-5">
          <a href="/">{t('dashboard')}</a>
        </Button>
      </div>
    </div>
  );
}
