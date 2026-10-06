'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Languages } from 'lucide-react';

function offlineTake(title: string, description: string): string {
  const t = `${title} ${description}`.toLowerCase();
  const actions = ['Verify unexpected messages through the official app, never via links in the message.'];
  if (/phish|email|scam|smish/.test(t)) actions.push('Check sender domains and hover before tapping links.');
  if (/password|credential|breach|leak/.test(t)) actions.push('Use unique passwords and turn on MFA, starting with email.');
  if (/malware|ransomware|trojan|virus/.test(t)) actions.push('Keep devices updated, install only from official stores, and keep backups.');
  if (/wifi|network/.test(t)) actions.push('Avoid sensitive logins on public Wi-Fi; prefer mobile data.');
  actions.push('Tell one person about this pattern so it protects them too.');
  return `What this means for you: attackers are actively using the tactic in this story against ordinary people. What to do:\n${actions.slice(0, 3).map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
}

export function NewsImpact({ title, description }: { title: string; description: string }) {
  const [text, setText] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [usedOffline, setUsedOffline] = useState(false);

  const explain = async () => {
    if (text || busy) return;
    setBusy(true);
    try {
      const { getMentorAnswer } = await import('@/app/mentor/actions');
      const res = await getMentorAnswer(
        `Explain this cybersecurity news for an ordinary non-technical person in 3 short parts: "What happened", "What it means for you", and exactly 3 numbered protective actions. News: ${title}. ${description}`
      );
      if (res.answer) {
        setText(res.answer);
      } else {
        setText(offlineTake(title, description));
        setUsedOffline(true);
      }
    } catch {
      setText(offlineTake(title, description));
      setUsedOffline(true);
    } finally {
      setBusy(false);
    }
  };

  if (text) {
    return (
      <div className="rounded-md bg-muted/50 p-3 text-sm">
        <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
        {usedOffline && <p className="mt-1 text-xs text-muted-foreground">Offline guidance (AI unavailable).</p>}
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={explain} disabled={busy} className="min-h-[36px]">
      {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
      What does this mean for me?
    </Button>
  );
}
