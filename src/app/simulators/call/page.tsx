'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Phone, PhoneOff, Mic, Send, Loader2, ArrowLeft,
  CheckCircle2, XCircle, ShieldCheck, ShieldAlert,
} from 'lucide-react';
import { callScenarios, type CallScenario } from '@/lib/content/call-scenarios';
import type { CallTurn } from '@/lib/calls/evaluate';
import { getScammerReply, judgeCallTranscript, type JudgeState } from './actions';
import { useUser, useFirestore } from '@/firebase';
import { recordCompletion } from '@/lib/gamification/service';
import { completionToast } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/language-provider';
import { ShareResult } from '@/components/share-result';
import { speakText, stopSpeaking } from '@/lib/audio/speak';
import { cn } from '@/lib/utils';

type Phase = 'pick' | 'brief' | 'ringing' | 'live' | 'debrief';

function speak(text: string, lang: string) {
  speakText(text, { lang, persona: 'scammer' });
}

export default function ScamCallPage() {
  const [scenario, setScenario] = useState<CallScenario | null>(null);
  const [phase, setPhase] = useState<Phase>('pick');
  const [transcript, setTranscript] = useState<CallTurn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<JudgeState | null>(null);
  const [saved, setSaved] = useState(false);
  const [declined, setDeclined] = useState(false);
  const recogRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { lang } = useLanguage();

  useEffect(() => () => {
    try {
      recogRef.current?.stop();
      stopSpeaking();
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, phase]);

  const startCall = (s: CallScenario) => {
    setScenario(s);
    setTranscript([{ role: 'scammer', text: s.opening }]);
    setResult(null);
    setSaved(false);
    setDeclined(false);
    setPhase('ringing');
    setTimeout(() => {
      setPhase('live');
      speak(s.opening, lang);
    }, 2500);
  };

  const decline = async () => {
    // Declining unknown calls is the textbook defense — reward it briefly.
    setDeclined(true);
    stopSpeaking();
    if (user && firestore && scenario) {
      try {
        const r = await recordCompletion(firestore, user.uid, {
          contentType: 'quiz', contentId: `call-${scenario.id}`, xpAmount: scenario.xpReward, correct: true,
        });
        toast(completionToast(r, `+${r.xpEarned} XP`, 'Correct instinct: unknown urgent caller, no engagement.'));
      } catch { /* silent */ }
    }
    setPhase('debrief');
  };

  const sendUserLine = async (text: string) => {
    const clean = text.trim().slice(0, 500);
    if (!clean || busy || !scenario || phase !== 'live') return;
    stopSpeaking();
    const next: CallTurn[] = [...transcript, { role: 'user', text: clean }];
    setTranscript(next);
    setInput('');
    setBusy(true);
    try {
      const res = await getScammerReply(scenario.id, next);
      if (res.error) {
        toast({ variant: 'destructive', title: 'Call dropped', description: 'The simulator hit an error. Try again.' });
        return;
      }
      const updated: CallTurn[] = [...next, { role: 'scammer', text: res.reply ?? '' }];
      setTranscript(updated);
      speak(res.reply ?? '', lang);
      const userTurns = updated.filter((t) => t.role === 'user').length;
      if (res.shouldEnd || userTurns >= scenario.maxTurns) {
        setTimeout(() => finishCall(updated), 2500);
      }
    } finally {
      setBusy(false);
    }
  };

  const [judgeError, setJudgeError] = useState(false);

  const runJudge = async (t: CallTurn[]): Promise<JudgeState | null> => {
    if (!scenario) return null;
    setJudgeError(false);
    try {
      const res = await judgeCallTranscript(scenario.id, t);
      setResult(res);
      return res;
    } catch {
      // Never leave the learner on a spinner: explain and offer retry.
      setJudgeError(true);
      return null;
    }
  };

  const finishCall = async (finalTranscript?: CallTurn[]) => {
    const t = finalTranscript ?? transcript;
    stopSpeaking();
    setPhase('debrief');
    if (!scenario) return;
    const judged = await runJudge(t);
    if (!saved && user && firestore) {
      setSaved(true);
      const good = (judged?.scores?.overall ?? 0) >= 60;
      try {
        const r = await recordCompletion(firestore, user.uid, {
          contentType: 'quiz', contentId: `call-${scenario.id}`,
          xpAmount: good ? scenario.xpReward : 0, correct: good,
        });
        if (good) toast(completionToast(r, `+${r.xpEarned} XP`, 'Handled well under pressure.'));
      } catch { /* silent */ }
    }
  };

  const toggleMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast({ title: 'Voice input unavailable', description: 'Your browser has no speech recognition — type instead.' });
      return;
    }
    if (listening) {
      try { recogRef.current?.stop(); } catch { /* noop */ }
      setListening(false);
      return;
    }
    try {
      const rec = new SR();
      recogRef.current = rec;
      rec.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
      rec.interimResults = false;
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setInput(text);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      rec.start();
      setListening(true);
    } catch {
      toast({ title: 'Microphone blocked', description: 'Allow microphone access or type instead.' });
    }
  };

  const score = result?.scores?.overall ?? 0;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 md:p-8">
      <Link href="/" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <div className="flex items-center gap-3">
        <Phone className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Scam call simulator</h1>
          <p className="text-muted-foreground">Answer a scammer safely. Training only — never use real codes or details here.</p>
        </div>
      </div>

      {phase === 'pick' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {callScenarios.map((s) => (
            <Card key={s.id} className="transition-all hover:border-primary/80">
              <CardHeader>
                <CardTitle className="font-headline text-lg">{s.title}</CardTitle>
                <CardDescription>{s.context}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => { setScenario(s); setPhase('brief'); }} className="min-h-[44px] w-full">
                  <Phone className="mr-2 h-4 w-4" />Take this call
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {phase === 'brief' && scenario && (
        <Card className="border-primary/40">
          <CardHeader><CardTitle className="font-headline">{scenario.title}</CardTitle><CardDescription>{scenario.caller}</CardDescription></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Alert>
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Practice rules</AlertTitle>
              <AlertDescription>
                This is fictional training. Use FAKE details only (say "my code is 0000" if you test sharing — never anything real).
                You can decline, hang up anytime, or play along to see the tactics. Your words are recorded for your debrief only.
              </AlertDescription>
            </Alert>
            <p className="text-muted-foreground">{scenario.context}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => setPhase('pick')} className="min-h-[44px]">Choose another</Button>
              <Button onClick={() => startCall(scenario)} className="min-h-[44px]"><Phone className="mr-2 h-4 w-4" />Ring me</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === 'ringing' && scenario && (
        <Card className="border-primary/40">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <span className="relative flex h-20 w-20">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-30" />
              <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                <Phone className="h-9 w-9 text-primary" />
              </span>
            </span>
            <div>
              <p className="font-headline text-xl font-bold">Incoming call…</p>
              <p className="text-sm text-muted-foreground">{scenario.caller}</p>
            </div>
            <div className="flex gap-6">
              <Button size="lg" className="h-16 w-16 rounded-full bg-green-600 p-0 hover:bg-green-700" onClick={() => setPhase('live')} aria-label="Answer">
                <Phone className="h-7 w-7" />
              </Button>
              <Button size="lg" className="h-16 w-16 rounded-full bg-destructive p-0" onClick={decline} aria-label="Decline">
                <PhoneOff className="h-7 w-7" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Green answers · Red declines (declining unknown urgent calls is correct)</p>
          </CardContent>
        </Card>
      )}

      {phase === 'live' && scenario && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline text-lg">On the call — {scenario.caller}</CardTitle>
              <Button variant="destructive" size="sm" onClick={() => finishCall()} className="min-h-[40px]">
                <PhoneOff className="mr-1 h-4 w-4" />Hang up
              </Button>
            </div>
            <CardDescription>Turn {transcript.filter((t) => t.role === 'user').length + 1} of {scenario.maxTurns} · speak or type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-80 space-y-2 overflow-y-auto" aria-live="polite">
              {transcript.map((m, i) => (
                <div
                  key={i}
                  className={m.role === 'user'
                    ? 'ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground'
                    : 'mr-auto max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm'}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                </div>
              ))}
              {busy && <p className="text-xs italic text-muted-foreground">The caller is responding…</p>}
              <div ref={endRef} />
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => { e.preventDefault(); sendUserLine(input); }}
            >
              <Button type="button" variant={listening ? 'default' : 'outline'} onClick={toggleMic} className="min-h-[44px] shrink-0" aria-label={listening ? 'Stop listening' : 'Speak instead of typing'}>
                <Mic className={cn('h-4 w-4', listening && 'animate-pulse')} />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? 'Listening… speak now' : 'Type your reply (or tap the mic)…'}
                aria-label="Your reply"
                className="min-h-[44px]"
                maxLength={500}
              />
              <Button type="submit" disabled={busy || !input.trim()} className="min-h-[44px] shrink-0" aria-label="Send reply">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">Training reminder: use fake details only. Hang up whenever you have seen enough.</p>
          </CardContent>
        </Card>
      )}

      {phase === 'debrief' && (
        <div className="space-y-4">
          {declined ? (
            <Card className="border-green-500/50">
              <CardHeader><CardTitle className="flex items-center gap-2 font-headline"><CheckCircle2 className="h-6 w-6 text-green-500" />Declined — textbook defense</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>Unknown number + urgent story = no engagement. You saved minutes and risked nothing.</p>
                {scenario && (
                  <>
                    <p className="text-muted-foreground">Had you answered, this caller wanted: {scenario.debrief.goal}</p>
                    <Alert><AlertTitle>Never</AlertTitle><AlertDescription>{scenario.debrief.neverDo.join(' · ')}</AlertDescription></Alert>
                    <Alert className="border-green-500/50"><AlertTitle>Always</AlertTitle><AlertDescription>{scenario.debrief.alwaysDo.join(' · ')}</AlertDescription></Alert>
                  </>
                )}
              </CardContent>
            </Card>
          ) : result ? (
            <>
              <Card className={cn(score >= 60 ? 'border-green-500/50' : 'border-destructive/60')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {score >= 60 ? <CheckCircle2 className="h-8 w-8 text-green-500" /> : <XCircle className="h-8 w-8 text-destructive" />}
                    <CardTitle className="font-headline text-2xl">Call score: {score}%</CardTitle>
                  </div>
                  <CardDescription>
                    Info protected {result.scores?.infoProtected}% · Verification {result.scores?.verification}% · Composure {result.scores?.composure}%
                    {result.offline ? ' · scored offline' : ' · AI judged'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={score} aria-label={`Call score ${score} percent`} />
                  {result.mistakes && result.mistakes.length > 0 && (
                    <Alert variant="destructive"><AlertTitle>Mistakes to fix</AlertTitle><AlertDescription><ul className="list-disc space-y-1 pl-5">{result.mistakes.map((m) => (<li key={m}>{m}</li>))}</ul></AlertDescription></Alert>
                  )}
                  {result.strengths && result.strengths.length > 0 && (
                    <Alert className="border-green-500/50"><AlertTitle>What you did right</AlertTitle><AlertDescription><ul className="list-disc space-y-1 pl-5">{result.strengths.map((s) => (<li key={s}>{s}</li>))}</ul></AlertDescription></Alert>
                  )}
                  {result.tip && <p className="text-sm"><strong>One habit:</strong> {result.tip}</p>}
                </CardContent>
              </Card>
              {scenario && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2 font-headline text-lg"><ShieldCheck className="h-5 w-5" />How this scam works</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{scenario.debrief.goal}</p>
                    <p><strong>Never:</strong> {scenario.debrief.neverDo.join(' · ')}</p>
                    <p><strong>Always:</strong> {scenario.debrief.alwaysDo.join(' · ')}</p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : judgeError ? (
            <Card className="border-destructive/60">
              <CardContent className="space-y-3 p-6 text-sm">
                <p className="font-medium">Evaluation failed — your transcript is safe, only the scoring broke.</p>
                <p className="text-muted-foreground">This is usually a network or AI-key problem. Your answers above still show exactly what happened on the call.</p>
                <Button onClick={() => runJudge(transcript)} className="min-h-[44px]">Retry evaluation</Button>
              </CardContent>
            </Card>
          ) : (
            <Card><CardContent className="flex items-center gap-2 p-6 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Evaluating your call…</CardContent></Card>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <ShareResult kind="call" title={scenario?.title ?? 'Scam call'} score={score} path="/simulators/call" />
            <Button variant="outline" onClick={() => { setPhase('pick'); setScenario(null); setTranscript([]); setResult(null); }} className="min-h-[44px]">Try another call</Button>
            <Button asChild className="min-h-[44px]"><Link href="/help/been-scammed">Response checklists</Link></Button>
          </div>
        </div>
      )}
    </main>
  );
}
