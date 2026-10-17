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
import { LevelLadder, MAU_CAP } from '@/components/LevelLadder';
import { BienTuyen } from '@/components/BienTuyen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadError } from '@/components/LoadError';
import { SearchResults } from './SearchResults';
import { LichHoc } from './LichHoc';
import { cn } from '@/lib/utils';

/** Bang "ga tiep theo": nhu bien sân ga — tuyen nao, ga ke la bai gi, va doan tuyen da di cua cong nghe do */
function HocTiep({ viTri, done }: { viTri: ViTriBai | null; done: Set<string> }) {
  const { t, translateTitle } = useT();
  // Chua hoc bai nao: luoi lo trinh ngay ben duoi da la loi moi, khong can o nhac them
  if (!viTri) return null;
  const { tech, level, lesson } = viTri;
  const td = tienDoCongNghe(tech, done);
  return (
    <section aria-labelledby="hoc-tiep" className="rounded-3xl bg-sign p-6 text-sign-foreground sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <BienTuyen tech={tech} co="lon" />
          <div className="min-w-0">
            <h2 id="hoc-tiep" className="text-sm text-white/70">{t('continueLearning')}</h2>
            <p className="mt-0.5 font-display text-3xl leading-tight font-semibold text-balance">{translateTitle(lesson.title)}</p>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/80">
              <span>{tech.name}</span>
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold text-white dark:text-background', MAU_CAP[level.id] ?? 'bg-primary')}>{level.name}</span>
            </p>
          </div>
        </div>
        <Button asChild size="lg" className="h-12 shrink-0 rounded-full bg-signal px-7 text-base font-semibold text-signal-foreground hover:bg-signal hover:brightness-105">
          <Link to={`/lesson/${tech.id}/${level.id}/${lesson.id}`}>{t('openLesson')}</Link>
        </Button>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <LevelLadder levels={tech.levels} theoCap={td.theoCap} className="max-w-xl flex-1" />
        <p className="shrink-0 text-xs text-white/70 tabular-nums">{td.xong}/{td.tong} {t('lessonsUnit')}</p>
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
      <h1 className="font-display text-5xl font-extrabold tracking-tight">{t('dashboardTitle')}</h1>
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
          {/* So lieu xep mot hang ngan cach bang vach mong, nhu bang thong tin o ga — khong chia o mau */}
          <dl className="grid grid-cols-2 rounded-2xl border bg-card sm:flex sm:divide-x">
            {([
              [t('statTech'), ds.length],
              [t('statLessons'), tong.tong],
              [t('statCompleted'), tong.xong],
              [t('statProgress'), `${tong.phanTram}%`]
            ] as const).map(([nhan, so]) => (
              <div key={String(nhan)} className="flex flex-col-reverse px-5 py-3">
                <dt className="text-xs text-muted-foreground">{nhan}</dt>
                <dd className="font-display text-3xl leading-none font-semibold tabular-nums">{so}</dd>
              </div>
            ))}
          </dl>
        </div>
        <LichHoc className="xl:flex-1" />
      </div>

      {isLoading ? <Skeleton className="h-44 w-full rounded-3xl" /> : <HocTiep viTri={keTiep} done={done} />}

      <div className="kich-dong relative">
        <Search data-dong="kinh" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          value={q}
          onChange={e => datQ(e.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
          className="h-12 rounded-full bg-card pl-10 text-base"
        />
      </div>

      {qTre.trim() ? (
        <SearchResults q={qTre} ds={ds} />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : (
        nhom.map(([n, techs]) => (
          <section key={n} className="space-y-4">
            {/* Tieu de nhom nhu chu thich tren ban do: chu bien ga + vach ke chay het hang */}
            <h2 className="flex items-center gap-3 font-display text-2xl font-semibold">
              {t(TEN_NHOM[n])}
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {techs.map(tech => <TechCard key={tech.id} tech={tech} done={done} />)}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
