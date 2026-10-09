'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { certificateIdFor } from '@/lib/gamification/certificates';
import { ShareResult } from '@/components/share-result';

type Props = {
  userId: string;
  userName: string;
  planId: string;
  planTitle: string;
};

/** Printable-style completion certificate for a finished 7-day plan. */
export function PlanCertificate({ userId, userName, planId, planTitle }: Props) {
  const certId = certificateIdFor(userId, planId);
  const date = new Date().toLocaleDateString();

  return (
    <Card className="border-primary/50 bg-gradient-to-br from-card to-muted/40">
      <CardHeader className="text-center">
        <Award className="mx-auto h-12 w-12 text-primary" />
        <CardDescription className="uppercase tracking-widest">Certificate of completion</CardDescription>
        <CardTitle className="font-headline text-2xl">{userName}</CardTitle>
        <CardDescription>
          completed <strong>{planTitle}</strong> — 7 days of digital safety practice
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 text-sm">
        <p className="text-muted-foreground">{date} · ID {certId}</p>
        <ShareResult kind="plan" title={planTitle} score={null} path="/plans" />
      </CardContent>
    </Card>
  );
}
