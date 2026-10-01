'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Flame, Star, CalendarCheck2, BookOpen, ScanSearch, ShieldAlert,
  HelpCircle, LifeBuoy, Compass, Bot, ArrowRight, Trophy,
} from 'lucide-react';
import { getDailyChallenge, WEEKDAY_FOCUS } from '@/lib/daily-challenge';
import { seedLessons } from '@/lib/seed/lessons';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { levelFromXp, xpToNextLevel } from '@/lib/gamification/engine';
import { recommendNext, summarizePerformance } from '@/lib/learning/recommendations';
import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

const SAFETY_TIP = [
  'Pause before you tap: check the sender domain first.',
  'Banks never ask for OTPs. Anyone who does is impersonating.',
  'Type important addresses yourself — do not use links in messages.',
  'Unique passwords + MFA stop most account takeovers.',
  'If a QR looks like a sticker, ask staff before scanning.',
  'Unsolicited winnings are always fake.',
  'Save evidence before you block and report.',
];

export default function Dashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const profileRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: profile } = useDoc(profileRef as any);
  const p: any = profile ?? null;
  const attemptsRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, 'users', user.uid, 'attempts') : null),
    [user, firestore]
  );
  const { data: attempts } = useCollection(attemptsRef as any);
  const perf = useMemo(
    () => summarizePerformance(((attempts as any[]) ?? []) as any),
    [attempts]
  );
  const recommendations = useMemo(
    () =>
      recommendNext(
        ((attempts as any[]) ?? []) as any,
        (p?.interests as string[]) ?? [],
        (((attempts as any[]) ?? []).filter((a: any) => a.status === 'completed').map((a: any) => a.contentId) as string[]) ?? []
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [attempts, p?.interests]
  );

  const now = new Date();
  const daily = getDailyChallenge(now);
  const focus = WEEKDAY_FOCUS[now.getDay()];
  const tip = SAFETY_TIP[now.getDate() % SAFETY_TIP.length];
  const firstLesson = seedLessons[0];

  const xp = p?.xp ?? 0;
  const level = p?.level ?? levelFromXp(xp);
  const prog = xpToNextLevel(xp);
  const streak = p?.streak ?? 0;
  const onboardingDone = p?.onboardingCompleted ?? false;

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          {user ? `Welcome back, ${user.displayName?.split(' ')[0] ?? 'learner'}` : 'Welcome to CyberWise'}
        </h1>
        <p className="text-muted-foreground">Recognize · Investigate · Respond — one small step today.</p>
      </div>

      {!user && (
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="font-headline">Start your safety journey</CardTitle><CardDescription>Sign up, personalize in 1 minute, then do today&apos;s 5-minute challenge.</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="min-h-[44px]"><Link href="/login">Sign up / Sign in</Link></Button>
            <Button asChild variant="outline" className="min-h-[44px]"><Link href="/learn">Browse lessons as guest</Link></Button>
          </CardContent>
        </Card>
      )}

      {user && !onboardingDone && (
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="font-headline">Personalize your path (1 min)</CardTitle><CardDescription>Tell us your level and interests for recommendations.</CardDescription></CardHeader>
          <CardContent><Button asChild className="min-h-[44px]"><Link href="/onboarding">Complete onboarding</Link></Button></CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Level {level}</CardTitle><Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{xp} XP</p>
            <Progress value={prog.progress} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">{prog.remaining} XP to level {level + 1} · {p?.rankName ?? 'Novice Guardian'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle><Flame className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{streak} day{streak === 1 ? '' : 's'}</p>
            <p className="mt-1 text-xs text-muted-foreground">Learn daily to keep it burning.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Safety tip of the day</CardTitle><CalendarCheck2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><p className="text-sm leading-relaxed">{tip}</p></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="font-headline">Today&apos;s challenge</CardTitle><CardDescription>{focus}</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium">{daily.title}</p>
            <p className="text-sm text-muted-foreground">{daily.description}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="min-h-[44px]"><Link href={`/challenges/${daily.slug}`}>Start (+{daily.xpReward} XP)</Link></Button>
              <Button asChild variant="outline" className="min-h-[44px]"><Link href="/daily">All of today</Link></Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-headline">Continue learning</CardTitle><CardDescription>New here? Start with this 8-minute lesson.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium">{firstLesson.title}</p>
            <p className="text-sm text-muted-foreground">{firstLesson.description}</p>
            <Button asChild variant="outline" className="min-h-[44px]"><Link href={`/learn/${firstLesson.slug}`}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline"><Sparkles className="h-5 w-5 text-primary" />Recommended for you</CardTitle>
          <CardDescription>
            {perf.weakAreas.length > 0
              ? `Focus areas: ${perf.weakAreas.join(' · ')}${perf.strengths.length > 0 ? ` — strengths: ${perf.strengths.join(' · ')}` : ''}`
              : perf.strengths.length > 0
                ? `Strengths: ${perf.strengths.join(' · ')} — keep going.`
                : 'Based on your interests and the starter path.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {recommendations.map((r) => (
            <Link key={r.href} href={r.href} className="flex">
              <span className="flex w-full flex-col rounded-lg border p-4 transition-all hover:border-primary/80 hover:shadow-lg">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">{r.topic}</span>
                <span className="mt-1 font-headline font-semibold">{r.title}</span>
                <span className="mt-1 text-sm text-muted-foreground">{r.reason}</span>
              </span>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 font-headline text-xl font-semibold">Practice safety now</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/simulators/phishing', icon: <ScanSearch className="h-6 w-6 text-primary" />, t: 'Phishing investigation', d: 'Inspect senders, links, urgency — then decide.' },
            { href: '/simulators/scam', icon: <ShieldAlert className="h-6 w-6 text-primary" />, t: 'Scam awareness', d: 'Fake jobs, scholarships, investments, romance patterns.' },
            { href: '/simulators/wwyd', icon: <HelpCircle className="h-6 w-6 text-primary" />, t: 'What would you do?', d: 'Realistic decisions with safe/risky explanations.' },
            { href: '/help/been-scammed', icon: <LifeBuoy className="h-6 w-6 text-primary" />, t: "I've been scammed", d: 'Calm checklists: clicked, paid, hacked, harassed.' },
            { href: '/stories', icon: <Compass className="h-6 w-6 text-primary" />, t: 'Cyber stories', d: 'Learn through interactive short stories.' },
            { href: '/mentor', icon: <Bot className="h-6 w-6 text-primary" />, t: 'AI mentor', d: 'Plain-language answers, defensive only.' },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="flex">
              <Card className="flex w-full flex-col transition-all hover:border-primary/80 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center gap-3">{c.icon}<CardTitle className="font-headline text-lg">{c.t}</CardTitle></CardHeader>
                <CardContent><CardDescription>{c.d}</CardDescription></CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/learn', icon: <BookOpen className="h-5 w-5" />, t: 'Lessons' },
          { href: '/challenges', icon: <Trophy className="h-5 w-5" />, t: 'Challenges' },
          { href: '/simulators/spam', icon: <ArrowRight className="h-5 w-5" />, t: 'Spam guide' },
          { href: '/programs', icon: <ArrowRight className="h-5 w-5" />, t: 'Programs' },
        ].map((l) => (
          <Button key={l.href} asChild variant="outline" className="min-h-[48px] justify-start">
            <Link href={l.href}><span className="mr-2">{l.icon}</span>{l.t}</Link>
          </Button>
        ))}
      </div>
    </main>
  );
}
