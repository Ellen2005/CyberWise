import { describe, it, expect } from 'vitest';
import { resolveCorrectAnswerText, isAnswerCorrect, scoreQuiz } from './quiz-utils';
import type { QuizQuestion } from '@/types';

const mcq: QuizQuestion = {
  id: 'q1',
  type: 'multiple-choice',
  question: 'Strongest password?',
  options: ['P@ssw0rd123', 'correct-horse-battery-staple', 'abc123'],
  correctAnswer: 'B',
  explanation: 'Length beats complexity.',
  points: 20,
};

describe('resolveCorrectAnswerText', () => {
  it('maps letters to options', () => {
    expect(resolveCorrectAnswerText(mcq)).toBe('correct-horse-battery-staple');
  });
  it('passes through full text', () => {
    expect(resolveCorrectAnswerText({ ...mcq, correctAnswer: 'abc123' })).toBe('abc123');
  });
});

describe('isAnswerCorrect', () => {
  it('accepts the option text or the letter', () => {
    expect(isAnswerCorrect(mcq, 'correct-horse-battery-staple')).toBe(true);
    expect(isAnswerCorrect(mcq, 'B')).toBe(true);
    expect(isAnswerCorrect(mcq, 'b')).toBe(true);
    expect(isAnswerCorrect(mcq, 'P@ssw0rd123')).toBe(false);
  });
});

describe('scoreQuiz', () => {
  it('scores and computes percent', () => {
    const r = scoreQuiz([mcq, { ...mcq, id: 'q2' }], { q1: 'B', q2: 'wrong' });
    expect(r.earned).toBe(20);
    expect(r.max).toBe(40);
    expect(r.percent).toBe(50);
  });
  it('handles empty quiz', () => {
    expect(scoreQuiz([], {})).toEqual({ earned: 0, max: 0, percent: 0 });
  });
});
