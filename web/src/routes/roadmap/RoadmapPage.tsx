import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Check, ChevronRight, Flag, Lock } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { useBatDauHoc } from '@/lib/use-thoi-gian-hoc';
import { useCurriculumIndex } from '@/lib/use-curriculum';
import { useProgress } from '@/lib/use-progress';
import { useEscape } from '@/lib/use-escape';
import { timCongNghe } from '@/lib/curriculum';
import { baiDaMo, khoaBai, tienDoCongNghe } from '@/lib/progress';
import { LevelLadder, CHU_CAP, MAU_CAP, VIEN_CAP } from '@/components/LevelLadder';
import { BienTuyen } from '@/components/BienTuyen';
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
  // Ga "ban o day": bai dau tien da mo ma chua xong (hoc theo thu tu)
  const gaHienTai = tech.levels.flatMap(cap => cap.lessons.map(bai => ({ cap: cap.id, bai: bai.id })))
    .find(g => baiDaMo(tech, g.cap, g.bai, done) && !done.has(khoaBai(tech.id, g.cap, g.bai)));
  const capCuoi = tech.levels.length - 1;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> {t('back')}
      </Link>

      <header className="space-y-5">
        <div className="flex items-start gap-4">
          <BienTuyen tech={tech} co="lon" />
          <div className="min-w-0">
            <h1 className="font-display text-5xl leading-none font-extrabold tracking-tight">{tech.name}</h1>
            <p className="mt-2 text-muted-foreground">{techDesc(tech.id, tech.description)}</p>
          </div>
        </div>
        <div className="flex max-w-xl items-center gap-4">
          <LevelLadder levels={tech.levels} theoCap={td.theoCap} className="flex-1" />
          <p className="shrink-0 text-sm text-muted-foreground tabular-nums">
            {td.xong}/{td.tong} {t('lessonsUnit')} <span className="ml-1.5 font-semibold text-foreground">{td.phanTram}%</span>
          </p>
        </div>
      </header>

      {tech.id === 'cybersecurity' && (
        <Link to="/challenge" className="the-noi flex items-center gap-4 rounded-2xl border bg-card p-5">
          <Flag className="size-6 shrink-0 text-level-senior" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{t('challengeNav')}</span>
            <span className="block text-sm text-muted-foreground">{t('challengeEntryHint')}</span>
          </span>
          <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
        </Link>
      )}

      {/*
        So do tuyen doc: moi cap do la mot doan tuyen mang mau cap, moi bai la mot ga tren doan do.
        Duong tuyen ve tung khuc theo hang (khong khe ho giua cac hang): khuc da di dam mau, khuc chua toi nhat.
        Dau moi cap la tram doi tuyen (vong tron lon ghi so cap); ga "ban o day" to vang.
      */}
      <ol>
        {tech.levels.map((cap, i) => {
          const c = td.theoCap[i];
          const xongCap = c.tong > 0 && c.xong === c.tong;
          const mau = MAU_CAP[cap.id] ?? 'bg-primary';
          const daToi = c.xong > 0 || gaHienTai?.cap === cap.id;
          return (
            <li key={cap.id}>
              <section
                id={`cap-${cap.id}`}
                aria-labelledby={`tieu-de-cap-${cap.id}`}
                aria-current={cap.id === capTrenUrl ? 'true' : undefined}
                className={cn('scroll-mt-24 rounded-2xl', cap.id === capTrenUrl && 'ring-2 ring-ring/40 ring-offset-8 ring-offset-background')}
              >
                <div className="relative flex items-center justify-between gap-3 py-3 pl-14">
                  <span aria-hidden="true" className={cn('absolute left-[17px] w-1.5', mau, i === 0 ? 'top-1/2 bottom-0' : 'inset-y-0', !daToi && 'opacity-25')} />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-1/2 left-0 grid size-10 -translate-y-1/2 place-items-center rounded-full border-[5px] bg-card font-display text-base font-bold tabular-nums',
                      VIEN_CAP[cap.id] ?? 'border-primary', xongCap && cn(mau, 'text-white dark:text-background')
                    )}
                  >
                    {xongCap ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                  </span>
                  <h2 id={`tieu-de-cap-${cap.id}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-sm font-semibold text-white dark:text-background', mau)}>{cap.name}</span>
                    <span className="font-display text-2xl font-semibold">{translateTitle(cap.desc || cap.name)}</span>
                  </h2>
                  <span className="shrink-0 text-sm text-muted-foreground tabular-nums">{c.xong}/{c.tong}</span>
                </div>

                <ul>
                  {cap.lessons.map((bai, k) => {
                    const xong = done.has(khoaBai(tech.id, cap.id, bai.id));
                    const oDay = gaHienTai?.cap === cap.id && gaHienTai.bai === bai.id;
                    const gaCuoi = i === capCuoi && k === cap.lessons.length - 1;
                    // Khuc tuyen cua hang: da qua ga nay thi dam ca khuc; dang o day thi dam nua tren
                    const khuc = (
                      <>
                        <span aria-hidden="true" className={cn('absolute top-0 left-[17px] w-1.5', mau, gaCuoi ? 'h-1/2' : 'bottom-0', !xong && !oDay && 'opacity-25')} />
                        {oDay && !gaCuoi && <span aria-hidden="true" className={cn('absolute top-1/2 bottom-0 left-[17px] w-1.5 opacity-25', mau)} />}
                      </>
                    );
                    // Hoc theo thu tu: bai chua toi luot hien khoa, khong vao duoc
                    if (!baiDaMo(tech, cap.id, bai.id, done)) {
                      return (
                        <li key={bai.id} className="relative py-1 pl-14">
                          {khuc}
                          <span aria-hidden="true" className="absolute top-1/2 left-[11px] size-[18px] -translate-y-1/2 rounded-full border-[3px] border-muted-foreground/40 bg-card" />
                          <div aria-disabled="true" title={t('lessonLockedHint')} className="kich-dong flex cursor-not-allowed items-center gap-3 px-3 py-2.5 text-muted-foreground/80">
                            <span className="min-w-0 flex-1">
                              <span>{translateTitle(bai.title)}</span>
                              <span className="sr-only"> {t('lessonLocked')}</span>
                            </span>
                            <Lock data-dong="khoa" className="size-4 shrink-0" aria-hidden="true" />
                          </div>
                        </li>
                      );
                    }
                    return (
                      <li key={bai.id} className="relative py-1 pl-14">
                        {khuc}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute top-1/2 -translate-y-1/2 rounded-full border-[3px]',
                            oDay ? 'left-[9px] size-[22px] border-foreground bg-signal'
                              : cn('left-[11px] size-[18px]', VIEN_CAP[cap.id], xong ? mau : 'bg-card')
                          )}
                        />
                        <Link to={`/lesson/${tech.id}/${cap.id}/${bai.id}`} aria-current={oDay ? 'step' : undefined}
                          className={cn('the-noi flex items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 hover:bg-card',
                            'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                            oDay && 'border-border bg-card font-semibold')}>
                          <span className="min-w-0 flex-1">
                            {translateTitle(bai.title)}
                            {xong && <span className="sr-only"> {t('statCompleted')}</span>}
                          </span>
                          {oDay && <span aria-hidden="true" className="shrink-0 rounded-full bg-signal px-2.5 py-0.5 text-xs font-semibold text-signal-foreground">{t('youAreHere')}</span>}
                          {xong && <Check className={cn('size-4 shrink-0', CHU_CAP[cap.id] ?? 'text-primary')} strokeWidth={3} aria-hidden="true" />}
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
