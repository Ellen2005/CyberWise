'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Square } from 'lucide-react';
import { speakText, stopSpeaking } from '@/lib/audio/speak';

type Props = {
  text: string;
  lang: string;
  label?: string;
};

/** Free text-to-speech narration via the browser Speech API. No network, no key. */
export function ReadAloud({ text, lang, label = 'Listen' }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => stopSpeaking();
  }, []);

  if (!supported) return null;

  const toggle = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const ok = speakText(text, {
      lang,
      persona: 'narrator',
      onend: () => setSpeaking(false),
      onerror: () => setSpeaking(false),
    });
    setSpeaking(ok);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      aria-pressed={speaking}
      aria-label={speaking ? 'Stop narration' : `${label} (audio narration)`}
      className="min-h-[36px]"
    >
      {speaking ? <Square className="mr-1 h-4 w-4" /> : <Volume2 className="mr-1 h-4 w-4" />}
      {speaking ? 'Stop' : label}
    </Button>
  );
}
