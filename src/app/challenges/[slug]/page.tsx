'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Clock, Flame, Lightbulb, CheckCircle2, XCircle, Loader2, Lock, Sparkles } from 'lucide-react';
import { seedChallenges, seedHints, CHALLENGE_TYPE_META, DIFFICULTY_META } from '@/lib/seed/challenges';
import { useUser, useFirestore } from '@/firebase';
import { recordCompletion } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { NamedIcon } from '@/components/icon-map';

export default function ChallengeDetailPage() {
  const params = useParams<{ slug: string }>();
  const challenge = seedChallenges.find((c) => c.slug === params.slug);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hintsUnlocked, setHintsUnlocked] = useState<string[]>([]);
  const [attemptedCount, setAttemptedCount] = useState(0);

  if (!challenge) {
    notFound();
  }

  const hints = useMemo(() => seedHints[challenge.id] || [], [challenge.id]);
  const typeMeta = CHALLENGE_TYPE_META[challenge.type];
  const diffMeta = DIFFICULTY_META[challenge.difficulty];

  // Normalize answer for comparison (case-insensitive, trim, flexible whitespace)
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setAttemptedCount((c) => c + 1);

    // Normalize both sides for comparison
    const normalizedFlag = normalize(challenge.flag || '');
    const submittedAnswer = normalize(answer);
    const correct = submittedAnswer === normalize(normalizedFlag);

    setIsCorrect(correct);
    setSubmitted(true);

    // Record completion + award XP if correct
    if (correct && user && firestore) {
      try {
        const result = await recordCompletion(firestore, user.uid, {
          contentType: 'challenge',
          contentId: challenge.id,
          xpAmount: challenge.xpReward,
          skillIds: challenge.skillIds,
          correct: true,
          hintsUsed: hintsUnlocked.length,
          timeSpentSeconds: 0,
        });
        toast(
          result.alreadyCompleted
            ? { title: 'Already solved', description: 'Review complete — XP was earned on your first pass.' }
            : {
                title: `+${result.xpEarned} XP!`,
                description:
                  result.newBadges.length > 0
                    ? `Badges unlocked: ${result.newBadges.map((b) => b).join(', ')}`
                    : result.leveledUp
                      ? `Level up! You reached level ${result.newLevel}.`
                      : 'Challenge completed! Great work.',
              }
        );
      } catch (error) {
        console.error('Failed to record completion:', error);
        toast({
          variant: 'destructive',
          title: 'Could not record progress',
          description: 'Please try again.',
        });
      }
    } else if (correct && !user) {
      toast({
        title: 'Correct!',
        description: 'Sign in to save your progress and earn XP.',
      });
    }

    setIsSubmitting(false);
  };

  const unlockHint = (hintId: string) => {
    if (!hintsUnlocked.includes(hintId)) {
      setHintsUnlocked((prev) => [...prev, hintId]);
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
    setIsCorrect(false);
    setAnswer('');
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <Link href="/challenges" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to Challenges
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <NamedIcon name={typeMeta.icon} className={cn('h-9 w-9', typeMeta.color)} />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">{challenge.title}</h1>
              <span className={cn("text-xs px-2 py-1 rounded-full border whitespace-nowrap", diffMeta.color)}>
                {diffMeta.label}
              </span>
            </div>
            <p className="text-muted-foreground">{challenge.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-orange-400">
            <Flame className="h-4 w-4" /> {challenge.points} pts
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" /> {challenge.estimatedMinutes} min
          </span>
        </div>
      </div>

      {/* Learning objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg">Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {challenge.learningObjectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Challenge prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg">The Challenge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none text-foreground/90">
            <pre className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              {challenge.prompt}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Hints */}
      {hints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" /> Hints
            </CardTitle>
            <CardDescription>Unlock hints progressively as you work through the challenge.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {hints.map((hint) => {
                const unlocked = hintsUnlocked.includes(hint.id);
                return (
                  <AccordionItem value={hint.id} key={hint.id}>
                    <AccordionTrigger
                      onClick={(e) => {
                        e.preventDefault();
                        if (!unlocked) {
                          unlockHint(hint.id);
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <span className="flex items-center gap-2">
                        <Lightbulb className={cn('h-4 w-4', unlocked ? 'text-yellow-400' : 'text-muted-foreground')} />
                        Hint {hint.level}
                        {!unlocked && <span className="text-muted-foreground text-xs">(click to reveal)</span>}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{hint.content}</p>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Answer submission */}
      {!submitted ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Submit Your Answer</CardTitle>
            <CardDescription>
              {(challenge.flag || '').length === 1
                ? 'This one is multiple-choice style: enter the letter of the best answer (e.g. A, B, C, D).'
                : challenge.type === 'phishing'
                  ? 'Enter the answer in plain words (e.g. the domain or the strongest indicator). Case does not matter.'
                  : 'Enter the flag or answer. Case and extra spaces do not matter.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="font-mono"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <Button onClick={handleSubmit} disabled={!answer.trim() || isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className={cn(isCorrect ? 'border-green-500' : 'border-destructive')}>
          <CardHeader>
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              ) : (
                <XCircle className="h-8 w-8 text-destructive" />
              )}
              <CardTitle className={cn('font-headline text-2xl', isCorrect ? 'text-green-400' : 'text-destructive')}>
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isCorrect && attemptedCount < 3 && (
              <p className="text-muted-foreground">
                Try again! Remember — you can use hints to guide you.
              </p>
            )}
            <Alert className={cn(isCorrect && 'border-green-500')}>
              <AlertTitle className={cn(isCorrect && 'text-green-400')}>Solution Explanation</AlertTitle>
              <AlertDescription className="text-foreground/80">
                {challenge.solutionExplanation}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="gap-3">
            {!isCorrect && (
              <Button onClick={handleRetry} variant="secondary">
                Try Again
              </Button>
            )}
            <Button asChild variant={isCorrect ? 'default' : 'outline'}>
              <Link href="/challenges">Browse More Challenges</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}