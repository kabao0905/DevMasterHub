import { useMemo } from 'react';
import { Lightbulb } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { escapeHtml } from '@/lib/highlight';
import type { BaiDayDu } from '@/lib/curriculum';
import { useDichNoiDung } from './use-dich-noi-dung';

export function TheoryTab({ lesson }: { lesson: BaiDayDu }) {
  const { t, lang } = useT();
  const lyThuyet = useDichNoiDung(lesson.theory ?? '', lang);
  // Diem chinh la chu thuong (co the chua "<iostream>"): escape truoc, roi moi dich/hien nhu HTML
  const htmlDiemChinh = useMemo(
    () => (lesson.keyPoints?.length ? `<ul>${lesson.keyPoints.map(k => `<li>${escapeHtml(k)}</li>`).join('')}</ul>` : ''),
    [lesson.keyPoints]
  );
  const diemChinh = useDichNoiDung(htmlDiemChinh, lang);

  return (
    <div className="space-y-6">
      {/* Vung live luon gan san: chi doi chu, trinh doc man hinh moi bao "dang dich" */}
      <p className="w-fit rounded-full bg-sky px-2.5 py-0.5 text-xs font-semibold text-sky-ink empty:hidden" aria-live="polite">
        {lyThuyet.dangDich || diemChinh.dangDich ? t('translating') : ''}
      </p>
      <div className="rounded-3xl bg-card p-6 shadow-soft sm:p-8">
        {lesson.theory
          // HTML giao trinh (hoac ban dich cua no) da qua lamSachHtml
          ? <div className="noi-dung-bai" dangerouslySetInnerHTML={{ __html: lyThuyet.html }} />
          : <p className="text-muted-foreground italic">{t('noContentAvailable')}</p>}
      </div>
      {htmlDiemChinh && (
        <section aria-labelledby="diem-chinh" className="rounded-3xl bg-sky p-6 text-foreground">
          <h2 id="diem-chinh" className="mb-3 flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
            <span className="grid size-8 place-items-center rounded-xl bg-card text-sky-ink" aria-hidden="true"><Lightbulb className="size-4" /></span>
            {t('keyPoints')}
          </h2>
          <div className="noi-dung-bai" dangerouslySetInnerHTML={{ __html: diemChinh.html }} />
        </section>
      )}
    </div>
  );
}
