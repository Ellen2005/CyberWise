'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PhoneCall } from 'lucide-react';

const TACTICS = [
  { id: 'authority', name: 'Authority', ex: '“This is your bank / IT / police.”' },
  { id: 'urgency', name: 'Urgency', ex: '“Act in 10 minutes or else.”' },
  { id: 'fear', name: 'Fear', ex: '“Your account is compromised.”' },
  { id: 'curiosity', name: 'Curiosity', ex: '“See these leaked photos…”' },
  { id: 'trust', name: 'Trust', ex: '“I’m your friend — new number.”' },
  { id: 'scarcity', name: 'Scarcity', ex: '“Only 2 slots left.”' },
];

const QUIZ = {
  text: 'Caller: “Hi, this is bank support. We detected fraud. To stop it, install this remote app and read me the code on your screen.” Which tactics are in play? (pick the best answer)',
  options: [
    { id: 'a', text: 'Helpfulness only — they want to stop fraud', ok: false },
    { id: 'b', text: 'Authority + fear + urgency, asking for remote access and codes', ok: true },
    { id: 'c', text: 'No tactic — support calls are always real', ok: false },
  ],
  why: 'Banks never ask for remote access or screen codes by cold call. Hang up, contact the bank via the official app yourself.',
};

export default function SocialEngineeringPage() {
  const [picked, setPicked] = useState<string | null>(null);
  const choice = QUIZ.options.find((o) => o.id === picked);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <PhoneCall className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Social engineering</h1>
          <p className="text-muted-foreground">Manipulation tactics — and the one defense that beats them: independent verification.</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="font-headline">Six pressure tactics</CardTitle><CardDescription>Attackers mix these to rush you.</CardDescription></CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          {TACTICS.map((t) => (
            <div key={t.id} className="rounded-md border p-3">
              <p className="font-medium">{t.name}</p>
              <p className="text-muted-foreground">{t.ex}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="font-headline">Spot it</CardTitle><CardDescription>{QUIZ.text}</CardDescription></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {QUIZ.options.map((o) => (
            <Button key={o.id} variant={picked === o.id ? (o.ok ? 'default' : 'destructive') : 'outline'} onClick={() => setPicked(o.id)} disabled={!!picked} className="min-h-[48px] w-full justify-start whitespace-normal text-left">
              {o.text}
            </Button>
          ))}
          {choice && (
            <Alert variant={choice.ok ? 'default' : 'destructive'}>
              <AlertTitle>{choice.ok ? 'Correct' : 'Look again'}</AlertTitle>
              <AlertDescription>{QUIZ.why}</AlertDescription>
            </Alert>
          )}
          {picked && <Button variant="outline" onClick={() => setPicked(null)} className="min-h-[44px]">Retry</Button>}
        </CardContent>
      </Card>
    </main>
  );
}
