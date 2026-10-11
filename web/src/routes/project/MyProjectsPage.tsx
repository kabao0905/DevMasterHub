// Du an da nop va ket qua AI cham. Tai mot lan qua react-query (ban cu tung goi Supabase lap vo han
// khi nguoi dung chua nop bai nao vi lay "danh sach rong" lam dieu kien tai).
import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { taiBaiNop, type BaiNop } from '@/lib/project-db';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { CodeBlock } from '@/components/CodeBlock';
import { LoadError } from '@/components/LoadError';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const mauDiem = (d: number | null) => (d == null ? 'text-muted-foreground' : d >= 80 ? 'text-emerald-400' : d >= 60 ? 'text-amber-300' : d >= 40 ? 'text-orange-400' : 'text-red-400');

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
        <h1 className="text-3xl font-bold tracking-tight">📁 {t('myProjectsTitle')}</h1>
        <p className="text-muted-foreground">{t('myProjectsSubtitle')}</p>
      </header>
      {q.isError ? <LoadError onRetry={() => { void q.refetch(); }} />
        : q.isPending ? <div className="space-y-3"><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
          : q.data.length === 0 ? (
            <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">📁 {t('noProjectsYet')}</p>
          ) : (
            <ul className="space-y-3">
              {q.data.map(p => (
                <li key={p.id}>
                  <Link to={`/my-projects/${encodeURIComponent(p.id)}`}
                    className="flex items-center gap-5 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-ring">
                    <span className={cn('shrink-0 font-mono text-3xl font-semibold', mauDiem(p.score_overall))}>
                      {p.score_overall ?? '?'}<span className="text-sm text-muted-foreground">/100</span>
                    </span>
                    <span className="min-w-0 space-y-1">
                      <span className="block truncate text-lg font-semibold">{p.project_name}</span>
                      {p.project_description && <span className="line-clamp-2 block text-sm text-muted-foreground">{p.project_description}</span>}
                      <span className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>📅 {p.submitted_at ? new Date(p.submitted_at).toLocaleDateString(lang) : ''}</span>
                        <span>🎯 {p.difficulty_level || 'N/A'}</span>
                        <span>💻 {p.languages_used.join(', ') || 'N/A'}</span>
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
  if (q.isPending) return <div className="mx-auto max-w-4xl space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-40" /></div>;
  if (!p) return <div className="mx-auto max-w-4xl space-y-6">{quayLai}<p className="rounded-2xl border bg-card p-8 text-center">{t('projectNotFound')}</p></div>;

  const diem: [string, number | null][] = [
    ['scoreOverall', p.score_overall], ['scoreCodeQuality', p.score_code_quality], ['scoreFunctionality', p.score_functionality],
    ['scoreBestPractices', p.score_best_practices], ['scoreCreativity', p.score_creativity]
  ];
  return (
    <article className="mx-auto max-w-4xl space-y-8">
      {quayLai}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{p.project_name}</h1>
        {p.project_description && <p className="text-muted-foreground">{p.project_description}</p>}
      </header>
      <ul aria-label={t('scoreOverall')} className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {diem.map(([khoa, d]) => (
          <li key={khoa} className="rounded-xl border bg-card p-4">
            <span className="block text-xs text-muted-foreground">{t(khoa)}</span>
            <span className={cn('font-mono text-2xl font-semibold', mauDiem(d))}>{d ?? '?'}</span>
          </li>
        ))}
      </ul>
      {p.ai_feedback && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">💬 {t('aiFeedbackTitle')}</h2>
          <div className="rounded-xl border bg-card p-4 text-sm leading-relaxed"><ChatMarkdown text={p.ai_feedback} /></div>
        </section>
      )}
      {p.ai_strengths.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t('strengths')}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">{p.ai_strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </section>
      )}
      {p.ai_improvements.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t('improvements')}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">{p.ai_improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </section>
      )}
      {p.files.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">📄 {t('projectCodeFiles')}</h2>
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
