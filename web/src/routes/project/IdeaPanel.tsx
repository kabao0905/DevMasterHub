import { useEffect, useState } from 'react';
import { Check, Clock, RefreshCw, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useT } from '@/lib/i18n';
import { NEN_CAP, CHU_CAP } from '@/components/LevelLadder';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CapDo, YTuong } from '@/lib/project-ai';
import { useYTuong } from './use-y-tuong';
import { MentorChat } from './MentorChat';
import { KhongGianCode } from './KhongGianCode';
import { CHIP } from './mau-diem';
import type { CheDo, DuAn } from './use-du-an';

export function IdeaPanel({ idea }: { idea: YTuong }) {
  const { t } = useT();
  const muc = (tieuDe: string, ds: string[], coSo = false) => ds.length > 0 && (
    <section className="space-y-2">
      <h3 className="font-display font-extrabold tracking-tight">{tieuDe}</h3>
      {coSo
        ? <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed">{ds.map((x, i) => <li key={i}>{x}</li>)}</ol>
        : <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">{ds.map((x, i) => <li key={i}>{x}</li>)}</ul>}
    </section>
  );
  return (
    <article className="space-y-5 rounded-3xl bg-card p-6 shadow-soft">
      <header className="space-y-3">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-balance break-words">{idea.name}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn(CHIP, 'uppercase', NEN_CAP[idea.difficulty], CHU_CAP[idea.difficulty])}>{idea.difficulty}</span>
          {idea.estimatedTime && (
            <span className={cn(CHIP, 'gap-1 bg-butter text-butter-ink')}>
              <Clock className="size-3" aria-hidden="true" /> {idea.estimatedTime}
            </span>
          )}
        </div>
      </header>
      {idea.description && <p className="leading-relaxed text-muted-foreground">{idea.description}</p>}
      {idea.techStack.length > 0 && (
        <section className="space-y-2">
          <h3 className="font-display font-extrabold tracking-tight">{t('techStackTitle')}</h3>
          <ul translate="no" className="flex flex-wrap gap-1.5">
            {idea.techStack.map((x, i) => <li key={i} className={cn(CHIP, 'bg-sky font-mono font-medium text-sky-ink')}>{x}</li>)}
          </ul>
        </section>
      )}
      {muc(t('requirementsTitle'), idea.requirements)}
      {muc(t('stepsTitle'), idea.steps, true)}
      {muc(t('bonusFeaturesTitle'), idea.bonusFeatures)}
    </article>
  );
}

export function KhuLamViec({ duAn, cheDo, aiBat }: { duAn: DuAn; cheDo: CheDo; aiBat: boolean }) {
  const { kho } = duAn;
  if (!kho.idea) return null;
  return (
    <div className="space-y-6">
      <IdeaPanel idea={kho.idea} />
      <HanhDongIdea
        idea={kho.idea}
        nguon={{ source: cheDo, topic: cheDo === 'topic' ? kho.topic.trim() || null : null, level: kho.level }}
        taoMoi={duAn.taoIdea} dangTao={!!kho.dangTao} aiBat={aiBat}
      />
      <MentorChat duAn={duAn} />
      <KhongGianCode duAn={duAn} aiBat={aiBat} />
    </div>
  );
}

export function LoiTaoIdea({ loi, thuLai }: { loi: string; thuLai: () => void }) {
  const { t } = useT();
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <span>{t('projectIdeaFailed', { error: loi })}</span>
      <Button variant="outline" size="sm" className="rounded-full" onClick={thuLai}>{t('retry')}</Button>
    </div>
  );
}

export function HanhDongIdea({ idea, nguon, taoMoi, dangTao, aiBat }: {
  idea: YTuong;
  nguon: { source: 'topic' | 'level'; topic: string | null; level: CapDo | null };
  taoMoi: () => void; dangTao: boolean; aiBat: boolean;
}) {
  const { t } = useT();
  const yTuong = useYTuong();
  const [vuaLuu, datVuaLuu] = useState(false);
  useEffect(() => {
    if (!vuaLuu) return;
    const h = setTimeout(() => datVuaLuu(false), 2000);
    return () => clearTimeout(h);
  }, [vuaLuu]);

  function luu() {
    if (yTuong.luu(idea, nguon) === 'trung') toast.info(t('ideaAlreadySaved'));
    else datVuaLuu(true);
  }

  return (
    <div className="flex flex-wrap gap-3">
      {aiBat && (
        <Button variant="outline" className="rounded-full" onClick={taoMoi} disabled={dangTao}>
          <RefreshCw className={cn(dangTao && 'motion-safe:animate-spin')} aria-hidden="true" /> {t('newIdeaBtn')}
        </Button>
      )}
      <Button variant="outline" className="rounded-full" onClick={luu}>
        {vuaLuu ? <Check aria-hidden="true" /> : <Save aria-hidden="true" />} {vuaLuu ? t('ideaSavedShort') : t('saveIdeaBtn')}
      </Button>
      <span role="status" className="sr-only">{vuaLuu ? t('ideaSavedShort') : ''}</span>
    </div>
  );
}
