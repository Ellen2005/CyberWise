'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, ScanSearch, RotateCcw } from 'lucide-react';
import { phishingScenarios } from '@/lib/content/phishing-scenarios';
import { useUser, useFirestore } from '@/firebase';
import { recordCompletion } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function PhishingInvestigationPage() {
  const [index, setIndex] = useState(0);
  const [pickedClues, setPickedClues] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<'phishing' | 'legit' | null>(null);
  const [action, setAction] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const scenario = phishingScenarios[index];
  const correctClueIds = new Set(scenario.clues.map((c) => c.id));

  const toggleClue = (id: string) =>
    setPickedClues((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const submit = async () => {
    setSubmitted(true);
    const verdictOk = (verdict === 'phishing') === scenario.isPhishing;
    const found = pickedClues.filter((id) => correctClueIds.has(id)).length;
    const recall = found / scenario.clues.length;
    const score = (verdictOk ? 0.5 : 0) + recall * 0.5;
    if (score >= 0.7 && user && firestore) {
      try {
        const r = await recordCompletion(firestore, user.uid, {
          contentType: 'quiz',
          contentId: scenario.id,
          xpAmount: scenario.xpReward,
          skillIds: ['skill-phishing-awareness', 'skill-email-security'],
          correct: true,
        });
        toast({ title: `+${r.xpEarned} XP`, description: 'Investigation complete.' });
      } catch {
        toast({ variant: 'destructive', title: 'Could not save XP', description: 'Try again.' });
      }
    } else if (score >= 0.7) {
      toast({ title: 'Well investigated!', description: 'Sign in to save XP.' });
    }
  };

  const reset = (next?: number) => {
    const n = next ?? index;
    setIndex(n);
    setPickedClues([]);
    setVerdict(null);
    setAction(null);
    setSubmitted(false);
  };

  const verdictOk = submitted && (verdict === 'phishing') === scenario.isPhishing;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <ScanSearch className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Phishing investigation</h1>
          <p className="text-muted-foreground">Investigate like an analyst: inspect, pick clues, decide, then act. {index + 1}/{phishingScenarios.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {phishingScenarios.map((s, i) => (
          <Button key={s.id} size="sm" variant={i === index ? 'default' : 'outline'} onClick={() => reset(i)} className="min-h-[36px]">
            {i + 1}. {s.category}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{scenario.title}</CardTitle>
          <CardDescription>Difficulty {scenario.difficulty}/3 · +{scenario.xpReward} XP</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-2 rounded-md bg-muted/50 p-4">
            <p><strong>From:</strong> {scenario.senderName} &lt;{scenario.senderAddress}&gt;</p>
            <p><strong>Real domain:</strong> {scenario.realDomain}</p>
            <p><strong>Subject:</strong> {scenario.subject}</p>
            <p className="whitespace-pre-wrap"><strong>Message:</strong> {scenario.body}</p>
            <p><strong>Link text:</strong> {scenario.linkText}</p>
            <p className="break-all"><strong>Link destination:</strong> {scenario.linkDestination}</p>
            {scenario.hasAttachment && <p><strong>Attachment:</strong> {scenario.hasAttachment}</p>}
          </div>

          <div>
            <p className="mb-2 font-medium">1. Which clues do you notice? (select all that apply)</p>
            <div className="space-y-2">
              {[
                ...scenario.clues,
                { id: 'distractor-tone', label: 'Friendly tone means it is safe', detail: '', whyItMatters: '' },
                { id: 'distractor-logo', label: 'Has a logo, so it must be real', detail: '', whyItMatters: '' },
              ].map((c) => (
                <label key={c.id} className="flex cursor-pointer items-start gap-2 rounded-md border p-3">
                  <Checkbox checked={pickedClues.includes(c.id)} onCheckedChange={() => !submitted && toggleClue(c.id)} aria-label={c.label} />
                  <span className="font-normal">{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium">2. Would you trust this message?</p>
            <RadioGroup value={verdict ?? ''} onValueChange={(v) => !submitted && setVerdict(v as 'phishing' | 'legit')} className="space-y-2">
              <div className="flex items-center gap-2 rounded-md border p-3">
                <RadioGroupItem value="phishing" id="v-phish" /><Label htmlFor="v-phish" className="cursor-pointer font-normal">No — looks like phishing</Label>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-3">
                <RadioGroupItem value="legit" id="v-legit" /><Label htmlFor="v-legit" className="cursor-pointer font-normal">Yes — looks legitimate</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <p className="mb-2 font-medium">3. What should you do next?</p>
            <RadioGroup value={action ?? ''} onValueChange={(v) => !submitted && setAction(v)} className="space-y-2">
              {[scenario.safeAction, ...scenario.riskyActions].map((a, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border p-3">
                  <RadioGroupItem value={a} id={`act-${i}`} /><Label htmlFor={`act-${i}`} className="cursor-pointer font-normal">{a}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {!submitted ? (
            <Button disabled={!verdict || !action || pickedClues.length === 0} onClick={submit} className="min-h-[44px] w-full sm:w-auto">
              Submit investigation
            </Button>
          ) : (
            <div className="space-y-3">
              <Alert variant={verdictOk ? 'default' : 'destructive'} className={cn(verdictOk && 'border-green-500/50')}>
                {verdictOk ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{verdictOk ? 'Good verdict' : 'Verdict missed'} — {scenario.isPhishing ? 'this WAS phishing.' : 'this was LEGITIMATE.'}</AlertTitle>
                <AlertDescription>
                  You found {pickedClues.filter((id) => correctClueIds.has(id)).length}/{scenario.clues.length} real clues.
                  {action !== scenario.safeAction && ' Your chosen action was risky — see the safe action below.'}
                </AlertDescription>
              </Alert>
              {scenario.clues.map((c) => (
                <Alert key={c.id}>
                  <AlertTitle>{c.label} {pickedClues.includes(c.id) ? '— you spotted it' : '— you missed it'}</AlertTitle>
                  <AlertDescription>{c.detail} Why it matters: {c.whyItMatters}</AlertDescription>
                </Alert>
              ))}
              <Alert className="border-green-500/50">
                <AlertTitle>Safe action</AlertTitle>
                <AlertDescription>{scenario.safeAction} Why: {scenario.safeActionWhy}</AlertDescription>
              </Alert>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={() => reset()} className="min-h-[44px]"><RotateCcw className="mr-2 h-4 w-4" />Retry</Button>
                {index < phishingScenarios.length - 1 && (
                  <Button onClick={() => reset(index + 1)} className="min-h-[44px]">Next scenario</Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
