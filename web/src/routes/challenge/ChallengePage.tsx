import { Link } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { taoThuThach } from '@/lib/ai';
import { Button } from '@/components/ui/button';
import { Terminal } from '@/components/tools/Terminal';
import { CtfPanel } from '@/components/tools/CtfPanel';
import { useTerminal } from '@/components/tools/use-terminal';

/** Thu thach Linux & An ninh mang: terminal gia lap, bang co CTF va de do AI ra */
export function ChallengePage() {
  const { t, lang } = useT();
  const { client } = useAuth();
  const kenh = useTerminal();
  usePageMeta({ title: `${t('challengeTitle').replace(/^\S+\s/u, '')} | DevMaster Hub`, description: t('challengeSubtitle') });

  // De chi duoc dung lenh va tep co that trong terminal nay (truoc kia AI ra de can chmod, ss...)
  const de = useMutation({ mutationFn: () => taoThuThach(client, { lenh: kenh.may.commandNames(), tep: kenh.may.filePaths(), lang }) });
  const loi = de.error instanceof Error ? (/không hợp lệ/.test(de.error.message) ? t('aiChallengeBad') : de.error.message) : null;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link to="/roadmap/cybersecurity" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> {t('back')}
      </Link>
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('challengeTitle')}</h1>
        <p className="text-muted-foreground">{t('challengeSubtitle')}</p>
      </header>

      <section aria-labelledby="de-ai" className="rounded-2xl border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id="de-ai" className="font-semibold">{t('aiChallengeTitle')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('aiChallengeHint')}</p>
          </div>
          <Button className="bg-brand text-white hover:opacity-90" onClick={() => de.mutate()} disabled={de.isPending}>
            {de.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
            {t('aiChallengeBtn')}
          </Button>
        </div>
        {de.isPending && <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">{t('aiChallengeLoading')}</p>}
        {loi && !de.isPending && <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm">{loi}</p>}
        {de.data && !de.isPending && (
          <article className="mt-5 space-y-3 border-t pt-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-lg font-semibold">{de.data.title}</h3>
              {de.data.level && <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">{de.data.level}</span>}
            </div>
            {de.data.scenario && <p className="text-sm leading-relaxed">{de.data.scenario}</p>}
            {de.data.steps.length > 0 && (
              <ol className="list-decimal space-y-1 pl-5 text-sm">{de.data.steps.map(s => <li key={s}>{s}</li>)}</ol>
            )}
            {de.data.hint && <p className="text-sm text-muted-foreground">💡 {de.data.hint}</p>}
          </article>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Terminal kenh={kenh} />
        <CtfPanel kenh={kenh} />
      </div>
    </div>
  );
}
