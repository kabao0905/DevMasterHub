import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { khopDapAn, taoThuThach, type ThuThachAi } from '@/lib/ai';
import { createTerminal, type MayTerminal } from '@/lib/terminal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Terminal } from '@/components/tools/Terminal';
import { CtfPanel } from '@/components/tools/CtfPanel';
import { useTerminalBenVung } from '@/components/tools/use-terminal';

// Lenh co ket qua dang de ra de: tien trinh, cong dang mo, quet mang, nguoi dung
const LENH_CHUP = ['ps aux', 'netstat -tulpn', 'nmap 192.168.1.100', 'whoami', 'id', 'last'];
const boMaMau = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, '');

/** Du lieu that cua may dang choi (tep hien tai + ket qua lenh) de AI ra de giai duoc */
function chupMay(may: MayTerminal) {
  const fs = may.getFs();
  const tep = Object.fromEntries(Object.entries(fs).flatMap(([duong, nut]) => (nut.type === 'file' ? [[duong, nut.content]] : [])));
  // Chay lenh tren ban sao: khong chen dong nao vao man hinh / lich su lenh cua hoc vien
  const tam = createTerminal();
  tam.loadFs(fs);
  const dauRa = Object.fromEntries(LENH_CHUP.map(l => [l, boMaMau(tam.executeCommand(l)).trim()]));
  return { lenh: may.commandNames(), tep, dauRa };
}

/** Cau hoi cua de AI + o nop dap an; bi thi xem dap an */
function KhungDapAn({ de }: { de: ThuThachAi }) {
  const { t } = useT();
  const [nhap, datNhap] = useState('');
  const [daGiai, datDaGiai] = useState(false);

  function nop(e: FormEvent) {
    e.preventDefault();
    if (!nhap.trim()) return;
    if (khopDapAn(de.answer, nhap)) {
      datDaGiai(true);
      toast.success(t('aiChallengeCorrect'));
    } else {
      toast.error(t('aiChallengeWrong'));
    }
  }

  return (
    <div className="space-y-3 rounded-xl border bg-background/50 p-4">
      <p className="font-medium">❓ {de.question}</p>
      {daGiai ? (
        <p role="status" className="font-medium text-level-newbie">{t('aiChallengeCorrect')}</p>
      ) : (
        <>
          <form onSubmit={nop} className="flex flex-col gap-2 sm:flex-row">
            <Input value={nhap} onChange={e => datNhap(e.target.value)} aria-label={t('aiChallengeAnswerLabel')} placeholder={t('aiChallengeAnswerLabel')}
              autoCapitalize="off" autoCorrect="off" spellCheck={false} className="font-mono" />
            <Button type="submit" className="shrink-0">{t('submitAnswerBtn')}</Button>
          </form>
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground">{t('showAnswerBtn')}</summary>
            <code className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 font-mono">{de.answer}</code>
          </details>
        </>
      )}
    </div>
  );
}

/** Thu thach Linux & An ninh mang: terminal gia lap, bang co CTF va de do AI ra */
export function ChallengePage() {
  const { t, lang } = useT();
  const { client, user } = useAuth();
  // Diem, co da giai va de AI giu qua cac lan roi trang roi quay lai (ban cu giu ca phien trang)
  const kenh = useTerminalBenVung(['challenge', user?.id, 'may']);
  usePageMeta({ title: `${t('challengeTitle').replace(/^\S+\s/u, '')} | DevMaster Hub`, description: t('challengeSubtitle') });

  // De dua tren lenh, noi dung tep va ket qua lenh co that trong terminal nay (truoc kia AI bia du lieu -> khong giai duoc)
  const de = useQuery({
    queryKey: ['challenge', user?.id, 'de'],
    queryFn: async ({ signal }) => {
      const deMoi = await taoThuThach(client, { ...chupMay(kenh.may), lang, signal });
      // Dung hien truong: ghi tep AI tao vao chinh may hoc vien dang go (tu tao thu muc cha)
      for (const f of deMoi.files) kenh.may.luuTuSoanThao(f.path, f.content);
      return deMoi;
    },
    enabled: false,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false
  });
  const dangRa = de.isFetching;
  const loi = de.error instanceof Error && !dangRa ? (/không hợp lệ/.test(de.error.message) ? t('aiChallengeBad') : de.error.message) : null;

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
          <Button className="bg-brand text-white hover:brightness-110" onClick={() => { void de.refetch(); }} disabled={dangRa}>
            {dangRa ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
            {t('aiChallengeBtn')}
          </Button>
        </div>
        {dangRa && <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">{t('aiChallengeLoading')}</p>}
        {loi && <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm">{loi}</p>}
        {de.data && !dangRa && (
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
            {de.data.files.length > 0 && (
              <p className="text-sm text-muted-foreground">{t('aiChallengeFilesAdded', { n: de.data.files.length })}</p>
            )}
            {/* key: de moi thi o nop dap an trong lai */}
            {de.data.question && de.data.answer && <KhungDapAn key={de.dataUpdatedAt} de={de.data} />}
          </article>
        )}
      </section>

      <div className="space-y-6">
        <section aria-label="Terminal"><Terminal kenh={kenh} /></section>
        <CtfPanel kenh={kenh} />
      </div>
    </div>
  );
}
