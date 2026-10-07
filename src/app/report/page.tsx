'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

type Resource = { name: string; detail: string };

const DEFAULT_RESOURCES: Resource[] = [
  { name: 'Your mobile operator’s fraud channel', detail: 'MTN, Orange, and Camtel each run fraud-reporting lines. Find the current number on the operator’s official site or app — never trust one sent in a message — and report scam numbers, plus request SIM blocks and transfer reversals where available.' },
  { name: 'The platform where it happened', detail: 'WhatsApp, Facebook, Instagram, and Telegram all have in-app report flows for accounts and messages. Report first, then block.' },
  { name: 'National cyber authorities', detail: 'Cameroon’s Law No. 2010/012 covers cybersecurity and cybercrime, and ANTIC is the national agency. Reporting channels change — verify the current ones on official government sites before publishing or relying on them.' },
  { name: 'Local police', detail: 'For theft, financial loss, or threats, file a report locally and bring your incident notes and evidence.' },
];

const STEPS = [
  'Preserve evidence first: screenshots with dates, numbers, links, receipts.',
  'Stop the bleeding: lock accounts, change passwords, freeze money access.',
  'Report to the operator and the platform — this protects the next victim too.',
  'Escalate to authorities for financial loss, theft, threats, or extortion.',
  'Bring organized notes: use the incident builder so nothing is forgotten.',
];

export default function ReportPage() {
  const firestore = useFirestore();
  const ref = useMemoFirebase(() => (firestore ? doc(firestore, 'config', 'reporting') : null), [firestore]);
  const { data } = useDoc(ref as any);
  const cfg: any = data ?? {};
  const resources: Resource[] = Array.isArray(cfg.items) && cfg.items.length > 0 ? cfg.items : DEFAULT_RESOURCES;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <Flag className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Where to report</h1>
          <p className="text-muted-foreground">Awareness is incomplete without a reporting path. Contacts change — always verify on official sites.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-headline">How to report, in order</CardTitle></CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            {STEPS.map((s) => (<li key={s}>{s}</li>))}
          </ol>
        </CardContent>
      </Card>

      <h2 className="font-headline text-xl font-semibold">Official channels</h2>
      <div className="space-y-3">
        {resources.map((r) => (
          <Card key={r.name}>
            <CardHeader className="pb-2"><CardTitle className="font-headline text-lg">{r.name}</CardTitle></CardHeader>
            <CardContent><CardDescription>{r.detail}</CardDescription></CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button asChild className="min-h-[44px]"><Link href="/help/incident-report">Build incident notes</Link></Button>
        <Button asChild variant="outline" className="min-h-[44px]"><Link href="/help/been-scammed">Response checklists</Link></Button>
      </div>
      <p className="text-xs text-muted-foreground">WiseTap does not replace authorities. Resource details are maintained by admins and must be re-verified against official sources before campaigns rely on them.</p>
    </main>
  );
}
