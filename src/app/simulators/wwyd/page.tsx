'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HelpCircle } from 'lucide-react';
import { wwydScenarios } from '@/lib/content/wwyd-scenarios';
import { useUser, useFirestore } from '@/firebase';
import { recordCompletion } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';

export default function WWYDPage() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const s = wwydScenarios[index];
  const choice = s.choices.find((c) => c.id === picked);

  const pick = async (id: string) => {
    if (picked) return;
    setPicked(id);
    const c = s.choices.find((x) => x.id === id);
    if (c?.verdict === 'safe' && user && firestore) {
      try {
        const r = await recordCompletion(firestore, user.uid, { contentType: 'quiz', contentId: s.id, xpAmount: s.xpReward, correct: true });
        toast({ title: `+${r.xpEarned} XP`, description: 'Safe decision.' });
      } catch { /* silent */ }
    }
  };

  const reset = (n: number) => { setIndex(n); setPicked(null); };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <HelpCircle className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">What would you do?</h1>
          <p className="text-muted-foreground">Realistic situations. Choose, then learn safe vs risky. {index + 1}/{wwydScenarios.length}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {wwydScenarios.map((x, i) => (
          <Button key={x.id} size="sm" variant={i === index ? 'default' : 'outline'} onClick={() => reset(i)} className="min-h-[36px]">{x.topic}</Button>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="font-headline">{s.title}</CardTitle><CardDescription>{s.topic} · +{s.xpReward} XP</CardDescription></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="rounded-md bg-muted/50 p-4 leading-relaxed">{s.situation}</p>
          <div className="space-y-2">
            {s.choices.map((c) => (
              <Button key={c.id} variant={picked === c.id ? (c.verdict === 'safe' ? 'default' : 'destructive') : 'outline'} onClick={() => pick(c.id)} disabled={!!picked} className="min-h-[48px] w-full justify-start whitespace-normal text-left">
                {c.text}
              </Button>
            ))}
          </div>
          {choice && (
            <>
              <Alert variant={choice.verdict === 'safe' ? 'default' : 'destructive'}>
                <AlertTitle>{choice.verdict === 'safe' ? 'Safe action' : choice.verdict === 'risky' ? 'Risky action' : 'Unsafe action'}</AlertTitle>
                <AlertDescription>{choice.feedback}</AlertDescription>
              </Alert>
              <Alert><AlertTitle>What to do next</AlertTitle><AlertDescription>{s.nextSteps.join(' → ')}</AlertDescription></Alert>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => reset(index)} className="min-h-[44px]">Retry</Button>
                {index < wwydScenarios.length - 1 && <Button onClick={() => reset(index + 1)} className="min-h-[44px]">Next situation</Button>}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
