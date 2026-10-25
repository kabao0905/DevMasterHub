import { useXacNhan } from '@/components/XacNhan';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Bot, FileCode, Loader2, Package, Plus, Trash2, TriangleAlert, X } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { CodeArea } from '@/routes/lesson/CodeArea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TienDoCham } from '@/lib/project-ai';
import type { DuAn } from './use-du-an';
import { KetQuaChamView } from './KetQuaChamView';
import { CHIP } from './mau-diem';

const NGON_NGU = [
  { val: 'javascript', ten: 'JavaScript' }, { val: 'python', ten: 'Python' }, { val: 'java', ten: 'Java' }, { val: 'cpp', ten: 'C++' },
  { val: 'csharp', ten: 'C#' }, { val: 'go', ten: 'Go' }, { val: 'rust', ten: 'Rust' }, { val: 'php', ten: 'PHP' },
  { val: 'html', ten: 'HTML/CSS' }, { val: 'css', ten: 'CSS' }, { val: 'typescript', ten: 'TypeScript' }, { val: 'json', ten: 'JSON' }
];
const LON = 200_000;
const RAT_LON = 400_000;
const ID_KHUNG = 'khung-tep-code';
const idTab = (j: number) => `tab-tep-${j}`;

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
  const [hoi, hopXacNhan] = useXacNhan();
  const i = Math.min(kho.tepDangMo, kho.files.length - 1);
  const tabRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [tenTam, datTenTam] = useState(tepMo.name);
  useEffect(() => { datTenTam(tepMo.name); }, [tepMo.name, i]);
  const chotTen = () => { if (tenTam.trim() && tenTam !== tepMo.name) duAn.doiTenTep(tenTam); else datTenTam(tepMo.name); };

  const soDong = kho.files.reduce((s, f) => s + (f.code ? f.code.split('\n').length : 0), 0);
  const soKyTu = kho.files.reduce((s, f) => s + f.code.length, 0);
  const coCode = kho.files.some(f => f.code.trim());

  function khiGoTab(e: KeyboardEvent<HTMLButtonElement>) {
    const n = kho.files.length;
    const moi = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (moi < 0) return;
    e.preventDefault();
    duAn.chonTep(moi);
    tabRef.current[moi]?.focus();
  }

  async function xoaTepMo() {
    if (tepMo.code.trim() && !(await hoi(t('projectRemoveFileConfirm', { name: tepMo.name }), t('delete')))) return;
    duAn.xoaTep(i);
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-3xl bg-card p-4 shadow-soft sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <div role="tablist" aria-label={t('projectCodeFiles')} className="flex min-w-0 flex-1 flex-wrap gap-1.5">
            {kho.files.map((f, j) => (
              <button key={j} ref={el => { tabRef.current[j] = el; }} id={idTab(j)} type="button" role="tab"
                aria-selected={j === i} aria-controls={ID_KHUNG} tabIndex={j === i ? 0 : -1}
                onClick={() => duAn.chonTep(j)} onKeyDown={khiGoTab}
                className={cn('flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                  j === i ? 'bg-lavender font-semibold text-lavender-ink' : 'bg-background text-foreground hover:bg-muted')}>
                <FileCode className="size-3.5" aria-hidden="true" />{f.name}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="rounded-full" onClick={duAn.themTep}><Plus aria-hidden="true" /> {t('projectAddFile')}</Button>
        </div>

        <div id={ID_KHUNG} role="tabpanel" aria-labelledby={idTab(i)} className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <input
              name="fileName"
              value={tenTam}
              onChange={e => datTenTam(e.target.value)}
              onBlur={chotTen}
              onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); chotTen(); } }}
              aria-label={t('projectFileName')}
              placeholder={t('projectFileName')}
              autoComplete="off"
              spellCheck={false}
              className="h-9 min-w-0 flex-1 rounded-lg border bg-background px-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <select value={tepMo.lang} onChange={e => duAn.doiNgonNgu(e.target.value)} aria-label={t('projectFileLang')}
              className="h-9 rounded-lg border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {NGON_NGU.map(n => <option key={n.val} value={n.val}>{n.ten}</option>)}
              {!NGON_NGU.some(n => n.val === tepMo.lang) && <option value={tepMo.lang}>{tepMo.lang}</option>}
            </select>
            {kho.files.length > 1 && (
              <Button variant="ghost" size="icon-lg" className="text-muted-foreground hover:text-destructive"
                aria-label={t('projectRemoveFile', { name: tepMo.name })} title={t('projectRemoveFile', { name: tepMo.name })}
                onClick={() => { void xoaTepMo(); }}>
                <X aria-hidden="true" />
              </Button>
            )}
          </div>

          <CodeArea value={tepMo.code} onChange={duAn.datCode} label={t('projectCodeOf', { file: tepMo.name })} className="min-h-72" />
        </div>

        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>{t('projectStats', { files: kho.files.length, lines: soDong })}</span>
          {soKyTu > RAT_LON
            ? <span className={cn(CHIP, 'gap-1 bg-peach text-peach-ink')}><TriangleAlert className="size-3.5" aria-hidden="true" />{t('projectSizeHuge')}</span>
            : soKyTu > LON ? <span className={cn(CHIP, 'gap-1 bg-butter text-butter-ink')}><Package className="size-3.5" aria-hidden="true" />{t('projectSizeLarge')}</span> : null}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {aiBat && (
            <Button className="rounded-full bg-signal text-signal-foreground hover:bg-signal hover:brightness-105" onClick={duAn.cham} disabled={!!kho.dangCham || !coCode}>
              {kho.dangCham ? <Loader2 className="motion-safe:animate-spin" aria-hidden="true" /> : <Bot aria-hidden="true" />}
              {t('projectSubmitBtn', { n: kho.files.length })}
            </Button>
          )}
          <Button variant="ghost" className="rounded-full text-muted-foreground" disabled={!!kho.dangCham}
            onClick={() => { void hoi(t('projectClearConfirm')).then(ok => { if (ok) duAn.xoaHet(); }); }}>
            <Trash2 aria-hidden="true" /> {t('projectClearAll')}
          </Button>
          <p className="text-sm text-lavender-ink" aria-live="polite">{kho.dangCham ? chuTienDo(t, kho.tienDo) : ''}</p>
        </div>
        {kho.loiCham && !kho.dangCham && (
          <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{t('reviewFailed', { error: kho.loiCham })}</p>
        )}
        {kho.banNopCho && !kho.dangCham && (
          <Button variant="outline" className="rounded-full" onClick={duAn.luuLai} disabled={!!kho.dangLuu}>
            {kho.dangLuu && <Loader2 className="motion-safe:animate-spin" aria-hidden="true" />} {t('submissionSaveRetry')}
          </Button>
        )}
      </section>

      {hopXacNhan}
      {kho.ketQua && <KetQuaChamView kq={kho.ketQua} />}
    </div>
  );
}
