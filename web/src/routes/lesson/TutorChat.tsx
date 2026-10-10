import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { Bot, Send } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { khoaBai } from '@/lib/progress';
import { hoiGiaSu, nguCanhBai, type TabBai, type TinNhan, type TrangThaiQuiz } from '@/lib/ai';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BaiDangMo } from './use-quiz-bai';

type KhoChat = { tinNhan: TinNhan[]; dangGui: boolean; loi?: string };
const RONG: KhoChat = { tinNhan: [], dangGui: false };

const NHAN_TAB: Record<TabBai, string> = { theory: 'tabLabelTheory', code: 'tabLabelCode', quiz: 'tabLabelQuiz', exercise: 'tabLabelExercise' };
const GOI_Y = [
  { nut: 'explainSimplyBtn', cau: 'explainSimply' },
  { nut: 'moreExamplesBtn', cau: 'moreExamples' },
  { nut: 'keyTakeawaysBtn', cau: 'keyTakeaways' }
];

/** Gia su AI cua bai dang mo. Ngu canh gui di theo tab DANG mo (quiz: co cau hoi, chua lo dap an) */
export function TutorChat({ bai, tab, quiz }: { bai: BaiDangMo; tab: TabBai; quiz?: TrangThaiQuiz }) {
  const { t, lang } = useT();
  const { client, user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;
  const kb = khoaBai(bai.tech.id, bai.level.id, bai.lesson.id);
  const khoa = useMemo<QueryKey>(() => ['tutor', uid, kb], [uid, kb]);
  const { data = RONG } = useQuery({ queryKey: khoa, queryFn: () => RONG, initialData: RONG, staleTime: Infinity, gcTime: Infinity });
  const [nhap, datNhap] = useState('');
  const dsRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = dsRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [data.tinNhan.length, data.dangGui]);

  // Ghi theo khoa cua bai LUC HOI: tra loi ve sau khi da doi bai van vao dung bai.
  // Da dang xuat (truy van bi xoa) thi bo qua, khong tao lai du lieu cua nguoi cu.
  const capNhat = (k: QueryKey, f: (s: KhoChat) => KhoChat) => {
    if (!qc.getQueryState(k)) return;
    qc.setQueryData<KhoChat>(k, s => f(s ?? RONG));
  };

  async function gui(k: QueryKey, cauHoi: string, lichSu: TinNhan[]) {
    capNhat(k, s => ({ ...s, dangGui: true, loi: undefined }));
    try {
      const traLoi = await hoiGiaSu(client, {
        nguCanh: nguCanhBai({ ...bai, tab, quiz }), lichSu, cauHoi, tab,
        daNopQuiz: tab === 'quiz' && !!quiz?.submitted, lang
      });
      capNhat(k, s => ({ tinNhan: [...s.tinNhan, { role: 'assistant', content: traLoi }], dangGui: false }));
    } catch (e) {
      capNhat(k, s => ({ ...s, dangGui: false, loi: e instanceof Error ? e.message : String(e) }));
    }
  }

  function hoi(cauHoi: string) {
    const hienTai = qc.getQueryData<KhoChat>(khoa) ?? RONG;
    // Doc tu cache (cap nhat ngay) chu khong tu lan ve truoc: Enter + bam nut cung luc chi gui mot lan
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
    // Dang go chu co dau (IME) thi Enter la chot chu, khong phai gui.
    // Safari bao isComposing = false o phim Enter chot chu nhung keyCode = 229.
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      hoi(nhap);
    }
  }

  const khiGui = (e: FormEvent) => { e.preventDefault(); hoi(nhap); };

  return (
    <section aria-labelledby="tieu-de-gia-su" className="overflow-hidden rounded-2xl border bg-card">
      <header className="flex items-center justify-between gap-3 border-b px-5 py-3">
        <h2 id="tieu-de-gia-su" className="flex items-center gap-2 text-sm font-semibold">
          <Bot className="size-4 text-primary" aria-hidden="true" />
          {t('tutorHeader')} {t(NHAN_TAB[tab])}
        </h2>
        {data.tinNhan.length > 0 && (
          <Button variant="ghost" size="sm" className="text-muted-foreground" disabled={data.dangGui}
            onClick={() => qc.setQueryData<KhoChat>(khoa, RONG)}>
            {t('clearLessonChat')}
          </Button>
        )}
      </header>

      <ol ref={dsRef} aria-live="polite" className="max-h-[28rem] space-y-3 overflow-y-auto px-5 py-4">
        {data.tinNhan.length === 0 && (
          <li className="space-y-3">
            <p className="text-sm text-muted-foreground">{t('tutorWelcome')}</p>
            <div className="flex flex-wrap gap-2">
              {GOI_Y.map(g => (
                <Button key={g.nut} variant="outline" size="sm" disabled={data.dangGui} onClick={() => hoi(t(g.cau))}>{t(g.nut)}</Button>
              ))}
            </div>
          </li>
        )}
        {data.tinNhan.map((m, i) => (
          <li key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
              m.role === 'user' ? 'whitespace-pre-wrap bg-primary text-primary-foreground' : 'bg-muted'
            )}>
              {m.role === 'user' ? m.content : <ChatMarkdown text={m.content} />}
            </div>
          </li>
        ))}
        {data.dangGui && (
          <li className="text-sm text-muted-foreground motion-safe:animate-pulse">{t('thinking')}…</li>
        )}
        {data.loi && !data.dangGui && (
          <li role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm">
            <span>{t('tutorFailed', { error: data.loi })}</span>
            <Button variant="outline" size="sm" onClick={guiLai}>{t('resend')}</Button>
          </li>
        )}
      </ol>

      <form onSubmit={khiGui} className="flex items-end gap-2 border-t p-3">
        <textarea
          value={nhap}
          onChange={e => datNhap(e.target.value)}
          onKeyDown={khiGo}
          rows={1}
          aria-label={t('askAiPlaceholder')}
          placeholder={t('askAiPlaceholder')}
          className="max-h-40 min-h-10 flex-1 resize-y rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" disabled={data.dangGui || !nhap.trim()}>
          <Send aria-hidden="true" /> {t('sendMessage')}
        </Button>
      </form>
    </section>
  );
}
