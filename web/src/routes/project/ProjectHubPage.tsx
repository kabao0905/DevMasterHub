import { Link } from 'react-router';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { ChuDam } from '@/components/ChuDam';
import { useYTuong } from './use-y-tuong';

/** Project Lab: ba loi vao — theo cap do, theo chu de, idea da luu */
export function ProjectHubPage() {
  const { t } = useT();
  const { ds, dangTai } = useYTuong();
  usePageMeta({ title: `${t('projectLabTitle')} | DevMaster Hub`, description: t('projectLabSubtitle') });

  const the = 'group flex flex-col gap-3 rounded-2xl border bg-card p-6 transition-colors hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-ring';
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">🚀 {t('projectLabTitle')}</h1>
        <p className="max-w-2xl text-muted-foreground">{t('projectLabSubtitle')}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/project-level" className={the}>
          <span className="text-3xl" aria-hidden="true">📊</span>
          <h2 className="text-lg font-semibold">{t('byLevelTitle')}</h2>
          <p className="flex-1 text-sm text-muted-foreground">{t('byLevelDesc')}</p>
          <span className="text-sm font-medium text-primary">{t('startBtn')}</span>
        </Link>
        <Link to="/project-topic" className={the}>
          <span className="text-3xl" aria-hidden="true">📝</span>
          <h2 className="text-lg font-semibold">{t('byTopicTitle')}</h2>
          <p className="flex-1 text-sm text-muted-foreground">{t('byTopicDesc')}</p>
          <span className="text-sm font-medium text-primary">{t('startBtn')}</span>
        </Link>
        <Link to="/saved-ideas" className={the}>
          <span className="text-3xl" aria-hidden="true">📂</span>
          <h2 className="text-lg font-semibold">{t('savedIdeasTitle')}</h2>
          <p className="flex-1 text-sm text-muted-foreground">
            {dangTai ? '…' : ds.length > 0 ? <ChuDam khoa="savedIdeasCount" bien={{ n: ds.length }} /> : t('noSavedIdeasYet')}
          </p>
          {ds.length > 0 && <span className="text-sm font-medium text-primary">{t('viewSavedBtn', { n: ds.length })}</span>}
        </Link>
      </div>
    </div>
  );
}
