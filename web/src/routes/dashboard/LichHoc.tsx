// Lich hoc tren Dashboard: dai ngang cac ngay trong thang. Ngay hoc du so phut muc tieu thi duoc tich,
// hoc chua du thi to nhat; dem chuoi ngay dat muc tieu lien tiep. Cao vua bang khoi tieu de + thong ke.
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ChevronLeft, ChevronRight, CircleCheck, Clock, Flame, Target } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { ngayDiaPhuong, tinhStreak } from '@/lib/ngay-hoc';
import { useThoiGianHoc } from '@/lib/use-thoi-gian-hoc';
import { HopMucTieu } from '@/components/ChaoMung';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const dauThang = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const phutTu = (giay: number) => Math.floor(giay / 60);

/** Man hep hon breakpoint sm (640px) cua Tailwind; may khong co matchMedia (jsdom) coi la man rong */
const MAN_HEP = '(max-width: 639px)';
function useManHep(): boolean {
  return useSyncExternalStore(
    bao => {
      const mq = window.matchMedia?.(MAN_HEP);
      mq?.addEventListener('change', bao);
      return () => mq?.removeEventListener('change', bao);
    },
    () => window.matchMedia?.(MAN_HEP).matches ?? false,
    () => false
  );
}

export function LichHoc({ className }: { className?: string }) {
  const { t, lang } = useT();
  const { giayTheoNgay, ngayDat, mucTieuPhut } = useThoiGianHoc();
  const homNay = new Date();
  const khoaHomNay = ngayDiaPhuong(homNay);
  const [thang, datThang] = useState(() => dauThang(homNay));
  const [moMucTieu, datMoMucTieu] = useState(false);
  const { hienTai, daiNhat } = useMemo(() => tinhStreak(ngayDat, new Date()), [ngayDat]);
  const phutHomNay = phutTu(giayTheoNgay[khoaHomNay] ?? 0);
  const datHomNay = phutHomNay >= mucTieuPhut;
  const phanTramHomNay = Math.min(100, Math.round((phutHomNay / Math.max(1, mucTieuPhut)) * 100));

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
  const manHep = useManHep();

  /** Mot o ngay (ngay thu i+1 cua thang dang xem): dat muc tieu to dam, hoc chua du to nhat */
  function oNgay(i: number, coChu: string) {
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
          'grid aspect-square place-items-center rounded-md tabular-nums', coChu,
          dat ? 'bg-brand font-semibold text-white'
            : phut > 0 ? 'bg-brand/25 text-foreground'
              : khoa > khoaHomNay ? 'bg-muted/30 text-muted-foreground/40' : 'bg-muted/60 text-muted-foreground',
          khoa === khoaHomNay && 'ring-2 ring-primary'
        )}
      >
        {i + 1}
      </span>
    );
  }

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

      {manHep ? (
        // Dien thoai: dai 31 ngay chi thay nua thang, o qua nho -> luoi thang 7 cot, tuan bat dau thu Hai
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={`thu-${i}`} aria-hidden="true" className="text-xs leading-5 text-muted-foreground">
              {thuNgan.format(new Date(2024, 0, 1 + i))}
            </span>
          ))}
          {Array.from({ length: (thang.getDay() + 6) % 7 }, (_, i) => <span key={`trong-${i}`} aria-hidden="true" />)}
          {Array.from({ length: soNgay }, (_, i) => oNgay(i, 'text-sm'))}
        </div>
      ) : (
        // Ca thang tren mot hang: thu o tren, ngay o duoi. Hep qua thi cuon ngang
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
            {Array.from({ length: soNgay }, (_, i) => oNgay(i, 'text-[11px]'))}
          </div>
        </div>
      )}

      {/* Thoi gian hoc hom nay: so to + thanh tien do de nguoi hoc thay ngay minh da hoc bao lau */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2">
        <span className={cn('grid size-9 shrink-0 place-items-center rounded-full text-white', datHomNay ? 'bg-level-newbie' : 'bg-brand')} aria-hidden="true">
          {datHomNay ? <CircleCheck className="size-5" /> : <Clock className="size-5" />}
        </span>
        <div className="min-w-40 flex-1" title={t('streakHint')}>
          <div className="flex items-baseline justify-between gap-2">
            {/* So phut cung co chu, chi khac mau trang dam: noi ma khong lan at; muc tieu chi ghi mot lan o day */}
            <p className="flex items-baseline gap-1.5 text-sm tabular-nums">
              <span className="text-muted-foreground">{t('todayShort')}</span>
              <span className="font-semibold text-foreground">{Math.min(phutHomNay, 9999)}</span>
              <span className="text-muted-foreground">{t('ofGoalMinutes', { n: mucTieuPhut })}</span>
            </p>
            {datHomNay && <span className="text-xs font-medium text-level-newbie">{t('goalReached')}</span>}
          </div>
          <div
            role="progressbar"
            aria-label={t('todayMinutes', { m: Math.min(phutHomNay, 9999), n: mucTieuPhut })}
            aria-valuemin={0}
            aria-valuemax={mucTieuPhut}
            aria-valuenow={Math.min(phutHomNay, mucTieuPhut)}
            className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"
          >
            <div className={cn('h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none', datHomNay ? 'bg-level-newbie' : 'bg-brand')} style={{ width: `${phanTramHomNay}%` }} />
          </div>
        </div>
        {/* So phut da hien ben canh: nut chi ghi "Muc tieu"; trinh doc man hinh van nghe du "Muc tieu: N phut/ngay" */}
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs text-muted-foreground" aria-label={t('goalPerDay', { n: mucTieuPhut })} onClick={() => datMoMucTieu(true)}>
          <Target className="size-3.5" aria-hidden="true" /> {t('goalShort')}
        </Button>
      </div>

      {/* Chi gan khi mo: moi lan mo lay lai muc tieu hien tai lam lua chon ban dau */}
      {moMucTieu && <HopMucTieu mo onDong={() => datMoMucTieu(false)} />}
    </section>
  );
}
