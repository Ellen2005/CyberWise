'use client';

import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Star, User as UserIcon, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { levelFromXp, xpToNextLevel, BADGES } from '@/lib/gamification/engine';
import { NamedIcon } from '@/components/icon-map';
import { useMemo } from 'react';

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const profileRef = useMemoFirebase(() => (user && firestore ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
  const attemptsRef = useMemoFirebase(() => (user && firestore ? collection(firestore, 'users', user.uid, 'attempts') : null), [user, firestore]);
  const { data: profile, loading: profileLoading } = useDoc(profileRef as any);
  const { data: attempts } = useCollection(attemptsRef as any);
  const p: any = profile ?? null;

  const stats = useMemo(() => {
    const list: any[] = (attempts as any[]) ?? [];
    const done = list.filter((a) => a.status === 'completed');
    return {
      lessons: done.filter((a) => a.contentType === 'lesson' || a.contentType === 'quiz').length,
      challenges: done.filter((a) => a.contentType === 'challenge').length,
      stories: done.filter((a) => a.contentType === 'story').length,
      totalXpEarned: done.reduce((s, a) => s + (a.xpEarned ?? 0), 0),
    };
  }, [attempts]);

  if (userLoading || profileLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
        <div className="flex items-center gap-4"><Skeleton className="h-24 w-24 rounded-full" /><div className="space-y-2"><Skeleton className="h-8 w-48" /><Skeleton className="h-6 w-64" /></div></div>
        <Card><CardHeader><Skeleton className="h-7 w-40" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
        <UserIcon className="h-16 w-16 text-muted-foreground" />
        <h1 className="font-headline text-3xl font-bold">Sign in to view your profile</h1>
        <p className="text-muted-foreground">Track XP, streaks, badges, and progress.</p>
        <Button asChild><Link href="/login">Sign In</Link></Button>
      </main>
    );
  }

  const xp: number = p?.xp ?? 0;
  const level: number = p?.level ?? levelFromXp(xp);
  const prog = xpToNextLevel(xp);
  const badges: string[] = p?.badges ?? [];
  const badgeMeta = BADGES.filter((b) => badges.includes(b.id));

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Avatar className="h-20 w-20 border-4 border-primary">
          <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
          <AvatarFallback className="text-2xl">{user.displayName?.charAt(0) ?? 'L'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="font-headline text-3xl font-bold md:text-4xl">{user.displayName}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-sm">{p?.rankName ?? 'Novice Guardian'} · Level {level} · <span className="inline-flex items-center gap-1"><Flame className="h-4 w-4 text-orange-400" />{p?.streak ?? 0}-day streak</span></p>
        </div>
        <Button asChild variant="outline"><Link href="/daily">Today&apos;s challenge</Link></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium"><Star className="h-4 w-4 text-primary" />Progress</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{xp} XP</p><Progress value={prog.progress} className="mt-2" /><p className="mt-1 text-xs text-muted-foreground">{prog.remaining} XP to level {level + 1}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Completions</CardTitle></CardHeader>
          <CardContent className="text-sm"><p>{stats.lessons} lessons/quizzes · {stats.challenges} challenges · {stats.stories} stories</p><p className="mt-1 text-xs text-muted-foreground">See your strengths, weak areas, and recommendations on the <Link href="/" className="text-primary underline">dashboard</Link>.</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Interests</CardTitle></CardHeader>
          <CardContent><div className="flex flex-wrap gap-2">{((p?.interests as string[]) ?? []).length ? (p.interests as string[]).map((i: string) => <Badge key={i} variant="secondary">{i}</Badge>) : <span className="text-sm text-muted-foreground">Not set — <Link href="/onboarding" className="text-primary underline">personalize</Link></span>}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Badges ({badgeMeta.length})</CardTitle><CardDescription>Earned across lessons, challenges, stories, and simulators.</CardDescription></CardHeader>
        <CardContent>
          {badgeMeta.length === 0 ? (
            <p className="text-sm text-muted-foreground">No badges yet. Try today&apos;s challenge or the phishing investigation to earn your first.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {badgeMeta.map((b) => (
                <div key={b.id} className="rounded-lg border p-4">
                  <NamedIcon name={b.icon} className="h-8 w-8 text-primary" />
                  <p className="mt-2 font-semibold">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
