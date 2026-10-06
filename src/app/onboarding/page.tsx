'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const INTERESTS = ['Phishing', 'Scams', 'Passwords', 'Social media safety', 'Cyberbullying', 'Privacy', 'Mobile security'];

export default function OnboardingPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [level, setLevel] = useState('beginner');
  const [goal, setGoal] = useState('personal-protection');
  const [interests, setInterests] = useState<string[]>(['Phishing']);
  const [saving, setSaving] = useState(false);

  const toggleInterest = (v: string) =>
    setInterests((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const save = async () => {
    if (!user || !firestore) {
      toast({ title: 'Sign in first', description: 'Create an account or sign in, then complete onboarding.' });
      router.push('/login?next=/onboarding');
      return;
    }
    setSaving(true);
    try {
      await setDoc(
        doc(firestore, 'users', user.uid),
        {
          onboardingCompleted: true,
          experienceLevel: level,
          learningGoal: goal,
          interests,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      document.cookie = 'cw-session=1; path=/; max-age=31536000';
      toast({ title: 'Welcome to WiseTap!', description: 'Your learning path is ready.' });
      router.push('/');
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Could not save', description: 'Check Firestore rules and connection.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="font-headline text-3xl font-bold md:text-4xl">Welcome — let&apos;s personalize</h1>
        <p className="mt-2 text-muted-foreground">Two quick questions so we can recommend the right first lesson.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your experience</CardTitle>
          <CardDescription>There are no wrong answers — we start everyone with basics.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup value={level} onValueChange={setLevel} className="space-y-2">
            {[
              ['beginner', 'Beginner — I want to protect myself with my phone and computer'],
              ['intermediate', 'Intermediate — I know basics, want to recognize threats better'],
              ['advanced', 'Advanced — I want practical and technical skills'],
            ].map(([v, label]) => (
              <div key={v} className="flex items-start gap-2 rounded-md border p-3">
                <RadioGroupItem value={v} id={`lvl-${v}`} />
                <Label htmlFor={`lvl-${v}`} className="cursor-pointer font-normal leading-snug">{label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <RadioGroup value={goal} onValueChange={setGoal} className="space-y-2">
            {[
              ['personal-protection', 'Protect myself and my family'],
              ['student', 'Student — stay safe at school and online'],
              ['career-cybersecurity', 'Explore cybersecurity as a skill/career'],
              ['business-owner', 'Protect a small business or community'],
            ].map(([v, label]) => (
              <div key={v} className="flex items-start gap-2 rounded-md border p-3">
                <RadioGroupItem value={v} id={`goal-${v}`} />
                <Label htmlFor={`goal-${v}`} className="cursor-pointer font-normal leading-snug">{label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">What worries you most?</CardTitle>
          <CardDescription>Pick any. We will recommend starting points.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {INTERESTS.map((i) => (
            <label key={i} className="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm">
              <Checkbox checked={interests.includes(i)} onCheckedChange={() => toggleInterest(i)} aria-label={i} />
              {i}
            </label>
          ))}
        </CardContent>
      </Card>
      <Button onClick={save} disabled={saving} className="min-h-[48px] text-base">
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Start learning
      </Button>
      {!user && (
        <p className="text-center text-sm text-muted-foreground">
          You are not signed in — we will ask you to sign in first so progress is saved.
        </p>
      )}
    </main>
  );
}
