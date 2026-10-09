'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { scamScenarios } from '@/lib/content/scam-scenarios';
import { useUser, useFirestore } from '@/firebase';
import { recordCompletion } from '@/lib/gamification/service';
import { completionToast } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';
import { scoreInvestigation, passedInvestigation } from '@/lib/learning/investigation-score';

export default function ScamSimulatorPage() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const s = scamScenarios[index];

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  // No separate verdict step here: spotting the flags IS the verdict.
  const grading = scoreInvestigation(picked, s.redFlags.map((r) => r.id), true);

  const submit = async () => {
    setSubmitted(true);
    const good = passedInvestigation(grading);
    if (user && firestore) {
      try {
        const r = await recordCompletion(firestore, user.uid, { contentType: 'quiz', contentId: s.id, xpAmount: good ? s.xpReward : 0, correct: good });
        if (good) toast(completionToast(r, `+${r.xpEarned} XP`, 'Red flags spotted.'));
      } catch { toast({ variant: 'destructive', title: 'Could not save XP', description: 'Try again.' }); }
    } else if (good) {
      toast({ title: 'Well spotted!', description: 'Sign in to save XP.' });
    }
  };

  const reset = (n: number) => { setIndex(n); setPicked([]); setSubmitted(false); };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <ShieldAlert className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Scam awareness</h1>
          <p className="text-muted-foreground">Fictional scenarios. Spot red flags — learn the manipulation, not the crime. {index + 1}/{scamScenarios.length}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {scamScenarios.map((x, i) => (
          <Button key={x.id} size="sm" variant={i === index ? 'default' : 'outline'} onClick={() => reset(i)} className="min-h-[36px]">{x.title}</Button>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="font-headline">{s.title}</CardTitle><CardDescription>{s.category} · +{s.xpReward} XP</CardDescription></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="rounded-md bg-muted/50 p-4 leading-relaxed">{s.story}</p>
          <p className="font-medium">Which are red flags? (select all that apply)</p>
          <div className="space-y-2">
            {[...s.redFlags.map((r) => ({ id: r.id, label: r.label })), { id: 'd1', label: 'Professional design means it is safe' }, { id: 'd2', label: 'Fast replies prove legitimacy' }].map((o) => (
              <label key={o.id} className="flex cursor-pointer items-start gap-2 rounded-md border p-3">
                <Checkbox checked={picked.includes(o.id)} onCheckedChange={() => !submitted && toggle(o.id)} aria-label={o.label} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          {!submitted ? (
            <Button disabled={picked.length === 0} onClick={submit} className="min-h-[44px]">Check my analysis</Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium">
                Score {Math.round(grading.score * 100)}% — {grading.found.length}/{s.redFlags.length} flags found
                {grading.falsePositives.length > 0 && `, ${grading.falsePositives.length} wrong pick(s)`}
              </p>
              {s.redFlags.map((r) => (
                <Alert key={r.id}><AlertTitle>{r.label} {picked.includes(r.id) ? '— spotted' : '— missed'}</AlertTitle><AlertDescription>{r.explanation}</AlertDescription></Alert>
              ))}
              {grading.falsePositives.map((id) => (
                <Alert key={id} variant="destructive">
                  <AlertTitle>False positive</AlertTitle>
                  <AlertDescription>
                    {id === 'd1'
                      ? 'Professional design is cheap to fake — scammers buy polish. Judge evidence, not looks.'
                      : 'Fast replies prove a call center exists, not honesty. Speed is a pressure tactic.'}
                  </AlertDescription>
                </Alert>
              ))}
              <Alert><AlertTitle>Manipulation tactics</AlertTitle><AlertDescription>{s.tactics.join(' · ')}</AlertDescription></Alert>
              <Alert><AlertTitle>Never share</AlertTitle><AlertDescription>{s.neverShare.join(' · ')}</AlertDescription></Alert>
              <Alert><AlertTitle>How to verify</AlertTitle><AlertDescription>{s.howToVerify.join(' → ')}</AlertDescription></Alert>
              <Alert><AlertTitle>If money/info already sent</AlertTitle><AlertDescription>{s.ifAlreadySent.join(' → ')}</AlertDescription></Alert>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => reset(index)} className="min-h-[44px]">Retry</Button>
                {index < scamScenarios.length - 1 && <Button onClick={() => reset(index + 1)} className="min-h-[44px]">Next</Button>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
