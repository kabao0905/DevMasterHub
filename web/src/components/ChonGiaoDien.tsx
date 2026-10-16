// Chon kieu giao dien ngay trong sidebar (kieu Co dien). Kieu Pastel chon trong menu Tai khoan cua thanh tren cung.
import { Moon, Palette } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { useGiaoDien, type GiaoDien } from '@/lib/giao-dien';
import { cn } from '@/lib/utils';

const LUA_CHON: { g: GiaoDien; nhan: string; Icon: typeof Moon }[] = [
  { g: 'co-dien', nhan: 'themeClassic', Icon: Moon },
  { g: 'pastel', nhan: 'themePastel', Icon: Palette }
];

export function ChonGiaoDien({ className }: { className?: string }) {
  const { t } = useT();
  const [giaoDien, datGiaoDien] = useGiaoDien();
  return (
    <div role="radiogroup" aria-label={t('themeLabel')} className={cn('grid grid-cols-2 gap-1 rounded-lg bg-sidebar-accent/60 p-1', className)}>
      {LUA_CHON.map(({ g, nhan, Icon }) => (
        <button
          key={g}
          type="button"
          role="radio"
          aria-checked={giaoDien === g}
          onClick={() => datGiaoDien(g)}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-sidebar-ring',
            giaoDien === g ? 'bg-sidebar font-medium text-sidebar-foreground shadow-sm' : 'text-muted-foreground hover:text-sidebar-foreground'
          )}
        >
          <Icon className="size-3.5" aria-hidden="true" /> {t(nhan)}
        </button>
      ))}
    </div>
  );
}
