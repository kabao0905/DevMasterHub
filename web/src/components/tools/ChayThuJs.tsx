import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { buildDocument } from '@/lib/sandpack-doc';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Log = { id: number; level: string; text: string };

/**
 * Chay thu doan JavaScript trong khung sandbox an (khong allow-same-origin), in console ra duoi.
 * Chi dung cho bai JavaScript — app cu chay MOI ngon ngu nhu JS (Python cung bi eval).
 * idO: o soan code — bam Chay khi chua co code thi nhac va dua con tro ve o do.
 */
export function ChayThuJs({ code, nhan, idO }: { code: string; nhan: string; idO?: string }) {
  const { t } = useT();
  const [taiLieu, datTaiLieu] = useState<{ doc: string; token: string } | null>(null);
  const [logs, datLogs] = useState<Log[]>([]);
  const [nhacTrong, datNhacTrong] = useState(false);
  const khungRef = useRef<HTMLIFrameElement>(null);
  const demRef = useRef(0);
  const idRef = useRef(0);
  const tokenRef = useRef('');

  useEffect(() => { tokenRef.current = taiLieu?.token ?? ''; }, [taiLieu]);

  useEffect(() => {
    function nghe(e: MessageEvent) {
      if (!khungRef.current || e.source !== khungRef.current.contentWindow) return;
      const d = e.data as Record<string, unknown> | null;
      if (!d || d.__sandpack !== tokenRef.current) return;
      const args = Array.isArray(d.args) ? d.args.map(String) : [];
      datLogs(ds => [...ds, { id: idRef.current++, level: String(d.level ?? 'log'), text: args.join(' ') }].slice(-80));
    }
    window.addEventListener('message', nghe);
    return () => window.removeEventListener('message', nghe);
  }, []);

  function chay() {
    // Nut luon bam duoc: chua co code thi noi ro ly do thay vi im lang
    if (!code.trim()) {
      datNhacTrong(true);
      if (idO) document.getElementById(idO)?.focus();
      return;
    }
    datNhacTrong(false);
    datLogs([]);
    datTaiLieu(buildDocument('js', { 'main.js': code }, { token: 'run' + ++demRef.current }));
  }

  return (
    <div className="space-y-2">
      <Button variant="outline" className="rounded-full" onClick={chay}><Play aria-hidden="true" /> {nhan}</Button>
      <p role="alert" className="text-sm text-destructive empty:hidden">{nhacTrong && !code.trim() ? t('emptyCodeHint') : ''}</p>
      {taiLieu && (
        <>
          <iframe ref={khungRef} title={nhan} srcDoc={taiLieu.doc} sandbox="allow-scripts" className="hidden" />
          <ol aria-label="Console" aria-live="polite" translate="no"
            className="max-h-48 overflow-y-auto rounded-2xl bg-code p-4 font-mono text-xs text-[#e6edf3] shadow-soft">
            {logs.length === 0 && <li className="text-[#8b949e]">{t('noOutput')}</li>}
            {logs.map(l => <li key={l.id} className={cn('whitespace-pre-wrap break-words', l.level === 'error' && 'text-[#ff7b72]')}>{l.text}</li>)}
          </ol>
        </>
      )}
    </div>
  );
}
