import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Lightbulb, Loader2, Sparkles } from 'lucide-react';
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
  /** Loi hien ngay duoi o: chua nhap hoac sai */
  const [loi, datLoi] = useState<string | null>(null);
  const oRef = useRef<HTMLInputElement>(null);

  function nop(e: FormEvent) {
    e.preventDefault();
    if (!nhap.trim()) {
      datLoi(t('emptyInputHint'));
      oRef.current?.focus();
      return;
    }
    if (khopDapAn(de.answer, nhap)) {
      datDaGiai(true);
      datLoi(null);
      toast.success(t('aiChallengeCorrect'));
    } else {
      datLoi(t('aiChallengeWrong'));
      oRef.current?.focus();
    }
  }

  return (
    <div className="space-y-3 rounded-2xl bg-background p-4">
      <p className="font-medium">{de.question}</p>
      {daGiai ? (
        <p role="status" className="inline-flex rounded-full bg-mint px-3 py-1 text-sm font-semibold text-mint-ink">{t('aiChallengeCorrect')}</p>
      ) : (
        <>
          <form onSubmit={nop} noValidate className="space-y-1.5">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input ref={oRef} name="answer" value={nhap} onChange={e => { datNhap(e.target.value); if (loi) datLoi(null); }}
                aria-label={t('aiChallengeAnswerLabel')} placeholder={t('aiChallengeAnswerLabel')}
                aria-invalid={!!loi || undefined} aria-describedby={loi ? 'dap-an-loi' : undefined}
                autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} className="font-mono" />
              <Button type="submit" className="shrink-0 rounded-full">{t('submitAnswerBtn')}</Button>
            </div>
            {loi && <p id="dap-an-loi" role="alert" className="text-sm text-destructive">{loi}</p>}
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
  usePageMeta({ title: `${t('challengeTitle')} | DevMaster Hub`, description: t('challengeSubtitle') });

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
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{t('challengeTitle')}</h1>
        <p className="text-muted-foreground">{t('challengeSubtitle')}</p>
      </header>

      <section aria-labelledby="de-ai" className="rounded-3xl bg-card p-5 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-lavender text-lavender-ink" aria-hidden="true"><Sparkles className="size-5" /></span>
            <div>
              <h2 id="de-ai" className="font-display text-lg font-extrabold tracking-tight">{t('aiChallengeTitle')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('aiChallengeHint')}</p>
            </div>
          </div>
          <Button className="rounded-full bg-signal text-signal-foreground hover:bg-signal hover:brightness-105" onClick={() => { void de.refetch(); }} disabled={dangRa}>
            {dangRa ? <Loader2 className="motion-safe:animate-spin" aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
            {t('aiChallengeBtn')}
          </Button>
        </div>
        {/* Vung bao luon co mat (rong khi khong ra de): chi doi chu */}
        <p className="text-sm text-lavender-ink not-empty:mt-4" aria-live="polite">{dangRa ? t('aiChallengeLoading') : ''}</p>
        {loi && <p role="alert" className="mt-4 rounded-2xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{loi}</p>}
        {de.data && !dangRa && (
          <article className="mt-5 space-y-3 border-t pt-5">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-xl font-extrabold tracking-tight">{de.data.title}</h3>
              {de.data.level && <span className="inline-flex items-center rounded-full bg-sky px-2.5 py-0.5 text-xs font-semibold text-sky-ink">{de.data.level}</span>}
            </div>
            {de.data.scenario && <p className="text-sm leading-relaxed">{de.data.scenario}</p>}
            {de.data.steps.length > 0 && (
              <ol className="list-decimal space-y-1 pl-5 text-sm">{de.data.steps.map(s => <li key={s}>{s}</li>)}</ol>
            )}
            {de.data.hint && (
              <p className="flex gap-3 rounded-2xl bg-butter p-4 text-sm leading-relaxed text-foreground">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-card text-butter-ink" aria-hidden="true"><Lightbulb className="size-4" /></span>
                <span className="self-center">{de.data.hint}</span>
              </p>
            )}
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
