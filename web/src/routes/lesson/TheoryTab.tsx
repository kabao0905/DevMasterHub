import { useMemo } from 'react';
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
    <div className="space-y-8">
      {(lyThuyet.dangDich || diemChinh.dangDich) && (
        <p className="text-xs text-muted-foreground" aria-live="polite">{t('translating')}</p>
      )}
      {lesson.theory
        // HTML giao trinh (hoac ban dich cua no) da qua lamSachHtml
        ? <div className="noi-dung-bai" dangerouslySetInnerHTML={{ __html: lyThuyet.html }} />
        : <p className="text-muted-foreground italic">{t('noContentAvailable')}</p>}
      {htmlDiemChinh && (
        <section aria-labelledby="diem-chinh" className="rounded-xl border bg-card p-5">
          <h2 id="diem-chinh" className="mb-3 font-semibold">{t('keyPoints')}</h2>
          <div className="noi-dung-bai" dangerouslySetInnerHTML={{ __html: diemChinh.html }} />
        </section>
      )}
    </div>
  );
}
