import { memo, type ReactNode } from 'react';
import { ChevronDown, CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { KetQuaCham, TrangThaiCham } from '@/lib/project-ai';
import { CHIP, CHIP_DIEM, NEN_DIEM, mucDiem } from './mau-diem';

const NHAN_TRANG_THAI: Record<TrangThaiCham, string> = {
  excellent: 'reviewExcellent', good: 'reviewGood', partial: 'reviewPartial', needs_work: 'reviewNeedsWork'
};
const ICON_SACH = <CircleCheck className="size-4 text-mint-ink" aria-hidden="true" />;

function ChipDiem({ diem, tren = 100 }: { diem: number | null; tren?: number }) {
  return (
    <span className={cn(CHIP, 'shrink-0 font-mono', CHIP_DIEM[mucDiem(diem == null ? null : (diem * 100) / tren)])}>
      {diem ?? '?'}/{tren}
    </span>
  );
}

const MuiTen = () => (
  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
);

function Thanh({ diem, cao = 'h-2' }: { diem: number | null; cao?: string }) {
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-muted', cao)} aria-hidden="true">
      <div className={cn('h-full rounded-full', NEN_DIEM[mucDiem(diem ?? 0)])} style={{ width: `${diem ?? 0}%` }} />
    </div>
  );
}

function Muc({ tieuDe, children }: { tieuDe: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3 border-t pt-5">
      <h3 className="font-display font-extrabold tracking-tight">{tieuDe}</h3>
      {children}
    </section>
  );
}

const DanhSach = ({ ds }: { ds: string[] }) => <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">{ds.map((x, i) => <li key={i}>{x}</li>)}</ul>;

export const KetQuaChamView = memo(function KetQuaChamView({ kq }: { kq: KetQuaCham }) {
  const { t } = useT();
  const sr = kq.structureReview;
  const la = kq.localAnalysis;
  return (
    <article aria-labelledby="ket-qua-cham" className="space-y-5 rounded-3xl bg-card p-6 shadow-soft">
      <header className="space-y-3">
        <h2 id="ket-qua-cham" className="flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-2xl font-extrabold tracking-tight">
          {t(NHAN_TRANG_THAI[kq.status])} — <span className={cn('rounded-full px-3 py-0.5 font-mono text-xl', CHIP_DIEM[mucDiem(kq.score)])}>{kq.score ?? '?'}/100</span>
        </h2>
        <Thanh diem={kq.score} />
        {kq.summary && <p className="leading-relaxed">{kq.summary}</p>}
      </header>

      {kq.criteria.length > 0 && (
        <ul aria-label={t('reviewScoresLabel')} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kq.criteria.map((c, i) => (
            <li key={i} className="space-y-1 rounded-2xl bg-background p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{c.name}</span>
                <ChipDiem diem={c.score} tren={20} />
              </div>
              {c.comment && <p className="text-xs leading-relaxed text-muted-foreground">{c.comment}</p>}
            </li>
          ))}
        </ul>
      )}

      {kq.perFileReviews.length > 0 && (
        <Muc tieuDe={t('reviewPerFile')}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {kq.perFileReviews.map((f, i) => (
              <li key={i} className="space-y-1.5 rounded-2xl bg-background p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-sm">{f.fileName}</span>
                  <ChipDiem diem={f.score} />
                </div>
                <Thanh diem={f.score} cao="h-1" />
                {f.summary && <p className="text-xs text-muted-foreground">{f.summary}</p>}
              </li>
            ))}
          </ul>
        </Muc>
      )}

      {sr && (
        <Muc tieuDe={<span className="inline-flex flex-wrap items-center gap-2">{t('reviewStructureTitle')} — <ChipDiem diem={sr.structureScore} /></span>}>
          <dl className="grid gap-2 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-4">
            <dt className="font-medium">{t('reviewNaming')}</dt><dd className="text-muted-foreground">{sr.naming || t('notAvailable')}</dd>
            <dt className="font-medium">{t('reviewOrganization')}</dt><dd className="text-muted-foreground">{sr.organization || t('notAvailable')}</dd>
            <dt className="font-medium">{t('reviewCompleteness')}</dt><dd className="text-muted-foreground">{sr.completeness || t('notAvailable')}</dd>
            {sr.missingFiles.length > 0 && <><dt className="font-medium">{t('reviewMissingFiles')}</dt><dd className="font-mono text-muted-foreground">{sr.missingFiles.join(', ')}</dd></>}
          </dl>
          {sr.suggestions.length > 0 && <DanhSach ds={sr.suggestions} />}
        </Muc>
      )}

      {kq.moduleReviews.length > 0 && (
        <Muc tieuDe={t('reviewModulesTitle')}>
          <div className="space-y-3">
            {kq.moduleReviews.map((m, i) => (
              <details key={i} open className="group rounded-2xl bg-background p-4">
                <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 [&::-webkit-details-marker]:hidden">
                  <MuiTen />
                  <span className="font-medium">{m.moduleLabel || m.moduleId}</span>
                  <ChipDiem diem={m.score} />
                  <span className="basis-full pl-7 text-xs text-muted-foreground">
                    {t('reviewModuleScores', { q: m.codeQuality, l: m.logic, e: m.errorHandling, r: m.relevance })}
                  </span>
                </summary>
                <div className="mt-3 space-y-2 text-sm">
                  {m.summary && <p className="leading-relaxed">{m.summary}</p>}
                  {m.fileScores.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                      {m.fileScores.map((f, j) => (
                        <li key={j} className={cn(CHIP, 'gap-1.5 font-mono font-medium', CHIP_DIEM[mucDiem(f.score)])}>{f.file} <span className="font-bold">{f.score}</span></li>
                      ))}
                    </ul>
                  )}
                  {m.issues.length > 0 && <p><strong>{t('reviewIssues')}:</strong> {m.issues.join(' • ')}</p>}
                  {m.positives.length > 0 && <p><strong>{t('reviewPositives')}:</strong> {m.positives.join(' • ')}</p>}
                </div>
              </details>
            ))}
          </div>
        </Muc>
      )}

      {la && (
        <Muc tieuDe={t('reviewStaticTitle')}>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className={cn('inline-flex items-baseline gap-1.5 rounded-2xl px-3 py-2', CHIP_DIEM[mucDiem(la.avgScore)])}>
              <span className="font-mono text-xl font-bold">{la.avgScore}</span>
              <span>{t('reviewLintScore')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">{la.totalErrors > 0 ? <CircleX className="size-4 text-destructive" aria-hidden="true" /> : ICON_SACH}{t('reviewErrorsCount', { n: la.totalErrors })}</span>
            <span className="inline-flex items-center gap-1.5">{la.totalWarnings > 0 ? <TriangleAlert className="size-4 text-butter-ink" aria-hidden="true" /> : ICON_SACH}{t('reviewWarningsCount', { n: la.totalWarnings })}</span>
            <span className="inline-flex items-center gap-1.5"><Info className="size-4 text-muted-foreground" aria-hidden="true" />{t('reviewInfoCount', { n: la.totalIssues - la.totalErrors - la.totalWarnings })}</span>
          </div>
          {la.files.filter(f => f.issues.length > 0).map((f, i) => (
            <details key={i} className="group rounded-2xl bg-background p-3 text-sm">
              <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 [&::-webkit-details-marker]:hidden">
                <MuiTen />
                <span className="font-mono">{f.fileName}</span>
                <span className="font-semibold">{f.grade}</span>
                <ChipDiem diem={f.score} />
              </summary>
              <ul className="mt-2 space-y-1">
                {f.issues.map((v, j) => (
                  <li key={j} className={cn(v.severity === 'error' ? 'text-destructive' : v.severity === 'warning' ? 'text-butter-ink' : 'text-muted-foreground')}>
                    {v.line ? <span className="mr-2 font-mono text-xs">L{v.line}</span> : null}{v.message}
                  </li>
                ))}
              </ul>
            </details>
          ))}
          {la.files.every(f => f.issues.length === 0) && <p className="flex items-center gap-1.5 text-sm text-mint-ink"><CircleCheck className="size-4" aria-hidden="true" />{t('reviewClean')}</p>}
        </Muc>
      )}

      {kq.strengths.length > 0 && <Muc tieuDe={t('strengths')}><DanhSach ds={kq.strengths} /></Muc>}
      {kq.improvements.length > 0 && <Muc tieuDe={t('improvements')}><DanhSach ds={kq.improvements} /></Muc>}
      {kq.tips.length > 0 && <Muc tieuDe={t('reviewTips')}><DanhSach ds={kq.tips} /></Muc>}
    </article>
  );
});
