import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { khoaBai } from '@/lib/progress';
import { taoQuiz, type TrangThaiQuiz } from '@/lib/ai';
import type { BaiDayDu, CapDayDu, CongNgheDayDu } from '@/lib/curriculum';
import { drawQuiz, validateBank, type QuestionBank } from '../../../../shared/quiz-bank.mjs';

export type BaiDangMo = { tech: CongNgheDayDu; level: CapDayDu; lesson: BaiDayDu };

export function useQuizBai({ tech, level, lesson }: BaiDangMo) {
  const { client, user } = useAuth();
  const { lang, t } = useT();
  const qc = useQueryClient();
  const uid = user?.id;
  const kb = khoaBai(tech.id, level.id, lesson.id);
  const bank = lesson.quizBanks?.[lang];
  const khoa = useMemo(() => ['quiz', uid, kb, lang, bank?.url ?? 'ai'], [uid, kb, lang, bank?.url]);

  const q = useQuery({
    queryKey: khoa,
    queryFn: async ({ signal }): Promise<TrangThaiQuiz> => {
      if (bank) {
        const content = await qc.fetchQuery({
          queryKey: ['quiz-bank', bank.url],
          queryFn: async ({ signal: bankSignal }) => {
            const response = await fetch(bank.url, { signal: bankSignal });
            if (!response.ok) throw new Error(t('bankLoadFailed'));
            const value: unknown = await response.json();
            const errors = validateBank(value, { tech: tech.id, level: level.id, lesson: lesson.id, language: lang, sourceHash: bank.sourceHash });
            if (errors.length || (value as QuestionBank).status !== 'approved') throw new Error(t('bankInvalid'));
            return value as QuestionBank;
          }, staleTime: Infinity, retry: false
        });
        const previous = qc.getQueryData<TrangThaiQuiz>(khoa)?.bank;
        const { questions, seen } = drawQuiz(content, previous?.url === bank.url ? previous.seen : []);
        return { questions, answers: {}, submitted: false, bank: { url: bank.url, seen } };
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
