import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { BookOpen, Code2, Dumbbell, ListChecks } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { useBatDauHoc } from '@/lib/use-thoi-gian-hoc';
import { useCurriculumIndex, useTech, taiJson } from '@/lib/use-curriculum';
import { useProgress } from '@/lib/use-progress';
import { useEscape } from '@/lib/use-escape';
import { timCongNghe, viTriBai } from '@/lib/curriculum';
import { boThe, type TabBai } from '@/lib/ai';
import { CHU_CAP, NEN_CAP } from '@/components/LevelLadder';
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

export const TABS: TabBai[] = ['theory', 'code', 'quiz', 'exercise'];

export function LessonPage() {
  const { tech: techId = '', level: levelId = '', lesson: lessonId = '' } = useParams();
  const { t } = useT();
  const navigate = useNavigate();
  const ds = useCurriculumIndex();
  const coTech = ds.data ? timCongNghe(ds.data, techId) : undefined;
  const tech = useTech(coTech ? techId : undefined);
  const vt = tech.data ? viTriBai(tech.data, levelId, lessonId) : null;

  useEscape(() => navigate(coTech ? `/roadmap/${coTech.id}` : '/'));
  useBatDauHoc(coTech?.id ?? '', lessonId);

  const ten = vt && tech.data ? `${vt.lesson.title} — ${tech.data.name} | DevMaster Hub` : `${t('pageNotFound')} | DevMaster Hub`;
  const lyThuyet = boThe(vt?.lesson.theory);
  usePageMeta({
    title: ten,
    description: vt ? (lyThuyet ? lyThuyet.slice(0, 155).trim() + '…' : `Học bài "${vt.lesson.title}" trong lộ trình ${tech.data?.name} (${vt.level.name}) cùng ví dụ code và bài tập thực hành.`) : undefined,
    url: vt ? `${window.location.origin}/lesson/${techId}/${levelId}/${lessonId}` : undefined
  });

  if (ds.isError) return <LoadError onRetry={() => ds.refetch()} />;
  if (ds.isLoading) return <Skeleton className="h-96 w-full rounded-2xl" />;
  if (!coTech) return <NotFoundPanel />;
  if (tech.isError) return <LoadError onRetry={() => tech.refetch()} />;
  if (!tech.data) return <Skeleton className="h-96 w-full rounded-2xl" />;
  if (!vt) return <NotFoundPanel ve={`/roadmap/${coTech.id}`} nhanVe={coTech.name} />;

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
          <li><Link to={`/roadmap/${tech.id}`} className="hover:text-foreground"><span aria-hidden="true">{tech.icon}</span> {tech.name}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to={`/roadmap/${tech.id}/${level.id}`} className="hover:text-foreground">{level.name}</Link></li>
        </ol>
      </nav>

      <header className="space-y-4">
        <span className={cn('inline-block rounded-md px-2 py-0.5 text-sm font-semibold', NEN_CAP[level.id] ?? 'bg-primary/15', CHU_CAP[level.id] ?? 'text-primary')}>
          {level.name}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-balance">{translateTitle(lesson.title)}</h1>
        {/* Khong co nut tu tich: bai chi duoc tich khi lam DAT bai tap (AI cham Dung / xong lab) */}
        {xong ? (
          <p className="inline-flex rounded-lg border border-level-newbie/40 bg-level-newbie/10 px-3 py-1.5 text-sm font-medium text-level-newbie">{t('completed')}</p>
        ) : (
          <Button variant="outline" disabled={loading} onClick={() => doiTab('exercise')}>
            <Dumbbell aria-hidden="true" /> {t('completeByExercise')}
          </Button>
        )}
      </header>

      <Tabs value={tab} onValueChange={doiTab}>
        {/* Dien thoai: 4 tab tren mot hang rong ~530px, tran man 375px va cat mat tab dau/cuoi -> luoi 2x2 */}
        <TabsList className="grid w-full grid-cols-2 gap-1 group-data-horizontal/tabs:h-auto sm:inline-flex sm:w-auto sm:gap-0 sm:group-data-horizontal/tabs:h-8">
          <TabsTrigger value="theory" className="min-h-9 whitespace-normal text-center leading-tight sm:min-h-0 sm:whitespace-nowrap"><BookOpen aria-hidden="true" /> {t('tabTheory')}</TabsTrigger>
          <TabsTrigger value="code" className="min-h-9 whitespace-normal text-center leading-tight sm:min-h-0 sm:whitespace-nowrap"><Code2 aria-hidden="true" /> {t('tabCode')}</TabsTrigger>
          <TabsTrigger value="quiz" className="min-h-9 whitespace-normal text-center leading-tight sm:min-h-0 sm:whitespace-nowrap"><ListChecks aria-hidden="true" /> {t('tabQuiz')}</TabsTrigger>
          <TabsTrigger value="exercise" className="min-h-9 whitespace-normal text-center leading-tight sm:min-h-0 sm:whitespace-nowrap"><Dumbbell aria-hidden="true" /> {t('tabExercise')}</TabsTrigger>
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
          <Link to={duongDan(truoc)} className="rounded-xl border p-4 transition-colors hover:bg-accent/40">
            <span className="block text-xs text-muted-foreground">{t('prevLesson')}</span>
            <span className="mt-1 block font-medium">{translateTitle(truoc.lesson.title)}</span>
          </Link>
        ) : <span aria-hidden="true" />}
        {sau && (
          <Link to={duongDan(sau)} className="rounded-xl border p-4 text-right transition-colors hover:bg-accent/40">
            <span className="block text-xs text-muted-foreground">{t('nextLesson')}</span>
            <span className="mt-1 block font-medium">{translateTitle(sau.lesson.title)}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
