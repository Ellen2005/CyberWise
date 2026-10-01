'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck2 } from 'lucide-react';
import { getDailyChallenge, WEEKDAY_FOCUS } from '@/lib/daily-challenge';
import { seedLessons } from '@/lib/seed/lessons';
import { cyberStories } from '@/lib/content/stories';

export default function DailyPage() {
  const now = new Date();
  const challenge = getDailyChallenge(now);
  const focus = WEEKDAY_FOCUS[now.getDay()];
  const lesson = seedLessons[now.getDate() % seedLessons.length];
  const story = cyberStories[now.getDate() % cyberStories.length];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <CalendarCheck2 className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Today&apos;s challenge</h1>
          <p className="text-muted-foreground">{now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} · {focus}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{challenge.title}</CardTitle>
          <CardDescription>{challenge.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="min-h-[44px]"><Link href={`/challenges/${challenge.slug}`}>Start today&apos;s challenge (+{challenge.xpReward} XP)</Link></Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="font-headline text-lg">5-minute lesson</CardTitle><CardDescription>{lesson.title}</CardDescription></CardHeader>
          <CardContent><Button asChild variant="outline" className="min-h-[44px]"><Link href={`/learn/${lesson.slug}`}>Read lesson</Link></Button></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-headline text-lg">Story break</CardTitle><CardDescription>{story.title}</CardDescription></CardHeader>
          <CardContent><Button asChild variant="outline" className="min-h-[44px]"><Link href={`/stories/${story.slug}`}>Play story</Link></Button></CardContent>
        </Card>
      </div>
    </main>
  );
}
