'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Presentation, Clock, FlaskConical } from 'lucide-react';
import { youthSessions, type AgeBand } from '@/lib/content/sessions';

const BANDS: ('all' | AgeBand)[] = ['all', '7-10', '11-13', '14-18'];
const BAND_LABEL: Record<string, string> = {
  all: 'All ages',
  '7-10': 'Ages 7–10',
  '11-13': 'Ages 11–13',
  '14-18': 'Ages 14–18',
};

export default function SessionsPage() {
  const [band, setBand] = useState<'all' | AgeBand>('all');
  const filtered = youthSessions.filter((s) => band === 'all' || s.ages.includes(band));

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Presentation className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">Digital Safety Lab</h1>
          <p className="text-muted-foreground">
            Facilitator-led youth sessions. Situations, not lectures — every session ends with app practice at home.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by age">
          {BANDS.map((b) => (
            <Badge
              key={b}
              variant={band === b ? 'default' : 'secondary'}
              className="cursor-pointer px-3 py-1.5"
              onClick={() => setBand(b)}
            >
              {BAND_LABEL[b]}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <Button asChild variant="outline" className="min-h-[44px]"><Link href="/powers">5 Safety Powers</Link></Button>
          <Button asChild variant="outline" className="min-h-[44px]"><Link href="/sessions/pilot">Run a pilot</Link></Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s, i) => (
          <Link key={s.id} href={`/sessions/${s.slug}`} className="flex">
            <Card className="flex w-full flex-col transition-all hover:border-primary/80 hover:shadow-lg">
              <CardHeader>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary">Session {i + 1}</Badge>
                  {s.ages.map((a) => (<Badge key={a} variant="outline">{a}</Badge>))}
                </div>
                <CardTitle className="font-headline text-xl">{s.title}</CardTitle>
                <CardDescription className="line-clamp-2">{s.goal}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />{s.minutes} min
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 font-headline text-lg"><FlaskConical className="h-5 w-5" />How a session runs</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Live activity first (learners decide before being taught), instructor debrief, then WiseTap practice at home with progress and badges. Measure with the Risk Check before session 1 and after the last one.
        </CardContent>
      </Card>
    </main>
  );
}
