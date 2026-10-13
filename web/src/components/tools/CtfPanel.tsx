import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useT } from '@/lib/i18n';
import { dichThuThach } from '@/lib/terminal-ban-dich';
import { cn } from '@/lib/utils';
import type { KenhTerminal } from './use-terminal';

/** Bang thu thach CTF gan voi mot terminal: diem, the thu thach, o nop co */
export function CtfPanel({ kenh }: { kenh: KenhTerminal }) {
  const { may, nghe } = kenh;
  const { t, lang } = useT();
  const [, veLai] = useState(0);
  const [co, datCo] = useState('');
  // Nop co bang lenh "submit" trong terminal cung phai cap nhat bang nay
  useEffect(() => nghe('diem', () => veLai(v => v + 1)), [nghe]);

  const daGiai = may.coDaGiai();

  function nop(e: FormEvent) {
    e.preventDefault();
    if (!co.trim()) return;
    // Phan loai theo trang thai may (so co da giai), khong theo chu trong cau bao — cau bao da dich theo ngon ngu
    const truoc = may.coDaGiai().size;
    const kq = may.checkFlag(co);
    if (may.coDaGiai().size > truoc) toast.success(kq);
    else if (may.CHALLENGES.some(c => c.flag === co.trim())) toast.warning(kq);
    else toast.error(kq);
    datCo('');
  }

  return (
    <section aria-label={t('ctfRegion')} className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border bg-card p-5">
        <div>
          <p className="text-sm text-muted-foreground">{t('ctfScore')}</p>
          <p className="text-2xl font-semibold tabular-nums">{may.diem()} XP</p>
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">{t('ctfFlagCount', { n: daGiai.size, total: may.CHALLENGES.length })}</p>
        <form onSubmit={nop} className="flex w-full gap-2 sm:w-auto">
          <Input value={co} onChange={e => datCo(e.target.value)} aria-label={t('ctfFlagLabel')} placeholder="FLAG{...}" className="font-mono sm:w-72" spellCheck={false} />
          <Button type="submit">{t('ctfSubmitBtn')}</Button>
        </form>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {may.CHALLENGES.map(goc => {
          const c = dichThuThach(goc, lang);
          const xong = daGiai.has(c.id);
          return (
            <article key={c.id} aria-label={c.title} className={cn('rounded-xl border bg-card p-4', xong && 'border-level-newbie/50 bg-level-newbie/5')}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium">{c.title}</h3>
                <span className={cn('shrink-0 text-xs font-medium tabular-nums', xong ? 'text-level-newbie' : 'text-muted-foreground')}>
                  {xong ? t('ctfSolved') : `+${c.points} XP`}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
              <details className="mt-2 text-sm">
                <summary className="cursor-pointer text-primary">{t('showHints')}</summary>
                <p className="mt-1 text-muted-foreground">{c.hint}</p>
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}
