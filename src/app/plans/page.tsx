'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarRange, CheckCircle2 } from 'lucide-react';
import { plans } from '@/lib/content/plans';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';
import { useLanguage } from '@/components/language-provider';

export default function PlansPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { t } = useLanguage();
  const attemptsRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, 'users', user.uid, 'attempts') : null),
    [user, firestore]
  );
  const { data: attempts } = useCollection(attemptsRef as any);
  const doneIds = useMemo(
    () => new Set(((attempts as any[]) ?? []).filter((a) => a.status === 'completed').map((a) => a.contentId)),
    [attempts]
  );

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <CalendarRange className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">{t.plans.title}</h1>
          <p className="text-muted-foreground">{t.plans.sub}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((p) => {
          const done = p.days.filter((d) => doneIds.has(`plan-${p.id}-d${d.day}`)).length;
          return (
            <Link key={p.id} href={`/plans/${p.slug}`} className="flex">
              <Card className="flex w-full flex-col transition-all hover:border-primary/80 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">{p.audience}</Badge>
                    {done === 7 && <CheckCircle2 className="h-5 w-5 text-green-500" aria-label={t.plans.completed} />}
                  </div>
                  <CardTitle className="font-headline text-xl">{p.title}</CardTitle>
                  <CardDescription>{p.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {done}/7 {t.plans.days} · {p.days.reduce((s, d) => s + d.minutes, 0)} {t.plans.totalMin} · +{p.xpPerDay * 7} {t.common.xp}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
