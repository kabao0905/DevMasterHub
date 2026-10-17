import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { BookOpen, CircleCheck, Code2, Dumbbell, ListChecks, Lock } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { useBatDauHoc } from '@/lib/use-thoi-gian-hoc';
import { useCurriculumIndex, useTech, taiJson } from '@/lib/use-curriculum';
import { useProgress } from '@/lib/use-progress';
import { useEscape } from '@/lib/use-escape';
import { timCongNghe, viTriBai, type CongNgheTomTat } from '@/lib/curriculum';
import { baiCanHocTruoc, baiDaMo, type ViTriBai } from '@/lib/progress';
import { boThe, type TabBai } from '@/lib/ai';
import { LoadError } from '@/components/LoadError';
import { NotFoundPanel } from '@/components/NotFoundPanel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TheoryTab } from './TheoryTab';
import { CodeTab } from './CodeTab';
import { QuizTab } from './QuizTab';
import { TutorChat } from './TutorChat';
import { useQuizBai, type BaiDangMo } from './use-quiz-bai';
import { ExerciseTab } from './ExerciseTab';
import { codeDangLam, useBaiTap } from './use-bai-tap';
import { BienTuyen } from '@/components/BienTuyen';

export const TABS: TabBai[] = ['theory', 'code', 'quiz', 'exercise'];

// Tab bai hoc dang vien thuoc mem: tab dang mo la mang oai huong (dang hoc), che do toi cung vay
const LOP_TAB = cn(
  'shrink-0 snap-start rounded-full px-3 transition-colors',
  'data-active:bg-lavender data-active:text-lavender-ink data-active:shadow-none',
  'dark:data-active:border-transparent dark:data-active:bg-lavender dark:data-active:text-lavender-ink'
);

export function LessonPage() {
  const { tech: techId = '', level: levelId = '', lesson: lessonId = '' } = useParams();
  const { t } = useT();
  const navigate = useNavigate();
  const ds = useCurriculumIndex();
  const coTech = ds.data ? timCongNghe(ds.data, techId) : undefined;
  const tech = useTech(coTech ? techId : undefined);
  const vt = tech.data ? viTriBai(tech.data, levelId, lessonId) : null;
  const { done, loading: dangTaiTienDo } = useProgress();

  useEscape(() => navigate(coTech ? `/roadmap/${coTech.id}` : '/'));
  useBatDauHoc(coTech?.id ?? '', lessonId);

  const ten = vt && tech.data ? `${vt.lesson.title} — ${tech.data.name} | DevMaster Hub` : `${t('pageNotFound')} | DevMaster Hub`;
  const lyThuyet = boThe(vt?.lesson.theory);
  usePageMeta({
    title: ten,
    description: vt ? (lyThuyet ? lyThuyet.slice(0, 155).trim() + '…' : `Học bài “${vt.lesson.title}” trong lộ trình ${tech.data?.name} (${vt.level.name}) cùng ví dụ code và bài tập thực hành.`) : undefined,
    url: vt ? `${window.location.origin}/lesson/${techId}/${levelId}/${lessonId}` : undefined
  });

  if (ds.isError) return <LoadError onRetry={() => ds.refetch()} />;
  if (ds.isLoading) return <Skeleton className="h-96 w-full rounded-lg" />;
  if (!coTech) return <NotFoundPanel />;
  if (tech.isError) return <LoadError onRetry={() => tech.refetch()} />;
  if (!tech.data) return <Skeleton className="h-96 w-full rounded-lg" />;
  if (!vt) return <NotFoundPanel ve={`/roadmap/${coTech.id}`} nhanVe={coTech.name} />;
  // Hoc theo thu tu: chua xong bai truoc thi chi hien bang khoa (dang tai tien do that thi cho, khong chop noi dung)
  if (!baiDaMo(tech.data, levelId, lessonId, done)) {
    const truoc = baiCanHocTruoc(tech.data, levelId, lessonId);
    if (dangTaiTienDo || !truoc) return <Skeleton className="h-96 w-full rounded-lg" />;
    return <BaiBiKhoa tech={tech.data} truoc={truoc} />;
  }

  return <NoiDungBai key={`${techId}.${levelId}.${lessonId}`} bai={{ tech: tech.data, level: vt.level, lesson: vt.lesson }} truoc={vt.truoc} sau={vt.sau} />;
}

type LanCan = { level: { id: string }; lesson: { id: string; title: string } } | null;

function NoiDungBai({ bai, truoc, sau }: { bai: BaiDangMo; truoc: LanCan; sau: LanCan }) {
  const { t, translateTitle } = useT();
  const { tech, level, lesson } = bai;
  const [params, datParams] = useSearchParams();
  const thamSoTab = params.get('tab') as TabBai | null;
  const tab: TabBai = thamSoTab && TABS.includes(thamSoTab) ? thamSoTab : 'theory';
  const { isDone, loading } = useProgress();
  const xong = isDone(tech.id, level.id, lesson.id);
  const quizBai = useQuizBai(bai);
  const baiTap = useBaiTap(bai);
  // Tab Bai tap (IDE, terminal) chi dung khi mo lan dau, roi giu nguyen khi doi tab: khong mat code dang go
  const [daMoBaiTap, datDaMoBaiTap] = useState(tab === 'exercise');
  useEffect(() => { if (tab === 'exercise') datDaMoBaiTap(true); }, [tab]);
  const { data: suc } = useQuery({ queryKey: ['health'], queryFn: () => taiJson<{ aiEnabled: boolean }>('/api/health'), staleTime: 5 * 60_000 });

  function doiTab(v: string) {
    // Thay URL (khong them lich su, khong cuon len dau): Back van ve trang truoc, link chia se mo dung tab
    datParams(p => {
      if (v === 'theory') p.delete('tab'); else p.set('tab', v);
      return p;
    }, { replace: true, preventScrollReset: true });
  }

  const duongDan = (x: NonNullable<LanCan>) => `/lesson/${tech.id}/${x.level.id}/${x.lesson.id}`;

  return (
    // Tab Bai tap (IDE chia doi, terminal) can rong hon khung doc ly thuyet
    <article className={cn('mx-auto space-y-8', tab === 'exercise' ? 'max-w-6xl' : 'max-w-3xl')}>
      <nav aria-label="breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li><Link to="/" className="hover:text-foreground">{t('dashboard')}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to={`/roadmap/${tech.id}`} className="inline-flex items-center gap-1.5 hover:text-foreground"><BienTuyen tech={tech} co="nho" /> {tech.name}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to={`/roadmap/${tech.id}/${level.id}`} className="hover:text-foreground">{level.name}</Link></li>
        </ol>
      </nav>

      <header className="space-y-4">
        <h1 className="font-display text-3xl leading-tight font-extrabold tracking-tight text-balance break-words sm:text-4xl">{translateTitle(lesson.title)}</h1>
        {/* Khong co nut tu tich: bai chi duoc tich khi lam DAT bai tap (AI cham Dung / xong lab) */}
        {xong ? (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-sm font-semibold text-mint-ink"><CircleCheck className="size-4" aria-hidden="true" />{t('completed')}</p>
        ) : (
          <Button variant="outline" className="rounded-full" disabled={loading} onClick={() => doiTab('exercise')}>
            <Dumbbell aria-hidden="true" /> {t('completeByExercise')}
          </Button>
        )}
      </header>

      <Tabs value={tab} onValueChange={doiTab}>
        {/* Dien thoai: 4 tab tren mot hang rong ~530px > 375px -> mot hang cuon ngang (an thanh cuon, bat diem tung tab), nhan khong bao gio xuong dong */}
        <TabsList className="flex w-full max-w-full snap-x snap-proximity justify-start gap-1 overflow-x-auto rounded-full bg-card p-1 shadow-soft [scrollbar-width:none] group-data-horizontal/tabs:h-11 sm:w-fit [&::-webkit-scrollbar]:hidden">
          <TabsTrigger value="theory" className={LOP_TAB}><BookOpen aria-hidden="true" /> {t('tabTheory')}</TabsTrigger>
          <TabsTrigger value="code" className={LOP_TAB}><Code2 aria-hidden="true" /> {t('tabCode')}</TabsTrigger>
          <TabsTrigger value="quiz" className={LOP_TAB}><ListChecks aria-hidden="true" /> {t('tabQuiz')}</TabsTrigger>
          <TabsTrigger value="exercise" className={LOP_TAB}><Dumbbell aria-hidden="true" /> {t('tabExercise')}</TabsTrigger>
        </TabsList>
        <TabsContent value="theory" className="pt-6"><TheoryTab lesson={lesson} /></TabsContent>
        <TabsContent value="code" className="pt-6"><CodeTab lesson={lesson} /></TabsContent>
        <TabsContent value="quiz" className="pt-6"><QuizTab lesson={lesson} quizBai={quizBai} aiEnabled={suc?.aiEnabled} /></TabsContent>
        {daMoBaiTap && (
          <TabsContent value="exercise" forceMount hidden={tab !== 'exercise'} className="pt-6">
            <ExerciseTab bai={bai} baiTap={baiTap} aiEnabled={suc?.aiEnabled} />
          </TabsContent>
        )}
      </Tabs>

      <TutorChat bai={bai} tab={tab} quiz={quizBai.quiz} baiTap={{ hienTai: baiTap.deChoGiaSu, code: codeDangLam(baiTap.kho) }} />

      <nav aria-label={`${t('prevLesson')} / ${t('nextLesson')}`} className="grid gap-3 sm:grid-cols-2">
        {truoc ? (
          <Link to={duongDan(truoc)} className="the-noi rounded-2xl bg-card p-4 shadow-soft">
            <span className="block text-xs text-muted-foreground">{t('prevLesson')}</span>
            <span className="mt-1 block font-medium">{translateTitle(truoc.lesson.title)}</span>
          </Link>
        ) : <span aria-hidden="true" />}
        {sau && (xong ? (
          <Link to={duongDan(sau)} className="the-noi rounded-2xl bg-card p-4 text-right shadow-soft">
            <span className="block text-xs text-muted-foreground">{t('nextLesson')}</span>
            <span className="mt-1 block font-medium">{translateTitle(sau.lesson.title)}</span>
          </Link>
        ) : (
          // Hoc theo thu tu: bai tiep theo chi mo khi lam dat bai tap cua bai nay
          <div aria-disabled="true" className="rounded-2xl bg-muted p-4 text-right text-muted-foreground">
            <span className="flex items-center justify-end gap-1.5 text-xs"><Lock className="size-3.5" aria-hidden="true" /> {t('nextLesson')}</span>
            <span className="mt-1 block font-medium">{translateTitle(sau.lesson.title)}</span>
            <span className="mt-1 block text-xs">{t('nextLessonLockedHint')}</span>
          </div>
        ))}
      </nav>
    </article>
  );
}

/** Bai chua toi luot: chi duong ve bai can hoc truoc */
function BaiBiKhoa({ tech, truoc }: { tech: CongNgheTomTat; truoc: ViTriBai }) {
  const { t, translateTitle } = useT();
  return (
    <section className="mx-auto max-w-xl rounded-3xl bg-card p-8 text-center shadow-soft">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-butter text-butter-ink" aria-hidden="true">
        <Lock className="size-7" />
      </span>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-balance">{t('lessonLockedTitle')}</h1>
      <p className="mt-2 text-muted-foreground">{t('lessonLockedHint')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full">
          <Link to={`/lesson/${tech.id}/${truoc.level.id}/${truoc.lesson.id}`}>{t('lessonLockedGoTo', { title: translateTitle(truoc.lesson.title) })}</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link to={`/roadmap/${tech.id}`}>{tech.name}</Link>
        </Button>
      </div>
    </section>
  );
}
