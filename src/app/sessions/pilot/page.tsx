import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, ArrowLeft } from 'lucide-react';

const PLAN = [
  { title: 'Pick 2–3 sessions', detail: 'Good first trio: Would You Click It?, Mobile Money Scams, I Clicked It. Now What? Add the Escape Room if you have 45 minutes and a lively group.' },
  { title: 'Measure before', detail: 'Every learner takes the Risk Check on their phone before session 1. Record the group average per dimension — that is your baseline.' },
  { title: 'Run the sessions', detail: 'Decide-first, then debrief. Note which activities spark debate and which fall flat — that observation is data.' },
  { title: 'Practice week', detail: 'Learners do one guided plan at home. Check completion on their profiles or ask them to show badges.' },
  { title: 'Measure after', detail: 'Retake the Risk Check. Compare recognition and decision rates before vs after. Even 15–20 learners produce a story worth telling.' },
  { title: 'Collect voices', detail: 'Ask three questions: what surprised you, what will you do differently, what should we change? Keep quotes (anonymous) for reports and pitches.' },
];

export default function PilotPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-8">
      <Link href="/sessions" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All sessions
      </Link>
      <div className="flex items-center gap-3">
        <FlaskConical className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Run a pilot</h1>
          <p className="text-muted-foreground">A school, youth group, or company trial in 6 steps — with evidence at the end.</p>
        </div>
      </div>
      <div className="space-y-3">
        {PLAN.map((p, i) => (
          <Card key={p.title}>
            <CardHeader className="pb-2"><CardTitle className="font-headline text-lg">{i + 1}. {p.title}</CardTitle></CardHeader>
            <CardContent><CardDescription>{p.detail}</CardDescription></CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button asChild className="min-h-[44px]"><Link href="/risk-check">Open the Risk Check</Link></Button>
        <Button asChild variant="outline" className="min-h-[44px]"><Link href="/sessions">Browse sessions</Link></Button>
      </div>
      <p className="text-xs text-muted-foreground">Tip for organizers: get permission from the school or group first, keep learner data private, and never publish names or photos without consent.</p>
    </main>
  );
}
