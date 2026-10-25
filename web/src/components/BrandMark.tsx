import { cn } from '@/lib/utils';

export function BrandMark({ className, nho = false }: { className?: string; nho?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2 font-display font-extrabold', className)}>
      <span className={cn('grid place-items-center rounded-full bg-signal text-signal-foreground shadow-soft', nho ? 'size-8' : 'size-10')} aria-hidden="true">
        <svg data-dong="logo" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
          className={nho ? 'size-6' : 'size-7'}>
          <g className="logo-cua-so">
            <rect x="3.5" y="5.5" width="25" height="21" rx="5" />
            <path d="M4 11.5h24" />
            <g stroke="none" fill="currentColor">
              <circle className="logo-cham" cx="7.5" cy="8.5" r="0.85" />
              <circle className="logo-cham" cx="10.5" cy="8.5" r="0.85" />
              <path d="M22 7.75h2.5v1.5H22z" opacity="0.4" />
            </g>
            <path className="logo-code-trai" d="m11.5 16-3 3 3 3" />
            <path className="logo-code-gach" d="m17.5 15-3 8" />
            <path className="logo-code-phai" d="m20.5 16 3 3-3 3" />
          </g>
        </svg>
      </span>
      <span translate="no" className={nho ? 'text-base' : 'text-lg'}>DevMaster Hub</span>
    </span>
  );
}
