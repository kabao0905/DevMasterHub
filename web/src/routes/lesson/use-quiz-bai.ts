import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { khoaBai } from '@/lib/progress';
import { taoQuiz, type CauHoi, type TrangThaiQuiz } from '@/lib/ai';
import type { BaiDayDu, CapDayDu, CongNgheDayDu } from '@/lib/curriculum';
import { drawQuiz, validateBank, type QuestionBank } from '../../../../shared/quiz-bank.mjs';
import { dichMay } from './use-dich-noi-dung';
import { duongTinh } from '@/lib/duong-tinh';

export type BaiDangMo = { tech: CongNgheDayDu; level: CapDayDu; lesson: BaiDayDu };

const boc = (s: string) => `<p>${s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;

async function dichCau(c: CauHoi, lang: string, signal: AbortSignal): Promise<CauHoi> {
  const nguon = [c.question, c.explanation, ...c.options];
  try {
    const html = await dichMay(nguon.map(boc).join(''), lang, signal);
    const ra = [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll('p')].map(p => (p.textContent ?? '').trim());
    if (ra.length !== nguon.length || ra.some(x => !x)) return c;
    const [question, explanation, ...options] = ra;
    if (new Set(options).size !== options.length) return c;
    return { ...c, question, explanation, options };
  } catch (e) {
    if (signal.aborted) throw e;
    return c;
  }
}

export function useQuizBai({ tech, level, lesson }: BaiDangMo) {
  const { client, user } = useAuth();
  const { lang, t } = useT();
  const qc = useQueryClient();
  const uid = user?.id;
  const kb = khoaBai(tech.id, level.id, lesson.id);
  const nganHangGoc = lesson.quizBanks?.[lang] ? lang : lesson.quizBanks?.vi ? 'vi' : undefined;
  const bank = nganHangGoc ? lesson.quizBanks?.[nganHangGoc] : undefined;
  const khoa = useMemo(() => ['quiz', uid, kb, lang, bank?.url ?? 'ai'], [uid, kb, lang, bank?.url]);

  const q = useQuery({
    queryKey: khoa,
    queryFn: async ({ signal }): Promise<TrangThaiQuiz> => {
      if (bank) {
        const content = await qc.fetchQuery({
          queryKey: ['quiz-bank', bank.url],
          queryFn: async ({ signal: bankSignal }) => {
            const response = await fetch(duongTinh(bank.url), { signal: bankSignal });
            if (!response.ok) throw new Error(t('bankLoadFailed'));
            const value: unknown = await response.json();
            const errors = validateBank(value, { tech: tech.id, level: level.id, lesson: lesson.id, language: nganHangGoc, sourceHash: bank.sourceHash });
            if (errors.length || (value as QuestionBank).status !== 'approved') throw new Error(t('bankInvalid'));
            return value as QuestionBank;
          }, staleTime: Infinity, retry: false
        });
        const previous = qc.getQueryData<TrangThaiQuiz>(khoa)?.bank;
        const { questions, seen } = drawQuiz(content, previous?.url === bank.url ? previous.seen : []);
        const ds = nganHangGoc === lang ? questions : await Promise.all(questions.map(c => dichCau(c, lang, signal)));
        return { questions: ds, answers: {}, submitted: false, bank: { url: bank.url, seen } };
      }
      return { questions: await taoQuiz(client, { tech, level, lesson, lang, signal }), answers: {}, submitted: false };
    },
    enabled: false,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false
  });

  const datQuiz = useCallback((f: (s: TrangThaiQuiz) => TrangThaiQuiz) => {
    qc.setQueryData<TrangThaiQuiz>(khoa, s => (s ? f(s) : s));
  }, [qc, khoa]);

  return {
    quiz: q.data,
    tuNganHang: Boolean(bank),
    dangTao: q.isFetching,
    loi: q.isError && !q.isFetching ? q.error : null,
    tao: () => { void q.refetch(); },
    chon: (cau: number, dapAn: number) => datQuiz(s => (s.submitted ? s : { ...s, answers: { ...s.answers, [cau]: dapAn } })),
    nop: () => datQuiz(s => ({ ...s, submitted: true }))
  };
}

export type QuizBai = ReturnType<typeof useQuizBai>;
