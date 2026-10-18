import { useState, type FormEvent } from 'react';
import { Check, ChevronRight, FlaskConical, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { docTienDo, kiemNhiemVu, luuTienDo, tinhDiem, type Lab, type NhiemVu } from '@/lib/lab';
import { cn } from '@/lib/utils';
import { Terminal } from './Terminal';
import { useTerminal } from './use-terminal';

export function LabPanel({ lab, onHoanThanh }: { lab: Lab; onHoanThanh?: () => void }) {
  const kenh = useTerminal(lab.fs);
  const [daXong, datDaXong] = useState(() => docTienDo(lab.lessonKey));
  const [nhap, datNhap] = useState<Record<string, string>>({});
  const [goiY, datGoiY] = useState<Record<string, number>>({});
  const [nhan, datNhan] = useState<Record<string, string>>({});
  const d = tinhDiem(lab, daXong);
  const phanTram = d.tongDiem ? Math.round((d.diem / d.tongDiem) * 100) : 0;

  function kiem(nv: NhiemVu) {
    if (daXong.includes(nv.id)) return;
    const kq = kiemNhiemVu(nv, kenh.may.getFs(), nhap[nv.id] ?? '');
    if (!kq.dat) {
      datNhan(n => ({ ...n, [nv.id]: kq.nhan || 'Chưa đúng.' }));
      return;
    }
    const moi = [...daXong, nv.id];
    datDaXong(moi);
    luuTienDo(lab.lessonKey, moi);
    const sau = tinhDiem(lab, moi);
    if (sau.tong > 0 && sau.xong === sau.tong) onHoanThanh?.();
    datNhan(n => ({ ...n, [nv.id]: '' }));
  }

  function nop(e: FormEvent, nv: NhiemVu) {
    e.preventDefault();
    kiem(nv);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-card p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-pink text-pink-ink" aria-hidden="true"><FlaskConical className="size-5" /></span>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-extrabold tracking-tight break-words">{lab.tenLab}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Dùng terminal bên dưới để tìm câu trả lời. Không đoán được đâu — phải thật sự gõ lệnh mới ra.</p>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium tabular-nums">{`Tiến độ: ${d.xong}/${d.tong} nhiệm vụ · ${d.diem}/${d.tongDiem} điểm`}</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-mint" aria-hidden="true">
          <div className="h-full origin-left rounded-full bg-mint-ink transition-transform duration-500 motion-reduce:transition-none" style={{ transform: `scaleX(${phanTram / 100})` }} />
        </div>
      </div>

      <div className="space-y-3">
        {lab.tasks.map(nv => {
          const xong = daXong.includes(nv.id);
          const soGoiY = goiY[nv.id] ?? 0;
          return (
            <fieldset key={nv.id} className={cn('min-w-0 rounded-2xl p-4 shadow-soft', xong ? 'bg-mint' : 'bg-card')}>
              <legend className="sr-only">{nv.cau}</legend>
              <div className="flex items-start gap-3">
                {xong
                  ? <Check className="mt-0.5 size-4 shrink-0 text-mint-ink" aria-hidden="true" />
                  : <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
                <p className="min-w-0 flex-1 text-sm break-words">{nv.cau}</p>
                <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums', xong ? 'bg-card text-mint-ink' : 'bg-butter text-butter-ink')}>{nv.diem}đ</span>
              </div>
              {xong ? (
                <p className="mt-2 pl-7 text-sm font-medium text-mint-ink">
                  {nv.kieu === 'traLoi' ? <>→ <code translate="no" className="font-mono break-all">{Array.isArray(nv.dapAn) ? nv.dapAn[0] : nv.dapAn}</code></> : '→ Đã hoàn thành'}
                </p>
              ) : (
                <div className="mt-3 space-y-2 pl-7">
                  <form onSubmit={e => nop(e, nv)} className="flex flex-wrap gap-2">
                    {nv.kieu === 'traLoi' && (
                      <Input
                        value={nhap[nv.id] ?? ''}
                        onChange={e => datNhap(n => ({ ...n, [nv.id]: e.target.value }))}
                        placeholder="Nhập đáp án…"
                        aria-label={`Đáp án: ${nv.cau}`}
                        aria-describedby={`lab-nhan-${nv.id}`}
                        name={`dap-an-${nv.id}`}
                        className="max-w-sm font-mono"
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        enterKeyHint="done"
                      />
                    )}
                    <Button type="submit" variant="outline" className="rounded-full">Kiểm tra</Button>
                    {soGoiY < nv.goiY.length && (
                      <Button type="button" variant="ghost" className="rounded-full" onClick={() => datGoiY(g => ({ ...g, [nv.id]: soGoiY + 1 }))}>
                        <Lightbulb aria-hidden="true" /> Gợi ý {soGoiY + 1}/{nv.goiY.length}
                      </Button>
                    )}
                  </form>
                  <p id={`lab-nhan-${nv.id}`} role="status" className="text-sm text-destructive empty:hidden">{nhan[nv.id] ?? ''}</p>
                  {soGoiY > 0 && (
                    <ul className="space-y-1 rounded-2xl bg-butter p-3 text-sm text-foreground">
                      {nv.goiY.slice(0, soGoiY).map(g => <li key={g} className="flex gap-2"><Lightbulb className="mt-0.5 size-3.5 shrink-0 text-butter-ink" aria-hidden="true" /><span className="min-w-0 break-words">{g}</span></li>)}
                    </ul>
                  )}
                </div>
              )}
            </fieldset>
          );
        })}
      </div>

      <Terminal kenh={kenh} />
    </div>
  );
}
