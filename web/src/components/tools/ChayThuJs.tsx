import { useEffect, useRef, useState } from 'react';
import { buildDocument } from '@/lib/sandpack-doc';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Log = { id: number; level: string; text: string };

/**
 * Chay thu doan JavaScript trong khung sandbox an (khong allow-same-origin), in console ra duoi.
 * Chi dung cho bai JavaScript — app cu chay MOI ngon ngu nhu JS (Python cung bi eval).
 */
export function ChayThuJs({ code, nhan }: { code: string; nhan: string }) {
  const [taiLieu, datTaiLieu] = useState<{ doc: string; token: string } | null>(null);
  const [logs, datLogs] = useState<Log[]>([]);
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
    datLogs([]);
    datTaiLieu(buildDocument('js', { 'main.js': code }, { token: 'run' + ++demRef.current }));
  }

  return (
    <div className="space-y-2">
      <Button variant="outline" onClick={chay} disabled={!code.trim()}>{nhan}</Button>
      {taiLieu && (
        <>
          <iframe ref={khungRef} title="Chạy thử" srcDoc={taiLieu.doc} sandbox="allow-scripts" className="hidden" />
          <ol aria-label="Console" aria-live="polite" className="max-h-48 overflow-y-auto rounded-lg border bg-code p-3 font-mono text-xs">
            {logs.length === 0 && <li className="text-muted-foreground">(chưa có output)</li>}
            {logs.map(l => <li key={l.id} className={cn('whitespace-pre-wrap', l.level === 'error' && 'text-destructive')}>{l.text}</li>)}
          </ol>
        </>
      )}
    </div>
  );
}
