'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Link2 } from 'lucide-react';
import { buildResultText, shareResult, type ShareKind } from '@/lib/share/build-result-text';
import { useToast } from '@/hooks/use-toast';

type Props = {
  kind: ShareKind;
  title: string;
  score?: number | null;
  path: string;
};

/** "Challenge a friend" button: Web Share sheet, clipboard fallback. */
export function ShareResult({ kind, title, score = null, path }: Props) {
  const { toast } = useToast();
  const [state, setState] = useState<'idle' | 'shared' | 'copied'>('idle');

  const go = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
    const { text } = buildResultText(kind, title, score, url);
    const out = await shareResult(text, url);
    if (out === 'shared') {
      setState('shared');
      toast({ title: 'Shared', description: 'Challenge sent. May the sharpest eyes win.' });
    } else if (out === 'copied') {
      setState('copied');
      toast({ title: 'Copied', description: 'Paste it in WhatsApp to challenge friends.' });
      setTimeout(() => setState('idle'), 2500);
    } else {
      toast({ variant: 'destructive', title: 'Sharing failed', description: 'Copy the page link manually.' });
    }
  };

  return (
    <Button variant="outline" onClick={go} className="min-h-[44px]">
      {state === 'copied' ? <Check className="mr-2 h-4 w-4" /> : state === 'shared' ? <Share2 className="mr-2 h-4 w-4" /> : <Link2 className="mr-2 h-4 w-4" />}
      {state === 'copied' ? 'Copied' : 'Challenge a friend'}
    </Button>
  );
}
