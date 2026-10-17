// Bien tuyen: hinh tron deu mang mau cua cong nghe, ben trong la logo that cua cong nghe (Simple Icons);
// cong nghe chua co logo thi ghi ma tuyen toi da 3 ky tu (PY, C++, RS...).
// Logo / chu trang hay toi chon theo mot luat: ben nao tuong phan cao hon voi nen (lib/ma-tuyen chuTrenNen).
// Chi de nhan dien bang mat: ten cong nghe luon dung ngay canh nen bien an voi trinh doc man hinh.
import { chuTrenNen, maTuyen } from '@/lib/ma-tuyen';
import { logoCongNghe } from '@/lib/logo-cong-nghe';
import { cn } from '@/lib/utils';

const CO = {
  nho: 'size-6 text-[9px]',
  vua: 'size-10 text-[13px]',
  lon: 'size-16 text-xl'
} as const;

type Props = {
  tech: { id: string; name: string; color?: string };
  co?: keyof typeof CO;
  className?: string;
};

export function BienTuyen({ tech, co = 'vua', className }: Props) {
  const mau = tech.color || '#5b6470';
  const logo = logoCongNghe(tech.id);
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
      {logo ? (
        <svg viewBox="0 0 24 24" className="size-[58%] fill-current" focusable="false"><path d={logo} /></svg>
      ) : maTuyen(tech)}
    </span>
  );
}
