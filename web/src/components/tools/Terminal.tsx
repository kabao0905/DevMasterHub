import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { KenhTerminal } from './use-terminal';

type Dong = { id: number; loai: 'lenh' | 'ra' | 'he'; cwd?: string; text: string };

// Engine in ma mau ANSI (ls to xanh thu muc) — man hinh nay ve chu thuong
const boMaMau = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, '');
const rutGon = (cwd: string) => (cwd === '/home/hacker' ? '~' : cwd.startsWith('/home/hacker/') ? '~' + cwd.slice(12) : cwd);

type Props = { kenh: KenhTerminal; className?: string };

/** Man hinh terminal gia lap: nhap lenh, ↑/↓ xem lai lenh cu, nano mo hop soan thao */
export function Terminal({ kenh, className }: Props) {
  const { may, nghe } = kenh;
  const [dong, datDong] = useState<Dong[]>([{ id: 0, loai: 'he', text: 'Terminal giả lập DevMaster — gõ "help" để xem các lệnh có sẵn.' }]);
  const [nhap, datNhap] = useState('');
  const [viTri, datViTri] = useState<number | null>(null);
  const [soan, datSoan] = useState<{ duong: string; noiDung: string } | null>(null);
  const idRef = useRef(1);
  const manRef = useRef<HTMLDivElement>(null);
  const oRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const boXoa = nghe('xoa', () => datDong([]));
    const boSoan = nghe('soan', (duong, noiDung) => datSoan({ duong, noiDung }));
    return () => { boXoa(); boSoan(); };
  }, [nghe]);

  useEffect(() => {
    const m = manRef.current;
    if (m) m.scrollTop = m.scrollHeight;
  }, [dong]);

  const them = (d: Omit<Dong, 'id'>) => datDong(ds => [...ds, { ...d, id: idRef.current++ }]);

  function chay(lenh: string) {
    them({ loai: 'lenh', cwd: may.cwd(), text: lenh });
    // "clear" goi lai xoa man hinh ngay trong luc chay: dong lenh vua them cung mat, dung nhu terminal that
    const ra = boMaMau(may.executeCommand(lenh)).replace(/^\n+|\n+$/g, '');
    if (ra) them({ loai: 'ra', text: ra });
  }

  // Enter (ca phim "Di"/"Gui" cua ban phim ao tren dien thoai) gui form -> chay lenh.
  // Truoc day bat Enter trong onKeyDown: nhieu ban phim Android khong phat keydown Enter dung chuan nen khong chay duoc.
  function guiLenh(e: FormEvent) {
    e.preventDefault();
    if (nhap.trim()) chay(nhap);
    datNhap('');
    datViTri(null);
    oRef.current?.focus();
  }

  function khiGo(e: KeyboardEvent<HTMLInputElement>) {
    const lichSu = may.lichSu();
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!lichSu.length) return;
      const i = viTri === null ? lichSu.length - 1 : Math.max(0, viTri - 1);
      datViTri(i);
      datNhap(lichSu[i]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (viTri === null) return;
      const i = viTri + 1;
      if (i >= lichSu.length) { datViTri(null); datNhap(''); } else { datViTri(i); datNhap(lichSu[i]); }
    }
  }

  function luu() {
    if (!soan) return;
    const loi = may.luuTuSoanThao(soan.duong, soan.noiDung);
    them({ loai: 'he', text: loi ? `nano: ${loi}` : `Đã lưu ${soan.duong}` });
    datSoan(null);
    oRef.current?.focus();
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-white/10 bg-[#0b1020] font-mono text-[13px] text-[#c9d1d9]', className)}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs text-[#8b949e]">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f56]" /><span className="size-2.5 rounded-full bg-[#ffbd2e]" /><span className="size-2.5 rounded-full bg-[#27c93f]" />
        </span>
        <span className="ml-2">hacker@devmaster: {rutGon(may.cwd())}</span>
      </div>
      {/* Bam vao man hinh de go tiep (giong terminal that) */}
      <div ref={manRef} onClick={() => oRef.current?.focus()} className="h-80 space-y-1 overflow-y-auto px-4 py-3" role="log" aria-live="polite">
        {dong.map(d => (
          d.loai === 'lenh'
            ? <div key={d.id}><span className="text-[#7ee787]">hacker@devmaster:{rutGon(d.cwd || '/')}$</span> {d.text}</div>
            : <pre key={d.id} className={cn('whitespace-pre-wrap break-words', d.loai === 'he' && 'text-[#8b949e]')}>{d.text}</pre>
        ))}
      </div>
      <form onSubmit={guiLenh} className="flex items-center gap-2 border-t border-white/10 py-1.5 pr-1.5 pl-4">
        <span className="shrink-0 text-[#7ee787]" aria-hidden="true">{rutGon(may.cwd())}$</span>
        {/* Dien thoai: tat tu sua/viet hoa (iOS doi "ls" thanh "Is"), chu 16px de iOS khong tu phong to khi cham */}
        <input
          ref={oRef}
          value={nhap}
          onChange={e => datNhap(e.target.value)}
          onKeyDown={khiGo}
          aria-label="Lệnh terminal"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          className="min-w-0 flex-1 bg-transparent text-base text-[#e6edf3] caret-[#7ee787] outline-none sm:text-[13px]"
        />
        <button type="submit" aria-label="Chạy lệnh" title="Chạy lệnh (Enter)"
          className="grid size-9 shrink-0 place-items-center rounded-md text-[#8b949e] hover:bg-white/10 hover:text-[#e6edf3] focus-visible:outline-2 focus-visible:outline-[#7ee787]">
          <CornerDownLeft className="size-4" aria-hidden="true" />
        </button>
      </form>

      <Dialog open={!!soan} onOpenChange={mo => { if (!mo) datSoan(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">📝 Đang sửa: {soan?.duong}</DialogTitle>
          </DialogHeader>
          <textarea
            value={soan?.noiDung ?? ''}
            onChange={e => datSoan(s => (s ? { ...s, noiDung: e.target.value } : s))}
            aria-label="Nội dung tệp"
            spellCheck={false}
            className="h-72 w-full resize-y rounded-lg border bg-code p-3 font-mono text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => datSoan(null)}>Hủy</Button>
            <Button onClick={luu}>💾 Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
