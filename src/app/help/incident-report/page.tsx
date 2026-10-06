'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, ArrowLeft, Copy, Check, Loader2 } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const EVIDENCE = ['Screenshots of messages', 'Sender phone number / account name', 'Suspicious links (URLs)', 'Date and time it happened', 'Transaction reference / receipt', 'Amount involved'];

export default function IncidentReportPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [kind, setKind] = useState('Scam / fraud attempt');
  const [when, setWhen] = useState('');
  const [platform, setPlatform] = useState('');
  const [contact, setContact] = useState('');
  const [amount, setAmount] = useState('');
  const [ref, setRef] = useState('');
  const [detail, setDetail] = useState('');
  const [evidence, setEvidence] = useState<string[]>(['Screenshots of messages']);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const report = [
    'CYBER INCIDENT NOTES (prepared with WiseTap — educational aid, not a legal document)',
    '',
    `Type: ${kind}`,
    `When: ${when || '(not specified)'}`,
    `Platform/channel: ${platform || '(not specified)'}`,
    `Scammer contact / account / URL: ${contact || '(not specified)'}`,
    `Amount involved: ${amount || '(none / not specified)'}`,
    `Transaction reference: ${ref || '(none)'}`,
    '',
    'What happened:',
    detail || '(not described yet)',
    '',
    'Evidence I have saved:',
    ...evidence.map((e) => `- ${e}`),
    '',
    'Next: take these notes (and the saved evidence) to the relevant service provider, platform report flow, or local authority. Do not confront the scammer.',
  ].join('\n');

  const toggle = (e: string) =>
    setEvidence((p) => (p.includes(e) ? p.filter((x) => x !== e) : [...p, e]));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ variant: 'destructive', title: 'Copy failed', description: 'Select the text manually.' });
    }
  };

  const save = async () => {
    if (!user || !firestore) {
      toast({ title: 'Sign in to save', description: 'You can still copy the notes above.' });
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(collection(firestore, 'users', user.uid, 'incidentReports')), {
        kind, when, platform, contact, amount, ref, detail: detail.slice(0, 2000), evidence,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Saved', description: 'Your incident notes are stored in your account.' });
    } catch {
      toast({ variant: 'destructive', title: 'Could not save', description: 'Copy the notes instead.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 md:p-8">
      <Link href="/help/been-scammed" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Response checklists
      </Link>
      <div className="flex items-center gap-3">
        <FileText className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Incident notes builder</h1>
          <p className="text-muted-foreground">Organize what happened so reporting is fast and complete. WiseTap is not law enforcement — this prepares you to report well.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-headline">What happened?</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="ir-kind">Type</Label>
              <Select value={kind} onValueChange={setKind}>
                <SelectTrigger id="ir-kind" className="min-h-[44px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Scam / fraud attempt', 'Phishing message', 'Account takeover', 'Harassment / bullying', 'Money sent', 'Malware / hacked device', 'Other'].map((k) => (
                    <SelectItem key={k} value={k}>{k}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label htmlFor="ir-when">Date / time</Label><Input id="ir-when" value={when} onChange={(e) => setWhen(e.target.value)} placeholder="e.g. 2026-10-05 evening" className="min-h-[44px]" /></div>
            <div className="space-y-1"><Label htmlFor="ir-platform">Platform / channel</Label><Input id="ir-platform" value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="e.g. WhatsApp, MTN MoMo, email" className="min-h-[44px]" /></div>
            <div className="space-y-1"><Label htmlFor="ir-contact">Scammer contact / URL</Label><Input id="ir-contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Number, username, or link" className="min-h-[44px]" /></div>
            <div className="space-y-1"><Label htmlFor="ir-amount">Amount (if any)</Label><Input id="ir-amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 20,000 FCFA" className="min-h-[44px]" /></div>
            <div className="space-y-1"><Label htmlFor="ir-ref">Transaction reference</Label><Input id="ir-ref" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Receipt / reference number" className="min-h-[44px]" /></div>
          </div>
          <div className="space-y-1"><Label htmlFor="ir-detail">Describe what happened</Label><Textarea id="ir-detail" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Sequence of events, in your own words..." className="min-h-[120px]" maxLength={2000} /></div>
          <div className="space-y-2">
            <Label>Evidence I have saved</Label>
            {EVIDENCE.map((e) => (
              <label key={e} className="flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm">
                <Checkbox checked={evidence.includes(e)} onCheckedChange={() => toggle(e)} aria-label={e} />{e}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-headline">Your notes</CardTitle><CardDescription>Copy these wherever you report — provider, platform, or authority.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-4 font-mono text-xs">{report}</pre>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={copy} variant="outline" className="min-h-[44px]">{copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}{copied ? 'Copied' : 'Copy notes'}</Button>
            <Button onClick={save} disabled={saving} className="min-h-[44px]">{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save to my account</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
