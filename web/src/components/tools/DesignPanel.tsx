import { useEffect, useRef, useState } from 'react';
import { Loader2, Sparkles, Undo2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { apDungThietKe, suaThietKe } from '@/lib/ai';
import { getProperty, setProperties } from '@/lib/css-patch';
import { GROUPS, rgbToHex, type TruongThietKe } from '@/lib/design-inject';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ChonThietKe = { selector: string; tag: string; text: string; computed: Record<string, string> };

type Props = { chon: ChonThietKe | null; files: Record<string, string>; onFilesChange: (files: Record<string, string>) => void };

const lopO = 'h-8 w-full rounded-lg border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring';

const MAU_TRANG_THAI = { dang: 'bg-lavender text-lavender-ink', xong: 'bg-mint text-mint-ink', loi: 'bg-destructive/10 text-destructive' } as const;

export function DesignPanel({ chon, files, onFilesChange }: Props) {
  const { client } = useAuth();
  const { t, lang } = useT();
  const [yeuCau, datYeuCau] = useState('');
  const oYeuCauRef = useRef<HTMLTextAreaElement>(null);
  const [trangThai, datTrangThai] = useState<{ loai: 'dang' | 'xong' | 'loi'; text: string } | null>(null);
  const [truocAi, datTruocAi] = useState<Record<string, string> | null>(null);
  const filesRef = useRef(files);
  useEffect(() => { filesRef.current = files; }, [files]);
  const css = files['style.css'] || '';

  function ghi(f: TruongThietKe, giaTri: string) {
    if (!chon) return;
    const r = setProperties(css, chon.selector, { [f.writeProp || f.prop]: giaTri });
    if (r.changed) onFilesChange({ ...files, 'style.css': r.css });
  }

  function giaTriCua(f: TruongThietKe): string {
    if (!chon) return '';
    return getProperty(css, chon.selector, f.writeProp || f.prop) ?? getProperty(css, chon.selector, f.prop) ?? chon.computed[f.prop] ?? '';
  }

  async function hoiAi() {
    if (trangThai?.loai === 'dang') return;
    if (!yeuCau.trim()) {
      datTrangThai({ loai: 'loi', text: t('emptyInputHint') });
      oYeuCauRef.current?.focus();
      return;
    }
    datTrangThai({ loai: 'dang', text: 'AI đang đọc code của bạn…' });
    try {
      const kq = await suaThietKe(client, { yeuCau: yeuCau.trim(), chon, files: filesRef.current, lang });
      const hienTai = filesRef.current;
      const ap = apDungThietKe(hienTai, kq.edits);
      datTruocAi(hienTai);
      onFilesChange(ap.files);
      datTrangThai({ loai: 'xong', text: `${kq.explain || 'Đã áp dụng'} (${ap.soThayDoi} thay đổi)` });
      datYeuCau('');
    } catch (e) {
      datTrangThai({ loai: 'loi', text: e instanceof Error ? e.message : String(e) });
    }
  }

  return (
    <section aria-label="Chế độ Thiết kế" className="space-y-4 rounded-3xl bg-card p-5 shadow-soft">
      {chon ? (
        <>
          <p className="text-sm">Đang chọn <code translate="no" className="rounded-lg bg-sky px-1.5 py-0.5 font-mono break-all text-sky-ink">{`<${chon.tag}>`} {chon.selector}</code></p>
          <div className="grid gap-4 sm:grid-cols-3">
            {GROUPS.map(nhom => (
              <fieldset key={nhom.name} className="space-y-2">
                <legend className="mb-1 text-xs font-medium text-muted-foreground">{nhom.name}</legend>
                {nhom.fields.map(f => <TruongNhap key={f.prop} f={f} giaTri={giaTriCua(f)} onDoi={v => ghi(f, v)} />)}
              </fieldset>
            ))}
          </div>
        </>
      ) : (
        <p className="rounded-2xl bg-sky px-4 py-3 text-sm text-sky-ink">Bấm vào một phần tử trong khung xem trước để chỉnh màu, chữ, khoảng cách.</p>
      )}

      <div className="space-y-2 border-t pt-4">
        <label htmlFor="dm-yeu-cau" className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid size-7 place-items-center rounded-xl bg-lavender text-lavender-ink" aria-hidden="true"><Sparkles className="size-4" /></span>
          Nhờ AI sửa giao diện
        </label>
        <div className="flex gap-2">
          <textarea
            ref={oYeuCauRef}
            id="dm-yeu-cau"
            aria-describedby="dm-trang-thai"
            value={yeuCau}
            onChange={e => datYeuCau(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); void hoiAi(); } }}
            rows={1}
            placeholder="vd: làm nút bo tròn hơn, nền tối hơn…"
            className="min-h-9 flex-1 resize-y rounded-xl border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button className="rounded-full" onClick={() => void hoiAi()} disabled={trangThai?.loai === 'dang'}>
            {trangThai?.loai === 'dang' ? <Loader2 className="motion-safe:animate-spin" aria-hidden="true" /> : <Sparkles aria-hidden="true" />} Sửa
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p id="dm-trang-thai" role="status" className={cn('rounded-2xl px-4 py-2 text-sm empty:hidden', trangThai && MAU_TRANG_THAI[trangThai.loai])}>{trangThai?.text ?? ''}</p>
          {truocAi && trangThai?.loai === 'xong' && (
            <Button variant="ghost" size="sm" className="rounded-full" onClick={() => { onFilesChange(truocAi); datTruocAi(null); datTrangThai(null); }}>
              <Undo2 aria-hidden="true" /> Hoàn tác
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

function useNhapTam(giaTri: string) {
  const [nhap, datNhap] = useState(giaTri);
  const [goc, datGoc] = useState(giaTri);
  if (giaTri !== goc) {
    datGoc(giaTri);
    datNhap(giaTri);
  }
  return [nhap, datNhap] as const;
}

function OChu({ giaTri, onDoi, ...con }: { giaTri: string; onDoi: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  const [nhap, datNhap] = useNhapTam(giaTri);
  const chot = () => { if (nhap !== giaTri) onDoi(nhap.trim()); };
  return (
    <input type="text" autoComplete="off" {...con} value={nhap} onChange={e => datNhap(e.target.value)} onBlur={chot}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); chot(); } }} spellCheck={false} />
  );
}

function OPx({ giaTri, onDoi, ...con }: { giaTri: string; onDoi: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  const so = parseFloat(giaTri);
  const goc = Number.isFinite(so) ? String(so) : '';
  const [nhap, datNhap] = useNhapTam(goc);
  const chot = () => {
    const n = parseFloat(nhap);
    if (!nhap.trim() || !Number.isFinite(n)) { datNhap(goc); return; }
    if (String(n) !== goc) onDoi(n + 'px');
  };
  return (
    <input type="number" inputMode="decimal" autoComplete="off" {...con} value={nhap} onChange={e => datNhap(e.target.value)} onBlur={chot}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); chot(); } }} />
  );
}

function TruongNhap({ f, giaTri, onDoi }: { f: TruongThietKe; giaTri: string; onDoi: (v: string) => void }) {
  if (f.type === 'color') {
    const hex = rgbToHex(giaTri) || giaTri;
    return (
      <div className="space-y-1">
        <span className="text-xs">{f.label}</span>
        <div className="flex items-center gap-2">
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(hex) ? hex : '#000000'} onChange={e => onDoi(e.target.value)} aria-label={`${f.label} (bảng màu)`} className="h-8 w-10 shrink-0 cursor-pointer rounded border bg-transparent" />
          <OChu giaTri={hex} onDoi={onDoi} aria-label={f.label} className={lopO + ' font-mono'} />
        </div>
      </div>
    );
  }
  if (f.type === 'select') {
    return (
      <label className="block space-y-1 text-xs">
        <span>{f.label}</span>
        <select value={giaTri} onChange={e => onDoi(e.target.value)} className={lopO}>
          {(f.options ?? []).map(o => <option key={o} value={o}>{o || '—'}</option>)}
        </select>
      </label>
    );
  }
  if (f.type === 'range') {
    return (
      <label className="block space-y-1 text-xs">
        <span>{f.label} <output className="tabular-nums text-muted-foreground">{giaTri || '1'}</output></span>
        <input type="range" min={f.min} max={f.max} step={f.step} value={giaTri || '1'} onChange={e => onDoi(e.target.value)} className="w-full" />
      </label>
    );
  }
  if (f.type === 'px') {
    return (
      <label className="block space-y-1 text-xs">
        <span>{f.label} (px)</span>
        <OPx giaTri={giaTri} onDoi={onDoi} min={f.min} max={f.max} placeholder="0" className={lopO} />
      </label>
    );
  }
  return (
    <label className="block space-y-1 text-xs">
      <span>{f.label}</span>
      <OChu giaTri={giaTri} onDoi={onDoi} placeholder={f.placeholder} className={lopO} />
    </label>
  );
}
