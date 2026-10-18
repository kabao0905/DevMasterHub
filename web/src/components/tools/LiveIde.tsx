import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { useXacNhan } from '@/components/XacNhan';
import { useT } from '@/lib/i18n';
import { Monitor, Paintbrush, Play, RotateCcw, Smartphone, Tablet } from 'lucide-react';
import { buildDocument, laConsole, presetFor, PRESETS, type TaiLieu } from '@/lib/sandpack-doc';
import { injectScript } from '@/lib/design-inject';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DesignPanel, type ChonThietKe } from './DesignPanel';

type Props = {
  techId: string;
  files: Record<string, string>;
  macDinh: Record<string, string>;
  onFilesChange: (files: Record<string, string>) => void;
  tepDau?: string;
};
type Log = { id: number; level: string; text: string };

const KHO = { desktop: { w: null, nhan: 'Desktop', Icon: Monitor }, tablet: { w: 768, nhan: 'Tablet', Icon: Tablet }, mobile: { w: 375, nhan: 'Mobile', Icon: Smartphone } } as const;
type Kho = keyof typeof KHO;

export function LiveIde({ techId, files, macDinh, onFilesChange, tepDau }: Props) {
  const [hoi, hopXacNhan] = useXacNhan();
  const { t } = useT();
  const presetId = presetFor(techId);
  const consoleMode = laConsole(presetId);
  const tenTep = Object.keys(files);
  const entry = PRESETS[presetId]?.entry;
  const [active, datActive] = useState(() => (tepDau && tenTep.includes(tepDau) ? tepDau
    : tenTep.includes('index.html') && !consoleMode ? 'index.html' : entry && tenTep.includes(entry) ? entry : tenTep[0]));
  const [chia, datChia] = useState(50);
  const [kho, datKho] = useState<Kho>('desktop');
  const [thietKe, datThietKe] = useState(false);
  const [chon, datChon] = useState<ChonThietKe | null>(null);
  const [logs, datLogs] = useState<Log[]>([]);
  const demRef = useRef(0);
  const logIdRef = useRef(0);
  const khungRef = useRef<HTMLIFrameElement>(null);
  const luoiRef = useRef<HTMLDivElement>(null);
  const soDongRef = useRef<HTMLPreElement>(null);

  const dung = useCallback((): TaiLieu => {
    const token = 'sp' + ++demRef.current;
    return buildDocument(presetId, files, { token, designScript: thietKe && !consoleMode ? injectScript(token) : '' });
  }, [presetId, files, thietKe, consoleMode]);

  const [taiLieu, datTaiLieu] = useState<TaiLieu>(() => dung());
  const tokenRef = useRef(taiLieu.token);
  useEffect(() => { tokenRef.current = taiLieu.token; }, [taiLieu]);

  useEffect(() => {
    if (consoleMode) return;
    const h = setTimeout(() => { datLogs([]); datTaiLieu(dung()); }, 300);
    return () => clearTimeout(h);
  }, [dung, consoleMode]);

  useEffect(() => {
    function nghe(e: MessageEvent) {
      if (!khungRef.current || e.source !== khungRef.current.contentWindow) return;
      const d: unknown = e.data;
      if (!d || typeof d !== 'object') return;
      const x = d as Record<string, unknown>;
      if (x.__design === tokenRef.current && x.type === 'select') {
        const computed = x.computed && typeof x.computed === 'object' ? (x.computed as Record<string, unknown>) : {};
        datChon({
          selector: String(x.selector ?? ''),
          tag: String(x.tag ?? ''),
          text: String(x.text ?? ''),
          computed: Object.fromEntries(Object.entries(computed).map(([k, v]) => [k, String(v)]))
        });
        return;
      }
      if (x.__sandpack !== tokenRef.current) return;
      const args = Array.isArray(x.args) ? x.args.map(String) : [];
      datLogs(ds => [...ds, { id: logIdRef.current++, level: String(x.level ?? 'log'), text: args.join(' ') }].slice(-80));
    }
    window.addEventListener('message', nghe);
    return () => window.removeEventListener('message', nghe);
  }, []);

  function chay() {
    datLogs([]);
    datTaiLieu(dung());
  }

  function doiNoiDung(giaTri: string) {
    onFilesChange({ ...files, [active]: giaTri });
  }

  function khiGo(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Tab' || e.shiftKey) return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: a, selectionEnd: b, value } = el;
    doiNoiDung(value.slice(0, a) + '  ' + value.slice(b));
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = a + 2; });
  }

  function keoChia(e: PointerEvent<HTMLDivElement>) {
    const luoi = luoiRef.current;
    if (!luoi) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const hop = luoi.getBoundingClientRect();
    const di = (ev: globalThis.PointerEvent) => datChia(Math.min(80, Math.max(20, ((ev.clientX - hop.left) / hop.width) * 100)));
    const tha = () => { window.removeEventListener('pointermove', di); window.removeEventListener('pointerup', tha); };
    window.addEventListener('pointermove', di);
    window.addEventListener('pointerup', tha);
  }

  const noiDung = files[active] ?? '';
  const soDong = noiDung.split('\n').length;
  const cotSoDong = useMemo(() => Array.from({ length: soDong }, (_, i) => i + 1).join('\n'), [soDong]);
  const rong = KHO[kho].w;

  return (
    <div className="space-y-3">
      <div
        ref={luoiRef}
        style={{ '--chia': `${chia}%` } as React.CSSProperties}
        className="grid gap-3 lg:grid-cols-[var(--chia)_6px_1fr] lg:gap-0"
      >
        <TabsPrimitive.Root value={active} onValueChange={datActive}
          className="min-w-0 overflow-hidden rounded-2xl bg-code shadow-soft lg:rounded-r-none">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-2">
            <TabsPrimitive.List aria-label="Tệp" className="flex overflow-x-auto">
              {tenTep.map(ten => (
                <TabsPrimitive.Trigger key={ten} value={ten}
                  className="border-b-2 border-transparent px-3 py-2 font-mono text-xs whitespace-nowrap text-[#8b949e] transition-colors outline-none hover:text-[#e6edf3] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring data-[state=active]:border-primary data-[state=active]:text-[#e6edf3]">
                  {ten}
                </TabsPrimitive.Trigger>
              ))}
            </TabsPrimitive.List>
            <Button variant="ghost" size="sm" className="h-7 rounded-full text-xs text-[#8b949e] hover:bg-white/10 hover:text-[#e6edf3]" onClick={() => { void hoi(t('resetCodeConfirm')).then(ok => { if (ok) onFilesChange(macDinh); }); }}>
              <RotateCcw aria-hidden="true" /> Đặt lại
            </Button>
          </div>
          <TabsPrimitive.Content value={active} tabIndex={-1}
            className="flex h-[420px] font-mono text-[13px] leading-6 outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring">
            <pre ref={soDongRef} aria-hidden="true" className="w-10 shrink-0 select-none overflow-hidden py-3 pr-2 text-right text-[#6e7681]">
              {cotSoDong}
            </pre>
            <textarea
              value={noiDung}
              onChange={e => doiNoiDung(e.target.value)}
              onKeyDown={khiGo}
              onScroll={e => { if (soDongRef.current) soDongRef.current.scrollTop = e.currentTarget.scrollTop; }}
              aria-label={`Soạn ${active}`}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              translate="no"
              wrap="off"
              className="h-full flex-1 resize-none bg-transparent py-3 pr-3 text-[#e6edf3] caret-primary outline-none"
            />
          </TabsPrimitive.Content>
        </TabsPrimitive.Root>

        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Chia khung soạn và xem trước"
          aria-valuenow={Math.round(chia)}
          aria-valuemin={20}
          aria-valuemax={80}
          tabIndex={0}
          onPointerDown={keoChia}
          onKeyDown={e => {
            if (e.key === 'ArrowLeft') datChia(c => Math.max(20, c - 5));
            if (e.key === 'ArrowRight') datChia(c => Math.min(80, c + 5));
          }}
          className="hidden cursor-col-resize touch-none bg-border transition-colors hover:bg-primary/60 focus-visible:bg-primary focus-visible:outline-none lg:block"
        />

        <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-card shadow-soft lg:rounded-l-none">
          <div className="flex flex-wrap items-center gap-1 border-b px-2 py-1.5">
            {consoleMode ? (
              <Button size="sm" className="h-7 rounded-full" onClick={chay}><Play aria-hidden="true" /> Chạy</Button>
            ) : (
              <>
                {(Object.keys(KHO) as Kho[]).map(k => {
                  const { nhan, Icon } = KHO[k];
                  return (
                    <Button key={k} variant="ghost" size="icon" className={cn('size-7 rounded-full', kho === k && 'bg-lavender text-lavender-ink hover:bg-lavender')} aria-label={nhan} aria-pressed={kho === k} onClick={() => datKho(k)}>
                      <Icon aria-hidden="true" />
                    </Button>
                  );
                })}
                <Button variant="ghost" size="sm" className={cn('ml-auto h-7 rounded-full', thietKe && 'bg-lavender text-lavender-ink hover:bg-lavender')} aria-pressed={thietKe} onClick={() => { datThietKe(v => !v); datChon(null); }}>
                  <Paintbrush aria-hidden="true" /> Thiết kế
                </Button>
                <Button variant="ghost" size="icon" className="size-7 rounded-full" aria-label="Tải lại xem trước" onClick={chay}><RotateCcw aria-hidden="true" /></Button>
              </>
            )}
          </div>
          <div className={cn('flex justify-center overflow-auto bg-muted', consoleMode ? 'hidden' : 'h-[300px]')}>
            <iframe
              ref={khungRef}
              title="Xem trước"
              srcDoc={taiLieu.doc}
              sandbox="allow-scripts allow-modals allow-forms allow-popups"
              style={{ width: rong ? `${rong}px` : '100%' }}
              className="h-full max-w-full border-0 bg-white"
            />
          </div>
          <div className={cn('flex flex-col', consoleMode ? 'h-[420px]' : 'h-[120px]', 'border-t')}>
            <div className="flex items-center justify-between px-3 py-1 text-xs text-muted-foreground">
              <span>Console <span className={cn('tabular-nums', logs.some(l => l.level === 'error') && 'text-destructive')}>({logs.length})</span></span>
              {logs.length > 0 && <button type="button" className="rounded-full px-2 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring" onClick={() => datLogs([])}>Xóa</button>}
            </div>
            <ol aria-label="Console" aria-live={consoleMode ? 'polite' : undefined} translate="no" className="flex-1 overflow-y-auto px-3 pb-2 font-mono text-xs">
              {logs.length === 0 && <li className="text-muted-foreground">{consoleMode ? 'Bấm Chạy để chạy code.' : 'console.log() sẽ hiện ở đây.'}</li>}
              {logs.map(l => (
                <li key={l.id} className={cn('whitespace-pre-wrap break-words border-b border-border/40 py-0.5', l.level === 'error' && 'text-destructive', l.level === 'warn' && 'text-butter-ink')}>{l.text}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {thietKe && !consoleMode && <DesignPanel chon={chon} files={files} onFilesChange={onFilesChange} />}
      {hopXacNhan}
    </div>
  );
}
