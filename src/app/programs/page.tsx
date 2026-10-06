'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const DEFAULT_SAFETY =
  'Recognizing phishing, scams, and manipulation; passwords + MFA; safe browsing and mobile habits; responding and reporting. Practical experience: investigations, “What Would You Do?” decisions, stories, daily challenges, quizzes with explanations.';
const DEFAULT_ADVANCED =
  'Networks, log basics, incident thinking, secure habits for study and work. Successful trainees may be considered for further learning paths or community projects — depending on performance and available openings. We do not promise jobs or guaranteed opportunities.';
const DEFAULT_NOTE =
  'Possible opportunities may include: community safety volunteer roles, peer mentoring, or foundational IT support learning — depending on performance and available openings.';

export default function ProgramsPage() {
  const firestore = useFirestore();
  const ref = useMemoFirebase(() => (firestore ? doc(firestore, 'config', 'programs') : null), [firestore]);
  const { data } = useDoc(ref as any);
  const cfg: any = data ?? {};
  const safety = cfg.safetyTrack || DEFAULT_SAFETY;
  const advanced = cfg.advancedTrack || DEFAULT_ADVANCED;
  const note = cfg.opportunitiesNote || DEFAULT_NOTE;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Training programs</h1>
          <p className="text-muted-foreground">What you can achieve with WiseTap — no job guarantees.</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="font-headline">Stay Safe Online (Levels 1–4)</CardTitle><CardDescription>For beginners, students, and non-technical users.</CardDescription></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{safety}</p>
          <p><strong>{note}</strong></p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="font-headline">Practical Cybersecurity (Levels 5–6)</CardTitle><CardDescription>For learners who finish the safety track and want technical foundations.</CardDescription></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{advanced}</p>
          <Button asChild className="mt-2 min-h-[44px]"><Link href="/learn">Start with Level 1</Link></Button>
        </CardContent>
      </Card>
    </main>
  );
}
