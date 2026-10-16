import { Link } from 'react-router';
import { useT } from '@/lib/i18n';
import { tienDoCongNghe } from '@/lib/progress';
import type { CongNgheTomTat } from '@/lib/curriculum';
import { LevelLadder } from '@/components/LevelLadder';

export function TechCard({ tech, done }: { tech: CongNgheTomTat; done: Set<string> }) {
  const { t, techDesc } = useT();
  const td = tienDoCongNghe(tech, done);
  return (
    <Link
      to={`/roadmap/${tech.id}`}
      className="group kich-dong flex flex-col gap-4 rounded-3xl border border-transparent bg-card p-5 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.18)] dark:border-border dark:shadow-none transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-14px_rgba(0,0,0,0.22)] dark:hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:hover:translate-y-0"
    >
      <div className="flex items-start gap-3">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-full text-2xl"
          style={{ backgroundColor: `color-mix(in oklab, ${tech.color || '#58a6ff'} 18%, transparent)` }}
          aria-hidden="true"
        >
          <span data-dong="nhay">{tech.icon}</span>
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold leading-tight">{tech.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{techDesc(tech.id, tech.description)}</p>
        </div>
      </div>
      <div className="mt-auto space-y-2">
        <LevelLadder levels={tech.levels} theoCap={td.theoCap} />
        <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>{td.xong}/{td.tong} {t('lessonsUnit')}</span>
          <span className={td.phanTram > 0 ? 'font-medium text-foreground' : undefined}>{td.phanTram}%</span>
        </div>
      </div>
    </Link>
  );
}
