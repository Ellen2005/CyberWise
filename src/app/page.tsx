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
import { doc, collection, query, orderBy, limit } from 'firebase/firestore';
import { levelFromXp, xpToNextLevel } from '@/lib/gamification/engine';
import { recommendNext, summarizePerformance } from '@/lib/learning/recommendations';
import { ProgressInsights } from '@/components/progress-insights';
import { useLanguage } from '@/components/language-provider';
import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

const SAFETY_TIPS = {
  en: [
    'Pause before you tap: check the sender domain first.',
    'Banks never ask for OTPs. Anyone who does is impersonating.',
    'Type important addresses yourself — do not use links in messages.',
    'Unique passwords + MFA stop most account takeovers.',
    'If a QR looks like a sticker, ask staff before scanning.',
    'Unsolicited winnings are always fake.',
    'Save evidence before you block and report.',
  ],
  fr: [
    'Pause avant de toucher : vérifiez d’abord le domaine de l’expéditeur.',
    'Les banques ne demandent jamais vos codes. Quiconque le fait usurpe.',
    'Tapez vous-même les adresses importantes — pas via les liens reçus.',
    'Mots de passe uniques + MFA stoppent la plupart des piratages.',
    'Si un QR ressemble à un autocollant, demandez au personnel.',
    'Les gains non sollicités sont toujours faux.',
    'Sauvegardez les preuves avant de bloquer et signaler.',
  ],
} as const;

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
  const riskRef = useMemoFirebase(
    () => (user && firestore ? query(collection(firestore, 'users', user.uid, 'riskChecks'), orderBy('createdAt', 'desc'), limit(5)) : null),
    [user, firestore]
  );
  const { data: riskChecks } = useCollection(riskRef as any);
  const latestRisk: any = ((riskChecks as any[]) ?? [])[0] ?? null;
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

  const { t, lang } = useLanguage();
  const now = new Date();
  const daily = getDailyChallenge(now);
  const focus = WEEKDAY_FOCUS[now.getDay()];
  const tips = SAFETY_TIPS[lang];
  const tip = tips[now.getDate() % tips.length];
  const firstLesson = seedLessons[0];

  const xp = p?.xp ?? 0;
  const level = p?.level ?? levelFromXp(xp);
  const prog = xpToNextLevel(xp);
  const streak = p?.streak ?? 0;
  const onboardingDone = p?.onboardingCompleted ?? false;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="hero-gradient animate-rise rounded-2xl border p-6 md:p-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          {user ? `${t.dashboard.welcomeBack}, ${user.displayName?.split(' ')[0] ?? 'learner'}` : t.dashboard.welcome}
        </h1>
        <p className="mt-1 text-muted-foreground">{t.dashboard.tagline}</p>
      </div>

      {user && (
        latestRisk ? (
          <Card className="border-primary/30">
            <CardHeader><CardTitle className="font-headline">Your risk: {latestRisk.overall}% · {t.dashboard.riskWeakest}: {latestRisk.weakest}</CardTitle><CardDescription>{t.dashboard.riskLastChecked} {latestRisk.createdAt?.toDate ? latestRisk.createdAt.toDate().toLocaleDateString() : t.dashboard.riskRecently}. {t.dashboard.riskRetakeMeasure}</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="min-h-[44px]"><Link href="/risk-check">{t.dashboard.riskRetake}</Link></Button>
              <Button asChild variant="outline" className="min-h-[44px]"><Link href="/plans">{t.dashboard.continuePlan}</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-primary/30">
            <CardHeader><CardTitle className="font-headline">{t.dashboard.riskTitle}</CardTitle><CardDescription>{t.dashboard.riskDesc}</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="min-h-[44px]"><Link href="/risk-check">{t.dashboard.riskCta}</Link></Button>
              <Button asChild variant="outline" className="min-h-[44px]"><Link href="/scenarios">{t.dashboard.jumpScenario}</Link></Button>
            </CardContent>
          </Card>
        )
      )}

      {!user && (
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="font-headline">{t.dashboard.startJourney}</CardTitle><CardDescription>{t.dashboard.startJourneyDesc}</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="min-h-[44px]"><Link href="/login">{t.dashboard.signUpIn}</Link></Button>
            <Button asChild variant="outline" className="min-h-[44px]"><Link href="/learn">{t.dashboard.browseGuest}</Link></Button>
          </CardContent>
        </Card>
      )}

      {user && !onboardingDone && (
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="font-headline">{t.dashboard.onboardingTitle}</CardTitle><CardDescription>{t.dashboard.onboardingDesc}</CardDescription></CardHeader>
          <CardContent><Button asChild className="min-h-[44px]"><Link href="/onboarding">{t.dashboard.onboardingCta}</Link></Button></CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.level} {level}</CardTitle><Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{xp} {t.common.xp}</p>
            <Progress value={prog.progress} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">{prog.remaining} {t.common.xp} {t.dashboard.toLevel} {level + 1} · {p?.rankName ?? 'Cyber Beginner'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.streak}</CardTitle><Flame className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{streak} {streak === 1 ? t.dashboard.day : t.dashboard.days}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.dashboard.streakKeep}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.tipTitle}</CardTitle><CalendarCheck2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><p className="text-sm leading-relaxed">{tip}</p></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="font-headline">{t.dashboard.todayChallenge}</CardTitle><CardDescription>{focus}</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium">{daily.title}</p>
            <p className="text-sm text-muted-foreground">{daily.description}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="min-h-[44px]"><Link href={`/challenges/${daily.slug}`}>{t.dashboard.start} (+{daily.xpReward} {t.common.xp})</Link></Button>
              <Button asChild variant="outline" className="min-h-[44px]"><Link href="/daily">{t.dashboard.allOfToday}</Link></Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-headline">{t.dashboard.continueLearning}</CardTitle><CardDescription>{t.dashboard.newHere}</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium">{firstLesson.title}</p>
            <p className="text-sm text-muted-foreground">{firstLesson.description}</p>
            <Button asChild variant="outline" className="min-h-[44px]"><Link href={`/learn/${firstLesson.slug}`}>{t.dashboard.continueBtn} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline"><Sparkles className="h-5 w-5 text-primary" />{t.dashboard.recommended}</CardTitle>
          <CardDescription>
            {perf.weakAreas.length > 0
              ? `Focus areas: ${perf.weakAreas.join(' · ')}${perf.strengths.length > 0 ? ` — strengths: ${perf.strengths.join(' · ')}` : ''}`
              : perf.strengths.length > 0
                ? `Strengths: ${perf.strengths.join(' · ')} — keep going.`
                : t.dashboard.starterPath}
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

      <ProgressInsights attempts={(((attempts as any[]) ?? []) as any)} />

      <div>
        <h2 className="mb-3 font-headline text-xl font-semibold">{t.practice.title}</h2>
        <div className="grid animate-rise gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/simulators/phishing', icon: <ScanSearch className="h-6 w-6 text-primary" />, t: t.practice.phishingT, d: t.practice.phishingD },
            { href: '/simulators/scam', icon: <ShieldAlert className="h-6 w-6 text-primary" />, t: t.practice.scamT, d: t.practice.scamD },
            { href: '/simulators/wwyd', icon: <HelpCircle className="h-6 w-6 text-primary" />, t: t.practice.wwydT, d: t.practice.wwydD },
            { href: '/help/been-scammed', icon: <LifeBuoy className="h-6 w-6 text-primary" />, t: t.practice.scammedT, d: t.practice.scammedD },
            { href: '/stories', icon: <Compass className="h-6 w-6 text-primary" />, t: t.practice.storiesT, d: t.practice.storiesD },
            { href: '/mentor', icon: <Bot className="h-6 w-6 text-primary" />, t: t.practice.mentorT, d: t.practice.mentorD },
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
          { href: '/learn', icon: <BookOpen className="h-5 w-5" />, t: t.practice.lessonsT },
          { href: '/challenges', icon: <Trophy className="h-5 w-5" />, t: t.practice.challengesT },
          { href: '/simulators/spam', icon: <ArrowRight className="h-5 w-5" />, t: t.practice.spamT },
          { href: '/programs', icon: <ArrowRight className="h-5 w-5" />, t: t.practice.programsT },
        ].map((l) => (
          <Button key={l.href} asChild variant="outline" className="min-h-[48px] justify-start">
            <Link href={l.href}><span className="mr-2">{l.icon}</span>{l.t}</Link>
          </Button>
        ))}
      </div>
    </main>
  );
}
