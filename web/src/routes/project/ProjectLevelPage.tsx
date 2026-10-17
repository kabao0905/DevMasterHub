import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Bot, Loader2, Target } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { laCapDo, type CapDo } from '@/lib/project-ai';
import { ChuDam } from '@/components/ChuDam';
import { MAU_CAP } from '@/components/LevelLadder';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CAP_HIEN, useAiBat, useDuAn } from './use-du-an';
import { KhuLamViec, LoiTaoIdea } from './IdeaPanel';

/** Project theo cap do: chon cap -> AI tao idea -> chat mentor, soan code, nop cham */
export function ProjectLevelPage() {
  const { t } = useT();
  const { level: capUrl } = useParams();
  const navigate = useNavigate();
  const duAn = useDuAn('level');
  const { kho } = duAn;
  const aiBat = useAiBat();
  usePageMeta({ title: `${t('byLevelHeader')} | DevMaster Hub`, description: t('byLevelHeaderDesc') });

  // Link chia se /project-level/<cap>: chon san cap do do — nhung dang lam project thi khong xoa no
  // (Back/Forward toi mot muc lich su cu): dua URL ve cap dang lam
  const { chonCap } = duAn;
  useEffect(() => {
    if (!laCapDo(capUrl) || capUrl === kho.level) return;
    if (kho.idea && kho.level) navigate(`/project-level/${kho.level}`, { replace: true, preventScrollReset: true });
    else chonCap(capUrl);
  }, [capUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  function chon(cap: CapDo) {
    duAn.chonCap(cap);
    navigate(`/project-level/${cap}`, { replace: true, preventScrollReset: true });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link to="/project" className="inline-flex text-sm text-muted-foreground hover:text-foreground">{t('backToProjectLab')}</Link>
      <header className="space-y-1">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">{t('byLevelHeader')}</h1>
        <p className="text-muted-foreground">{t('byLevelHeaderDesc')}</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CAP_HIEN.map(c => (
          <button key={c.id} type="button" aria-pressed={kho.level === c.id} onClick={() => chon(c.id)}
            className={cn('flex flex-col items-start gap-1 rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-ring',
              kho.level === c.id && 'border-primary bg-primary/10')}>
            <span className="flex items-center gap-2 font-semibold"><span className={cn('size-3 rounded-full', MAU_CAP[c.id])} aria-hidden="true" />{c.ten}</span>
            <span className="text-xs text-muted-foreground">{t(c.moTa)}</span>
          </button>
        ))}
      </div>

      {kho.level && kho.loiTao && !kho.dangTao && <LoiTaoIdea loi={kho.loiTao} thuLai={duAn.taoIdea} />}

      {kho.level && kho.dangTao && (
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-6 text-sm" aria-live="polite">
          <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
          <p><ChuDam khoa="aiGeneratingLevelIdea" bien={{ level: kho.level }} /></p>
        </div>
      )}

      {kho.level && !kho.idea && !kho.dangTao && (
        <div className="space-y-4 rounded-2xl border bg-card p-10 text-center">
          <Target className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-lg font-semibold">{t('readyTitle')}</h2>
          <p className="text-muted-foreground"><ChuDam khoa="clickBelowForIdea" bien={{ level: kho.level }} /></p>
          {aiBat === undefined ? null : aiBat
            ? <Button className="bg-signal text-signal-foreground hover:bg-signal hover:brightness-105" onClick={duAn.taoIdea}><Bot aria-hidden="true" /> {t('generateIdeaBtn')}</Button>
            : <p className="text-sm text-muted-foreground">{t('aiDisabled')}</p>}
        </div>
      )}

      {kho.level && <KhuLamViec duAn={duAn} cheDo="level" aiBat={aiBat === true} />}
    </div>
  );
}
