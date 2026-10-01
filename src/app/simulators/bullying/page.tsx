'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HeartHandshake } from 'lucide-react';

const SCENARIO = {
  title: 'Edited photo spreads in a class group',
  text: 'Someone posts an edited embarrassing photo of a classmate. Others laugh and forward it. The classmate goes quiet.',
  options: [
    { id: 'join', text: 'Forward it with a laughing comment', verdict: 'unsafe' as const, feedback: 'Forwarding is participation in harassment and spreads harm. It can also get you in trouble.' },
    { id: 'support', text: 'Do not forward. Message them privately, save evidence, report the post', verdict: 'safe' as const, feedback: 'Correct. Private support + evidence + report is the safe chain. Do not retaliate publicly.' },
    { id: 'fight', text: 'Publicly insult the person who posted it', verdict: 'risky' as const, feedback: 'Retaliation usually escalates and can be used against you. Report instead.' },
  ],
};

export default function BullyingPage() {
  const [picked, setPicked] = useState<string | null>(null);
  const choice = SCENARIO.options.find((o) => o.id === picked);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <HeartHandshake className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Cyberbullying response</h1>
          <p className="text-muted-foreground">Sensitive, practical guidance. Never encourage retaliation. You do not have to face this alone.</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="font-headline">What cyberbullying includes</CardTitle><CardDescription>Harassment, threats, humiliation, impersonation, rumor-spreading, non-consensual sharing, repeated abusive messages, doxxing.</CardDescription></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Safe chain:</strong> Do not respond angrily → Save evidence (screenshots with dates) → Block → Report to the platform → Tell someone you trust → Seek support if unsafe.</p>
          <p><strong>Doxxing awareness:</strong> sharing someone&apos;s address, location, school, or private photos without consent is dangerous. Request removal via report tools and tighten your own privacy too.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="font-headline">{SCENARIO.title}</CardTitle><CardDescription>What would you do?</CardDescription></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="rounded-md bg-muted/50 p-4">{SCENARIO.text}</p>
          <div className="space-y-2">
            {SCENARIO.options.map((o) => (
              <Button key={o.id} variant={picked === o.id ? (o.verdict === 'safe' ? 'default' : 'destructive') : 'outline'} onClick={() => setPicked(o.id)} disabled={!!picked} className="min-h-[48px] w-full justify-start whitespace-normal text-left">
                {o.text}
              </Button>
            ))}
          </div>
          {choice && (
            <Alert variant={choice.verdict === 'safe' ? 'default' : 'destructive'}>
              <AlertTitle>{choice.verdict === 'safe' ? 'Safest response' : 'Why this is risky'}</AlertTitle>
              <AlertDescription>{choice.feedback}</AlertDescription>
            </Alert>
          )}
          {picked && <Button variant="outline" onClick={() => setPicked(null)} className="min-h-[44px]">Try again</Button>}
        </CardContent>
      </Card>
    </main>
  );
}
