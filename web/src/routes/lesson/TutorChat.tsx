import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { Bot, Send, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { khoaBai } from '@/lib/progress';
import { hoiGiaSu, nguCanhBai, type BaiTapAi, type TabBai, type TinNhan, type TrangThaiQuiz } from '@/lib/ai';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { useXacNhan } from '@/components/XacNhan';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BaiDangMo } from './use-quiz-bai';

type KhoChat = { tinNhan: TinNhan[]; dangGui: boolean; loi?: string; dangViet?: string };
const RONG: KhoChat = { tinNhan: [], dangGui: false };

const NHAN_TAB: Record<TabBai, string> = { theory: 'tabLabelTheory', code: 'tabLabelCode', quiz: 'tabLabelQuiz', exercise: 'tabLabelExercise' };
const GOI_Y = [
  { nut: 'explainSimplyBtn', cau: 'explainSimply' },
  { nut: 'moreExamplesBtn', cau: 'moreExamples' },
  { nut: 'keyTakeawaysBtn', cau: 'keyTakeaways' }
];

type Props = { bai: BaiDangMo; tab: TabBai; quiz?: TrangThaiQuiz; baiTap?: { hienTai?: BaiTapAi | null; code?: string } };

export function TutorChat({ bai, tab, quiz, baiTap }: Props) {
  const { t, lang } = useT();
  const { client, user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;
  const kb = khoaBai(bai.tech.id, bai.level.id, bai.lesson.id);
  const khoa = useMemo<QueryKey>(() => ['tutor', uid, kb], [uid, kb]);
  const { data = RONG } = useQuery({ queryKey: khoa, queryFn: () => RONG, initialData: RONG, staleTime: Infinity, gcTime: Infinity });
  const [nhap, datNhap] = useState('');
  const [nhacTrong, datNhacTrong] = useState(false);
  const [hoiXacNhan, hopXacNhan] = useXacNhan();
  const dsRef = useRef<HTMLOListElement>(null);
  const oRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = dsRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [data.tinNhan.length, data.dangGui, data.dangViet]);

  const capNhat = (k: QueryKey, f: (s: KhoChat) => KhoChat) => {
    if (!qc.getQueryState(k)) return;
    qc.setQueryData<KhoChat>(k, s => f(s ?? RONG));
  };

  async function gui(k: QueryKey, cauHoi: string, lichSu: TinNhan[]) {
    capNhat(k, s => ({ ...s, dangGui: true, loi: undefined, dangViet: undefined }));
    try {
      const traLoi = await hoiGiaSu(client, {
        nguCanh: nguCanhBai({ ...bai, tab, quiz, baiTap }), lichSu, cauHoi, tab,
        daNopQuiz: tab === 'quiz' && !!quiz?.submitted, lang,
        khiCo: phan => capNhat(k, s => ({ ...s, dangViet: (s.dangViet ?? '') + phan }))
      });
      capNhat(k, s => ({ tinNhan: [...s.tinNhan, { role: 'assistant', content: traLoi }], dangGui: false }));
    } catch (e) {
      capNhat(k, s => ({ ...s, dangGui: false, dangViet: undefined, loi: e instanceof Error ? e.message : String(e) }));
    }
  }

  function hoi(cauHoi: string) {
    const hienTai = qc.getQueryData<KhoChat>(khoa) ?? RONG;
    if (hienTai.dangGui || !cauHoi.trim()) return;
    capNhat(khoa, s => ({ ...s, tinNhan: [...s.tinNhan, { role: 'user', content: cauHoi.trim() }] }));
    datNhap('');
    void gui(khoa, cauHoi.trim(), hienTai.tinNhan);
  }

  function guiLai() {
    const hienTai = qc.getQueryData<KhoChat>(khoa) ?? RONG;
    const cuoi = hienTai.tinNhan.at(-1);
    if (hienTai.dangGui || cuoi?.role !== 'user') return;
    void gui(khoa, cuoi.content, hienTai.tinNhan.slice(0, -1));
  }

  function khiGo(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      guiO();
    }
  }

  function guiO() {
    if (!nhap.trim()) {
      datNhacTrong(true);
      oRef.current?.focus();
      return;
    }
    hoi(nhap);
  }

  async function xoaHoiThoai() {
    if (!(await hoiXacNhan(t('clearChatConfirm'), t('delete')))) return;
    qc.setQueryData<KhoChat>(khoa, RONG);
  }

  const khiGui = (e: FormEvent) => { e.preventDefault(); guiO(); };

  return (
    <section aria-labelledby="tieu-de-gia-su" className="overflow-hidden rounded-3xl bg-card shadow-soft">
      <header className="flex items-center justify-between gap-3 px-5 py-4">
        <h2 id="tieu-de-gia-su" className="flex items-center gap-2.5 font-display text-base font-extrabold tracking-tight">
          <span className="grid size-9 place-items-center rounded-2xl bg-lavender text-lavender-ink" aria-hidden="true"><Bot className="size-5" /></span>
          {t('tutorHeader')} {t(NHAN_TAB[tab])}
        </h2>
        {data.tinNhan.length > 0 && (
          <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground" disabled={data.dangGui}
            onClick={() => { void xoaHoiThoai(); }}>
            <Trash2 aria-hidden="true" /> {t('clearLessonChat')}
          </Button>
        )}
      </header>

      <ol ref={dsRef} aria-live="polite" className="max-h-[28rem] space-y-3 overflow-y-auto bg-canvas px-5 py-4">
        {data.tinNhan.length === 0 && (
          <li className="space-y-3">
            <p className="text-sm text-muted-foreground">{t('tutorWelcome')}</p>
            <div className="flex flex-wrap gap-2">
              {GOI_Y.map(g => (
                <Button key={g.nut} variant="outline" size="sm" className="rounded-full bg-card" disabled={data.dangGui} onClick={() => hoi(t(g.cau))}>{t(g.nut)}</Button>
              ))}
            </div>
          </li>
        )}
        {data.tinNhan.map((m, i) => (
          <li key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[85%] min-w-0 rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words',
              m.role === 'user' ? 'whitespace-pre-wrap rounded-br-md bg-lavender text-foreground' : 'rounded-bl-md bg-card shadow-soft'
            )}>
              {m.role === 'user' ? m.content : <ChatMarkdown text={m.content} />}
            </div>
          </li>
        ))}
        {data.dangGui && (data.dangViet
          ? (
            <li aria-hidden="true" className="flex justify-start">
              <div className="max-w-[85%] min-w-0 rounded-2xl rounded-bl-md bg-card px-4 py-2.5 text-sm leading-relaxed break-words shadow-soft">
                <ChatMarkdown text={data.dangViet} />
              </div>
            </li>
          )
          : <li className="w-fit rounded-full bg-lavender px-3 py-1 text-sm text-lavender-ink motion-safe:animate-pulse">{t('thinking')}…</li>
        )}
        {data.loi && !data.dangGui && (
          <li role="alert" className="flex flex-wrap items-center gap-3 rounded-2xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            <span className="min-w-0 break-words">{t('tutorFailed', { error: data.loi })}</span>
            <Button variant="outline" size="sm" className="rounded-full" onClick={guiLai}>{t('resend')}</Button>
          </li>
        )}
      </ol>

      <form onSubmit={khiGui} className="space-y-1.5 p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={oRef}
            name="message"
            value={nhap}
            onChange={e => { datNhap(e.target.value); if (nhacTrong) datNhacTrong(false); }}
            onKeyDown={khiGo}
            rows={1}
            aria-label={t('askAiPlaceholder')}
            aria-describedby="gia-su-nhac"
            placeholder={t('askAiPlaceholder')}
            className="field-sizing-content max-h-40 min-h-10 flex-1 resize-none rounded-2xl border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" className="rounded-full" disabled={data.dangGui}>
            <Send aria-hidden="true" /> {t('sendMessage')}
          </Button>
        </div>
        <p id="gia-su-nhac" role="alert" className="px-1 text-sm text-destructive empty:hidden">{nhacTrong && !nhap.trim() ? t('emptyInputHint') : ''}</p>
      </form>
      {hopXacNhan}
    </section>
  );
}
