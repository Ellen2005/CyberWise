'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { seedLessons, seedQuizzes } from '@/lib/seed/lessons';
import { LessonContentBlocks } from '@/components/learning/lesson-content-blocks';
import { QuizPlayer } from '@/components/learning/quiz-player';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Award } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { recordCompletion } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function LessonDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const lesson = seedLessons.find((l) => l.slug === params.slug);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [lessonDone, setLessonDone] = useState(false);

  if (!lesson) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="font-headline text-2xl font-bold">Lesson not found</h1>
        <Button asChild><Link href="/learn">Back to lessons</Link></Button>
      </main>
    );
  }

  const quiz = seedQuizzes.find((q) => q.id === lesson.quizId);

  const markLessonRead = async () => {
    setLessonDone(true);
    if (user && firestore) {
      try {
        await recordCompletion(firestore, user.uid, {
          contentType: 'lesson',
          contentId: lesson.id,
          xpAmount: Math.round(lesson.xpReward / 2),
          skillIds: lesson.skillIds,
          correct: true,
        });
        toast({ title: 'Progress saved', description: `+${Math.round(lesson.xpReward / 2)} XP for reading.` });
      } catch {
        toast({ variant: 'destructive', title: 'Could not save', description: 'Check your connection and Firestore rules.' });
      }
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-8">
      <Link href="/learn" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to lessons
      </Link>
      <div>
        <h1 className="font-headline text-3xl font-bold md:text-4xl">{lesson.title}</h1>
        <p className="mt-2 text-muted-foreground">{lesson.description}</p>
        <p className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{lesson.estimatedMinutes} min</span>
          <span className="flex items-center gap-1"><Award className="h-4 w-4" />+{lesson.xpReward} XP</span>
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-headline text-lg">Lesson</CardTitle></CardHeader>
        <CardContent>
          <LessonContentBlocks blocks={lesson.content} />
          {!lessonDone ? (
            <Button onClick={markLessonRead} className="mt-6 min-h-[44px] w-full sm:w-auto">
              Mark as read (+{Math.round(lesson.xpReward / 2)} XP)
            </Button>
          ) : (
            <p className="mt-6 text-sm text-green-600 dark:text-green-400">
              {user ? 'Saved! Now try the quiz below to earn the rest.' : 'Nice! Sign in to save XP, then try the quiz.'}
            </p>
          )}
        </CardContent>
      </Card>

      {quiz ? (
        <QuizPlayer
          quiz={quiz}
          onPassed={async () => {
            if (user && firestore) {
              try {
                const r = await recordCompletion(firestore, user.uid, {
                  contentType: 'quiz',
                  contentId: lesson.id,
                  xpAmount: quiz.xpReward,
                  skillIds: lesson.skillIds,
                  correct: true,
                });
                toast({
                  title: `+${r.xpEarned} XP!`,
                  description: r.leveledUp ? `Level up — now level ${r.newLevel}.` : 'Quiz passed. Great work.',
                });
              } catch {
                toast({ variant: 'destructive', title: 'Could not save quiz XP', description: 'Try again.' });
              }
            } else {
              toast({ title: 'Quiz passed!', description: 'Sign in to save XP.' });
            }
          }}
        />
      ) : (
        <Card><CardContent className="p-6 text-muted-foreground">Quiz coming soon for this lesson.</CardContent></Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline" className="min-h-[44px]"><Link href="/learn">More lessons</Link></Button>
        <Button asChild className="min-h-[44px]"><Link href="/simulators/phishing">Practice: phishing investigation</Link></Button>
      </div>
    </main>
  );
}
