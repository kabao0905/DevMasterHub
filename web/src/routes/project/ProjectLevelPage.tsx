import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Bot, Loader2, Target } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { laCapDo, type CapDo } from '@/lib/project-ai';
import { ChuDam } from '@/components/ChuDam';
import { MAU_CAP } from '@/components/LevelLadder';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CAP_HIEN, useAiBat, useDuAn } from './use-du-an';
import { KhuLamViec, LoiTaoIdea } from './IdeaPanel';

export function ProjectLevelPage() {
  const { t } = useT();
  const { level: capUrl } = useParams();
  const navigate = useNavigate();
  const duAn = useDuAn('level');
  const { kho } = duAn;
  const aiBat = useAiBat();
  usePageMeta({ title: `${t('byLevelHeader')} | DevMaster Hub`, description: t('byLevelHeaderDesc') });

  const { chonCap } = duAn;
  useEffect(() => {
    if (!laCapDo(capUrl) || capUrl === kho.level) return;
    if (kho.idea && kho.level) navigate(`/project-level/${kho.level}`, { replace: true, preventScrollReset: true });
    else chonCap(capUrl);
  }, [capUrl]);

  function chon(cap: CapDo) {
    duAn.chonCap(cap);
    navigate(`/project-level/${cap}`, { replace: true, preventScrollReset: true });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link to="/project" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />{t('backToProjectLab')}
      </Link>
      <header className="space-y-1">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance">{t('byLevelHeader')}</h1>
        <p className="text-muted-foreground">{t('byLevelHeaderDesc')}</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CAP_HIEN.map(c => (
          <button key={c.id} type="button" aria-pressed={kho.level === c.id} onClick={() => chon(c.id)}
            className={cn('flex flex-col items-start gap-1 rounded-2xl p-4 text-left shadow-soft transition-colors focus-visible:outline-2 focus-visible:outline-ring',
              kho.level === c.id ? 'bg-lavender text-foreground' : 'bg-card hover:bg-muted')}>
            <span className="flex items-center gap-2 font-display font-extrabold"><span className={cn('size-3 rounded-full', MAU_CAP[c.id])} aria-hidden="true" />{c.ten}</span>
            <span className={cn('text-xs', kho.level === c.id ? 'text-lavender-ink' : 'text-muted-foreground')}>{t(c.moTa)}</span>
          </button>
        ))}
      </div>

      {kho.level && kho.loiTao && !kho.dangTao && <LoiTaoIdea loi={kho.loiTao} thuLai={duAn.taoIdea} />}

      <div aria-live="polite" className="empty:m-0">
        {kho.level && kho.dangTao && (
          <div className="flex items-center gap-3 rounded-3xl bg-lavender p-6 text-sm text-foreground">
            <Loader2 className="size-5 text-lavender-ink motion-safe:animate-spin" aria-hidden="true" />
            <p><ChuDam khoa="aiGeneratingLevelIdea" bien={{ level: kho.level }} /></p>
          </div>
        )}
      </div>

      {kho.level && !kho.idea && !kho.dangTao && (
        <div className="space-y-4 rounded-3xl bg-card p-10 text-center shadow-soft">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-pink text-pink-ink" aria-hidden="true"><Target className="size-6" /></span>
          <h2 className="font-display text-xl font-extrabold tracking-tight">{t('readyTitle')}</h2>
          <p className="text-muted-foreground"><ChuDam khoa="clickBelowForIdea" bien={{ level: kho.level }} /></p>
          {aiBat === undefined ? null : aiBat
            ? <Button className="rounded-full bg-signal text-signal-foreground hover:bg-signal hover:brightness-105" onClick={duAn.taoIdea}><Bot aria-hidden="true" /> {t('generateIdeaBtn')}</Button>
            : <p className="text-sm text-muted-foreground">{t('aiDisabled')}</p>}
        </div>
      )}

      {kho.level && <KhuLamViec duAn={duAn} cheDo="level" aiBat={aiBat === true} />}
    </div>
  );
}
