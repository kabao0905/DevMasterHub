export type Difficulty = 'easy' | 'medium' | 'hard';
export type BankQuestion = {
  id: string; difficulty: Difficulty; objective: string; question: string; code?: string;
  options: string[]; correct: number; explanation: string;
};
export type QuestionBank = {
  version: 1; tech: string; level: string; lesson: string; language: string;
  sourceHash: string; status: 'draft' | 'approved'; review?: string; questions: BankQuestion[];
};
export const BANK_COUNTS: Readonly<Record<Difficulty, number>>;
export const QUIZ_COUNTS: Readonly<Record<Difficulty, number>>;
export function validateBank(bank: unknown, expected?: Partial<QuestionBank>): string[];
export function drawQuiz(bank: QuestionBank, seen?: string[], random?: () => number): { questions: BankQuestion[]; seen: string[] };
