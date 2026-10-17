// Lich hoc tren Dashboard: dai ngang ca thang tren mot hang (nhu ban truoc nguoi dung thich), to mau pastel:
// ngay hoc du so phut muc tieu to bac ha, hoc chua du to vang bo, hom nay co vong xanh; dem chuoi ngay dat muc tieu.
// Dien thoai (duoi 640px) dai 31 ngay qua chat nen doi sang luoi thang 7 cot, tuan bat dau theo ngon ngu.
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, CircleCheck, Clock, Flame, Target } from 'lucide-react';
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

/** Ngay dau tuan theo ngon ngu (1 = thu Hai ... 7 = Chu nhat); trinh duyet chua ho tro weekInfo thi lay thu Hai */
function ngayDauTuan(lang: string): number {
  try {
    const loc = new Intl.Locale(lang) as Intl.Locale & { getWeekInfo?: () => { firstDay: number }; weekInfo?: { firstDay: number } };
    return loc.getWeekInfo?.().firstDay ?? loc.weekInfo?.firstDay ?? 1;
  } catch {
    return 1;
  }
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
  const tiLeHomNay = Math.min(1, phutHomNay / Math.max(1, mucTieuPhut));

  const laThangNay = thang.getTime() === dauThang(homNay).getTime();
  const soNgay = new Date(thang.getFullYear(), thang.getMonth() + 1, 0).getDate();
  const tenThang = new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(thang);
  const thuNgan = new Intl.DateTimeFormat(lang, { weekday: 'narrow' });
  const ngayDayDu = new Intl.DateTimeFormat(lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const dauTuan = ngayDauTuan(lang) % 7; // 0 = Chu nhat, khop Date.getDay()
  const doiThang = (buoc: number) => datThang(new Date(thang.getFullYear(), thang.getMonth() + buoc, 1));
  const manHep = useManHep();

  // Dai ngang hep qua phai cuon: dua hom nay vao giua tam nhin thay vi dau thang
  const dai = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = dai.current;
    const o = el?.querySelector<HTMLElement>('[aria-current="date"]');
    if (el && o && el.scrollWidth > el.clientWidth) el.scrollLeft = o.offsetLeft - el.clientWidth / 2;
  }, [thang]);

  /** Mot o ngay (ngay thu i+1 cua thang dang xem) */
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
          'grid aspect-square place-items-center rounded-full tabular-nums', coChu,
          dat ? 'bg-mint font-bold text-mint-ink'
            : phut > 0 ? 'bg-butter font-semibold text-butter-ink'
              : khoa > khoaHomNay ? 'bg-muted/50 text-muted-foreground/50' : 'bg-muted text-muted-foreground',
          khoa === khoaHomNay && 'ring-2 ring-primary ring-offset-2 ring-offset-card'
        )}
      >
        {i + 1}
      </span>
    );
  }

  return (
    <section aria-labelledby="lich-hoc" className={cn('flex min-w-0 flex-col gap-4 rounded-3xl bg-card p-5 shadow-soft', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h2 id="lich-hoc" className="kich-dong flex items-center gap-2 font-display text-xl font-extrabold">
            <span className="grid size-8 place-items-center rounded-full bg-lavender text-lavender-ink" aria-hidden="true"><CalendarDays data-dong="lich" className="size-4" /></span>
            {t('studyCalendar')}
          </h2>
          <p className="flex items-center gap-1.5 rounded-full bg-peach px-3 py-1 text-sm text-peach-ink">
            <Flame data-dong={hienTai > 0 ? 'lua' : undefined} className="size-4" aria-hidden="true" />
            <span className="font-semibold tabular-nums">{t('streakCurrent', { n: hienTai })}</span>
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">{t('streakLongest', { n: daiNhat })}</p>
        </div>
        <div className="flex items-center rounded-full bg-muted p-0.5">
          <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label={t('prevMonth')} title={t('prevMonth')} onClick={() => doiThang(-1)}>
            <ChevronLeft data-dong="trai" />
          </Button>
          <span className="min-w-28 text-center text-xs font-semibold capitalize tabular-nums" aria-live="polite">{tenThang}</span>
          <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label={t('nextMonth')} title={t('nextMonth')} disabled={laThangNay} onClick={() => doiThang(1)}>
            <ChevronRight data-dong="phai" />
          </Button>
        </div>
      </div>

      {manHep ? (
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={`thu-${i}`} aria-hidden="true" className="text-xs leading-5 text-muted-foreground">
              {thuNgan.format(new Date(2024, 0, 7 + ((dauTuan + i) % 7)))}
            </span>
          ))}
          {Array.from({ length: (thang.getDay() - dauTuan + 7) % 7 }, (_, i) => <span key={`trong-${i}`} aria-hidden="true" />)}
          {Array.from({ length: soNgay }, (_, i) => oNgay(i, 'text-sm'))}
        </div>
      ) : (
        // Ca thang tren mot hang: thu o tren, ngay o duoi. Hep qua thi cuon ngang
        <div ref={dai} className="-mx-1 overflow-x-auto overscroll-x-contain px-1 py-1.5">
          <div className="grid gap-x-1 gap-y-1.5 text-center" style={{ gridTemplateColumns: `repeat(${soNgay}, minmax(1.5rem, 1fr))` }}>
            {Array.from({ length: soNgay }, (_, i) => {
              const d = new Date(thang.getFullYear(), thang.getMonth(), i + 1);
              const cuoiTuan = d.getDay() === 0 || d.getDay() === 6;
              return (
                <span key={`thu-${i}`} aria-hidden="true" className={cn('text-[10px] leading-4 font-medium', cuoiTuan ? 'text-peach-ink' : 'text-muted-foreground')}>
                  {thuNgan.format(d)}
                </span>
              );
            })}
            {Array.from({ length: soNgay }, (_, i) => oNgay(i, 'text-xs'))}
          </div>
        </div>
      )}

      {/* Thoi gian hoc hom nay: hang vang bo (muc tieu), dat muc tieu thi sang bac ha */}
      <div className={cn('kich-dong flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl px-3 py-2.5', datHomNay ? 'bg-mint' : 'bg-butter')}>
        <span className={cn('grid size-9 shrink-0 place-items-center rounded-full bg-card', datHomNay ? 'text-mint-ink' : 'text-butter-ink')} aria-hidden="true">
          {datHomNay ? <CircleCheck className="size-5" /> : <Clock data-dong="dong-ho kim" className="size-5" />}
        </span>
        <div className="min-w-44 flex-1">
          <p className="flex flex-wrap items-baseline gap-x-1.5 text-sm tabular-nums">
            <span>{t('todayShort')}</span>
            <span className="whitespace-nowrap">
              <span className="font-display text-lg font-extrabold">{Math.min(phutHomNay, 9999)}</span> {t('ofGoalMinutes', { n: mucTieuPhut })}
            </span>
            {datHomNay && <span className="text-xs font-semibold text-mint-ink">{t('goalReached')}</span>}
          </p>
          <div
            role="progressbar"
            aria-label={t('todayMinutes', { m: Math.min(phutHomNay, 9999), n: mucTieuPhut })}
            aria-valuemin={0}
            aria-valuemax={mucTieuPhut}
            aria-valuenow={Math.min(phutHomNay, mucTieuPhut)}
            className="mt-1.5 h-2 overflow-hidden rounded-full bg-card"
          >
            <div className={cn('h-full w-full origin-left rounded-full transition-transform duration-500 motion-reduce:transition-none', datHomNay ? 'bg-mint-ink' : 'bg-butter-ink')}
              style={{ transform: `scaleX(${tiLeHomNay})` }} />
          </div>
          <p className="mt-1.5 text-xs text-foreground/75">{t('streakHint')}</p>
        </div>
        {/* Nut chi ghi "Muc tieu"; trinh doc man hinh van nghe du "Muc tieu: N phut/ngay" */}
        <Button variant="ghost" size="sm" className="kich-dong h-8 shrink-0 gap-1.5 rounded-full bg-card/70 px-3 text-xs hover:bg-card" aria-label={t('goalPerDay', { n: mucTieuPhut })} onClick={() => datMoMucTieu(true)}>
          <Target data-dong="dich" className="size-3.5" aria-hidden="true" /> {t('goalShort')}
        </Button>
      </div>

      {/* Chi gan khi mo: moi lan mo lay lai muc tieu hien tai lam lua chon ban dau */}
      {moMucTieu && <HopMucTieu mo onDong={() => datMoMucTieu(false)} />}
    </section>
  );
}
