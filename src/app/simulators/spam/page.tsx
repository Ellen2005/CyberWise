'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailWarning } from 'lucide-react';

const EXAMPLES = [
  { id: 'e1', title: 'Spam SMS: prize', text: '“CONGRATS! You won a $500 gift card. Claim: bit.ly/xyz123”', isMalicious: true, why: 'Unsolicited prize + shortened link. Real giveaways never work like this. Block, report spam, delete.' },
  { id: 'e2', title: 'Store newsletter you signed up for', text: '“Your weekly deals from ShopYouKnow (unsubscribe link at bottom, sender matches shop domain).”', isMalicious: false, why: 'You opted in, sender matches, and unsubscribe is present. Legitimate marketing vs malicious spam: consent + real identity + safe unsubscribe.' },
  { id: 'e3', title: 'Spam call: “bank”', text: 'Unknown number: “Your card is blocked, press 1 and enter your PIN.”', isMalicious: true, why: 'Banks never ask for PINs by phone. Hang up, call the number on your card yourself.' },
  { id: 'e4', title: 'Social DM: promo spam', text: 'Stranger: “DM 500 people daily, earn cash! Click my link to join.”', isMalicious: true, why: 'Recruitment spam / pyramid pattern. Do not click, report the account.' },
];

export default function SpamPage() {
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <MailWarning className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Spam awareness</h1>
          <p className="text-muted-foreground">Recognize spam, handle it safely, and know legit marketing vs malicious spam.</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="font-headline">Safe handling rules</CardTitle><CardDescription>Same rules for email, SMS, calls, and DMs.</CardDescription></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Block</strong> repeat senders. <strong>Report</strong> spam/phishing in the app (do not just delete — reporting protects others).</p>
          <p><strong>Unsubscribe safely:</strong> only from senders you recognize and signed up for. Never tap unsubscribe in obvious phishing — just report + delete.</p>
          <p><strong>Never</strong> tap links, call back numbers, or share codes with unknown senders.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="font-headline">Try it: spam or not?</CardTitle><CardDescription>Tap Spam or OK for each, then check.</CardDescription></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {EXAMPLES.map((e) => (
            <div key={e.id} className="rounded-md border p-3">
              <p className="font-medium">{e.title}</p>
              <p className="text-muted-foreground">{e.text}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant={picked[e.id] === true ? 'destructive' : 'outline'} onClick={() => setPicked((p) => ({ ...p, [e.id]: true }))}>Spam</Button>
                <Button size="sm" variant={picked[e.id] === false ? 'default' : 'outline'} onClick={() => setPicked((p) => ({ ...p, [e.id]: false }))}>OK</Button>
              </div>
              {checked && (
                <Alert className="mt-2"><AlertTitle>{picked[e.id] === e.isMalicious ? 'Correct' : 'Not quite'}</AlertTitle><AlertDescription>{e.why}</AlertDescription></Alert>
              )}
            </div>
          ))}
          <Button onClick={() => setChecked(true)} disabled={Object.keys(picked).length < EXAMPLES.length} className="min-h-[44px]">Check answers</Button>
        </CardContent>
      </Card>
    </main>
  );
}
