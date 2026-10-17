import { Link } from 'react-router';
import { useT } from '@/lib/i18n';
import { tienDoCongNghe } from '@/lib/progress';
import type { CongNgheTomTat } from '@/lib/curriculum';
import { LevelLadder } from '@/components/LevelLadder';
import { BienTuyen } from '@/components/BienTuyen';

/** The tuyen: bien tuyen + ten + tuyen mini cac ga da qua — moi cong nghe la mot tuyen tren ban do */
export function TechCard({ tech, done }: { tech: CongNgheTomTat; done: Set<string> }) {
  const { t, techDesc } = useT();
  const td = tienDoCongNghe(tech, done);
  return (
    <Link
      to={`/roadmap/${tech.id}`}
      className="group kich-dong the-noi flex flex-col gap-4 rounded-2xl border bg-card p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-start gap-3">
        <span data-dong="nhay"><BienTuyen tech={tech} /></span>
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
