// Tuyen mini 5 cap: moi doan la mot cap do, moi cham la mot bai (ga).
// Mau mang thong tin (cap nao), nen dung chung mau voi badge cap do o moi noi.
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';
import type { CapTomTat } from '@/lib/curriculum';

export const MAU_CAP: Record<string, string> = {
  newbie: 'bg-level-newbie',
  junior: 'bg-level-junior',
  mid: 'bg-level-mid',
  senior: 'bg-level-senior',
  master: 'bg-level-master'
};

export const CHU_CAP: Record<string, string> = {
  newbie: 'text-level-newbie',
  junior: 'text-level-junior',
  mid: 'text-level-mid',
  senior: 'text-level-senior',
  master: 'text-level-master'
};

/** Vien ga cung mau cap */
export const VIEN_CAP: Record<string, string> = {
  newbie: 'border-level-newbie',
  junior: 'border-level-junior',
  mid: 'border-level-mid',
  senior: 'border-level-senior',
  master: 'border-level-master'
};

/** Nen nhat cung mau cap (badge, nut tren timeline) */
export const NEN_CAP: Record<string, string> = {
  newbie: 'bg-level-newbie/15',
  junior: 'bg-level-junior/15',
  mid: 'bg-level-mid/15',
  senior: 'bg-level-senior/15',
  master: 'bg-level-master/15'
};

type Props = {
  levels: CapTomTat[];
  theoCap: { capId: string; xong: number; tong: number }[];
  className?: string;
};

/**
 * Tuyen mini: moi cap do la mot doan tuyen mang mau cap, moi bai la mot ga tren doan do.
 * Ga da qua to dac, doan da di dam mau; phan chua toi nhat mau, ga rong. Giua hai cap la cho doi tuyen (khe ho).
 */
export function LevelLadder({ levels, theoCap, className }: Props) {
  const { t } = useT();
  return (
    <div className={cn('flex items-center gap-1.5', className)} aria-hidden="true">
      {levels.map((cap, i) => {
        const c = theoCap[i] ?? { xong: 0, tong: 0 };
        const daDi = c.tong === 0 ? 0 : c.xong >= c.tong ? 100 : c.xong > 0 ? ((c.xong - 0.5) / c.tong) * 100 : 0;
        const mau = MAU_CAP[cap.id] ?? 'bg-primary';
        return (
          <div
            key={cap.id}
            title={t('levelProgress', { level: cap.name, done: c.xong, total: c.tong })}
            className="relative flex h-3 flex-1 items-center justify-around"
          >
            <span className={cn('absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full opacity-25', mau)} />
            <span className={cn('absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full transition-[width] duration-500', mau)} style={{ width: `${daDi}%` }} />
            {Array.from({ length: c.tong }, (_, k) => (
              <span key={k} className={cn('relative size-2 rounded-full border-2', k < c.xong ? cn(mau, VIEN_CAP[cap.id]) : cn('bg-card', VIEN_CAP[cap.id], 'opacity-60'))} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
