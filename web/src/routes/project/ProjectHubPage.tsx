import { Link } from 'react-router';
import { ArrowRight, FolderOpen, Signal, Tag, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { ChuDam } from '@/components/ChuDam';
import { cn } from '@/lib/utils';
import { useYTuong } from './use-y-tuong';

/** Mot loi vao: ca the la mot mang pastel, o icon trang, chu muc dam cung mau */
function LoiVao({ to, nen, muc, Icon, tieuDe, moTa, nut }: {
  to: string; nen: string; muc: string; Icon: LucideIcon; tieuDe: string; moTa: ReactNode; nut: ReactNode;
}) {
  return (
    <Link to={to} className={cn('the-noi group flex flex-col gap-3 rounded-3xl p-6 text-foreground focus-visible:outline-2 focus-visible:outline-ring', nen)}>
      <span className={cn('grid size-12 place-items-center rounded-2xl bg-card', muc)} aria-hidden="true"><Icon className="size-6" /></span>
      <h2 className="font-display text-xl font-extrabold tracking-tight">{tieuDe}</h2>
      <p className="flex-1 text-sm leading-relaxed">{moTa}</p>
      {nut && (
        <span className={cn('inline-flex items-center gap-1.5 text-sm font-semibold', muc)}>
          {nut}<ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      )}
    </Link>
  );
}

/** Project Lab: ba loi vao — theo cap do (hong), theo chu de (tim), idea da luu (xanh troi) */
export function ProjectHubPage() {
  const { t } = useT();
  const { ds, dangTai } = useYTuong();
  usePageMeta({ title: `${t('projectLabTitle')} | DevMaster Hub`, description: t('projectLabSubtitle') });

  const moTaDaLuu = dangTai
    ? t('loading')
    : ds.length > 0 ? <ChuDam khoa="savedIdeasCount" bien={{ n: ds.length }} /> : t('noSavedIdeasYet');
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance">{t('projectLabTitle')}</h1>
        <p className="max-w-2xl text-muted-foreground">{t('projectLabSubtitle')}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <LoiVao to="/project-level" nen="bg-pink" muc="text-pink-ink" Icon={Signal}
          tieuDe={t('byLevelTitle')} moTa={t('byLevelDesc')} nut={t('startBtn')} />
        <LoiVao to="/project-topic" nen="bg-lavender" muc="text-lavender-ink" Icon={Tag}
          tieuDe={t('byTopicTitle')} moTa={t('byTopicDesc')} nut={t('startBtn')} />
        <LoiVao to="/saved-ideas" nen="bg-sky" muc="text-sky-ink" Icon={FolderOpen}
          tieuDe={t('savedIdeasTitle')} moTa={moTaDaLuu} nut={ds.length > 0 ? t('viewSavedBtn', { n: ds.length }) : null} />
      </div>
    </div>
  );
}
