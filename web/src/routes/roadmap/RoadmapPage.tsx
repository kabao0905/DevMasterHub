import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Check, ChevronRight, Flag, Lock, Play } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { useBatDauHoc } from '@/lib/use-thoi-gian-hoc';
import { useCurriculumIndex } from '@/lib/use-curriculum';
import { useProgress } from '@/lib/use-progress';
import { useEscape } from '@/lib/use-escape';
import { timCongNghe } from '@/lib/curriculum';
import { baiDaMo, khoaBai, tienDoCongNghe } from '@/lib/progress';
import { LevelLadder, MAU_CAP } from '@/components/LevelLadder';
import { BienTuyen } from '@/components/BienTuyen';
import { LoadError } from '@/components/LoadError';
import { NotFoundPanel } from '@/components/NotFoundPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function RoadmapPage() {
  const { tech: techId = '', level: capTrenUrl } = useParams();
  const { t, lang, translateTitle, techDesc } = useT();
  const navigate = useNavigate();
  const { data: ds = [], isLoading, isError, refetch } = useCurriculumIndex();
  const { done } = useProgress();
  const tech = timCongNghe(ds, techId);
  const tongBai = tech ? tech.levels.reduce((n, l) => n + l.lessons.length, 0) : 0;

  usePageMeta(tech
    ? {
        title: `${t('roadmapMetaTitle', { name: tech.name, n: tongBai })} | DevMaster Hub`,
        description: t('roadmapMetaDesc', { name: tech.name, n: tongBai, levels: tech.levels.length }),
        url: `${window.location.origin}/roadmap/${tech.id}`
      }
    : { title: `${t('pageNotFound')} | DevMaster Hub` });
  useEscape(() => navigate('/'));
  useBatDauHoc(tech?.id ?? '', 'roadmap');

  useEffect(() => {
    if (!tech || !capTrenUrl) return;
    const giamChuyenDong = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(`cap-${capTrenUrl}`)?.scrollIntoView?.({ block: 'start', behavior: giamChuyenDong ? 'auto' : 'smooth' });
  }, [tech, capTrenUrl]);

  if (isError) return <LoadError onRetry={() => refetch()} />;
  if (isLoading) return <Skeleton className="h-96 w-full rounded-3xl" />;
  if (!tech) return <NotFoundPanel />;

  const td = tienDoCongNghe(tech, done);
  const phanTram = new Intl.NumberFormat(lang, { style: 'percent' }).format(td.phanTram / 100);
  const gaHienTai = tech.levels.flatMap(cap => cap.lessons.map(bai => ({ cap: cap.id, bai: bai.id })))
    .find(g => baiDaMo(tech, g.cap, g.bai, done) && !done.has(khoaBai(tech.id, g.cap, g.bai)));
  const baiKhoaDau = tech.levels.flatMap(cap => cap.lessons.map(bai => ({ cap: cap.id, bai: bai.id })))
    .find(g => !baiDaMo(tech, g.cap, g.bai, done));

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link to="/" className="inline-flex items-center gap-1.5 rounded-full px-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> {t('dashboard')}
      </Link>

      <header className="space-y-5">
        <div className="flex items-start gap-4">
          <BienTuyen tech={tech} co="lon" />
          <div className="min-w-0">
            <h1 className="font-display text-4xl leading-none font-extrabold tracking-tight break-words sm:text-5xl">{tech.name}</h1>
            <p className="mt-2 text-muted-foreground">{techDesc(tech.id, tech.description)}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-3xl bg-card px-5 py-4 shadow-soft">
          <LevelLadder levels={tech.levels} theoCap={td.theoCap} className="min-w-48 flex-1" />
          <p className="shrink-0 text-sm text-muted-foreground tabular-nums">{td.xong}/{td.tong} {t('lessonsUnit')}</p>
          <span className="shrink-0 rounded-full bg-mint px-2.5 py-0.5 text-sm font-semibold text-mint-ink tabular-nums">{phanTram}</span>
        </div>
      </header>

      {tech.id === 'cybersecurity' && (
        <Link to="/challenge" className="the-noi flex items-center gap-4 rounded-3xl bg-peach p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-card text-peach-ink" aria-hidden="true">
            <Flag className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-lg font-extrabold">{t('challengeNav')}</span>
            <span className="block text-sm">{t('challengeEntryHint')}</span>
          </span>
          <ChevronRight className="size-5" aria-hidden="true" />
        </Link>
      )}

      <ol className="space-y-8">
        {tech.levels.map((cap, i) => {
          const c = td.theoCap[i];
          const xongCap = c.tong > 0 && c.xong === c.tong;
          return (
            <li key={cap.id}>
              <section
                id={`cap-${cap.id}`}
                aria-labelledby={`tieu-de-cap-${cap.id}`}
                aria-current={cap.id === capTrenUrl ? 'true' : undefined}
                className={cn('scroll-mt-24 rounded-3xl', cap.id === capTrenUrl && 'ring-2 ring-ring/40 ring-offset-8 ring-offset-canvas')}
              >
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <h2 id={`tieu-de-cap-${cap.id}`} className="flex min-w-0 flex-col items-start gap-y-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                    <span className={cn('rounded-full px-3 py-1 text-sm font-bold text-white dark:text-background', MAU_CAP[cap.id] ?? 'bg-primary')}>{cap.name}</span>
                    <span className="font-display text-2xl font-extrabold text-balance">{translateTitle(cap.desc || cap.name)}</span>
                  </h2>
                  <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-sm font-semibold tabular-nums', xongCap ? 'bg-mint text-mint-ink' : 'bg-muted text-muted-foreground')}>{c.xong}/{c.tong}</span>
                </div>

                <ul className="relative mt-4 space-y-3 pl-9 before:absolute before:top-4 before:bottom-4 before:left-[13px] before:border-l-2 before:border-dotted before:border-trail">
                  {cap.lessons.map(bai => {
                    const xong = done.has(khoaBai(tech.id, cap.id, bai.id));
                    const oDay = gaHienTai?.cap === cap.id && gaHienTai.bai === bai.id;
                    if (!baiDaMo(tech, cap.id, bai.id, done)) {
                      const laKhoaDau = baiKhoaDau?.cap === cap.id && baiKhoaDau.bai === bai.id;
                      return (
                        <li key={bai.id} className="relative">
                          <span aria-hidden="true" className="absolute top-1/2 -left-[29px] size-3.5 -translate-y-1/2 rounded-full border-2 border-border bg-canvas" />
                          <div className="kich-dong flex items-center gap-3 rounded-2xl border-2 border-dashed border-border px-4 py-3 text-muted-foreground">
                            <span className="min-w-0 flex-1">
                              <span>{translateTitle(bai.title)}</span>
                              <span className="sr-only"> {t('lessonLocked')}</span>
                              {laKhoaDau && <span className="mt-0.5 block text-xs">{t('lessonLockedHint')}</span>}
                            </span>
                            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted" aria-hidden="true">
                              <Lock data-dong="khoa" className="size-4" />
                            </span>
                          </div>
                        </li>
                      );
                    }
                    return (
                      <li key={bai.id} className="relative">
                        <span aria-hidden="true" className={cn('absolute top-1/2 -translate-y-1/2 rounded-full',
                          oDay ? '-left-[31px] size-[18px] border-4 border-canvas bg-primary ring-2 ring-primary/30'
                            : xong ? '-left-[29px] size-3.5 bg-trail' : '-left-[29px] size-3.5 border-2 border-trail bg-canvas')} />
                        <Link to={`/lesson/${tech.id}/${cap.id}/${bai.id}`} aria-current={oDay ? 'step' : undefined}
                          className={cn('the-noi flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                            oDay ? 'rounded-3xl bg-lavender px-5 py-4 shadow-lift sm:-rotate-[0.6deg] sm:hover:rotate-0'
                              : 'rounded-2xl bg-card px-4 py-3 shadow-soft')}>
                          <span className="min-w-0 flex-1">
                            <span className={cn('block', oDay && 'font-display text-lg font-extrabold')}>
                              {translateTitle(bai.title)}
                              {xong && <span className="sr-only"> {t('statCompleted')}</span>}
                            </span>
                          </span>
                          {xong && (
                            <span aria-hidden="true" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-mint p-1 text-xs font-semibold text-mint-ink sm:px-2.5 sm:py-0.5">
                              <Check className="size-3.5" strokeWidth={3} /><span className="hidden sm:inline">{t('statCompleted')}</span>
                            </span>
                          )}
                          {oDay && <span aria-hidden="true" className="hidden shrink-0 rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold text-lavender-ink sm:inline-block">{t('youAreHere')}</span>}
                          {oDay
                            ? <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="size-4 translate-x-px fill-current" /></span>
                            : <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
