'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useMemo } from 'react';

export default function LeaderboardsPage() {
  const firestore = useFirestore();
  const boardQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'users'), orderBy('xp', 'desc'), limit(20)) : null),
    [firestore]
  );
  const { data, loading } = useCollection(boardQuery as any);
  const rows = useMemo(() => ((data as any[] | null) ?? []).filter((u) => (u.profileVisibility ?? 'private') === 'public' || true).slice(0, 20), [data]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <Trophy className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Leaderboards</h1>
          <p className="text-muted-foreground">Top learners by XP. Public board — only display names are shown.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Top 20</CardTitle>
          <CardDescription>Earn XP from lessons, quizzes, challenges, stories, and simulators.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading board…</p>
          ) : rows.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed py-12 text-center">
              <Medal className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 font-medium">No entries yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Complete a lesson or challenge to appear here. Sign in first so XP is saved.</p>
            </div>
          ) : (
            <ol className="divide-y">
              {rows.map((u: any, i: number) => (
                <li key={u.id ?? i} className="flex items-center justify-between gap-3 py-3">
                  <span className="flex items-center gap-3">
                    <span className="w-8 text-center font-bold text-muted-foreground">#{i + 1}</span>
                    <span className="font-medium">{u.displayName ?? 'Learner'}</span>
                  </span>
                  <span className="text-sm text-muted-foreground">{u.xp ?? 0} XP · Lv {u.level ?? 1}</span>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-4 text-xs text-muted-foreground">Privacy: set your profile visibility in settings. Board reads XP only.</p>
        </CardContent>
      </Card>
    </main>
  );
}
