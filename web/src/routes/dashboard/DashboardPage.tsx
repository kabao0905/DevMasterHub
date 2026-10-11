import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Search } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { useCurriculumIndex } from '@/lib/use-curriculum';
import { useProgress } from '@/lib/use-progress';
import { nhomCongNghe, THU_TU_NHOM, type CongNgheTomTat, type Nhom } from '@/lib/curriculum';
import { baiKeTiep, tienDoCongNghe, tienDoTong, type ViTriBai } from '@/lib/progress';
import { TEN_NHOM } from '@/components/Sidebar';
import { TechCard } from '@/components/TechCard';
import { LevelLadder, CHU_CAP } from '@/components/LevelLadder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadError } from '@/components/LoadError';
import { SearchResults } from './SearchResults';
import { LichHoc } from './LichHoc';
import { cn } from '@/lib/utils';

function HocTiep({ viTri, done }: { viTri: ViTriBai | null; done: Set<string> }) {
  const { t, translateTitle } = useT();
  // Chua hoc bai nao: luoi lo trinh ngay ben duoi da la loi moi, khong can o nhac them
  if (!viTri) return null;
  const { tech, level, lesson } = viTri;
  const td = tienDoCongNghe(tech, done);
  return (
    <section aria-labelledby="hoc-tiep" className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-7">
      <div className="absolute inset-y-0 left-0 w-1 bg-brand" aria-hidden="true" />
      <h2 id="hoc-tiep" className="text-sm font-medium text-muted-foreground">{t('continueLearning')}</h2>
      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm">
            <span aria-hidden="true">{tech.icon}</span>
            <span className="font-medium">{tech.name}</span>
            <span className={cn('font-medium', CHU_CAP[level.id] ?? 'text-primary')}>{level.name}</span>
          </p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-balance">{translateTitle(lesson.title)}</p>
        </div>
        <Button asChild size="lg" className="h-10 shrink-0 bg-brand px-5 text-white hover:opacity-90">
          <Link to={`/lesson/${tech.id}/${level.id}/${lesson.id}`}>{t('openLesson')}</Link>
        </Button>
      </div>
      <div className="mt-6 max-w-md">
        <LevelLadder levels={tech.levels} theoCap={td.theoCap} />
        <p className="mt-2 text-xs text-muted-foreground tabular-nums">{td.xong}/{td.tong} {t('lessonsUnit')}</p>
      </div>
    </section>
  );
}

export function DashboardPage() {
  const { t } = useT();
  const { data: ds = [], isLoading, isError, refetch } = useCurriculumIndex();
  const { done } = useProgress();
  const [q, datQ] = useState('');
  const qTre = useDeferredValue(q);

  usePageMeta({ title: `${t('dashboard')} | DevMaster Hub`, description: t('dashboardSubtitle') });

  const tong = useMemo(() => tienDoTong(ds, done), [ds, done]);
  const keTiep = useMemo(() => baiKeTiep(ds, done), [ds, done]);
  const nhom = useMemo(() => {
    const m = new Map<Nhom, CongNgheTomTat[]>(THU_TU_NHOM.map(n => [n, []]));
    for (const tech of ds) m.get(nhomCongNghe(tech))!.push(tech);
    return [...m].filter(([, x]) => x.length);
  }, [ds]);

  const tieuDe = (
    <header className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight">{t('dashboardTitle')}</h1>
      <p className="text-muted-foreground">{t('dashboardSubtitle')}</p>
    </header>
  );

  if (isError) {
    return (
      <div className="space-y-10">
        {tieuDe}
        <LoadError onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Tieu de + thong ke ben trai, lich hoc nam ngang ben phai cao bang ca khoi do; man hep thi xep doc */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch">
        <div className="flex shrink-0 flex-col justify-between gap-8">
          {tieuDe}
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:flex sm:flex-wrap">
            {[
              [t('statTech'), ds.length],
              [t('statLessons'), tong.tong],
              [t('statCompleted'), tong.xong],
              [t('statProgress'), `${tong.phanTram}%`]
            ].map(([nhan, so]) => (
              <div key={String(nhan)}>
                <dt className="text-xs text-muted-foreground">{nhan}</dt>
                <dd className="text-xl font-semibold tabular-nums">{so}</dd>
              </div>
            ))}
          </dl>
        </div>
        <LichHoc className="xl:flex-1" />
      </div>

      {isLoading ? <Skeleton className="h-44 w-full rounded-2xl" /> : <HocTiep viTri={keTiep} done={done} />}

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          value={q}
          onChange={e => datQ(e.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
          className="h-11 pl-9 text-base"
        />
      </div>

      {qTre.trim() ? (
        <SearchResults q={qTre} ds={ds} />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : (
        nhom.map(([n, techs]) => (
          <section key={n} className="space-y-4">
            <h2 className="text-lg font-semibold">{t(TEN_NHOM[n])}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {techs.map(tech => <TechCard key={tech.id} tech={tech} done={done} />)}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
