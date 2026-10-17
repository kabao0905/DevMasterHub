// Bien tuyen: hinh tron (dai thanh vien thuoc khi ma dai) mang mau cua cong nghe, ghi ma tuyen bang chu bien ga (PY, C++, RS...) — thay cho emoji.
// Chi de nhan dien bang mat: ten cong nghe luon dung ngay canh nen bien an voi trinh doc man hinh.
import { chuTrenNen, maTuyen } from '@/lib/ma-tuyen';
import { cn } from '@/lib/utils';

const CO = {
  nho: 'h-5 min-w-5 px-1 text-[10px]',
  vua: 'h-10 min-w-10 px-1.5 text-sm',
  lon: 'h-16 min-w-16 px-2 text-xl'
} as const;

type Props = {
  tech: { id: string; name: string; color?: string };
  co?: keyof typeof CO;
  className?: string;
};

export function BienTuyen({ tech, co = 'vua', className }: Props) {
  const mau = tech.color || '#5b6470';
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: mau }}
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full font-display leading-none font-extrabold',
        'ring-1 ring-black/10 ring-inset dark:ring-white/25',
        chuTrenNen(mau) === 'trang' ? 'text-white' : 'text-[#14181e]',
        CO[co],
        className
      )}
    >
      {maTuyen(tech)}
    </span>
  );
}
