import { useEffect, useRef, useState } from 'react';
import { Loader2, Sparkles, Undo2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { apDungThietKe, suaThietKe } from '@/lib/ai';
import { getProperty, setProperties } from '@/lib/css-patch';
import { GROUPS, rgbToHex, type TruongThietKe } from '@/lib/design-inject';
import { Button } from '@/components/ui/button';

export type ChonThietKe = { selector: string; tag: string; text: string; computed: Record<string, string> };

type Props = { chon: ChonThietKe | null; files: Record<string, string>; onFilesChange: (files: Record<string, string>) => void };

const lopO = 'h-8 w-full rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

/**
 * Chinh phan tu dang chon trong khung xem truoc. Code van la goc: moi thay doi chen dung
 * mot khai bao vao style.css qua CssPatch, khong sinh lai ca tep.
 */
export function DesignPanel({ chon, files, onFilesChange }: Props) {
  const { client } = useAuth();
  const { lang } = useT();
  const [yeuCau, datYeuCau] = useState('');
  const [trangThai, datTrangThai] = useState<{ loai: 'dang' | 'xong' | 'loi'; text: string } | null>(null);
  // Bo tep truoc lan AI sua gan nhat, de Hoan tac (o soan duoc dieu khien nen Ctrl+Z khong lui duoc)
  const [truocAi, datTruocAi] = useState<Record<string, string> | null>(null);
  // Tep moi nhat: AI tra loi sau vai giay, hoc vien co the da go them trong luc cho
  const filesRef = useRef(files);
  useEffect(() => { filesRef.current = files; }, [files]);
  const css = files['style.css'] || '';

  function ghi(f: TruongThietKe, giaTri: string) {
    if (!chon) return;
    const r = setProperties(css, chon.selector, { [f.writeProp || f.prop]: giaTri });
    if (r.changed) onFilesChange({ ...files, 'style.css': r.css });
  }

  /** Gia tri dang dung: uu tien khai bao trong style.css, khong co thi lay style tinh toan tu khung xem truoc */
  function giaTriCua(f: TruongThietKe): string {
    if (!chon) return '';
    return getProperty(css, chon.selector, f.writeProp || f.prop) ?? getProperty(css, chon.selector, f.prop) ?? chon.computed[f.prop] ?? '';
  }

  async function hoiAi() {
    if (!yeuCau.trim() || trangThai?.loai === 'dang') return;
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
    <section aria-label="Chế độ Thiết kế" className="space-y-4 rounded-xl border bg-card p-4">
      {chon ? (
        <>
          <p className="text-sm">Đang chọn <code className="rounded bg-muted px-1.5 py-0.5 font-mono">{`<${chon.tag}>`} {chon.selector}</code></p>
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
        <p className="text-sm text-muted-foreground">Bấm vào một phần tử trong khung xem trước để chỉnh màu, chữ, khoảng cách.</p>
      )}

      <div className="space-y-2 border-t pt-4">
        <label htmlFor="dm-yeu-cau" className="text-sm font-medium">Nhờ AI sửa giao diện</label>
        <div className="flex gap-2">
          <textarea
            id="dm-yeu-cau"
            value={yeuCau}
            onChange={e => datYeuCau(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); void hoiAi(); } }}
            rows={1}
            placeholder="vd: làm nút bo tròn hơn, nền tối hơn"
            className="min-h-9 flex-1 resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button onClick={() => void hoiAi()} disabled={!yeuCau.trim() || trangThai?.loai === 'dang'}>
            {trangThai?.loai === 'dang' ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Sparkles aria-hidden="true" />} Sửa
          </Button>
        </div>
        {trangThai && (
          <div className="flex flex-wrap items-center gap-3">
            <p role="status" className={trangThai.loai === 'loi' ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'}>{trangThai.text}</p>
            {truocAi && trangThai.loai === 'xong' && (
              <Button variant="ghost" size="sm" onClick={() => { onFilesChange(truocAi); datTruocAi(null); datTrangThai(null); }}>
                <Undo2 aria-hidden="true" /> Hoàn tác
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Nhap tam cho o chu: dang go do dang ("re" truoc khi thanh "red") khong ghi vao CSS — truoc day moi phim
 * deu ghi, gia tri tinh toan nhay lai ngay khi xoa o. Gia tri ngoai doi (chon phan tu khac) thi lam moi.
 */
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
    <input type="text" {...con} value={nhap} onChange={e => datNhap(e.target.value)} onBlur={chot}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); chot(); } }} spellCheck={false} />
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
        <input type="number" min={f.min} max={f.max} value={parseFloat(giaTri) || 0} onChange={e => onDoi(e.target.value + 'px')} className={lopO} />
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
