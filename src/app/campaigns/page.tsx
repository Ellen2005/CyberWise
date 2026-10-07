import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone } from 'lucide-react';

const MESSAGE_HOUSE = {
  main: 'Stop. Think. Check. Protect. Tell.',
  behaviors: [
    'Never share PINs or OTPs with anyone — no legitimate caller asks for them, ever.',
    'Verify through official channels, never through links or numbers in the message.',
    'Use unique passwords and the second lock (MFA), starting with email.',
  ],
  cta: 'Take the 2-minute Risk Check, then practice one scenario today.',
};

const AUDIENCES = [
  { who: 'Young kids (5–10)', focus: 'Personal info, trusted adults, stranger danger, safe games', approach: 'Songs, stories, simple Stop-Think-Tell rules', href: '/powers' },
  { who: 'Teens (11–18)', focus: 'Bullying, oversharing, giveaways, gaming scams, footprints', approach: 'Peer challenges, real stories, no lecturing', href: '/simulators/bullying' },
  { who: 'Young adults', focus: 'Job scams, loan apps, MoMo fraud, takeovers, romance scams', approach: 'Social media, campus events, scenarios', href: '/scenarios' },
  { who: 'Workers', focus: 'Phishing, executive impersonation, device security', approach: 'Workshops, simulations, short drills', href: '/simulators/phishing' },
  { who: 'Parents & teachers', focus: 'Controls, calm conversations, warning signs', approach: 'School meetings, guides, family plans', href: '/plans/family-safety-week' },
  { who: 'Seniors', focus: 'Call scams, relative impersonation, prizes, OTP theft', approach: 'In-person sessions, family involvement', href: '/scenarios/mobile-money-reward-scam' },
  { who: 'SMEs & traders', focus: 'MoMo security, fake payment proofs, customer data', approach: 'Market outreach, the confirmed-balance rule', href: '/scenarios/fake-payment-confirmation' },
];

const PITFALLS = [
  'Fear paralyzes — teach actions, not dread.',
  'Three behaviors remembered beat thirty listed.',
  'Support victims; never blame them — shame silences reporting.',
  'Every message needs a reporting path, or awareness is incomplete.',
  'Get parental consent for activities with minors; handle data minimally.',
];

const STEPS = [
  'Research first: interview a sample of the audience about threats they actually face.',
  'Set a measurable goal ("30% enable WhatsApp 2FA"), not "raise awareness".',
  'Start with one high-risk, reachable group.',
  'Pilot in one community, gather feedback, then scale.',
  'Measure before/after with the Risk Check and recognition rates.',
  'Repeat: scams evolve, one-off campaigns fade.',
];

export default function CampaignsPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <Megaphone className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Campaign kit</h1>
          <p className="text-muted-foreground">Run an awareness campaign for any audience — message house, playbooks, pitfalls, measurement.</p>
        </div>
      </div>

      <Card className="border-primary/40">
        <CardHeader><CardTitle className="font-headline">The message house</CardTitle><CardDescription>One message, three behaviors, one action. Everything else supports these.</CardDescription></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="font-headline text-xl font-bold">{MESSAGE_HOUSE.main}</p>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            {MESSAGE_HOUSE.behaviors.map((b) => (<li key={b}>{b}</li>))}
          </ul>
          <p><strong>Call to action:</strong> {MESSAGE_HOUSE.cta}</p>
        </CardContent>
      </Card>

      <h2 className="font-headline text-xl font-semibold">Audience playbooks</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {AUDIENCES.map((a) => (
          <Card key={a.who}>
            <CardHeader className="pb-2"><CardTitle className="font-headline text-lg">{a.who}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Focus:</strong> <span className="text-muted-foreground">{a.focus}</span></p>
              <p><strong>Approach:</strong> <span className="text-muted-foreground">{a.approach}</span></p>
              <Button asChild variant="outline" size="sm" className="min-h-[40px]"><Link href={a.href}>Open practice</Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="font-headline">Pitfalls that kill campaigns</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {PITFALLS.map((p) => (<li key={p}>{p}</li>))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-headline">Run it in 6 steps</CardTitle><CardDescription>October (Cybersecurity Awareness Month) is the natural launch window.</CardDescription></CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            {STEPS.map((s) => (<li key={s}>{s}</li>))}
          </ol>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button asChild className="min-h-[44px]"><Link href="/sessions/pilot">Plan a pilot</Link></Button>
        <Button asChild variant="outline" className="min-h-[44px]"><Link href="/report">Where to report</Link></Button>
      </div>
    </main>
  );
}
