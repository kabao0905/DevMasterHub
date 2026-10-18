import { memo, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { useT } from '@/lib/i18n';
import type { TinNhan } from '@/lib/ai';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DuAn } from './use-du-an';

const CacTin = memo(function CacTin({ chat }: { chat: TinNhan[] }) {
  return chat.map((m, i) => (
    <li key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
        m.role === 'user' ? 'whitespace-pre-wrap break-words bg-lavender text-foreground [overflow-wrap:anywhere]' : 'min-w-0 bg-card shadow-soft'
      )}>
        {m.role === 'user' ? m.content : <ChatMarkdown text={m.content} />}
      </div>
    </li>
  ));
});

export function MentorChat({ duAn }: { duAn: DuAn }) {
  const { t } = useT();
  const { kho } = duAn;
  const [nhap, datNhap] = useState('');
  const [nhacRong, datNhacRong] = useState(false);
  const dsRef = useRef<HTMLOListElement>(null);
  const oNhapRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = dsRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [kho.chat.length, kho.dangGui]);

  function gui() {
    if (kho.dangGui) return;
    if (!nhap.trim()) {
      datNhacRong(true);
      oNhapRef.current?.focus();
      return;
    }
    duAn.hoi(nhap);
    datNhap('');
  }

  function khiGo(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      gui();
    }
  }
  const khiGui = (e: FormEvent) => { e.preventDefault(); gui(); };

  return (
    <section aria-labelledby="tieu-de-mentor" className="overflow-hidden rounded-3xl bg-card shadow-soft">
      <h2 id="tieu-de-mentor" className="px-5 py-3.5 font-display font-extrabold tracking-tight">{t('chatWithAiMentor')}</h2>
      <ol ref={dsRef} aria-live="polite" className="max-h-[28rem] space-y-3 overflow-y-auto overscroll-contain bg-background px-5 py-4">
        {kho.chat.length === 0 && !kho.dangGui && <li className="text-sm text-muted-foreground">{t('askAiAboutProject')}</li>}
        <CacTin chat={kho.chat} />
        {kho.dangGui && <li className="text-sm text-lavender-ink motion-safe:animate-pulse">{t('thinking')}…</li>}
        {kho.loiChat && !kho.dangGui && (
          <li role="alert" className="flex flex-wrap items-center gap-3 rounded-2xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            <span>{t('mentorFailed', { error: kho.loiChat })}</span>
            <Button variant="outline" size="sm" className="rounded-full" onClick={duAn.guiLai}>{t('resend')}</Button>
          </li>
        )}
      </ol>
      <form onSubmit={khiGui} className="space-y-1.5 p-3">
        <div className="flex items-center gap-2">
          <input
            ref={oNhapRef}
            name="message"
            value={nhap}
            onChange={e => { datNhap(e.target.value); if (nhacRong) datNhacRong(false); }}
            onKeyDown={khiGo}
            aria-label={t('askAboutProject')}
            aria-invalid={nhacRong || undefined}
            aria-describedby={nhacRong ? 'mentor-nhac' : undefined}
            placeholder={t('askAboutProject')}
            autoComplete="off"
            className="h-10 min-w-0 flex-1 rounded-full border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" className="rounded-full" disabled={kho.dangGui}>
            <Send aria-hidden="true" /> {t('sendMessage')}
          </Button>
        </div>
        {nhacRong && <p id="mentor-nhac" role="alert" className="px-4 text-xs text-destructive">{t('emptyInputHint')}</p>}
      </form>
    </section>
  );
}
