import { useT } from '@/lib/i18n';
import { tienDoCongNghe } from '@/lib/progress';
import type { CongNgheTomTat } from '@/lib/curriculum';
import { LevelLadder } from '@/components/LevelLadder';

export function TechCard({ tech, done }: { tech: CongNgheTomTat; done: Set<string> }) {
  const { t, techDesc } = useT();
  const td = tienDoCongNghe(tech, done);
  return (
    <a
      href={`/roadmap/${tech.id}`}
      className="group flex flex-col gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-start gap-3">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-lg text-2xl"
          style={{ backgroundColor: `color-mix(in oklab, ${tech.color || '#58a6ff'} 18%, transparent)` }}
          aria-hidden="true"
        >
          {tech.icon}
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
    </a>
  );
}
