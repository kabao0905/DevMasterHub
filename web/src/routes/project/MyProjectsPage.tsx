// Du an da nop va ket qua AI cham. Tai mot lan qua react-query (ban cu tung goi Supabase lap vo han
// khi nguoi dung chua nop bai nao vi lay "danh sach rong" lam dieu kien tai).
import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CalendarDays, Code, Target } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { taiBaiNop, type BaiNop } from '@/lib/project-db';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { CodeBlock } from '@/components/CodeBlock';
import { LoadError } from '@/components/LoadError';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CHIP_DIEM, mucDiem } from './mau-diem';

function useBaiNop() {
  const { client, user } = useAuth();
  const uid = user?.id;
  return useQuery({ queryKey: ['submissions', uid], enabled: !!uid, queryFn: () => taiBaiNop(client, uid!) });
}

export function MyProjectsPage() {
  const { id } = useParams();
  return id ? <ChiTietDuAn id={id} /> : <DanhSachDuAn />;
}

function DanhSachDuAn() {
  const { t, lang } = useT();
  const q = useBaiNop();
  usePageMeta({ title: `${t('myProjectsTitle')} | DevMaster Hub`, description: t('myProjectsSubtitle') });

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance">{t('myProjectsTitle')}</h1>
        <p className="text-muted-foreground">{t('myProjectsSubtitle')}</p>
      </header>
      {q.isError ? <LoadError onRetry={() => { void q.refetch(); }} />
        : q.isPending ? <div className="space-y-3"><Skeleton className="h-24 rounded-3xl" /><Skeleton className="h-24 rounded-3xl" /></div>
          : q.data.length === 0 ? (
            <p className="rounded-3xl bg-card p-8 text-center text-muted-foreground shadow-soft">{t('noProjectsYet')}</p>
          ) : (
            <ul className="space-y-3">
              {q.data.map(p => (
                <li key={p.id}>
                  <Link to={`/my-projects/${encodeURIComponent(p.id)}`}
                    className="the-noi flex items-center gap-5 rounded-3xl bg-card p-5 shadow-soft focus-visible:outline-2 focus-visible:outline-ring">
                    <span className={cn('grid size-20 shrink-0 place-items-center content-center rounded-2xl font-mono', CHIP_DIEM[mucDiem(p.score_overall)])}>
                      <span className="text-3xl font-bold leading-none">{p.score_overall ?? '?'}</span>
                      <span className="text-xs">/100</span>
                    </span>
                    <span className="min-w-0 space-y-1">
                      <span className="block truncate font-display text-lg font-extrabold">{p.project_name}</span>
                      {p.project_description && <span className="line-clamp-2 block text-sm text-muted-foreground">{p.project_description}</span>}
                      <span className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" aria-hidden="true" />{p.submitted_at ? new Date(p.submitted_at).toLocaleDateString(lang) : ''}</span>
                        <span className="inline-flex items-center gap-1"><Target className="size-3.5" aria-hidden="true" />{p.difficulty_level || t('notAvailable')}</span>
                        <span className="inline-flex items-center gap-1"><Code className="size-3.5" aria-hidden="true" />{p.languages_used.join(', ') || t('notAvailable')}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
    </div>
  );
}

function ChiTietDuAn({ id }: { id: string }) {
  const { t } = useT();
  const q = useBaiNop();
  const p: BaiNop | undefined = q.data?.find(x => x.id === id);
  usePageMeta({ title: `${p?.project_name || t('myProjectsTitle')} | DevMaster Hub` });

  const quayLai = (
    <Link to="/my-projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="size-4" aria-hidden="true" /> {t('back')}
    </Link>
  );
  if (q.isError) return <div className="mx-auto max-w-4xl space-y-6">{quayLai}<LoadError onRetry={() => { void q.refetch(); }} /></div>;
  if (q.isPending) return <div className="mx-auto max-w-4xl space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-40 rounded-3xl" /></div>;
  if (!p) return <div className="mx-auto max-w-4xl space-y-6">{quayLai}<p className="rounded-3xl bg-card p-8 text-center shadow-soft">{t('projectNotFound')}</p></div>;

  const diem: [string, number | null][] = [
    ['scoreOverall', p.score_overall], ['scoreCodeQuality', p.score_code_quality], ['scoreFunctionality', p.score_functionality],
    ['scoreBestPractices', p.score_best_practices], ['scoreCreativity', p.score_creativity]
  ];
  const tieuDeMuc = 'font-display text-lg font-extrabold tracking-tight';
  return (
    <article className="mx-auto max-w-4xl space-y-8">
      {quayLai}
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance break-words sm:text-4xl">{p.project_name}</h1>
        {p.project_description && <p className="text-muted-foreground">{p.project_description}</p>}
      </header>
      <ul aria-label={t('reviewScoresLabel')} className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {diem.map(([khoa, d]) => (
          <li key={khoa} className={cn('space-y-1 rounded-2xl p-4', CHIP_DIEM[mucDiem(d)])}>
            <span className="block text-xs font-semibold">{t(khoa)}</span>
            <span className="font-mono text-2xl font-bold">{d ?? '?'}</span>
          </li>
        ))}
      </ul>
      {p.ai_feedback && (
        <section className="space-y-2">
          <h2 className={tieuDeMuc}>{t('aiFeedbackTitle')}</h2>
          <div className="rounded-3xl bg-card p-5 text-sm leading-relaxed shadow-soft"><ChatMarkdown text={p.ai_feedback} /></div>
        </section>
      )}
      {p.ai_strengths.length > 0 && (
        <section className="space-y-2 rounded-3xl bg-mint p-5 text-foreground">
          <h2 className={cn(tieuDeMuc, 'text-mint-ink')}>{t('strengths')}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">{p.ai_strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </section>
      )}
      {p.ai_improvements.length > 0 && (
        <section className="space-y-2 rounded-3xl bg-butter p-5 text-foreground">
          <h2 className={cn(tieuDeMuc, 'text-butter-ink')}>{t('improvements')}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">{p.ai_improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </section>
      )}
      {p.files.length > 0 && (
        <section className="space-y-3">
          <h2 className={tieuDeMuc}>{t('projectCodeFiles')}</h2>
          {p.files.map((f, i) => (
            <div key={i} className="space-y-1.5">
              <p className="flex items-baseline gap-2 font-mono text-sm"><span>{f.name}</span><span className="text-xs text-muted-foreground">{f.lang || 'text'}</span></p>
              <CodeBlock code={f.code} lang={f.lang || undefined} />
            </div>
          ))}
        </section>
      )}
    </article>
  );
}
