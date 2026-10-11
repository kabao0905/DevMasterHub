import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { docTienDo, kiemNhiemVu, luuTienDo, tinhDiem, type Lab, type NhiemVu } from '@/lib/lab';
import { cn } from '@/lib/utils';
import { Terminal } from './Terminal';
import { useTerminal } from './use-terminal';

/** Phong lab: danh sach nhiem vu o tren, terminal rieng (nap bo tep cua lab) o duoi */
export function LabPanel({ lab }: { lab: Lab }) {
  const kenh = useTerminal(lab.fs);
  const [daXong, datDaXong] = useState(() => docTienDo(lab.lessonKey));
  // O nhap cua tung nhiem vu giu rieng — ban cu ve lai ca danh sach, xoa chu dang go o nhiem vu khac
  const [nhap, datNhap] = useState<Record<string, string>>({});
  const [goiY, datGoiY] = useState<Record<string, number>>({});
  const [nhan, datNhan] = useState<Record<string, string>>({});
  const d = tinhDiem(lab, daXong);
  const phanTram = d.tongDiem ? Math.round((d.diem / d.tongDiem) * 100) : 0;

  function kiem(nv: NhiemVu) {
    if (daXong.includes(nv.id)) return;
    const kq = kiemNhiemVu(nv, kenh.may.getFs(), nhap[nv.id] ?? '');
    if (!kq.dat) {
      datNhan(n => ({ ...n, [nv.id]: '❌ ' + (kq.nhan || 'Chưa đúng.') }));
      return;
    }
    const moi = [...daXong, nv.id];
    datDaXong(moi);
    luuTienDo(lab.lessonKey, moi);
    datNhan(n => ({ ...n, [nv.id]: '' }));
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold">🧪 {lab.tenLab}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Dùng terminal bên dưới để tìm câu trả lời. Không đoán được đâu — phải thật sự gõ lệnh mới ra.</p>
        <p className="mt-4 text-sm tabular-nums">{`Tiến độ: ${d.xong}/${d.tong} nhiệm vụ · ${d.diem}/${d.tongDiem} điểm`}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div className="h-full rounded-full bg-level-newbie transition-[width] duration-500" style={{ width: `${phanTram}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {lab.tasks.map(nv => {
          const xong = daXong.includes(nv.id);
          const soGoiY = goiY[nv.id] ?? 0;
          return (
            <fieldset key={nv.id} className={cn('rounded-xl border bg-card p-4', xong && 'border-level-newbie/50')}>
              <legend className="sr-only">{nv.cau}</legend>
              <div className="flex items-start gap-3">
                <span aria-hidden="true">{xong ? '✅' : '▸'}</span>
                <p className="min-w-0 flex-1 text-sm">{nv.cau}</p>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{nv.diem}đ</span>
              </div>
              {xong ? (
                <p className="mt-2 pl-7 text-sm text-level-newbie">
                  {nv.kieu === 'traLoi' ? <>→ <code className="font-mono">{Array.isArray(nv.dapAn) ? nv.dapAn[0] : nv.dapAn}</code></> : '→ Đã hoàn thành'}
                </p>
              ) : (
                <div className="mt-3 space-y-2 pl-7">
                  <div className="flex flex-wrap gap-2">
                    {nv.kieu === 'traLoi' && (
                      <Input
                        value={nhap[nv.id] ?? ''}
                        onChange={e => datNhap(n => ({ ...n, [nv.id]: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') kiem(nv); }}
                        placeholder="Nhập đáp án…"
                        aria-label={`Đáp án: ${nv.cau}`}
                        className="max-w-sm font-mono"
                        spellCheck={false}
                      />
                    )}
                    <Button variant="outline" onClick={() => kiem(nv)}>Kiểm tra</Button>
                    {soGoiY < nv.goiY.length && (
                      <Button variant="ghost" onClick={() => datGoiY(g => ({ ...g, [nv.id]: soGoiY + 1 }))}>
                        💡 Gợi ý {soGoiY + 1}/{nv.goiY.length}
                      </Button>
                    )}
                  </div>
                  {nhan[nv.id] && <p role="status" className="text-sm text-destructive">{nhan[nv.id]}</p>}
                  {soGoiY > 0 && (
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {nv.goiY.slice(0, soGoiY).map(g => <li key={g}>💡 {g}</li>)}
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
