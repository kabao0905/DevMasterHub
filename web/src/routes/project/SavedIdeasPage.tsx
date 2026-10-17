import { Link, useNavigate } from 'react-router';
import { useXacNhan } from '@/components/XacNhan';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarDays, Clock, Inbox, Play, Signal, Tag, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { NEN_CAP, CHU_CAP } from '@/components/LevelLadder';
import { LoadError } from '@/components/LoadError';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { YTuongDaLuu } from '@/lib/project-db';
import { useYTuong } from './use-y-tuong';
import { moYTuongDaLuu } from './use-du-an';

/** Idea da bookmark de quay lai lam sau */
export function SavedIdeasPage() {
  const { t, lang } = useT();
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const yTuong = useYTuong();
  const [hoi, hopXacNhan] = useXacNhan();
  usePageMeta({ title: `${t('savedIdeasTitle')} | DevMaster Hub`, description: t('savedIdeasDesc') });

  function batDau(s: YTuongDaLuu) {
    const cheDo = moYTuongDaLuu(qc, user?.id, s);
    navigate(cheDo === 'topic' ? '/project-topic' : '/project-level');
  }

  const ngayGio = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.toLocaleDateString(lang, { day: '2-digit', month: '2-digit', year: 'numeric' })} ${d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link to="/project" className="inline-flex text-sm text-muted-foreground hover:text-foreground">{t('backToProjectLab')}</Link>
      <header className="space-y-1">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">{t('savedIdeasTitle')}</h1>
        <p className="text-muted-foreground">{t('savedIdeasDesc')}</p>
      </header>

      {yTuong.loi ? <LoadError onRetry={yTuong.taiLai} />
        : yTuong.dangTai ? <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-48" /><Skeleton className="h-48" /></div>
          : yTuong.ds.length === 0 ? (
            <div className="space-y-3 rounded-2xl border bg-card p-10 text-center">
              <Inbox className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
              <h2 className="text-lg font-semibold">{t('noSavedIdeasYet')}</h2>
              <p className="text-muted-foreground">{t('createIdeaThenSave')}</p>
              <Button asChild className="bg-signal text-signal-foreground hover:bg-signal hover:brightness-105"><Link to="/project-topic">{t('createIdeaByTopicBtn')}</Link></Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {yTuong.ds.map(s => (
                <article key={s.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
                  <header className="space-y-2">
                    <h2 className="text-lg font-semibold">{s.idea.name}</h2>
                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                      <span className={cn('rounded-md px-2 py-0.5 uppercase', NEN_CAP[s.idea.difficulty], CHU_CAP[s.idea.difficulty])}>{s.idea.difficulty}</span>
                      {s.idea.estimatedTime && <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-muted-foreground"><Clock className="size-3" aria-hidden="true" /> {s.idea.estimatedTime}</span>}
                    </div>
                  </header>
                  {s.idea.description && <p className="line-clamp-3 text-sm text-muted-foreground">{s.idea.description}</p>}
                  {s.idea.techStack.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                      {s.idea.techStack.slice(0, 5).map((x, i) => <li key={i} className="rounded-md border px-2 py-0.5 font-mono text-xs">{x}</li>)}
                      {s.idea.techStack.length > 5 && <li className="rounded-md border px-2 py-0.5 font-mono text-xs">+{s.idea.techStack.length - 5}</li>}
                    </ul>
                  )}
                  <footer className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
                    <div className="space-y-0.5 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1"><CalendarDays className="size-3.5" aria-hidden="true" />{ngayGio(s.savedAt)}</p>
                      <p className="flex items-center gap-1">
                        {s.source === 'topic' ? <Tag className="size-3.5" aria-hidden="true" /> : <Signal className="size-3.5" aria-hidden="true" />}
                        {s.source === 'topic' ? s.topic || t('topicLabel') : s.level || s.idea.difficulty}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-signal text-signal-foreground hover:bg-signal hover:brightness-105" onClick={() => batDau(s)}>
                        <Play aria-hidden="true" /> {t('startWorking')}
                      </Button>
                      <Button size="sm" variant="ghost" aria-label={t('deleteIdeaNamed', { name: s.idea.name })} title={t('deleteIdeaNamed', { name: s.idea.name })}
                        onClick={() => { void hoi(t('deleteIdeaConfirm')).then(ok => { if (ok) yTuong.xoa(s.id); }); }}>
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          )}
      {hopXacNhan}
    </div>
  );
}
