import { useEffect, useRef, useState } from 'react';
import { Info, Loader2, Play } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { canhBaoChay, chayCode, daTaiTrinhDuyet, ngonNguChay, type KetQuaChay } from '@/lib/chay-code';
import { Button } from '@/components/ui/button';

const lopKhung = 'max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-code p-4 font-mono text-xs text-[#e6edf3] shadow-soft';
const lopLoi = 'text-[#ff7b72]';
const CHO_DU_LIEU = /EOFError|NoSuchElementException|InputMismatchException|unexpected end of (?:file|input)|end of file|EOF when reading/i;

export function ChayCode({ lang, code, stdinMacDinh = '', idO, nhacCanhBao = false }: {
  lang: string;
  code: string;
  stdinMacDinh?: string;
  idO?: string;
  nhacCanhBao?: boolean;
}) {
  const { t } = useT();
  const { client } = useAuth();
  const ngonNgu = ngonNguChay(lang);
  const [stdin, datStdin] = useState(stdinMacDinh);
  const [moStdin, datMoStdin] = useState(!!stdinMacDinh);
  const [dangChay, datDangChay] = useState<'' | 'tai' | 'chay'>('');
  const [kq, datKq] = useState<KetQuaChay | null>(null);
  const [loi, datLoi] = useState('');
  const [nhacTrong, datNhacTrong] = useState(false);
  const huyRef = useRef<AbortController | null>(null);
  useEffect(() => () => huyRef.current?.abort(), []);
  if (!ngonNgu) return null;
  const canhBao = nhacCanhBao ? canhBaoChay(lang, code) : null;

  async function chay() {
    if (dangChay || !ngonNgu) return;
    if (!code.trim()) {
      datNhacTrong(true);
      if (idO) document.getElementById(idO)?.focus();
      return;
    }
    datNhacTrong(false);
    huyRef.current?.abort();
    const huy = new AbortController();
    huyRef.current = huy;
    datDangChay(ngonNgu.noi === 'trinh-duyet' && !daTaiTrinhDuyet(ngonNgu.id) ? 'tai' : 'chay');
    datLoi('');
    datKq(null);
    try {
      const ra = await chayCode(client, ngonNgu.id, code, stdin, huy.signal, () => { if (!huy.signal.aborted) datDangChay('chay'); });
      if (huy.signal.aborted) return;
      datKq(ra);
      if (!stdin.trim() && 'stderr' in ra && CHO_DU_LIEU.test(ra.stderr)) datMoStdin(true);
    } catch (e) {
      if (!huy.signal.aborted) datLoi(e instanceof Error ? e.message : String(e));
    } finally {
      if (!huy.signal.aborted) datDangChay('');
    }
  }

  const choDuLieu = !!kq && 'stderr' in kq && !stdin.trim() && CHO_DU_LIEU.test(kq.stderr);

  return (
    <div className="space-y-2">
      {canhBao && (
        <p className="flex items-start gap-2 rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{canhBao.loai === 'thu-vien' ? t('runNeedsLib', { name: canhBao.ten }) : t('runNeedsMain')}</span>
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" className="rounded-full" onClick={() => { void chay(); }} disabled={!!dangChay}>
          {dangChay
            ? <><Loader2 className="motion-safe:animate-spin" aria-hidden="true" /> {dangChay === 'tai' ? t('runLoadingRuntime', { name: ngonNgu.ten }) : t('runningCode')}</>
            : <><Play aria-hidden="true" /> {t('runCode').replace(/^▶\s*/, '')}</>}
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground" aria-expanded={moStdin} onClick={() => datMoStdin(v => !v)}>
          {t('stdinLabel')}
        </Button>
        <span className="text-xs text-muted-foreground">
          {ngonNgu.ten} · {ngonNgu.noi === 'trinh-duyet' ? t('runInBrowser') : t('runOnServer')}
        </span>
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
            <pre translate="no" className={lopKhung}>{kq.stdout || (kq.stderr || kq.quaGio ? '' : t('noOutput'))}{kq.stdout && kq.stderr ? '\n' : ''}{kq.stderr && <span className={lopLoi}>{kq.stderr}</span>}{kq.quaGio ? <span className={lopLoi}>{t('runTimeout', { s: kq.quaGio })}</span> : null}</pre>
            {choDuLieu && <p className="rounded-2xl bg-muted px-4 py-2.5 text-sm">{t('runNeedsInput')}</p>}
            <p className="text-xs text-muted-foreground tabular-nums">
              {t('exitCode', { n: kq.maThoat })}{kq.trinhBienDich ? ` · ${t('runCompiler', { name: kq.trinhBienDich })}` : ''}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
