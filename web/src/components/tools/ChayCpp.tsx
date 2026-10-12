// Nut "Chay Code" cho bai C++: gui code (va stdin tuy chon) len server, hien ket qua hoac loi bien dich.
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { chayCpp, type KetQuaChay } from '@/lib/chay-cpp';
import { Button } from '@/components/ui/button';

const lopKhung = 'max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border bg-code p-3 font-mono text-xs';

export function ChayCpp({ code, stdinMacDinh = '' }: { code: string; stdinMacDinh?: string }) {
  const { t } = useT();
  const { client } = useAuth();
  const [stdin, datStdin] = useState(stdinMacDinh);
  const [moStdin, datMoStdin] = useState(!!stdinMacDinh);
  const [dangChay, datDangChay] = useState(false);
  const [kq, datKq] = useState<KetQuaChay | null>(null);
  const [loi, datLoi] = useState('');
  const huyRef = useRef<AbortController | null>(null);
  // Roi trang / doi bai khi dang chay: bo ket qua ve muon
  useEffect(() => () => huyRef.current?.abort(), []);

  async function chay() {
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
        <Button variant="outline" onClick={() => { void chay(); }} disabled={!code.trim() || dangChay}>
          {dangChay ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t('runningCode')}</> : t('runCode')}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground" aria-expanded={moStdin} onClick={() => datMoStdin(v => !v)}>
          {t('stdinLabel')}
        </Button>
      </div>
      {moStdin && (
        <textarea value={stdin} onChange={e => datStdin(e.target.value)} aria-label={t('stdinLabel')} rows={3} spellCheck={false}
          className="w-full rounded-lg border bg-background p-3 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      )}
      {loi && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm">{t('runFailed', { error: loi })}</p>}
      {kq && 'bienDichLoi' in kq && (
        <section aria-live="polite" className="space-y-1">
          <h3 className="text-sm font-medium text-destructive">{t('compileError')}</h3>
          <pre className={`${lopKhung} text-destructive`}>{kq.bienDichLoi}</pre>
        </section>
      )}
      {kq && !('bienDichLoi' in kq) && (
        <section aria-live="polite" className="space-y-1">
          <h3 className="text-sm font-medium">{t('programOutput')}</h3>
          <pre className={lopKhung}>{kq.stdout || t('noOutput')}</pre>
          {kq.stderr && <pre className={`${lopKhung} text-destructive`}>{kq.stderr}</pre>}
          <p className="text-xs text-muted-foreground tabular-nums">{t('exitCode', { n: kq.maThoat })}</p>
        </section>
      )}
    </div>
  );
}
