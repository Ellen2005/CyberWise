'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, Loader2 } from 'lucide-react';

type Msg = { role: 'user' | 'mentor'; text: string };

const FAQS: { q: string; a: string }[] = [
  { q: 'What is phishing?', a: 'Phishing is a fake message pretending to be someone you trust (bank, school, delivery) to trick you into clicking a link, opening an attachment, or typing your password. Defense: check the sender domain, hover before you click, and verify through the official app — never the link in the message.' },
  { q: 'Why is this message suspicious?', a: 'Walk through 4 checks: (1) Sender domain — does it match the real company? (2) Urgency — “act now or else” is pressure. (3) Link destination — hover to see the real URL. (4) Request — passwords, OTPs, fees, or ID photos by message are always red flags.' },
  { q: 'What should I do if I clicked?', a: 'Stop: close the page and enter nothing else. Preserve: screenshot the message. Secure: from the official app, change the password and enable MFA. Report: report the message on the platform. Tell someone if it was work/school.' },
  { q: 'How can I protect my account?', a: 'Three habits cover most attacks: unique passwords (use a password manager), MFA on email first then bank/social, and pause-and-verify for every unexpected message. Keep your phone and apps updated.' },
  { q: 'Is this QR code safe?', a: 'If a QR looks like a sticker over the original, stop. Ask staff for the real link, preview the URL before opening, and never log in or pay from a random QR. Type payment addresses yourself.' },
];

function localAnswer(input: string): string {
  const t = input.toLowerCase();
  if (/(harm|attack|hack into|steal|scam someone|bully|harass|ddos|malware create|bypass)/.test(t))
    return 'I can only help with defensive safety — recognizing and stopping threats, not carrying them out. Tell me what you received and I will help you check if it is safe and what to do next.';
  if (t.includes('phish')) return FAQS[0].a;
  if (t.includes('suspicious') || t.includes('why') ) return FAQS[1].a;
  if (t.includes('clicked') || t.includes('scammed') || t.includes('sent money') || t.includes('hacked')) return FAQS[2].a;
  if (t.includes('protect') || t.includes('password') || t.includes('mfa') || t.includes('account')) return FAQS[3].a;
  if (t.includes('qr')) return FAQS[4].a;
  if (t.includes('bully') || t.includes('harass')) return 'Do not reply angrily or retaliate. Save evidence (screenshots with dates), block, report on the platform, and tell someone you trust — a parent, teacher, or counselor. If you feel unsafe, reach out to a local support person.';
  if (t.includes('scam') || t.includes('job') || t.includes('scholarship') || t.includes('investment') || t.includes('romance'))
    return 'Treat unexpected money/job/prize messages as fake until proven otherwise: never pay fees to receive, never send ID/bank/OTP by chat, verify on the official site, and report the account. Try the Scam simulator for practice.';
  return 'Good question. In simple terms: pause, check the sender and link, verify through the official app (typed by you), and never share passwords or OTP codes. Ask me about phishing, scams, passwords, MFA, QR codes, or bullying — or try a quick FAQ below.';
}

export default function MentorPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'mentor', text: 'Hi! I am your CyberWise mentor. Ask me in plain language — e.g. “What is phishing?” or “I clicked a strange link, what now?” I guide with hints; I never help with attacks.' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setBusy(true);
    try {
      const { getMentorAnswer } = await import('./actions');
      const res = await getMentorAnswer(q);
      if (res.answer) {
        setMessages((m) => [...m, { role: 'mentor', text: res.answer as string }]);
      } else {
        // Offline fallback (works without an API key).
        setMessages((m) => [...m, { role: 'mentor', text: localAnswer(q) }]);
      }
    } catch {
      setMessages((m) => [...m, { role: 'mentor', text: localAnswer(q) }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <Bot className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">AI Mentor</h1>
          <p className="text-muted-foreground">Simple explanations, defensive only. No account needed to ask.</p>
        </div>
      </div>
      <Card className="flex min-h-[50vh] flex-col">
        <CardHeader>
          <CardTitle className="font-headline text-lg">Chat</CardTitle>
          <CardDescription>Hint-first help. For emergencies involving safety, contact a trusted person or local support.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto" aria-live="polite">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === 'user' ? 'ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-2 text-primary-foreground' : 'mr-auto max-w-[85%] rounded-lg bg-muted px-3 py-2'}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>
              </div>
            ))}
            {busy && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          </div>
          <div className="flex flex-wrap gap-2">
            {FAQS.slice(0, 3).map((f) => (
              <Button key={f.q} variant="outline" size="sm" onClick={() => send(f.q)} className="min-h-[36px]">
                {f.q}
              </Button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask e.g. What should I do if I clicked a strange link?"
              aria-label="Ask the mentor"
              className="min-h-[44px]"
            />
            <Button type="submit" disabled={busy || !input.trim()} className="min-h-[44px]" aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
