'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, ListOrdered, Package, MonitorSmartphone } from 'lucide-react';
import { youthSessions } from '@/lib/content/sessions';

export default function SessionDetailPage() {
  const params = useParams<{ slug: string }>();
  const session = youthSessions.find((s) => s.slug === params.slug);

  if (!session) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-headline text-2xl font-bold">Session not found</h1>
        <Button asChild><Link href="/sessions">Back to sessions</Link></Button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-8">
      <Link href="/sessions" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All sessions
      </Link>
      <div>
        <div className="flex flex-wrap gap-1.5">
          {session.ages.map((a) => (<Badge key={a} variant="secondary">Ages {a}</Badge>))}
          <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.minutes} min</Badge>
        </div>
        <h1 className="mt-2 font-headline text-3xl font-bold">{session.title}</h1>
        <p className="mt-2 text-muted-foreground">Goal: {session.goal}</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 font-headline text-lg"><ListOrdered className="h-5 w-5" />Run of show</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {session.steps.map((st, i) => (
            <div key={st.title} className="rounded-md border p-4">
              <p className="font-medium">{i + 1}. {st.title} <span className="text-xs font-normal text-muted-foreground">({st.minutes} min)</span></p>
              <p className="mt-1 text-sm text-muted-foreground">{st.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 font-headline text-lg"><Package className="h-5 w-5" />Materials</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {session.materials.map((m) => (<li key={m}>{m}</li>))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-primary/40">
        <CardHeader><CardTitle className="flex items-center gap-2 font-headline text-lg"><MonitorSmartphone className="h-5 w-5" />At-home practice</CardTitle>
        <CardDescription>Learners continue on WiseTap and earn XP.</CardDescription></CardHeader>
        <CardContent>
          <Button asChild className="min-h-[44px]"><Link href={session.appHref}>{session.appCta}</Link></Button>
        </CardContent>
      </Card>
    </main>
  );
}
