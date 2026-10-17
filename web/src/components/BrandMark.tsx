import { cn } from '@/lib/utils';

/** Logo: bien tuyen vang "DM" (nhu bien mot tuyen tau) + ten bang chu bien ga */
export function BrandMark({ className, nho = false }: { className?: string; nho?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2 font-display font-extrabold', className)}>
      <span className={cn('grid place-items-center rounded-full bg-signal leading-none text-signal-foreground', nho ? 'size-8 text-xs' : 'size-10 text-sm')} aria-hidden="true">
        DM
      </span>
      <span className={nho ? 'text-base' : 'text-lg'}>DevMaster Hub</span>
    </span>
  );
}
