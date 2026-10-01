'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LifeBuoy, ArrowLeft } from 'lucide-react';
import { responseGuides } from '@/lib/content/response-guides';
import { FeedbackForm } from '@/components/feedback-form';

export default function BeenScammedPage() {
  const [activeId, setActiveId] = useState(responseGuides[0].id);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const guide = responseGuides.find((g) => g.id === activeId)!;
  const done = guide.steps.filter((_, i) => checked[`${guide.id}-${i}`]).length;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-8">
      <Link href="/" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <div className="flex items-center gap-3">
        <LifeBuoy className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">I think I&apos;ve been scammed</h1>
          <p className="text-muted-foreground">Breathe. Pick what happened — get a calm, prioritized checklist. Educational guidance, not legal advice.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {responseGuides.map((g) => (
          <Button
            key={g.id}
            variant={g.id === activeId ? 'default' : 'outline'}
            onClick={() => setActiveId(g.id)}
            className="min-h-[40px]"
          >
            {g.title}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{guide.title}</CardTitle>
          <CardDescription>{guide.whenToUse} — {done}/{guide.steps.length} done</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {guide.steps.map((s, i) => {
            const key = `${guide.id}-${i}`;
            return (
              <label key={key} className="flex cursor-pointer items-start gap-3 rounded-md border p-3">
                <Checkbox checked={!!checked[key]} onCheckedChange={() => setChecked((p) => ({ ...p, [key]: !p[key] }))} aria-label={s.title} />
                <span>
                  <span className="font-medium">{i + 1}. {s.title}</span>
                  <span className="block text-sm text-muted-foreground">{s.detail}</span>
                </span>
              </label>
            );
          })}
          <p className="text-xs text-muted-foreground">
            If someone is in immediate danger or serious harm is involved, contact local emergency services or a trusted authority. CyberWise guidance is educational and does not replace professional help.
          </p>
        </CardContent>
      </Card>
      <FeedbackForm contentType="response-guide" contentId={guide.id} />
    </main>
  );
}
