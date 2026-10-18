import { cn } from '@/lib/utils';

export function BrandMark({ className, nho = false }: { className?: string; nho?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2 font-display font-extrabold', className)}>
      <span className={cn('grid place-items-center rounded-full bg-signal text-signal-foreground shadow-soft', nho ? 'size-8' : 'size-10')} aria-hidden="true">
        <svg data-dong="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
          className={nho ? 'size-[18px]' : 'size-[22px]'}>
          <path d="M8 7 3 12l5 5" />
          <path d="m14 5-4 14" />
          <path d="m16 7 5 5-5 5" />
        </svg>
      </span>
      <span translate="no" className={nho ? 'text-base' : 'text-lg'}>DevMaster Hub</span>
    </span>
  );
}
