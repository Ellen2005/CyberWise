'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Gauge, ArrowLeft, Loader2 } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type Dim = 'Account Security' | 'Scam Awareness' | 'Device Safety' | 'Privacy';
type Opt = { text: string; score: number };
type Q = { id: string; dim: Dim; text: string; options: Opt[] };

const QUESTIONS: Q[] = [
  { id: 'pw-reuse', dim: 'Account Security', text: 'Do you reuse passwords across accounts?', options: [{ text: 'Yes, mostly the same one', score: 0 }, { text: 'A few variations', score: 40 }, { text: 'Unique passwords (manager or written safely)', score: 100 }] },
  { id: 'mfa', dim: 'Account Security', text: 'Is MFA enabled on your email and money accounts?', options: [{ text: 'What is MFA?', score: 0 }, { text: 'On some accounts', score: 50 }, { text: 'On all important accounts', score: 100 }] },
  { id: 'otp', dim: 'Account Security', text: 'Would you share an OTP with someone claiming to be support?', options: [{ text: 'Yes, if they sound official', score: 0 }, { text: 'Only my bank', score: 30 }, { text: 'Never, with anyone', score: 100 }] },
  { id: 'links', dim: 'Scam Awareness', text: 'A message says you won money. First move?', options: [{ text: 'Tap the link to check', score: 0 }, { text: 'Reply asking if it is real', score: 30 }, { text: 'Verify independently, never via the link', score: 100 }] },
  { id: 'jobs', dim: 'Scam Awareness', text: 'A recruiter asks for a processing fee. You…', options: [{ text: 'Pay — the salary is worth it', score: 0 }, { text: 'Send documents first', score: 20 }, { text: 'Verify the company, never pay to be hired', score: 100 }] },
  { id: 'verify-offers', dim: 'Scam Awareness', text: 'Do you verify job offers or prizes before acting?', options: [{ text: 'Rarely', score: 20 }, { text: 'Sometimes', score: 60 }, { text: 'Always, through official channels', score: 100 }] },
  { id: 'apk', dim: 'Device Safety', text: 'Do you install APKs from outside official stores?', options: [{ text: 'Often (free apps, data apps)', score: 0 }, { text: 'Rarely', score: 50 }, { text: 'Never — Play Store / App Store only', score: 100 }] },
  { id: 'updates', dim: 'Device Safety', text: 'Are your phone and apps updated?', options: [{ text: 'Updates off / very old version', score: 20 }, { text: 'Sometimes', score: 60 }, { text: 'Automatic updates on', score: 100 }] },
  { id: 'backup', dim: 'Device Safety', text: 'Do you back up important photos and documents?', options: [{ text: 'No backup', score: 0 }, { text: 'Somewhere, outdated', score: 50 }, { text: 'Yes, recent backup', score: 100 }] },
  { id: 'overshare', dim: 'Privacy', text: 'What do you post publicly?', options: [{ text: 'Location, ID cards, daily routine', score: 0 }, { text: 'Photos, rarely personal details', score: 60 }, { text: 'Minimal — private profile, no sensitive posts', score: 100 }] },
  { id: 'wifi', dim: 'Privacy', text: 'On public Wi-Fi, you…', options: [{ text: 'Log into everything normally', score: 20 }, { text: 'Browse but avoid banking', score: 60 }, { text: 'Use mobile data / VPN for sensitive stuff', score: 100 }] },
];

const PATHS: Record<Dim, { title: string; href: string; why: string }> = {
  'Account Security': { title: 'Password Security + MFA lessons', href: '/learn/password-security', why: 'Unique passwords and a second lock stop most takeovers.' },
  'Scam Awareness': { title: 'Scenarios: Everyday scams', href: '/scenarios', why: 'Practice the exact patterns scammers use on you.' },
  'Device Safety': { title: 'Malware & Ransomware lesson', href: '/learn/malware-and-ransomware', why: 'Updates, stores-only installs, and backups.' },
  Privacy: { title: 'Spam + safe browsing guides', href: '/simulators/spam', why: 'Share less, verify networks, handle spam safely.' },
};

export default function RiskCheckPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const dims = (Object.keys(PATHS) as Dim[]).map((dim) => {
    const qs = QUESTIONS.filter((q) => q.dim === dim);
    const got = qs.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
    return { dim, pct: Math.round((got / (qs.length * 100)) * 100), answered: qs.every((q) => answers[q.id] !== undefined) };
  });
  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);
  const overall = Math.round(dims.reduce((s, d) => s + d.pct, 0) / dims.length);
  const weakest = [...dims].sort((a, b) => a.pct - b.pct)[0];

  const save = async () => {
    setDone(true);
    if (!user || !firestore) {
      toast({ title: 'Result ready', description: 'Sign in to save your profile.' });
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(collection(firestore, 'users', user.uid, 'riskChecks')), {
        scores: Object.fromEntries(dims.map((d) => [d.dim, d.pct])),
        overall,
        weakest: weakest.dim,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Risk profile saved', description: `Overall: ${overall}%. Check your dashboard.` });
    } catch {
      toast({ variant: 'destructive', title: 'Could not save', description: 'Try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 md:p-8">
      <Link href="/" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <div className="flex items-center gap-3">
        <Gauge className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Your Cyber Risk Check</h1>
          <p className="text-muted-foreground">11 honest questions. Get your profile and a learning path.</p>
        </div>
      </div>

      {!done ? (
        <Card>
          <CardHeader><CardTitle className="font-headline">Answer honestly — no judgment</CardTitle><CardDescription>{Object.keys(answers).length}/{QUESTIONS.length} answered</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            {QUESTIONS.map((q, i) => (
              <div key={q.id} className="space-y-2 border-b pb-5 last:border-0">
                <p className="font-medium">{i + 1}. {q.text} <span className="text-xs text-muted-foreground">({q.dim})</span></p>
                <RadioGroup
                  value={answers[q.id] !== undefined ? String(answers[q.id]) : ''}
                  onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: Number(v) }))}
                  className="space-y-2"
                >
                  {q.options.map((o, j) => (
                    <div key={j} className="flex items-start gap-2 rounded-md border p-3">
                      <RadioGroupItem value={String(o.score)} id={`${q.id}-${j}`} />
                      <Label htmlFor={`${q.id}-${j}`} className="cursor-pointer font-normal">{o.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <Button onClick={save} disabled={!allAnswered || saving} className="min-h-[48px] w-full sm:w-auto">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}See my risk profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-primary/40">
            <CardHeader><CardTitle className="font-headline text-2xl">Overall: {overall}%</CardTitle><CardDescription>{overall >= 75 ? 'Strong habits — keep them.' : overall >= 45 ? 'Mixed habits — one weak area to fix first.' : 'High exposure — start with the path below.'}</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {dims.map((d) => (
                <div key={d.dim}>
                  <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{d.dim}</span><span>{d.pct}%</span></div>
                  <Progress value={d.pct} aria-label={`${d.dim} ${d.pct} percent`} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="font-headline">Your path: fix {weakest.dim} first ({weakest.pct}%)</CardTitle><CardDescription>{PATHS[weakest.dim].why}</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="min-h-[44px]"><Link href={PATHS[weakest.dim].href}>{PATHS[weakest.dim].title}</Link></Button>
              <Button asChild variant="outline" className="min-h-[44px]"><Link href="/scenarios">Practice scenarios</Link></Button>
            </CardContent>
          </Card>
          <Button variant="outline" onClick={() => { setDone(false); }} className="min-h-[44px]">Retake</Button>
        </div>
      )}
    </main>
  );
}
