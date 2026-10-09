'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Video, VideoOff, PhoneOff, ArrowLeft,
  RotateCcw, ShieldCheck, Loader2,
} from 'lucide-react';
import { videoCases } from '@/lib/content/video-cases';
import { useUser, useFirestore } from '@/firebase';
import { recordCompletion } from '@/lib/gamification/service';
import { completionToast } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';
import { speakText, stopSpeaking } from '@/lib/audio/speak';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';

function FakeVideo({ name, speaking, frozen }: { name: string; speaking: boolean; frozen?: boolean }) {
  const bars = [12, 22, 16, 28, 20, 26, 14, 24, 18];
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 p-6">
      <span className="absolute left-3 top-3 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> LIVE?
      </span>
      <span className="absolute right-3 top-3 rounded bg-black/60 px-2 py-0.5 text-xs text-white">HD</span>
      <div className="flex flex-col items-center gap-3 py-4">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/30 text-2xl font-bold text-white ring-4 ring-white/10">
          {name.slice(0, 1).toUpperCase()}
        </span>
        <p className="font-medium text-white">{name}</p>
        <span className="flex h-8 items-end gap-1" aria-hidden="true">
          {bars.map((h, i) => (
            <span
              key={i}
              style={{ height: speaking && !frozen ? h : 4 }}
              className={cn('w-1.5 rounded-full bg-emerald-400 transition-all', frozen && 'bg-white/30')}
            />
          ))}
        </span>
        {frozen && <p className="text-xs text-white/70">Signal glitching… oddly repetitive</p>}
      </div>
    </div>
  );
}

export default function VideoCallPage() {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [usedTests, setUsedTests] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { lang } = useLanguage();

  const c = videoCases[index];
  const allUsed = c.tests.every((t) => usedTests.includes(t.id));

  const start = () => {
    setStarted(true);
    speakText(c.callScript[0], { lang, persona: c.truth === 'real-person' ? 'friend' : 'scammer' });
  };

  const hangup = async () => {
    stopSpeaking();
    setDone(true);
    if (!saved && user && firestore && allUsed) {
      setSaved(true);
      try {
        const r = await recordCompletion(firestore, user.uid, {
          contentType: 'quiz', contentId: `vc-${c.id}`, xpAmount: c.xpReward, correct: true,
        });
        toast(completionToast(r, `+${r.xpEarned} XP`, 'Verification drills complete.'));
      } catch { /* silent */ }
    }
  };

  const reset = (n: number) => {
    stopSpeaking();
    setIndex(n);
    setStarted(false);
    setUsedTests([]);
    setDone(false);
    setSaved(false);
    setBusy(false);
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 md:p-8">
      <Link href="/" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <div className="flex items-center gap-3">
        <Video className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Video-call check</h1>
          <p className="text-muted-foreground">
            Case {index + 1}/{videoCases.length}: {c.title}. We never touch your camera — this simulates their side.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {videoCases.map((v, i) => (
          <Button key={v.id} size="sm" variant={i === index ? 'default' : 'outline'} onClick={() => reset(i)} className="min-h-[36px]">
            Case {i + 1}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{c.caller}</CardTitle>
          <CardDescription>{c.story}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!started ? (
            <Button onClick={start} className="min-h-[48px] w-full sm:w-auto">
              <Video className="mr-2 h-4 w-4" />Accept video call
            </Button>
          ) : (
            <>
              <FakeVideo name={c.caller} speaking={!done} frozen={done && c.truth === 'recorded-loop'} />
              {!done ? (
                <>
                  <p className="text-sm font-medium">Run verification tests (use all three before hanging up):</p>
                  <div className="space-y-2">
                    {c.tests.map((t) => {
                      const used = usedTests.includes(t.id);
                      return (
                        <div key={t.id} className="rounded-md border p-3 text-sm">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="font-medium">{t.label}</p>
                              <p className="text-muted-foreground">{t.desc}</p>
                            </div>
                            {!used && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="min-h-[40px] shrink-0"
                                onClick={() => {
                                  setUsedTests((u) => [...u, t.id]);
                                  speakText(c.reactions[t.id], { lang, persona: 'scammer' });
                                }}
                              >
                                Test
                              </Button>
                            )}
                          </div>
                          {used && <p className="mt-2 border-t pt-2 text-muted-foreground">Result: {c.reactions[t.id]}</p>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={hangup} disabled={busy} className="min-h-[44px]">
                      {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PhoneOff className="mr-2 h-4 w-4" />}
                      Hang up{allUsed ? '' : ` (${c.tests.length - usedTests.length} tests left)`}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Alert className={cn(c.truth === 'real-person' ? 'border-green-500/50' : 'border-destructive/60')}>
                    <AlertTitle>{c.verdict}</AlertTitle>
                    <AlertDescription>{c.lesson}</AlertDescription>
                  </Alert>
                  {!allUsed && (
                    <p className="text-sm text-muted-foreground">You hung up early — no XP this time. Run all three tests to earn it.</p>
                  )}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="outline" onClick={() => reset(index)} className="min-h-[44px]"><RotateCcw className="mr-2 h-4 w-4" />Replay</Button>
                    {index < videoCases.length - 1 && (
                      <Button onClick={() => reset(index + 1)} className="min-h-[44px]">Next case</Button>
                    )}
                    <Button asChild variant="outline" className="min-h-[44px]">
                      <Link href="/help/been-scammed"><ShieldCheck className="mr-2 h-4 w-4" />Response help</Link>
                    </Button>
                  </div>
                </div>
              )}
              {!done && (
                <Button variant="ghost" size="sm" onClick={() => { stopSpeaking(); setStarted(false); }}>
                  <VideoOff className="mr-1 h-4 w-4" />Decline call
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Progress value={((usedTests.length + (done ? 1 : 0)) / (c.tests.length + 1)) * 100} aria-label="Verification progress" />
    </main>
  );
}
