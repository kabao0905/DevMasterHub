// Quiz AI cua mot bai: luu trong react-query theo nguoi dung (dang xuat la xoa), song qua
// viec doi tab/doi bai trong phien — nhu quizCache cua app cu.
import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { khoaBai } from '@/lib/progress';
import { taoQuiz, type TrangThaiQuiz } from '@/lib/ai';
import type { BaiDayDu, CapDayDu, CongNgheDayDu } from '@/lib/curriculum';

export type BaiDangMo = { tech: CongNgheDayDu; level: CapDayDu; lesson: BaiDayDu };

export function useQuizBai({ tech, level, lesson }: BaiDangMo) {
  const { client, user } = useAuth();
  const { lang } = useT();
  const qc = useQueryClient();
  const uid = user?.id;
  const kb = khoaBai(tech.id, level.id, lesson.id);
  const khoa = useMemo(() => ['quiz', uid, kb], [uid, kb]);

  const q = useQuery({
    queryKey: khoa,
    queryFn: async ({ signal }): Promise<TrangThaiQuiz> => ({
      questions: await taoQuiz(client, { tech, level, lesson, lang, signal }),
      answers: {},
      submitted: false
    }),
    // Chi tao khi nguoi hoc bam (moi lan tao ton luot AI)
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
    dangTao: q.isFetching,
    loi: q.isError && !q.isFetching ? q.error : null,
    tao: () => { void q.refetch(); },
    chon: (cau: number, dapAn: number) => datQuiz(s => (s.submitted ? s : { ...s, answers: { ...s.answers, [cau]: dapAn } })),
    nop: () => datQuiz(s => ({ ...s, submitted: true }))
  };
}

export type QuizBai = ReturnType<typeof useQuizBai>;
