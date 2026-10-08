'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Square } from 'lucide-react';

type Props = {
  text: string;
  lang: string;
  label?: string;
};

/** Free text-to-speech narration via the browser Speech API. No network, no key. */
export function ReadAloud({ text, lang, label = 'Listen' }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch { /* noop */ }
    };
  }, []);

  if (!supported) return null;

  const toggle = () => {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text.slice(0, 2000));
    utter.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
    utter.rate = 0.95;
    const voices = synth.getVoices();
    const match =
      voices.find((v) => v.lang.toLowerCase().startsWith(lang === 'fr' ? 'fr' : 'en')) ?? null;
    if (match) utter.voice = match;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    synth.cancel();
    synth.speak(utter);
    setSpeaking(true);
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
