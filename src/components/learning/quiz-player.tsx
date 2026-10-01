'use client';

import { useState } from 'react';
import type { Quiz } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { isAnswerCorrect, scoreQuiz } from '@/lib/learning/quiz-utils';
import { cn } from '@/lib/utils';

type QuizPlayerProps = {
  quiz: Quiz;
  onPassed?: (percent: number) => Promise<void> | void;
};

export function QuizPlayer({ quiz, onPassed }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const result = submitted ? scoreQuiz(quiz.questions, answers) : null;
  const passed = result ? result.percent >= quiz.passingScore : false;

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!onPassed) return;
    const scored = scoreQuiz(quiz.questions, answers);
    if (scored.percent >= quiz.passingScore) {
      setSubmitting(true);
      try {
        await onPassed(scored.percent);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{quiz.title}</CardTitle>
        <CardDescription>
          Answer each question. You need {quiz.passingScore}% to pass. Every answer includes an explanation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {quiz.questions.map((q, index) => {
          const userAnswer = answers[q.id];
          const showFeedback = submitted && userAnswer;
          const correct = showFeedback ? isAnswerCorrect(q, userAnswer) : null;

          return (
            <div key={q.id} className="space-y-3 border-b border-border pb-6 last:border-0">
              <p className="font-medium">
                {index + 1}. {q.question}
              </p>
              {q.options && q.options.length > 0 ? (
                <RadioGroup
                  value={userAnswer || ''}
                  onValueChange={(val) => !submitted && setAnswers((a) => ({ ...a, [q.id]: val }))}
                  className="space-y-2"
                >
                  {q.options.map((opt, optIndex) => {
                    const letter = String.fromCharCode(65 + optIndex);
                    const id = `${q.id}-${optIndex}`;
                    return (
                      <div key={id} className="flex items-start space-x-2 rounded-md border p-3">
                        <RadioGroupItem value={opt} id={id} disabled={submitted} />
                        <Label htmlFor={id} className="flex-1 cursor-pointer font-normal leading-snug">
                          <span className="text-muted-foreground mr-2">{letter}.</span>
                          {opt}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              ) : (
                <p className="text-sm text-muted-foreground">No options for this question.</p>
              )}
              {showFeedback && (
                <Alert variant={correct ? 'default' : 'destructive'} className={cn(correct && 'border-green-500/50')}>
                  {correct ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{correct ? 'Good call' : 'Not quite'}</AlertTitle>
                  <AlertDescription>{q.explanation}</AlertDescription>
                </Alert>
              )}
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {submitted && result ? (
          <>
            <p className={cn('text-sm font-medium', passed ? 'text-green-600 dark:text-green-400' : 'text-destructive')}>
              Score: {result.percent}% ({result.earned}/{result.max} points)
              {passed ? ' — Passed!' : ` — Need ${quiz.passingScore}% to pass.`}
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              {!passed && (
                <Button variant="secondary" onClick={handleRetry} className="flex-1 sm:flex-none">
                  Try again
                </Button>
              )}
            </div>
          </>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={quiz.questions.some((q) => !answers[q.id]) || submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit quiz
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
