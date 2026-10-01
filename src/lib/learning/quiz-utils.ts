import type { QuizQuestion } from '@/types';

/** Map letter answers (A, B, …) to option text when options exist. */
export function resolveCorrectAnswerText(question: QuizQuestion): string {
  const { correctAnswer, options } = question;
  if (typeof correctAnswer !== 'string' || !options?.length) {
    return String(correctAnswer);
  }
  const letter = correctAnswer.trim().toUpperCase();
  if (/^[A-Z]$/.test(letter)) {
    const index = letter.charCodeAt(0) - 65;
    if (options[index] !== undefined) {
      return options[index];
    }
  }
  return correctAnswer;
}

export function isAnswerCorrect(question: QuizQuestion, userAnswer: string): boolean {
  const normalized = userAnswer.trim().toLowerCase();
  const correctText = resolveCorrectAnswerText(question).trim().toLowerCase();
  const rawCorrect = String(question.correctAnswer).trim().toLowerCase();
  return normalized === correctText || normalized === rawCorrect;
}

export function scoreQuiz(
  questions: QuizQuestion[],
  answers: Record<string, string>
): { earned: number; max: number; percent: number } {
  let earned = 0;
  let max = 0;
  for (const q of questions) {
    max += q.points;
    if (answers[q.id] && isAnswerCorrect(q, answers[q.id])) {
      earned += q.points;
    }
  }
  const percent = max > 0 ? Math.round((earned / max) * 100) : 0;
  return { earned, max, percent };
}
