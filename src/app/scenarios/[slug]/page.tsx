'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Eye, Brain, ListChecks, Zap, BookOpen, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { scenarios } from '@/lib/content/scenarios';
import { scenarios2 } from '@/lib/content/scenarios-2';
import { localizeScenario } from '@/lib/content/localize';
import { useUser, useFirestore } from '@/firebase';
import { recordCompletion } from '@/lib/gamification/service';
import { completionToast } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/language-provider';
import { ReadAloud } from '@/components/read-aloud';
import { ShareResult } from '@/components/share-result';
import { ScenarioMessage } from '@/components/scenario-message';

const ALL = [...scenarios, ...scenarios2];

export default function ScenarioPlayerPage() {
  const params = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const base = ALL.find((s) => s.slug === params.slug);
  const scenario = base ? localizeScenario(base, lang) : undefined;
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const STEPS = t.player.steps;

  if (!scenario) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-headline text-2xl font-bold">Scenario not found</h1>
        <Button asChild><Link href="/scenarios">Back to scenarios</Link></Button>
      </main>
    );
  }

  const choice = scenario.choices.find((c) => c.id === picked) ?? null;
  const isSafe = choice?.verdict === 'safe';

  const finish = async () => {
    if (saved) return;
    setSaved(true);
    const xp = !choice ? 0 : choice.verdict === 'safe' ? scenario.xpReward : choice.verdict === 'risky' ? Math.round(scenario.xpReward / 2) : 0;
    if (user && firestore) {
      try {
        const r = await recordCompletion(firestore, user.uid, {
          contentType: 'quiz',
          contentId: scenario.id,
          xpAmount: xp,
          skillIds: ['skill-phishing-awareness'],
          correct: isSafe,
        });
        toast(
          r.alreadyCompleted
            ? { title: 'Already recorded', description: 'Review complete — XP was earned on your first pass.' }
            : {
                title: xp > 0 ? `+${r.xpEarned} XP` : 'Scenario complete',
                description: isSafe ? 'Safe decision.' : 'Review the red flags — retry to earn full XP.',
              }
        );
      } catch {
        toast({ variant: 'destructive', title: 'Could not save progress', description: 'Try again.' });
      }
    } else {
      toast({ title: 'Scenario complete', description: 'Sign in to save XP.' });
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 md:p-8">
      <Link href="/scenarios" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> {t.player.allScenarios}
      </Link>
      <div>
        <p className="text-sm text-muted-foreground">{scenario.category} · {scenario.channel}</p>
        <h1 className="font-headline text-3xl font-bold">{scenario.title}</h1>
      </div>

      <div>
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>{t.player.stepOf} {step + 1} {t.player.of} {STEPS.length}: {STEPS[step]}</span>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} aria-label={`Step ${step + 1} of ${STEPS.length}`} />
      </div>

      {step === 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-headline text-lg"><Eye className="h-5 w-5" />{STEPS[0]}</CardTitle>
            <ReadAloud text={`From ${scenario.sender}. ${scenario.message}`} lang={lang} label={lang === 'fr' ? 'Écouter' : 'Listen'} />
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ScenarioMessage
              sender={scenario.sender}
              message={scenario.message}
              channel={scenario.channel}
              lang={lang}
              contextNotes={scenario.contextNotes}
            />
            <Button onClick={() => setStep(1)} className="min-h-[44px] w-full sm:w-auto">{t.player.seenCta}</Button>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 font-headline text-lg"><Brain className="h-5 w-5" />{STEPS[1]}</CardTitle>
          <CardDescription>{scenario.thinkPrompt}</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <Textarea placeholder="Type your thinking in your own words (optional, not graded)..." className="min-h-[100px]" aria-label="Your thinking" />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)} className="min-h-[44px]">{t.player.back}</Button>
              <Button onClick={() => setStep(2)} className="min-h-[44px]">{t.player.toDecide}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 font-headline text-lg"><ListChecks className="h-5 w-5" />{STEPS[2]}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {scenario.choices.map((c) => (
              <Button
                key={c.id}
                variant={picked === c.id ? 'default' : 'outline'}
                onClick={() => setPicked(c.id)}
                className="min-h-[52px] w-full justify-start whitespace-normal text-left"
              >
                {c.text}
              </Button>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(1)} className="min-h-[44px]">{t.player.back}</Button>
              <Button disabled={!picked} onClick={() => setStep(3)} className="min-h-[44px]">{t.player.liveWithIt}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && choice && (
        <Card className={cn(choice.verdict === 'safe' ? 'border-green-500/60' : 'border-destructive/60')}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-headline text-lg"><Zap className="h-5 w-5" />{STEPS[3]}</CardTitle>
            <ReadAloud text={`${choice.consequenceTitle}. ${choice.consequence} ${choice.feedback}`} lang={lang} label={lang === 'fr' ? 'Écouter' : 'Listen'} />
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Alert variant={isSafe ? 'default' : 'destructive'}>
              {isSafe ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{choice.consequenceTitle}</AlertTitle>
              <AlertDescription>{choice.consequence}</AlertDescription>
            </Alert>
            <Alert><AlertDescription>{choice.feedback}</AlertDescription></Alert>
            <Button onClick={() => setStep(4)} className="min-h-[44px] w-full sm:w-auto">{t.player.understood}</Button>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-headline text-lg"><BookOpen className="h-5 w-5" />{STEPS[4]}</CardTitle>
            <ReadAloud text={scenario.redFlags.map((f) => `${f.label}. ${f.explanation}`).join(' ')} lang={lang} label={lang === 'fr' ? 'Écouter' : 'Listen'} />
          </CardHeader>
          <CardContent className="space-y-3">
            {scenario.redFlags.map((f) => (
              <Alert key={f.label}><AlertTitle>{f.label}</AlertTitle><AlertDescription>{f.explanation}</AlertDescription></Alert>
            ))}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(3)} className="min-h-[44px]">{t.player.back}</Button>
              <Button onClick={() => setStep(5)} className="min-h-[44px]">{t.player.toProtect}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 5 && (
        <Card className="border-green-500/40">
          <CardHeader><CardTitle className="flex items-center gap-2 font-headline text-lg"><ShieldCheck className="h-5 w-5" />{STEPS[5]}</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc space-y-2 pl-5">
              {scenario.protect.map((p) => (<li key={p}>{p}</li>))}
            </ul>
            {!saved ? (
              <Button onClick={finish} className="min-h-[44px] w-full sm:w-auto">{t.player.finish} (+{isSafe ? scenario.xpReward : choice?.verdict === 'risky' ? Math.round(scenario.xpReward / 2) : 0} {t.common.xp})</Button>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <ShareResult
                  kind="scenario"
                  title={scenario.title}
                  score={!choice ? 0 : choice.verdict === 'safe' ? 100 : choice.verdict === 'risky' ? 50 : 0}
                  path={`/scenarios/${scenario.slug}`}
                />
                <Button asChild variant="outline" className="min-h-[44px]"><Link href="/scenarios">{t.player.moreScenarios}</Link></Button>
                <Button asChild className="min-h-[44px]"><Link href="/spot-the-scam">{t.player.trySpot}</Link></Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      <CardDescription className="text-center">Progress saves automatically when you finish{user ? '' : ' (sign in to keep XP)'}. Retries are free — learning counts.</CardDescription>
    </main>
  );
}
