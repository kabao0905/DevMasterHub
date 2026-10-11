// Lich hoc tren Dashboard: dai ngang cac ngay trong thang. Ngay hoc du so phut muc tieu thi duoc tich,
// hoc chua du thi to nhat; dem chuoi ngay dat muc tieu lien tiep. Cao vua bang khoi tieu de + thong ke.
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, Target } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { ngayDiaPhuong, tinhStreak } from '@/lib/ngay-hoc';
import { useThoiGianHoc } from '@/lib/use-thoi-gian-hoc';
import { HopMucTieu } from '@/components/ChaoMung';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const dauThang = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const phutTu = (giay: number) => Math.floor(giay / 60);

export function LichHoc({ className }: { className?: string }) {
  const { t, lang } = useT();
  const { giayTheoNgay, ngayDat, mucTieuPhut } = useThoiGianHoc();
  const homNay = new Date();
  const khoaHomNay = ngayDiaPhuong(homNay);
  const [thang, datThang] = useState(() => dauThang(homNay));
  const [moMucTieu, datMoMucTieu] = useState(false);
  const { hienTai, daiNhat } = useMemo(() => tinhStreak(ngayDat, new Date()), [ngayDat]);
  const phutHomNay = phutTu(giayTheoNgay[khoaHomNay] ?? 0);

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
            const dat = ngayDat.has(khoa);
            const phut = phutTu(giayTheoNgay[khoa] ?? 0);
            const nhan = dat
              ? t('studiedDay', { date: ngayDayDu.format(d) })
              : phut > 0 ? t('studiedMinutes', { date: ngayDayDu.format(d), n: phut }) : ngayDayDu.format(d);
            return (
              <span
                key={khoa}
                role="img"
                aria-label={nhan}
                title={nhan}
                aria-current={khoa === khoaHomNay ? 'date' : undefined}
                className={cn(
                  'grid aspect-square place-items-center rounded-md text-[11px] tabular-nums',
                  dat ? 'bg-brand font-semibold text-white'
                    : phut > 0 ? 'bg-brand/25 text-foreground'
                      : khoa > khoaHomNay ? 'bg-muted/30 text-muted-foreground/40' : 'bg-muted/60 text-muted-foreground',
                  khoa === khoaHomNay && 'ring-2 ring-primary'
                )}
              >
                {i + 1}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs">
        <p className="text-muted-foreground tabular-nums" title={t('streakHint')}>
          {t('todayMinutes', { m: Math.min(phutHomNay, 9999), n: mucTieuPhut })}
        </p>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs text-muted-foreground" onClick={() => datMoMucTieu(true)}>
          <Target className="size-3.5" aria-hidden="true" /> {t('goalPerDay', { n: mucTieuPhut })}
        </Button>
      </div>

      {/* Chi gan khi mo: moi lan mo lay lai muc tieu hien tai lam lua chon ban dau */}
      {moMucTieu && <HopMucTieu mo onDong={() => datMoMucTieu(false)} />}
    </section>
  );
}
