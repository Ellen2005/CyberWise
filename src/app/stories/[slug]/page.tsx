'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cyberStories } from '@/lib/content/stories';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { recordCompletion } from '@/lib/gamification/service';
import { completionToast } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function StoryDetailPage() {
  const params = useParams<{ slug: string }>();
  const story = cyberStories.find((s) => s.slug === params.slug);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [safeCount, setSafeCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  if (!story) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-headline text-2xl font-bold">Story not found</h1>
        <Button asChild><Link href="/stories">Back to stories</Link></Button>
      </main>
    );
  }

  const node = story.nodes[nodeIndex];
  const choice = node.choices.find((c) => c.id === picked);

  const pick = (id: string) => {
    if (picked) return;
    setPicked(id);
    const c = node.choices.find((x) => x.id === id);
    if (c?.isSafe) setSafeCount((n) => n + 1);
  };

  const next = async () => {
    if (nodeIndex < story.nodes.length - 1) {
      setNodeIndex((i) => i + 1);
      setPicked(null);
    } else {
      setFinished(true);
      if (user && firestore) {
        try {
          const perfect = safeCount >= story.nodes.length;
          const r = await recordCompletion(firestore, user.uid, {
            contentType: 'story',
            contentId: story.id,
            xpAmount: perfect ? story.xpReward : Math.round(story.xpReward / 2),
            correct: perfect,
          });
          toast(completionToast(r, `+${r.xpEarned} XP`, perfect ? 'Perfect choices!' : 'Story complete.'));
        } catch {
          toast({ variant: 'destructive', title: 'Could not save progress', description: 'Try again.' });
        }
      }
    }
  };

  if (finished) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Story complete</CardTitle>
            <CardDescription>You made {safeCount} of {story.nodes.length} safe choices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert><AlertTitle>Takeaway</AlertTitle><AlertDescription>{story.takeaway}</AlertDescription></Alert>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline" className="min-h-[44px]"><Link href="/stories">More stories</Link></Button>
              <Button asChild className="min-h-[44px]"><Link href="/simulators/wwyd">Practice decisions</Link></Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 md:p-8">
      <Link href="/stories" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to stories
      </Link>
      <div>
        <p className="text-sm text-muted-foreground">{story.topic} · Part {nodeIndex + 1} of {story.nodes.length}</p>
        <h1 className="font-headline text-3xl font-bold">{node.title}</h1>
      </div>
      <Card>
        <CardContent className="space-y-4 p-6">
          <p className="leading-relaxed">{node.narrative}</p>
          <div className="space-y-2">
            {node.choices.map((c) => (
              <Button
                key={c.id}
                variant={picked === c.id ? (c.isSafe ? 'default' : 'destructive') : 'outline'}
                onClick={() => pick(c.id)}
                disabled={!!picked}
                className="min-h-[48px] w-full justify-start whitespace-normal text-left"
              >
                {c.text}
              </Button>
            ))}
          </div>
          {choice && (
            <Alert variant={choice.isSafe ? 'default' : 'destructive'} className={cn(choice.isSafe && 'border-green-500/50')}>
              {choice.isSafe ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{choice.isSafe ? 'Safe choice' : 'Risky choice'}</AlertTitle>
              <AlertDescription>{choice.feedback}</AlertDescription>
            </Alert>
          )}
          {picked && (
            <Button onClick={next} className="min-h-[44px] w-full sm:w-auto">
              {nodeIndex < story.nodes.length - 1 ? 'Continue story' : 'Finish story'}
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
