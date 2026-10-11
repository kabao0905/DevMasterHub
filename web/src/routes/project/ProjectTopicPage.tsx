import { useEffect, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { Bot, Loader2 } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { ChuDam } from '@/components/ChuDam';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CapDo } from '@/lib/project-ai';
import { CAP_HIEN, useAiBat, useDuAn } from './use-du-an';
import { KhuLamViec, LoiTaoIdea } from './IdeaPanel';

/** Goi y chu de (nhan tieng Anh nhu app cu) */
const GOI_Y = ['🎮 Game', '🌐 Website', '📱 Mobile App', '🤖 Chatbot', '📊 Dashboard', '🛒 E-commerce', '📝 Todo App', '🎵 Music Player', '☁️ Weather App', '💬 Social Media'];
const boEmoji = (s: string) => s.replace(/^\S+\s/u, '');

/** Project theo chu de: go chu de (va cap mong muon) -> AI thiet ke project */
export function ProjectTopicPage() {
  const { t } = useT();
  const { topic: chuDeUrl } = useParams();
  const duAn = useDuAn('topic');
  const { kho } = duAn;
  const aiBat = useAiBat();
  usePageMeta({ title: `${t('byTopicHeader').replace(/^\S+\s/u, '')} | DevMaster Hub`, description: t('byTopicHeaderDesc') });

  // Link /project-topic/<chu de>: dien san chu de
  const { datChuDe } = duAn;
  useEffect(() => { if (chuDeUrl) datChuDe(chuDeUrl); }, [chuDeUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const khiGui = (e: FormEvent) => { e.preventDefault(); duAn.taoIdea(); };
  const capTuyChon: { id: CapDo | null; ten: string; emoji: string; moTa: string }[] = [{ id: null, ten: 'Auto', emoji: '🎯', moTa: 'aiSelects' }, ...CAP_HIEN];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link to="/project" className="inline-flex text-sm text-muted-foreground hover:text-foreground">{t('backToProjectLab')}</Link>
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('byTopicHeader')}</h1>
        <p className="text-muted-foreground">{t('byTopicHeaderDesc')}</p>
      </header>

      <section className="space-y-4 rounded-2xl border bg-card p-5">
        <form onSubmit={khiGui} className="flex flex-col gap-2 sm:flex-row">
          <input
            value={kho.topic}
            onChange={e => duAn.datChuDe(e.target.value)}
            aria-label={t('topicLabel')}
            placeholder={t('topicInputPlaceholder')}
            autoComplete="off"
            className="h-11 flex-1 rounded-lg border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {aiBat && (
            <Button type="submit" className="h-11 bg-brand text-white hover:opacity-90" disabled={!!kho.dangTao || !kho.topic.trim()}>
              {kho.dangTao ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Bot aria-hidden="true" />}
              {kho.dangTao ? t('generatingIdea') : t('generateIdeaBtn')}
            </Button>
          )}
        </form>
        <div className="flex flex-wrap gap-2">
          {GOI_Y.map(g => (
            <Button key={g} variant="outline" size="sm" className="rounded-full" onClick={() => duAn.datChuDe(boEmoji(g))}>{g}</Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('levelPickerLabel')}>
          <span className="text-sm text-muted-foreground">{t('levelPickerLabel')}:</span>
          {capTuyChon.map(c => (
            <button key={c.id ?? 'auto'} type="button" aria-pressed={kho.level === c.id} title={t(c.moTa)} onClick={() => duAn.chonCap(c.id)}
              className={cn('rounded-full border px-3 py-1 text-sm transition-colors hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-ring',
                kho.level === c.id && 'border-primary bg-primary/10 text-primary')}>
              <span aria-hidden="true">{c.emoji}</span> {c.ten}
            </button>
          ))}
        </div>
        {aiBat === false && <p className="text-sm text-muted-foreground">⚠️ {t('aiDisabled')}</p>}
      </section>

      {kho.loiTao && !kho.dangTao && <LoiTaoIdea loi={kho.loiTao} thuLai={duAn.taoIdea} />}
      {kho.dangTao && (
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-6 text-sm" aria-live="polite">
          <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
          <p>🤖 <ChuDam khoa="aiGeneratingTopicIdea" bien={{ topic: kho.topic.trim() }} /></p>
        </div>
      )}
      <KhuLamViec duAn={duAn} cheDo="topic" aiBat={aiBat === true} />
    </div>
  );
}
