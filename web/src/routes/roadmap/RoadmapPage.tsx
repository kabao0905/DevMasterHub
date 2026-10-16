import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Check, ChevronRight, CircleCheck, Circle, Flag, Lock } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { useBatDauHoc } from '@/lib/use-thoi-gian-hoc';
import { useCurriculumIndex } from '@/lib/use-curriculum';
import { useProgress } from '@/lib/use-progress';
import { useEscape } from '@/lib/use-escape';
import { timCongNghe } from '@/lib/curriculum';
import { baiDaMo, khoaBai, tienDoCongNghe } from '@/lib/progress';
import { LevelLadder, CHU_CAP, MAU_CAP, NEN_CAP } from '@/components/LevelLadder';
import { LoadError } from '@/components/LoadError';
import { NotFoundPanel } from '@/components/NotFoundPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function RoadmapPage() {
  const { tech: techId = '', level: capTrenUrl } = useParams();
  const { t, translateTitle, techDesc } = useT();
  const navigate = useNavigate();
  const { data: ds = [], isLoading, isError, refetch } = useCurriculumIndex();
  const { done } = useProgress();
  const tech = timCongNghe(ds, techId);
  const tongBai = tech ? tech.levels.reduce((n, l) => n + l.lessons.length, 0) : 0;

  // Giong meta server chen cho lan tai dau, de di bang router hay tai trang deu ra mot tieu de
  usePageMeta(tech
    ? {
        title: `Học ${tech.name} Từ Cơ Bản Đến Nâng Cao — ${tongBai} Bài | DevMaster Hub`,
        description: `Lộ trình ${tech.name} gồm ${tongBai} bài thực chiến chia theo ${tech.levels.length} cấp độ. Học lý thuyết, chạy code ngay trên trình duyệt, làm trắc nghiệm và có AI Tutor kèm 1-1.`,
        url: `${window.location.origin}/roadmap/${tech.id}`
      }
    : { title: `${t('pageNotFound')} | DevMaster Hub` });
  useEscape(() => navigate('/'));
  // Mo mot mon hoc: bat dong ho dem thoi gian hoc (lich tren Dashboard)
  useBatDauHoc(tech?.id ?? '', 'roadmap');

  // /roadmap/python/junior: dua cap do vao tam nhin
  useEffect(() => {
    if (!tech || !capTrenUrl) return;
    const giamChuyenDong = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(`cap-${capTrenUrl}`)?.scrollIntoView?.({ block: 'start', behavior: giamChuyenDong ? 'auto' : 'smooth' });
  }, [tech, capTrenUrl]);

  if (isError) return <LoadError onRetry={() => refetch()} />;
  if (isLoading) return <Skeleton className="h-96 w-full rounded-2xl" />;
  if (!tech) return <NotFoundPanel />;

  const td = tienDoCongNghe(tech, done);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> {t('back')}
      </Link>

      <header className="space-y-5">
        <div className="flex items-start gap-4">
          <span
            className="grid size-14 shrink-0 place-items-center rounded-2xl text-3xl"
            style={{ backgroundColor: `color-mix(in oklab, ${tech.color || '#58a6ff'} 18%, transparent)` }}
            aria-hidden="true"
          >
            {tech.icon}
          </span>
          <div className="min-w-0">
            <h1 className="text-4xl font-semibold tracking-tight">{tech.name}</h1>
            <p className="mt-1 text-muted-foreground">{techDesc(tech.id, tech.description)}</p>
          </div>
        </div>
        <div className="max-w-md space-y-2">
          <LevelLadder levels={tech.levels} theoCap={td.theoCap} />
          <p className="text-sm text-muted-foreground tabular-nums">{td.xong}/{td.tong} {t('lessonsUnit')} · {td.phanTram}%</p>
        </div>
      </header>

      {tech.id === 'cybersecurity' && (
        <Link to="/challenge" className="flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary/10 p-5 transition-colors hover:bg-primary/15">
          <Flag className="size-6 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{t('challengeNav')}</span>
            <span className="block text-sm text-muted-foreground">{t('challengeEntryHint')}</span>
          </span>
          <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
        </Link>
      )}

      <ol className="relative">
        {tech.levels.map((cap, i) => {
          const c = td.theoCap[i];
          const xongCap = c.tong > 0 && c.xong === c.tong;
          const dangHoc = c.xong > 0 && !xongCap;
          const laCuoi = i === tech.levels.length - 1;
          return (
            <li key={cap.id} className="relative pb-10 pl-14 last:pb-0">
              {!laCuoi && <span className="absolute top-10 bottom-0 left-[19px] border-l-2 border-dashed border-pastel-line" aria-hidden="true" />}
              <span
                className={cn(
                  'absolute top-0 left-0 grid size-10 place-items-center rounded-full border text-sm font-semibold tabular-nums',
                  xongCap ? cn(MAU_CAP[cap.id] ?? 'bg-primary', 'border-transparent text-background')
                    : dangHoc ? cn(NEN_CAP[cap.id] ?? 'bg-primary/15', CHU_CAP[cap.id] ?? 'text-primary', 'border-transparent')
                    : 'bg-card text-muted-foreground'
                )}
                aria-hidden="true"
              >
                {xongCap ? <Check className="size-5" /> : i + 1}
              </span>

              <section
                id={`cap-${cap.id}`}
                aria-labelledby={`tieu-de-cap-${cap.id}`}
                aria-current={cap.id === capTrenUrl ? 'true' : undefined}
                className={cn('scroll-mt-20 rounded-2xl', cap.id === capTrenUrl && 'ring-2 ring-primary/40 ring-offset-8 ring-offset-background')}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 id={`tieu-de-cap-${cap.id}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className={cn('rounded-md px-2 py-0.5 text-sm font-semibold', NEN_CAP[cap.id] ?? 'bg-primary/15', CHU_CAP[cap.id] ?? 'text-primary')}>
                      {cap.name}
                    </span>
                    <span className="text-lg font-semibold">{translateTitle(cap.desc || cap.name)}</span>
                  </h2>
                  <span className="shrink-0 text-sm text-muted-foreground tabular-nums">{c.xong}/{c.tong}</span>
                </div>

                {/* Moi bai la mot the rieng, noi nhau bang duong cham xanh (nhu mau thiet ke) */}
                <ul className="relative mt-3 space-y-3 before:absolute before:top-6 before:bottom-6 before:left-[29px] before:border-l-2 before:border-dashed before:border-pastel-line">
                  {cap.lessons.map(bai => {
                    const xong = done.has(khoaBai(tech.id, cap.id, bai.id));
                    // Hoc theo thu tu: bai chua toi luot hien khoa, khong vao duoc
                    if (!baiDaMo(tech, cap.id, bai.id, done)) {
                      return (
                        <li key={bai.id} className="relative">
                          <div aria-disabled="true" title={t('lessonLockedHint')} className="flex cursor-not-allowed items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card px-5 py-4 text-muted-foreground/70">
                            <Lock className="relative z-10 size-5 shrink-0 bg-card" aria-hidden="true" />
                            <span className="min-w-0 flex-1">
                              <span>{translateTitle(bai.title)}</span>
                              <span className="sr-only"> {t('lessonLocked')}</span>
                            </span>
                          </div>
                        </li>
                      );
                    }
                    return (
                      <li key={bai.id} className="relative">
                        <Link to={`/lesson/${tech.id}/${cap.id}/${bai.id}`}
                          className={cn('flex items-center gap-3 rounded-2xl border border-transparent bg-card px-5 py-4 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.2)] dark:border-border dark:shadow-none',
                            'transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 dark:hover:border-primary/40 motion-reduce:hover:translate-y-0',
                            'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                            xong && 'bg-pastel-mint/45 hover:bg-pastel-mint/60')}>
                          {xong
                            ? <CircleCheck className={cn('relative z-10 size-5 shrink-0 rounded-full bg-card', CHU_CAP[cap.id] ?? 'text-primary')} aria-hidden="true" />
                            : <Circle className="relative z-10 size-5 shrink-0 rounded-full bg-card text-muted-foreground/50" aria-hidden="true" />}
                          <span className={cn('min-w-0 flex-1', xong && 'text-foreground')}>
                            {translateTitle(bai.title)}
                            {xong && <span className="sr-only"> {t('statCompleted')}</span>}
                          </span>
                          {xong && (
                            <span aria-hidden="true" className="inline-flex shrink-0 rounded-full bg-pastel-mint px-2.5 py-0.5 text-xs font-medium text-foreground">
                              ✓ {t('statCompleted')}
                            </span>
                          )}
                          <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
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
