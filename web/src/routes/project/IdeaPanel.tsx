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
import type { CheDo, DuAn } from './use-du-an';

/** Idea project: ten, cap, thoi gian, mo ta, tech stack, yeu cau, cac buoc, bonus */
export function IdeaPanel({ idea }: { idea: YTuong }) {
  const { t } = useT();
  const muc = (tieuDe: string, ds: string[], coSo = false) => ds.length > 0 && (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">{tieuDe}</h3>
      {coSo
        ? <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed">{ds.map((x, i) => <li key={i}>{x}</li>)}</ol>
        : <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">{ds.map((x, i) => <li key={i}>{x}</li>)}</ul>}
    </section>
  );
  return (
    <article className="space-y-5 rounded-2xl border bg-card p-6">
      <header className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">{idea.name}</h2>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className={cn('rounded-md px-2 py-0.5 uppercase', NEN_CAP[idea.difficulty], CHU_CAP[idea.difficulty])}>{idea.difficulty}</span>
          {idea.estimatedTime && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
              <Clock className="size-3" aria-hidden="true" /> {idea.estimatedTime}
            </span>
          )}
        </div>
      </header>
      {idea.description && <p className="leading-relaxed text-muted-foreground">{idea.description}</p>}
      {idea.techStack.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Tech Stack</h3>
          <ul className="flex flex-wrap gap-1.5">
            {idea.techStack.map((x, i) => <li key={i} className="rounded-md border bg-background px-2 py-0.5 font-mono text-xs">{x}</li>)}
          </ul>
        </section>
      )}
      {muc(t('requirementsTitle'), idea.requirements)}
      {muc(t('stepsTitle'), idea.steps, true)}
      {muc(t('bonusFeaturesTitle'), idea.bonusFeatures)}
    </article>
  );
}

/** Phan lam viec chung cua trang theo cap do / theo chu de khi da co idea */
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

/** Loi tao idea: noi ro, cho thu lai */
export function LoiTaoIdea({ loi, thuLai }: { loi: string; thuLai: () => void }) {
  const { t } = useT();
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
      <span>{t('projectIdeaFailed', { error: loi })}</span>
      <Button variant="outline" size="sm" onClick={thuLai}>{t('retry')}</Button>
    </div>
  );
}

/** "Idea moi" va "Luu Idea" duoi panel */
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
        <Button variant="outline" onClick={taoMoi} disabled={dangTao}>
          <RefreshCw className={cn(dangTao && 'animate-spin')} aria-hidden="true" /> {t('newIdeaBtn')}
        </Button>
      )}
      <Button variant="outline" onClick={luu}>
        {vuaLuu ? <Check aria-hidden="true" /> : <Save aria-hidden="true" />} {vuaLuu ? t('ideaSavedShort') : t('saveIdeaBtn')}
      </Button>
    </div>
  );
}
