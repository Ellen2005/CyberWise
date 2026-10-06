'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, LineChart } from 'lucide-react';
import { computeInsights, type AttemptLike } from '@/lib/learning/insights';

export function ProgressInsights({ attempts }: { attempts: AttemptLike[] }) {
  const ins = computeInsights(attempts);

  if (ins.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline"><LineChart className="h-5 w-5 text-primary" />Your effectiveness</CardTitle>
          <CardDescription>We measure recognition and decision-making — not just completions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">No graded activity yet. Run a scenario or Spot the Scam round to establish your baseline.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="min-h-[44px]"><Link href="/scenarios">Try a scenario</Link></Button>
            <Button asChild variant="outline" className="min-h-[44px]"><Link href="/risk-check">Take the Risk Check</Link></Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const TrendIcon = ins.trend.delta === null || ins.trend.delta === 0 ? Minus : ins.trend.delta > 0 ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline"><LineChart className="h-5 w-5 text-primary" />Your effectiveness</CardTitle>
        <CardDescription>Based on {ins.total} graded decision{ins.total === 1 ? '' : 's'} across simulators, scenarios, and challenges.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">Threat recognition</span>
              <span>{ins.recognition.pct === null ? '—' : `${ins.recognition.pct}%`}</span>
            </div>
            <Progress value={ins.recognition.pct ?? 0} aria-label="Threat recognition rate" />
            <p className="mt-1 text-xs text-muted-foreground">Can you identify phishing and scams? ({ins.recognition.total} checks)</p>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">Safe decisions</span>
              <span>{ins.decision.pct === null ? '—' : `${ins.decision.pct}%`}</span>
            </div>
            <Progress value={ins.decision.pct ?? 0} aria-label="Safe decision rate" />
            <p className="mt-1 text-xs text-muted-foreground">Do you choose the safe action? ({ins.decision.total} decisions)</p>
          </div>
        </div>
        {ins.trend.delta !== null && (
          <p className="flex items-center gap-2 text-sm">
            <TrendIcon className="h-4 w-4 text-primary" />
            {ins.trend.delta > 0
              ? `Improving: ${ins.trend.early}% early to ${ins.trend.recent}% recent (+${ins.trend.delta}).`
              : ins.trend.delta < 0
                ? `Dipping: ${ins.trend.early}% early to ${ins.trend.recent}% recent. Review the red flags and retry.`
                : `Steady at ${ins.trend.recent}%. Push higher with harder scenarios.`}
          </p>
        )}
        {ins.byTopic.length > 0 && (
          <div className="space-y-2">
            {ins.byTopic.slice(0, 5).map((t) => (
              <div key={t.topic}>
                <div className="mb-1 flex justify-between text-xs"><span>{t.topic}</span><span className="text-muted-foreground">{t.pct}% · {t.total}</span></div>
                <Progress value={t.pct} className="h-2" aria-label={`${t.topic} ${t.pct} percent`} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
