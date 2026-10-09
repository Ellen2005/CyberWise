'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft, ScanEye, Hand, Type, Sun, Ear,
  CheckCircle2, XCircle, SearchCheck, Loader2,
} from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { recordCompletion } from '@/lib/gamification/service';
import { completionToast } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ARTIFACTS = [
  { icon: Hand, name: 'Hands and fingers', desc: 'Extra, missing, or melted fingers are the classic tell. Zoom into hands first — generators still stumble there.', check: 'Count the fingers. Look for fused or extra digits.' },
  { icon: Type, name: 'Text and signs', desc: 'AI mangles letters: gibberish shop signs, warped logos, misspelled words in an otherwise perfect scene.', check: 'Read every word in the image. Nonsense text is a strong signal.' },
  { icon: Sun, name: 'Light and reflections', desc: 'Shadows falling different ways, reflections showing things not in the scene, glossy plastic skin.', check: 'Follow the light: one sun means one shadow direction.' },
  { icon: Ear, name: 'Ears, backgrounds, edges', desc: 'Mismatched earrings, melting crowds, warped railings and doorframes behind the subject.', check: 'Inspect edges and background people — subjects get the detail budget, backgrounds get the errors.' },
];

const DRILL = [
  'Find the original source: who posted it first, and are they credible?',
  'Check the date: old photos recaptioned as "breaking" is the oldest trick.',
  'Reverse-image search: has this exact picture appeared with a different story before?',
  'Cross-check: do reputable outlets, officials, or people on the ground confirm it?',
];

const QUIZ = [
  {
    q: 'A viral photo shows a disaster in your city, but no radio station or official channel mentions it. Safest move?',
    options: ['Forward it so others can verify', 'Donate via the number in the message', 'Verify with live sources before forwarding or donating anything'],
    answer: 2,
    why: 'Big claims need live confirmation. Forwarding spreads the lie; donating to viral numbers funds scammers.',
  },
  {
    q: 'A photo looks perfect except the shop sign reads gibberish. What does that suggest?',
    options: ['Bad camera focus', 'Likely AI-generated — generators mangle text', 'Nothing, signs are often blurry'],
    answer: 1,
    why: 'Gibberish text is one of the most reliable AI tells. Real cameras blur; they do not invent alphabets.',
  },
  {
    q: 'A celebrity video promises to double your crypto. It looks 100% real. What decides?',
    options: ['How real it looks', 'The promise itself: nobody doubles money for fans', 'The number of likes'],
    answer: 1,
    why: 'Video can be faked; economics cannot. Attack the premise (doubling), not the pixels.',
  },
  {
    q: 'Someone sends an intimate photo "leak" of a classmate. First action?',
    options: ['Forward to check if others think it is real', 'Do not forward; save evidence privately and report', 'Confront the person in the photo publicly'],
    answer: 1,
    why: 'Forwarding is participation in abuse and possibly a crime. Evidence + report + support is the safe chain.',
  },
  {
    q: 'Strongest single habit against fake visuals?',
    options: ['Staring harder at pixels', 'Verifying through sources independent of the message', 'Only trusting videos, never photos'],
    answer: 1,
    why: 'Eyes lose to generators; sources do not. Verification beats inspection every time.',
  },
];

export default function AiImagesPage() {
  const [drill, setDrill] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [graded, setGraded] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const correct = QUIZ.filter((q, i) => answers[i] === q.answer).length;
  const pct = Math.round((correct / QUIZ.length) * 100);

  const submit = async () => {
    setGraded(true);
    if (user && firestore && pct >= 60) {
      setSaving(true);
      try {
        const r = await recordCompletion(firestore, user.uid, {
          contentType: 'quiz', contentId: 'ai-images-detective', xpAmount: 40, correct: true,
        });
        toast(completionToast(r, `+${r.xpEarned} XP`, 'Sharp eyes.'));
      } catch { /* silent */ }
      finally { setSaving(false); }
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-8">
      <Link href="/" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <div className="flex items-center gap-3">
        <ScanEye className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">AI image detective</h1>
          <p className="text-muted-foreground">Learn the tells, run the drill, then prove it. Eyes help — sources decide.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ARTIFACTS.map((a) => (
          <Card key={a.name}>
            <CardHeader className="pb-2">
              <a.icon className="h-7 w-7 text-primary" />
              <CardTitle className="font-headline text-lg">{a.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="text-muted-foreground">{a.desc}</p>
              <p><strong>Check:</strong> {a.check}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-lg"><SearchCheck className="h-5 w-5" />The 4-step verification drill</CardTitle>
          <CardDescription>Run this on every shocking image. Tick as you rehearse.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {DRILL.map((d) => (
            <label key={d} className="flex cursor-pointer items-start gap-2 rounded-md border p-3 text-sm">
              <Checkbox
                checked={drill.includes(d)}
                onCheckedChange={() => setDrill((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]))}
                aria-label={d}
              />
              {d}
            </label>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-headline text-lg">Prove it — 5 questions</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {QUIZ.map((q, i) => {
            const picked = answers[i];
            const show = graded && picked !== undefined;
            const ok = picked === q.answer;
            return (
              <div key={i} className="space-y-2 border-b pb-5 last:border-0">
                <p className="font-medium">{i + 1}. {q.q}</p>
                <RadioGroup
                  value={picked !== undefined ? String(picked) : ''}
                  onValueChange={(v) => !graded && setAnswers((a) => ({ ...a, [i]: Number(v) }))}
                  className="space-y-2"
                >
                  {q.options.map((o, j) => (
                    <div key={j} className="flex items-start gap-2 rounded-md border p-3">
                      <RadioGroupItem value={String(j)} id={`aiq-${i}-${j}`} disabled={graded} />
                      <Label htmlFor={`aiq-${i}-${j}`} className="cursor-pointer font-normal">{o}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {show && (
                  <Alert variant={ok ? 'default' : 'destructive'} className={cn(ok && 'border-green-500/50')}>
                    {ok ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4" />}
                    <AlertTitle>{ok ? 'Correct' : 'Not quite'}</AlertTitle>
                    <AlertDescription>{q.why}</AlertDescription>
                  </Alert>
                )}
              </div>
            );
          })}
          {!graded ? (
            <Button
              onClick={submit}
              disabled={QUIZ.some((_, i) => answers[i] === undefined)}
              className="min-h-[44px] w-full sm:w-auto"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Check my answers
            </Button>
          ) : (
            <p className={cn('text-sm font-medium', pct >= 60 ? 'text-green-600 dark:text-green-400' : 'text-destructive')}>
              Score: {pct}% ({correct}/{QUIZ.length}){pct >= 60 ? ' — Detective certified.' : ' — review the artifacts and retry.'}
              {pct < 60 && (
                <Button variant="secondary" onClick={() => { setAnswers({}); setGraded(false); }} className="ml-3 min-h-[40px]">Try again</Button>
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
