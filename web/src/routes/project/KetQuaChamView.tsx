// Ket qua cham project: diem tong, 5 tieu chi, diem tung file, cau truc, tung module, phan tich tinh, nhan xet.
import type { ReactNode } from 'react';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { KetQuaCham, TrangThaiCham } from '@/lib/project-ai';

const NHAN_TRANG_THAI: Record<TrangThaiCham, string> = {
  excellent: 'reviewExcellent', good: 'reviewGood', partial: 'reviewPartial', needs_work: 'reviewNeedsWork'
};
const BIEU_TUONG: Record<TrangThaiCham, string> = { excellent: '🎉', good: '👍', partial: '💪', needs_work: '📝' };

/** Mau theo diem /100 (cung nguong voi app cu) */
const mauDiem = (d: number | null) => d == null ? 'text-muted-foreground' : (d >= 80 ? 'text-emerald-400' : d >= 60 ? 'text-amber-300' : d >= 40 ? 'text-orange-400' : 'text-red-400');
const nenDiem = (d: number) => (d >= 80 ? 'bg-emerald-400' : d >= 60 ? 'bg-amber-300' : d >= 40 ? 'bg-orange-400' : 'bg-red-400');

function Thanh({ diem, cao = 'h-2' }: { diem: number | null; cao?: string }) {
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-muted', cao)} aria-hidden="true">
      <div className={cn('h-full rounded-full', nenDiem(diem ?? 0))} style={{ width: `${diem ?? 0}%` }} />
    </div>
  );
}

function Muc({ tieuDe, children }: { tieuDe: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3 border-t pt-5">
      <h3 className="font-semibold">{tieuDe}</h3>
      {children}
    </section>
  );
}

const DanhSach = ({ ds }: { ds: string[] }) => <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">{ds.map((x, i) => <li key={i}>{x}</li>)}</ul>;

export function KetQuaChamView({ kq }: { kq: KetQuaCham }) {
  const { t } = useT();
  const sr = kq.structureReview;
  const la = kq.localAnalysis;
  return (
    <article aria-labelledby="ket-qua-cham" className="space-y-5 rounded-2xl border bg-card p-6">
      <header className="space-y-3">
        <h2 id="ket-qua-cham" className="text-2xl font-semibold tracking-tight">
          <span aria-hidden="true">{BIEU_TUONG[kq.status]} </span>{t(NHAN_TRANG_THAI[kq.status])} — <span className={mauDiem(kq.score)}>{kq.score ?? '?'}/100</span>
        </h2>
        <Thanh diem={kq.score} />
        {kq.summary && <p className="leading-relaxed">{kq.summary}</p>}
      </header>

      {kq.criteria.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kq.criteria.map((c, i) => (
            <li key={i} className="space-y-1 rounded-xl border bg-background p-4">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium">{c.name}</span>
                <span className={cn('font-mono text-sm font-semibold', mauDiem(c.score * 5))}>{c.score}/20</span>
              </div>
              {c.comment && <p className="text-xs leading-relaxed text-muted-foreground">{c.comment}</p>}
            </li>
          ))}
        </ul>
      )}

      {kq.perFileReviews.length > 0 && (
        <Muc tieuDe={`📁 ${t('reviewPerFile')}`}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {kq.perFileReviews.map((f, i) => (
              <li key={i} className="space-y-1.5 rounded-xl border bg-background p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-mono text-sm">{f.fileName}</span>
                  <span className={cn('font-mono text-sm font-semibold', mauDiem(f.score))}>{f.score}/100</span>
                </div>
                <Thanh diem={f.score} cao="h-1" />
                {f.summary && <p className="text-xs text-muted-foreground">{f.summary}</p>}
              </li>
            ))}
          </ul>
        </Muc>
      )}

      {sr && (
        <Muc tieuDe={<>🏗️ {t('reviewStructureTitle')} — <span className={mauDiem(sr.structureScore)}>{sr.structureScore}/100</span></>}>
          <dl className="grid gap-2 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-4">
            <dt className="font-medium">{t('reviewNaming')}</dt><dd className="text-muted-foreground">{sr.naming || 'N/A'}</dd>
            <dt className="font-medium">{t('reviewOrganization')}</dt><dd className="text-muted-foreground">{sr.organization || 'N/A'}</dd>
            <dt className="font-medium">{t('reviewCompleteness')}</dt><dd className="text-muted-foreground">{sr.completeness || 'N/A'}</dd>
            {sr.missingFiles.length > 0 && <><dt className="font-medium">{t('reviewMissingFiles')}</dt><dd className="font-mono text-muted-foreground">{sr.missingFiles.join(', ')}</dd></>}
          </dl>
          {sr.suggestions.length > 0 && <DanhSach ds={sr.suggestions} />}
        </Muc>
      )}

      {kq.moduleReviews.length > 0 && (
        <Muc tieuDe={`🤖 ${t('reviewModulesTitle')}`}>
          <div className="space-y-3">
            {kq.moduleReviews.map((m, i) => (
              <details key={i} open className="rounded-xl border bg-background p-4">
                <summary className="flex cursor-pointer flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-medium">{m.moduleLabel || m.moduleId}</span>
                  <span className={cn('font-mono text-sm font-semibold', mauDiem(m.score))}>{m.score}/100</span>
                  <span className="font-mono text-xs text-muted-foreground">Q:{m.codeQuality} L:{m.logic} E:{m.errorHandling} R:{m.relevance}</span>
                </summary>
                <div className="mt-3 space-y-2 text-sm">
                  {m.summary && <p className="leading-relaxed">{m.summary}</p>}
                  {m.fileScores.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                      {m.fileScores.map((f, j) => (
                        <li key={j} className="rounded-md border px-2 py-0.5 font-mono text-xs">{f.file} <span className={mauDiem(f.score)}>{f.score}</span></li>
                      ))}
                    </ul>
                  )}
                  {m.issues.length > 0 && <p><strong>⚠️ {t('reviewIssues')}:</strong> {m.issues.join(' • ')}</p>}
                  {m.positives.length > 0 && <p><strong>✅ {t('reviewPositives')}:</strong> {m.positives.join(' • ')}</p>}
                </div>
              </details>
            ))}
          </div>
        </Muc>
      )}

      {la && (
        <Muc tieuDe={`🔍 ${t('reviewStaticTitle')}`}>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-baseline gap-1.5 rounded-xl border px-3 py-2">
              <span className={cn('font-mono text-xl font-semibold', mauDiem(la.avgScore))}>{la.avgScore}</span>
              <span className="text-muted-foreground">{t('reviewLintScore')}</span>
            </span>
            <span>{la.totalErrors > 0 ? '🔴' : '✅'} {t('reviewErrorsCount', { n: la.totalErrors })}</span>
            <span>{la.totalWarnings > 0 ? '🟡' : '✅'} {t('reviewWarningsCount', { n: la.totalWarnings })}</span>
            <span>ℹ️ {t('reviewInfoCount', { n: la.totalIssues - la.totalErrors - la.totalWarnings })}</span>
          </div>
          {la.files.filter(f => f.issues.length > 0).map((f, i) => (
            <details key={i} className="rounded-xl border bg-background p-3 text-sm">
              <summary className="flex cursor-pointer flex-wrap items-baseline gap-x-3">
                <span className="font-mono">{f.fileName}</span>
                <span className="font-semibold">{f.grade}</span>
                <span className={mauDiem(f.score)}>{f.score}/100</span>
              </summary>
              <ul className="mt-2 space-y-1">
                {f.issues.map((v, j) => (
                  <li key={j} className={cn(v.severity === 'error' ? 'text-red-400' : v.severity === 'warning' ? 'text-amber-300' : 'text-muted-foreground')}>
                    {v.line ? <span className="mr-2 font-mono text-xs">L{v.line}</span> : null}{v.message}
                  </li>
                ))}
              </ul>
            </details>
          ))}
          {la.files.every(f => f.issues.length === 0) && <p className="text-sm text-emerald-400">✅ {t('reviewClean')}</p>}
        </Muc>
      )}

      {kq.strengths.length > 0 && <Muc tieuDe={t('strengths')}><DanhSach ds={kq.strengths} /></Muc>}
      {kq.improvements.length > 0 && <Muc tieuDe={t('improvements')}><DanhSach ds={kq.improvements} /></Muc>}
      {kq.tips.length > 0 && <Muc tieuDe={t('reviewTips')}><DanhSach ds={kq.tips} /></Muc>}
    </article>
  );
}
