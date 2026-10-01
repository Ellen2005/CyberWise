'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, Clock } from 'lucide-react';
import { cyberStories } from '@/lib/content/stories';

export default function StoriesPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Compass className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">Cyber Stories</h1>
          <p className="text-muted-foreground">Short interactive stories. You make the decisions — then learn why.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cyberStories.map((s) => (
          <Link key={s.id} href={`/stories/${s.slug}`} className="flex">
            <Card className="flex w-full flex-col transition-all hover:border-primary/80 hover:shadow-lg">
              <CardHeader>
                <Badge variant="secondary" className="w-fit">{s.topic}</Badge>
                <CardTitle className="font-headline text-xl">{s.title}</CardTitle>
                <CardDescription>{s.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{s.estimatedMinutes} min</span>
                <span>+{s.xpReward} XP</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
