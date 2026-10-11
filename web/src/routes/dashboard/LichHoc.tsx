// Lich hoc tren Dashboard: dai ngang cac ngay trong thang, tich ngay da hoc (mo mon hoc / hoi AI)
// va dem chuoi ngay lien tiep. Cao vua bang khoi tieu de + thong ke ben trai.
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { ngayDiaPhuong, tinhStreak, useNgayHoc } from '@/lib/ngay-hoc';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const dauThang = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export function LichHoc({ className }: { className?: string }) {
  const { t, lang } = useT();
  const { ngay } = useNgayHoc();
  const homNay = new Date();
  const khoaHomNay = ngayDiaPhuong(homNay);
  const [thang, datThang] = useState(() => dauThang(homNay));
  const { hienTai, daiNhat } = useMemo(() => tinhStreak(ngay, new Date()), [ngay]);

  const laThangNay = thang.getTime() === dauThang(homNay).getTime();
  const soNgay = new Date(thang.getFullYear(), thang.getMonth() + 1, 0).getDate();
  const tenThang = new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(thang);
  const thuNgan = new Intl.DateTimeFormat(lang, { weekday: 'narrow' });
  const ngayDayDu = new Intl.DateTimeFormat(lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  // Man hep phai cuon ngang: dua hom nay vao giua tam nhin thay vi dau thang
  const dai = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = dai.current;
    const o = el?.querySelector<HTMLElement>('[aria-current="date"]');
    if (el && o && el.scrollWidth > el.clientWidth) el.scrollLeft = o.offsetLeft - el.clientWidth / 2;
  }, [thang]);
  const doiThang = (buoc: number) => datThang(new Date(thang.getFullYear(), thang.getMonth() + buoc, 1));

  return (
    <section aria-labelledby="lich-hoc" className={cn('flex min-w-0 flex-col justify-between gap-3 rounded-2xl border bg-card p-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <h2 id="lich-hoc" className="text-sm font-medium text-muted-foreground">{t('studyCalendar')}</h2>
          <p className="flex items-center gap-1.5 self-center">
            <Flame className={cn('size-4', hienTai > 0 ? 'text-orange-400' : 'text-muted-foreground')} aria-hidden="true" />
            <span className="font-semibold tabular-nums">{t('streakCurrent', { n: hienTai })}</span>
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">{t('streakLongest', { n: daiNhat })}</p>
        </div>
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

      {/* Ca thang tren mot hang: thu o tren, ngay o duoi. Hep qua (dien thoai) thi cuon ngang */}
      <div ref={dai} className="-mx-1 overflow-x-auto px-1 py-0.5">
        <div className="grid gap-x-0.5 gap-y-1 text-center" style={{ gridTemplateColumns: `repeat(${soNgay}, minmax(1rem, 1fr))` }}>
          {Array.from({ length: soNgay }, (_, i) => {
            const d = new Date(thang.getFullYear(), thang.getMonth(), i + 1);
            const cuoiTuan = d.getDay() === 0 || d.getDay() === 6;
            return (
              <span key={`thu-${i}`} aria-hidden="true" className={cn('text-[10px] leading-4', cuoiTuan ? 'text-muted-foreground/60' : 'text-muted-foreground')}>
                {thuNgan.format(d)}
              </span>
            );
          })}
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
                title={daHoc ? t('studiedDay', { date: nhan }) : nhan}
                aria-current={khoa === khoaHomNay ? 'date' : undefined}
                className={cn(
                  'grid aspect-square place-items-center rounded-md text-[11px] tabular-nums',
                  daHoc ? 'bg-brand font-semibold text-white' : khoa > khoaHomNay ? 'bg-muted/30 text-muted-foreground/40' : 'bg-muted/60 text-muted-foreground',
                  khoa === khoaHomNay && 'ring-2 ring-primary'
                )}
              >
                {i + 1}
              </span>
            );
          })}
        </div>
      </div>

      {!ngay.has(khoaHomNay) && <p className="text-xs text-muted-foreground">{t('streakHint')}</p>}
    </section>
  );
}
