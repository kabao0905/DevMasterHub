import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { KenhTerminal } from './use-terminal';

/** Bang thu thach CTF gan voi mot terminal: diem, the thu thach, o nop co */
export function CtfPanel({ kenh }: { kenh: KenhTerminal }) {
  const { may, nghe } = kenh;
  const [, veLai] = useState(0);
  const [co, datCo] = useState('');
  // Nop co bang lenh "submit" trong terminal cung phai cap nhat bang nay
  useEffect(() => nghe('diem', () => veLai(v => v + 1)), [nghe]);

  const daGiai = may.coDaGiai();

  function nop(e: FormEvent) {
    e.preventDefault();
    if (!co.trim()) return;
    const kq = may.checkFlag(co);
    if (kq.includes('CHÍNH XÁC')) toast.success(kq);
    else if (kq.startsWith('⚠️')) toast.warning(kq);
    else toast.error(kq);
    datCo('');
  }

  return (
    <section aria-label="Thử thách CTF" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border bg-card p-5">
        <div>
          <p className="text-sm text-muted-foreground">Điểm</p>
          <p className="text-2xl font-semibold tabular-nums">{may.diem()} XP</p>
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">{daGiai.size}/{may.CHALLENGES.length} cờ</p>
        <form onSubmit={nop} className="flex w-full gap-2 sm:w-auto">
          <Input value={co} onChange={e => datCo(e.target.value)} aria-label="Cờ (FLAG{...})" placeholder="FLAG{...}" className="font-mono sm:w-72" spellCheck={false} />
          <Button type="submit">Nộp cờ</Button>
        </form>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {may.CHALLENGES.map(c => {
          const xong = daGiai.has(c.id);
          return (
            <article key={c.id} aria-label={c.title} className={cn('rounded-xl border bg-card p-4', xong && 'border-level-newbie/50 bg-level-newbie/5')}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium">{c.title}</h3>
                <span className={cn('shrink-0 text-xs font-medium tabular-nums', xong ? 'text-level-newbie' : 'text-muted-foreground')}>
                  {xong ? 'Đã giải' : `+${c.points} XP`}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
              <details className="mt-2 text-sm">
                <summary className="cursor-pointer text-primary">💡 Gợi ý</summary>
                <p className="mt-1 text-muted-foreground">{c.hint}</p>
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}
