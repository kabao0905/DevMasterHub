// "Thang 5 cap": moi vach la mot cap do, to dan theo so bai da xong o cap do.
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

export function LevelLadder({ levels, theoCap, className }: Props) {
  const { t } = useT();
  return (
    <div className={cn('flex gap-1', className)} aria-hidden="true">
      {levels.map((cap, i) => {
        const c = theoCap[i] ?? { xong: 0, tong: 0 };
        const pct = c.tong ? (c.xong / c.tong) * 100 : 0;
        return (
          <div
            key={cap.id}
            title={t('levelProgress', { level: cap.name, done: c.xong, total: c.tong })}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
          >
            <div className={cn('h-full rounded-full transition-[width] duration-500', MAU_CAP[cap.id] ?? 'bg-primary')} style={{ width: `${pct}%` }} />
          </div>
        );
      })}
    </div>
  );
}
