// Lich hoc tren Dashboard: tich cac ngay da hoc (mo mon hoc / hoi AI) va dem chuoi ngay lien tiep.
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { ngayDiaPhuong, tinhStreak, useNgayHoc } from '@/lib/ngay-hoc';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const dauThang = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export function LichHoc() {
  const { t, lang } = useT();
  const { ngay } = useNgayHoc();
  const homNay = new Date();
  const khoaHomNay = ngayDiaPhuong(homNay);
  const [thang, datThang] = useState(() => dauThang(homNay));
  const { hienTai, daiNhat } = useMemo(() => tinhStreak(ngay, new Date()), [ngay]);

  const laThangNay = thang.getTime() === dauThang(homNay).getTime();
  // Tuan bat dau tu thu Hai: Chu nhat (getDay = 0) dung cuoi
  const soOTrong = (thang.getDay() + 6) % 7;
  const soNgay = new Date(thang.getFullYear(), thang.getMonth() + 1, 0).getDate();
  const tenThu = useMemo(() => {
    const f = new Intl.DateTimeFormat(lang, { weekday: 'narrow' });
    return Array.from({ length: 7 }, (_, i) => f.format(new Date(2024, 0, 1 + i))); // 1/1/2024 la thu Hai
  }, [lang]);
  const tenThang = new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(thang);
  const ngayDayDu = new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' });
  const doiThang = (buoc: number) => datThang(new Date(thang.getFullYear(), thang.getMonth() + buoc, 1));

  return (
    <section aria-labelledby="lich-hoc" className="w-full rounded-2xl border bg-card p-4 sm:w-72">
      <div className="flex items-center justify-between gap-2">
        <h2 id="lich-hoc" className="text-sm font-medium text-muted-foreground">{t('studyCalendar')}</h2>
        <div className="flex items-center">
          <Button variant="ghost" size="icon-sm" aria-label={t('prevMonth')} title={t('prevMonth')} onClick={() => doiThang(-1)}>
            <ChevronLeft />
          </Button>
          <span className="min-w-24 text-center text-xs font-medium capitalize tabular-nums" aria-live="polite">{tenThang}</span>
          <Button variant="ghost" size="icon-sm" aria-label={t('nextMonth')} title={t('nextMonth')} disabled={laThangNay} onClick={() => doiThang(1)}>
            <ChevronRight />
          </Button>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-2">
        <Flame className={cn('size-5', hienTai > 0 ? 'text-orange-400' : 'text-muted-foreground')} aria-hidden="true" />
        <span className="text-lg font-semibold tabular-nums">{t('streakCurrent', { n: hienTai })}</span>
      </p>
      <p className="text-xs text-muted-foreground tabular-nums">{t('streakLongest', { n: daiNhat })}</p>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
        {tenThu.map((ten, i) => <span key={i} className="py-1 text-muted-foreground" aria-hidden="true">{ten}</span>)}
        {Array.from({ length: soOTrong }, (_, i) => <span key={`trong-${i}`} aria-hidden="true" />)}
        {Array.from({ length: soNgay }, (_, i) => {
          const d = new Date(thang.getFullYear(), thang.getMonth(), i + 1);
          const khoa = ngayDiaPhuong(d);
          const daHoc = ngay.has(khoa);
          const nhan = ngayDayDu.format(d);
          return (
            <span
              key={khoa}
              role="img"
              aria-label={daHoc ? t('studiedDay', { date: nhan }) : nhan}
              aria-current={khoa === khoaHomNay ? 'date' : undefined}
              className={cn(
                'grid aspect-square place-items-center rounded-md tabular-nums',
                daHoc ? 'bg-brand font-semibold text-white' : khoa > khoaHomNay ? 'text-muted-foreground/40' : 'text-muted-foreground',
                khoa === khoaHomNay && 'ring-2 ring-primary'
              )}
            >
              {i + 1}
            </span>
          );
        })}
      </div>

      {!ngay.has(khoaHomNay) && <p className="mt-3 text-xs text-muted-foreground">{t('streakHint')}</p>}
    </section>
  );
}
