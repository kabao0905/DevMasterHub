// Soan code nhieu file cho project va nop cho AI cham (renderSubmitPanel cua app cu).
import { useEffect, useState } from 'react';
import { Bot, Loader2, Plus, Trash2, X } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { CodeArea } from '@/routes/lesson/CodeArea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TienDoCham } from '@/lib/project-ai';
import type { DuAn } from './use-du-an';
import { KetQuaChamView } from './KetQuaChamView';

const NGON_NGU = [
  { val: 'javascript', ten: 'JavaScript' }, { val: 'python', ten: 'Python' }, { val: 'java', ten: 'Java' }, { val: 'cpp', ten: 'C++' },
  { val: 'csharp', ten: 'C#' }, { val: 'go', ten: 'Go' }, { val: 'rust', ten: 'Rust' }, { val: 'php', ten: 'PHP' },
  { val: 'html', ten: 'HTML/CSS' }, { val: 'css', ten: 'CSS' }, { val: 'typescript', ten: 'TypeScript' }, { val: 'json', ten: 'JSON' }
];
const BIEU_TUONG: Record<string, string> = { javascript: '📜', typescript: '🔷', python: '🐍', java: '☕', cpp: '⚡', csharp: '🟣', go: '🔵', rust: '🦀', php: '🐘', html: '🌐', css: '🎨', json: '📋' };

/** Nguong cua app cu: tren 200k ky tu la "file lon", tren 400k thi AI se rut gon */
const LON = 200_000;
const RAT_LON = 400_000;

function chuTienDo(t: ReturnType<typeof useT>['t'], b: TienDoCham | null | undefined) {
  if (!b) return t('reviewStepStatic');
  if (b.buoc === 'tinh') return t('reviewStepStatic');
  if (b.buoc === 'cauTruc') return t('reviewStepStructure');
  if (b.buoc === 'module') return t('reviewStepModule', { i: b.i ?? 1, n: b.n ?? 1, label: b.nhan ?? '' });
  return t('reviewStepSynthesis');
}

export function KhongGianCode({ duAn, aiBat }: { duAn: DuAn; aiBat: boolean }) {
  const { t } = useT();
  const { kho, tepMo } = duAn;
  const i = Math.min(kho.tepDangMo, kho.files.length - 1);
  // Ten file soan tam: ghi khi roi o hoac Enter (onchange cua app cu), khong doi ten giua chung
  const [tenTam, datTenTam] = useState(tepMo.name);
  useEffect(() => { datTenTam(tepMo.name); }, [tepMo.name, i]);
  const chotTen = () => { if (tenTam.trim() && tenTam !== tepMo.name) duAn.doiTenTep(tenTam); else datTenTam(tepMo.name); };

  const soDong = kho.files.reduce((s, f) => s + (f.code ? f.code.split('\n').length : 0), 0);
  const soKyTu = kho.files.reduce((s, f) => s + f.code.length, 0);
  const coCode = kho.files.some(f => f.code.trim());

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-2xl border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <div role="tablist" aria-label={t('projectCodeFiles')} className="flex min-w-0 flex-1 flex-wrap gap-1">
            {kho.files.map((f, j) => (
              <div key={j} className={cn('flex items-center rounded-lg border', j === i ? 'border-primary bg-primary/10' : 'bg-background')}>
                <button type="button" role="tab" aria-selected={j === i} onClick={() => duAn.chonTep(j)}
                  className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs">
                  <span aria-hidden="true">{BIEU_TUONG[f.lang] ?? '📄'}</span> {f.name}
                </button>
                {kho.files.length > 1 && (
                  <button type="button" aria-label={t('projectRemoveFile', { name: f.name })} onClick={() => duAn.xoaTep(j)}
                    className="rounded-md p-1 text-muted-foreground hover:text-foreground">
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={duAn.themTep}><Plus aria-hidden="true" /> {t('projectAddFile')}</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            value={tenTam}
            onChange={e => datTenTam(e.target.value)}
            onBlur={chotTen}
            onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); chotTen(); } }}
            aria-label={t('projectFileName')}
            placeholder={t('projectFileName')}
            spellCheck={false}
            className="h-9 min-w-0 flex-1 rounded-lg border bg-background px-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <select value={tepMo.lang} onChange={e => duAn.doiNgonNgu(e.target.value)} aria-label={t('projectFileLang')}
            className="h-9 rounded-lg border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {NGON_NGU.map(n => <option key={n.val} value={n.val}>{n.ten}</option>)}
            {!NGON_NGU.some(n => n.val === tepMo.lang) && <option value={tepMo.lang}>{tepMo.lang}</option>}
          </select>
        </div>

        <CodeArea value={tepMo.code} onChange={duAn.datCode} label={t('projectCodeOf', { file: tepMo.name })} className="min-h-72" />

        <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>{t('projectStats', { files: kho.files.length, lines: soDong })}</span>
          {soKyTu > RAT_LON ? <span>⚠️ {t('projectSizeHuge')}</span> : soKyTu > LON ? <span>📦 {t('projectSizeLarge')}</span> : null}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {aiBat && (
            <Button className="bg-brand text-white hover:opacity-90" onClick={duAn.cham} disabled={!!kho.dangCham || !coCode}>
              {kho.dangCham ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Bot aria-hidden="true" />}
              {t('projectSubmitBtn', { n: kho.files.length })}
            </Button>
          )}
          <Button variant="ghost" className="text-muted-foreground" disabled={!!kho.dangCham}
            onClick={() => { if (window.confirm(t('projectClearConfirm'))) duAn.xoaHet(); }}>
            <Trash2 aria-hidden="true" /> {t('projectClearAll')}
          </Button>
        </div>
        {kho.dangCham && <p className="text-sm text-muted-foreground" aria-live="polite">{chuTienDo(t, kho.tienDo)}</p>}
        {kho.loiCham && !kho.dangCham && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm">{t('reviewFailed', { error: kho.loiCham })}</p>
        )}
      </section>

      {kho.ketQua && <KetQuaChamView kq={kho.ketQua} />}
    </div>
  );
}
