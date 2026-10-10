import { cn } from '@/lib/utils';

/** Logo: o vuong gradient nhan dien + ten. Gradient chi dung o logo va nut chinh. */
export function BrandMark({ className, nho = false }: { className?: string; nho?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5 font-semibold tracking-tight', className)}>
      <span className={cn('grid place-items-center rounded-lg bg-brand text-white shadow-sm', nho ? 'size-7 text-sm' : 'size-9 text-base')} aria-hidden="true">
        🚀
      </span>
      <span className={nho ? 'text-sm' : 'text-base'}>DevMaster Hub</span>
    </span>
  );
}
