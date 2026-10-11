import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DuAn } from './use-du-an';

/** Chat voi AI Mentor ve project dang lam (gui kem idea va code hien tai) */
export function MentorChat({ duAn }: { duAn: DuAn }) {
  const { t } = useT();
  const { kho } = duAn;
  const [nhap, datNhap] = useState('');
  const dsRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = dsRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [kho.chat.length, kho.dangGui]);

  function gui() {
    if (!nhap.trim() || kho.dangGui) return;
    duAn.hoi(nhap);
    datNhap('');
  }

  function khiGo(e: KeyboardEvent<HTMLInputElement>) {
    // Dang go chu co dau (IME) thi Enter la chot chu; Safari bao keyCode 229
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      gui();
    }
  }
  const khiGui = (e: FormEvent) => { e.preventDefault(); gui(); };

  return (
    <section aria-labelledby="tieu-de-mentor" className="overflow-hidden rounded-2xl border bg-card">
      <h2 id="tieu-de-mentor" className="border-b px-5 py-3 text-sm font-semibold">{t('chatWithAiMentor')}</h2>
      <ol ref={dsRef} aria-live="polite" className="max-h-[28rem] space-y-3 overflow-y-auto px-5 py-4">
        {kho.chat.length === 0 && !kho.dangGui && <li className="text-sm text-muted-foreground">{t('askAiAboutProject')}</li>}
        {kho.chat.map((m, i) => (
          <li key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
              m.role === 'user' ? 'whitespace-pre-wrap bg-primary text-primary-foreground' : 'bg-muted'
            )}>
              {m.role === 'user' ? m.content : <ChatMarkdown text={m.content} />}
            </div>
          </li>
        ))}
        {kho.dangGui && <li className="text-sm text-muted-foreground motion-safe:animate-pulse">{t('thinking')}…</li>}
        {kho.loiChat && !kho.dangGui && (
          <li role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm">
            <span>{t('mentorFailed', { error: kho.loiChat })}</span>
            <Button variant="outline" size="sm" onClick={duAn.guiLai}>{t('resend')}</Button>
          </li>
        )}
      </ol>
      <form onSubmit={khiGui} className="flex items-center gap-2 border-t p-3">
        <input
          value={nhap}
          onChange={e => datNhap(e.target.value)}
          onKeyDown={khiGo}
          aria-label={t('askAboutProject')}
          placeholder={t('askAboutProject')}
          autoComplete="off"
          className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" disabled={kho.dangGui || !nhap.trim()}>
          <Send aria-hidden="true" /> {t('sendMessage')}
        </Button>
      </form>
    </section>
  );
}
