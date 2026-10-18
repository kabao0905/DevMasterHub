import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, Bot, Loader2 } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { ChuDam } from '@/components/ChuDam';
import { MAU_CAP } from '@/components/LevelLadder';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { laCapDo, type CapDo } from '@/lib/project-ai';
import { CAP_HIEN, useAiBat, useDuAn } from './use-du-an';
import { KhuLamViec, LoiTaoIdea } from './IdeaPanel';

const GOI_Y = ['Game', 'Website', 'Mobile App', 'Chatbot', 'Dashboard', 'E-commerce', 'Todo App', 'Music Player', 'Weather App', 'Social Media'];

export function ProjectTopicPage() {
  const { t } = useT();
  const { topic: chuDeUrl } = useParams();
  const [thamSo] = useSearchParams();
  const navigate = useNavigate();
  const duAn = useDuAn('topic');
  const { kho } = duAn;
  const aiBat = useAiBat();
  usePageMeta({ title: `${t('byTopicHeader')} | DevMaster Hub`, description: t('byTopicHeaderDesc') });

  const [nhap, datNhap] = useState(kho.topic);
  const [nhacRong, datNhacRong] = useState(false);
  const oRef = useRef<HTMLInputElement>(null);
  const nhapRef = useRef(nhap);
  useEffect(() => { nhapRef.current = nhap; }, [nhap]);
  useEffect(() => { datNhap(kho.topic); }, [kho.topic]);
  const { datChuDe, chonCap } = duAn;
  useEffect(() => () => datChuDe(nhapRef.current), []);

  useEffect(() => { if (chuDeUrl) datChuDe(chuDeUrl); }, [chuDeUrl]);
  const capUrl = thamSo.get('level');
  useEffect(() => { if (laCapDo(capUrl)) chonCap(capUrl); }, [capUrl]);

  function khiGui(e: FormEvent) {
    e.preventDefault();
    const chuDe = nhap.trim();
    if (!chuDe) {
      datNhacRong(true);
      oRef.current?.focus();
      return;
    }
    datChuDe(chuDe);
    duAn.taoIdea();
    const q = kho.level ? `?level=${kho.level}` : '';
    navigate(`/project-topic/${encodeURIComponent(chuDe)}${q}`, { replace: true, preventScrollReset: true });
  }
  const capTuyChon: { id: CapDo | null; ten: string; moTa: string }[] = [{ id: null, ten: t('levelAuto'), moTa: 'aiSelects' }, ...CAP_HIEN];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link to="/project" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />{t('backToProjectLab')}
      </Link>
      <header className="space-y-1">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance">{t('byTopicHeader')}</h1>
        <p className="text-muted-foreground">{t('byTopicHeaderDesc')}</p>
      </header>

      <section className="space-y-4 rounded-3xl bg-card p-5 shadow-soft">
        <form onSubmit={khiGui} noValidate className="space-y-1.5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              ref={oRef}
              name="topic"
              value={nhap}
              onChange={e => { datNhap(e.target.value); if (nhacRong) datNhacRong(false); }}
              aria-label={t('topicLabel')}
              aria-invalid={nhacRong || undefined}
              aria-describedby={nhacRong ? 'chu-de-nhac' : undefined}
              placeholder={t('topicInputPlaceholder')}
              autoComplete="off"
              className="h-11 min-w-0 flex-1 rounded-full border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {aiBat && (
              <Button type="submit" className="h-11 rounded-full bg-signal px-5 text-signal-foreground hover:bg-signal hover:brightness-105" disabled={!!kho.dangTao}>
                {kho.dangTao ? <Loader2 className="motion-safe:animate-spin" aria-hidden="true" /> : <Bot aria-hidden="true" />}
                {kho.dangTao ? t('generatingIdea') : t('generateIdeaBtn')}
              </Button>
            )}
          </div>
          {nhacRong && <p id="chu-de-nhac" role="alert" className="px-4 text-sm text-destructive">{t('emptyInputHint')}</p>}
        </form>
        <div className="flex flex-wrap gap-2">
          {GOI_Y.map(g => (
            <button key={g} type="button" onClick={() => { datNhap(g); datNhacRong(false); }}
              className="rounded-full bg-pink px-3 py-1 text-sm font-medium text-pink-ink transition-colors hover:bg-pink/70 focus-visible:outline-2 focus-visible:outline-ring">
              {g}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('levelPickerLabel')}>
          <span className="text-sm text-muted-foreground">{t('levelPickerLabel')}:</span>
          {capTuyChon.map(c => (
            <button key={c.id ?? 'auto'} type="button" aria-pressed={kho.level === c.id} title={t(c.moTa)} onClick={() => chonCap(c.id)}
              className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                kho.level === c.id ? 'bg-lavender font-semibold text-lavender-ink' : 'bg-background hover:bg-muted')}>
              {c.id && <span className={cn('size-2.5 rounded-full', MAU_CAP[c.id])} aria-hidden="true" />}{c.ten}
            </button>
          ))}
        </div>
        {aiBat === false && <p className="text-sm text-muted-foreground">{t('aiDisabled')}</p>}
      </section>

      {kho.loiTao && !kho.dangTao && <LoiTaoIdea loi={kho.loiTao} thuLai={duAn.taoIdea} />}
      <div aria-live="polite" className="empty:m-0">
        {kho.dangTao && (
          <div className="flex items-center gap-3 rounded-3xl bg-lavender p-6 text-sm text-foreground">
            <Loader2 className="size-5 text-lavender-ink motion-safe:animate-spin" aria-hidden="true" />
            <p><ChuDam khoa="aiGeneratingTopicIdea" bien={{ topic: kho.topic.trim() }} /></p>
          </div>
        )}
      </div>
      <KhuLamViec duAn={duAn} cheDo="topic" aiBat={aiBat === true} />
    </div>
  );
}
