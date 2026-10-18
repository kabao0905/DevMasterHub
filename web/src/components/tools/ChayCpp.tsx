import { useEffect, useRef, useState } from 'react';
import { Loader2, Play } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { chayCpp, type KetQuaChay } from '@/lib/chay-cpp';
import { Button } from '@/components/ui/button';

const lopKhung = 'max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-code p-4 font-mono text-xs text-[#e6edf3] shadow-soft';
const lopLoi = 'text-[#ff7b72]';

export function ChayCpp({ code, stdinMacDinh = '', idO }: { code: string; stdinMacDinh?: string; idO?: string }) {
  const { t } = useT();
  const { client } = useAuth();
  const [stdin, datStdin] = useState(stdinMacDinh);
  const [moStdin, datMoStdin] = useState(!!stdinMacDinh);
  const [dangChay, datDangChay] = useState(false);
  const [kq, datKq] = useState<KetQuaChay | null>(null);
  const [loi, datLoi] = useState('');
  const [nhacTrong, datNhacTrong] = useState(false);
  const huyRef = useRef<AbortController | null>(null);
  useEffect(() => () => huyRef.current?.abort(), []);

  async function chay() {
    if (dangChay) return;
    if (!code.trim()) {
      datNhacTrong(true);
      if (idO) document.getElementById(idO)?.focus();
      return;
    }
    datNhacTrong(false);
    huyRef.current?.abort();
    const huy = new AbortController();
    huyRef.current = huy;
    datDangChay(true);
    datLoi('');
    datKq(null);
    try {
      const ra = await chayCpp(client, code, stdin, huy.signal);
      if (!huy.signal.aborted) datKq(ra);
    } catch (e) {
      if (!huy.signal.aborted) datLoi(e instanceof Error ? e.message : String(e));
    } finally {
      if (!huy.signal.aborted) datDangChay(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" className="rounded-full" onClick={() => { void chay(); }} disabled={dangChay}>
          {dangChay ? <><Loader2 className="motion-safe:animate-spin" aria-hidden="true" /> {t('runningCode')}</> : <><Play aria-hidden="true" /> {t('runCode')}</>}
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground" aria-expanded={moStdin} onClick={() => datMoStdin(v => !v)}>
          {t('stdinLabel')}
        </Button>
      </div>
      <p role="alert" className="text-sm text-destructive empty:hidden">{nhacTrong && !code.trim() ? t('emptyCodeHint') : ''}</p>
      {moStdin && (
        <textarea value={stdin} onChange={e => datStdin(e.target.value)} aria-label={t('stdinLabel')} rows={3} spellCheck={false}
          autoCapitalize="off" autoCorrect="off" translate="no"
          className="w-full rounded-2xl border bg-background p-3 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      )}
      {loi && <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{t('runFailed', { error: loi })}</p>}
      <section aria-live="polite" className="space-y-1 empty:hidden">
        {kq && 'bienDichLoi' in kq && (
          <>
            <h3 className="text-sm font-semibold text-destructive">{t('compileError')}</h3>
            <pre translate="no" className={`${lopKhung} ${lopLoi}`}>{kq.bienDichLoi}</pre>
          </>
        )}
        {kq && !('bienDichLoi' in kq) && (
          <>
            <h3 className="text-sm font-semibold">{t('programOutput')}</h3>
            <pre translate="no" className={lopKhung}>{kq.stdout || t('noOutput')}</pre>
            {kq.stderr && <pre translate="no" className={`${lopKhung} ${lopLoi}`}>{kq.stderr}</pre>}
            <p className="text-xs text-muted-foreground tabular-nums">{t('exitCode', { n: kq.maThoat })}</p>
          </>
        )}
      </section>
    </div>
  );
}
