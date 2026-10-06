'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';
import { plans } from '@/lib/content/plans';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { recordCompletion } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';

export default function PlanDetailPage() {
  const params = useParams<{ slug: string }>();
  const plan = plans.find((p) => p.slug === params.slug);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [busyDay, setBusyDay] = useState<number | null>(null);

  const attemptsRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, 'users', user.uid, 'attempts') : null),
    [user, firestore]
  );
  const { data: attempts } = useCollection(attemptsRef as any);
  const doneIds = useMemo(
    () => new Set(((attempts as any[]) ?? []).filter((a) => a.status === 'completed').map((a) => a.contentId)),
    [attempts]
  );

  if (!plan) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-headline text-2xl font-bold">Plan not found</h1>
        <Button asChild><Link href="/plans">Back to plans</Link></Button>
      </main>
    );
  }

  const dayId = (day: number) => `plan-${plan.id}-d${day}`;
  const done = plan.days.filter((d) => doneIds.has(dayId(d.day))).length;
  const complete = done === 7;

  const markDone = async (day: number) => {
    if (!user || !firestore) {
      toast({ title: 'Sign in to track', description: 'Your plan progress saves to your account.' });
      return;
    }
    setBusyDay(day);
    try {
      const r = await recordCompletion(firestore, user.uid, {
        contentType: 'quiz',
        contentId: dayId(day),
        xpAmount: plan.xpPerDay,
        correct: true,
      });
      toast({ title: `Day ${day} done. +${r.xpEarned} XP`, description: done + 1 === 7 ? 'Plan complete. Excellent discipline.' : 'One step closer.' });
    } catch {
      toast({ variant: 'destructive', title: 'Could not save', description: 'Try again.' });
    } finally {
      setBusyDay(null);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 md:p-8">
      <Link href="/plans" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All plans
      </Link>
      <div>
        <p className="text-sm text-muted-foreground">{plan.audience}</p>
        <h1 className="font-headline text-3xl font-bold">{plan.title}</h1>
        <p className="mt-1 text-muted-foreground">{plan.tagline}</p>
      </div>
      <div>
        <div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>{done}/7 days</span>{complete && <span>Complete</span>}</div>
        <Progress value={(done / 7) * 100} aria-label={`${done} of 7 days complete`} />
      </div>
      <div className="space-y-3">
        {plan.days.map((d) => {
          const isDone = doneIds.has(dayId(d.day));
          return (
            <Card key={d.day} className={isDone ? 'border-green-500/40' : ''}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <p className="flex items-center gap-2 font-medium">
                    {isDone ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                    Day {d.day}: {d.title}
                  </p>
                  <CardDescription className="mt-1">{d.desc}</CardDescription>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{d.minutes} min · +{plan.xpPerDay} XP</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="min-h-[44px]"><Link href={d.href}>{d.cta}</Link></Button>
                  {!isDone && (
                    <Button onClick={() => markDone(d.day)} disabled={busyDay === d.day} className="min-h-[44px]">
                      {busyDay === d.day && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Done
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {complete && (
        <Card className="border-green-500/40">
          <CardHeader><CardTitle className="font-headline">Plan complete</CardTitle><CardDescription>Seven days of discipline. Pick your next plan or take the Risk Check again to measure change.</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline" className="min-h-[44px]"><Link href="/plans">More plans</Link></Button>
            <Button asChild className="min-h-[44px]"><Link href="/risk-check">Retake Risk Check</Link></Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
