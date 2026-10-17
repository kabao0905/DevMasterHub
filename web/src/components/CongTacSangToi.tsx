// Cong tac gat sang / toi: ben sang num co mat troi tren nen troi xanh co may; gat sang toi num truot qua,
// mat troi xoay mo di, mat trang xoay vao, nen thanh dem co sao. Ca trang doi mau bang hieu ung lan tron
// tu chinh cong tac (lib/che-do.ts). Ai bat "giam chuyen dong": num truot nhanh khong nhun, trang chi mo dan.
import type { MouseEvent } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { useCheDo } from '@/lib/che-do';
import { cn } from '@/lib/utils';

/** Nhun nhe khi num dung lai (vuot qua mot chut roi ve) */
const NHUN = 'duration-500 ease-[cubic-bezier(.68,-0.35,.27,1.35)] motion-reduce:duration-200 motion-reduce:ease-out';
const SAO = [
  'top-1.5 left-2 size-1', 'top-4 left-4 size-0.5', 'top-2.5 left-6 size-0.5', 'bottom-1.5 left-3 size-0.5'
];

export function CongTacSangToi({ className }: { className?: string }) {
  const { t } = useT();
  const [cheDo, doiCheDo] = useCheDo();
  const toi = cheDo === 'toi';

  const gat = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    doiCheDo(toi ? 'sang' : 'toi', { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={toi}
      aria-label={t('darkMode')}
      title={t('darkMode')}
      onClick={gat}
      className={cn(
        'relative h-8 w-15 shrink-0 cursor-pointer overflow-hidden rounded-full shadow-inner ring-1 ring-white/15 transition-colors duration-500 motion-reduce:duration-200 motion-reduce:ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        toi ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900' : 'bg-gradient-to-br from-sky-300 to-sky-500',
        className
      )}
    >
      {/* May (ban ngay) troi sang phai va mo khi gat sang toi */}
      <span aria-hidden="true" className={cn('absolute right-1.5 bottom-1 h-2.5 w-5 rounded-full bg-white/85 transition-all', NHUN,
        toi ? 'translate-x-4 opacity-0' : 'opacity-100')} />
      <span aria-hidden="true" className={cn('absolute top-1.5 right-4 h-1.5 w-3 rounded-full bg-white/70 transition-all delay-75', NHUN,
        toi ? 'translate-x-5 opacity-0' : 'opacity-100')} />
      {/* Sao (ban dem) hien dan */}
      {SAO.map((vt, i) => (
        <span key={vt} aria-hidden="true" style={{ transitionDelay: toi ? `${150 + i * 70}ms` : '0ms' }}
          className={cn('absolute rounded-full bg-white transition-all duration-500 motion-reduce:duration-200 motion-reduce:ease-out', vt,
            toi ? 'scale-100 opacity-90' : 'scale-0 opacity-0')} />
      ))}
      {/* Num */}
      <span aria-hidden="true" className={cn(
        'absolute top-1 left-1 grid size-6 place-items-center rounded-full shadow-md transition-[transform,background-color]', NHUN,
        toi ? 'translate-x-7 bg-slate-100' : 'translate-x-0 bg-amber-50'
      )}>
        <Sun className={cn('absolute size-4 text-amber-500 transition-all', NHUN,
          toi ? '-rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100')} />
        <Moon className={cn('absolute size-3.5 fill-slate-300 text-slate-500 transition-all', NHUN,
          toi ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0')} />
      </span>
    </button>
  );
}
