'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScanEye, Timer, CheckCircle2, XCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { spotItems } from '@/lib/content/spot-items';
import { useUser, useFirestore } from '@/firebase';
import { recordCompletion } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SpotTheScamPage() {
  const [index, setIndex] = useState(0);
  const [tapped, setTapped] = useState<string[]>([]);
  const [calledLegit, setCalledLegit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const item = spotItems[index];
  const flagIds = useMemo(() => new Set(item.flags.map((f) => f.id)), [item]);

  const tap = (flagId?: string) => {
    if (submitted || calledLegit) return;
    if (!flagId) {
      setTapped((t) => (t.includes('__innocent') ? t : [...t, '__innocent']));
      return;
    }
    setTapped((t) => (t.includes(flagId) ? t.filter((x) => x !== flagId) : [...t, flagId]));
  };

  const found = tapped.filter((t) => flagIds.has(t)).length;
  const falseHits = tapped.filter((t) => !flagIds.has(t)).length;
  const verdictOk = item.isScam ? found > 0 : calledLegit;
  const score = item.isScam
    ? Math.max(0, Math.round((found / Math.max(1, item.flags.length)) * 100 - falseHits * 15))
    : calledLegit && falseHits === 0
      ? 100
      : 0;

  const submit = async () => {
    setSubmitted(true);
    const good = score >= 60;
    if (user && firestore) {
      try {
        const r = await recordCompletion(firestore, user.uid, {
          contentType: 'quiz',
          contentId: item.id,
          xpAmount: good ? item.xpReward : 0,
          correct: good,
        });
        toast({ title: good ? `+${r.xpEarned} XP` : 'Checked', description: good ? 'Sharp eyes.' : 'Review the flags below and retry.' });
      } catch {
        toast({ variant: 'destructive', title: 'Could not save', description: 'Try again.' });
      }
    }
  };

  const reset = (n: number) => {
    setIndex(n); setTapped([]); setCalledLegit(false); setSubmitted(false);
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-8">
      <Link href="/" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <div className="flex items-center gap-3">
        <ScanEye className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Spot the Scam</h1>
          <p className="text-muted-foreground">Tap the suspicious parts. {index + 1}/{spotItems.length} · Wrong taps cost accuracy.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {spotItems.map((s, i) => (
          <Button key={s.id} size="sm" variant={i === index ? 'default' : 'outline'} onClick={() => reset(i)} className="min-h-[36px]">
            {i + 1}. {s.kind}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{item.title}</CardTitle>
          <CardDescription>{item.intro}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="rounded-md border bg-muted/40 p-4 font-mono text-[13px] leading-relaxed" role="group" aria-label="Message to inspect">
            {item.segments.map((seg, i) =>
              seg.flagId ? (
                <button
                  key={i}
                  onClick={() => tap(seg.flagId)}
                  disabled={submitted}
                  className={cn(
                    'rounded px-0.5 underline decoration-dotted underline-offset-4 transition-colors',
                    tapped.includes(seg.flagId)
                      ? submitted
                        ? 'bg-green-500/25 text-green-700 dark:text-green-300'
                        : 'bg-primary/25'
                      : 'hover:bg-primary/10'
                  )}
                  aria-pressed={tapped.includes(seg.flagId)}
                >
                  {seg.text}
                </button>
              ) : (
                <button key={i} onClick={() => tap()} disabled={submitted} className={cn('rounded px-0.5', tapped.includes('__innocent') && 'bg-red-500/10')}>
                  {seg.text}
                </button>
              )
            )}
          </div>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Timer className="h-4 w-4" /> No timer pressure here — accuracy first. Tapped: {tapped.length}
          </p>

          {!submitted ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={submit} disabled={tapped.length === 0 && !calledLegit} className="min-h-[44px]">
                Check my inspection{tapped.length > 0 ? ` (${found} suspect${found === 1 ? '' : 's'} tapped)` : ''}
              </Button>
              <Button
                variant={calledLegit ? 'default' : 'outline'}
                onClick={() => { setCalledLegit((v) => !v); setTapped([]); }}
                className="min-h-[44px]"
              >
                Looks legitimate
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {score >= 60 ? <CheckCircle2 className="h-7 w-7 text-green-500" /> : <XCircle className="h-7 w-7 text-destructive" />}
                <p className="font-headline text-xl font-bold">Score: {score}%</p>
              </div>
              <Progress value={score} aria-label={`Score ${score} percent`} />
              {!verdictOk && (
                <Alert variant="destructive">
                  <AlertTitle>{item.isScam ? 'You missed it — this WAS a scam.' : 'Careful — this one was LEGITIMATE.'}</AlertTitle>
                  <AlertDescription>
                    {item.isScam
                      ? 'Calling scam messages "legitimate" (or finding nothing) is how victims are made. Study the flags below.'
                      : 'Flagging honest messages trains paranoia, not safety. The skill is telling them apart.'}
                  </AlertDescription>
                </Alert>
              )}
              {item.flags.map((f) => (
                <Alert key={f.id} className={cn(tapped.includes(f.id) && 'border-green-500/50')}>
                  <AlertTitle>{f.label} {tapped.includes(f.id) ? '— you spotted it' : '— you missed it'}</AlertTitle>
                  <AlertDescription>{f.explanation}</AlertDescription>
                </Alert>
              ))}
              {falseHits > 0 && (
                <p className="text-sm text-muted-foreground">{falseHits} tap{falseHits === 1 ? '' : 's'} on innocent parts cost accuracy. Tap only what you can justify.</p>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => reset(index)} className="min-h-[44px]"><RotateCcw className="mr-2 h-4 w-4" />Retry</Button>
                {index < spotItems.length - 1 && <Button onClick={() => reset(index + 1)} className="min-h-[44px]">Next message</Button>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
