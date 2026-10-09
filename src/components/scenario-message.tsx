'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Siren } from 'lucide-react';
import { cn } from '@/lib/utils';
import { initials, hue, isUrgent, isVoice } from '@/lib/chat/format';

function VoiceBubble({ text, lang }: { text: string; lang: string }) {
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    try {
      if (!('speechSynthesis' in window)) return;
      if (playing) {
        window.speechSynthesis.cancel();
        setPlaying(false);
        return;
      }
      const u = new SpeechSynthesisUtterance(text.slice(0, 400));
      u.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
      u.rate = 0.95;
      u.onend = () => setPlaying(false);
      u.onerror = () => setPlaying(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      setPlaying(true);
    } catch { /* audio unavailable */ }
  };

  // Fake waveform bars — pure decoration, deterministic widths.
  const bars = [10, 18, 26, 20, 32, 24, 14, 28, 22, 16, 30, 18, 12, 24, 20];

  return (
    <button
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Stop voice note' : 'Play voice note'}
      className="flex w-full items-center gap-3 rounded-2xl rounded-tl-sm bg-[#DCF8C6] p-3 text-left dark:bg-[#005C4B]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00A884] text-white">
        {playing ? <Square className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
      </span>
      <span className="flex flex-1 items-end gap-[3px]" aria-hidden="true">
        {bars.map((h, i) => (
          <span
            key={i}
            style={{ height: h }}
            className={cn('w-[3px] rounded-full', playing ? 'bg-white/90' : 'bg-black/30 dark:bg-white/40')}
          />
        ))}
      </span>
      <span className="text-xs text-black/60 dark:text-white/70">0:19</span>
    </button>
  );
}

type Props = {
  sender: string;
  message: string;
  channel: string;
  lang: string;
  contextNotes?: string[];
};

/**
 * Renders a scenario message the way it would arrive: chat bubble with
 * avatar for messaging channels, voice-note player for voice scenarios,
 * urgency ribbon when pressure language is detected.
 */
export function ScenarioMessage({ sender, message, channel, lang, contextNotes }: Props) {
  const voice = isVoice(channel, message);
  const urgent = isUrgent(message);

  return (
    <div className="space-y-2">
      <div className="rounded-xl border bg-[#ECE5DD]/60 p-3 dark:bg-[#0B141A]/60">
        <div className="mb-2 flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: `hsl(${hue(sender)} 55% 42%)` }}
          >
            {initials(sender)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{sender}</p>
            <p className="text-xs text-muted-foreground">{channel}</p>
          </div>
          {urgent && (
            <Badge variant="destructive" className="ml-auto flex items-center gap-1">
              <Siren className="h-3 w-3" />{lang === 'fr' ? 'URGENT' : 'URGENT'}
            </Badge>
          )}
        </div>
        {voice ? (
          <VoiceBubble text={message} lang={lang} />
        ) : (
          <div className="max-w-[95%] rounded-2xl rounded-tl-sm bg-white p-3 shadow-sm dark:bg-[#1F2C34]">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message}</p>
            <p className="mt-1 text-right text-[11px] text-black/50 dark:text-white/50">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {'  ✓✓'}
            </p>
          </div>
        )}
      </div>
      {contextNotes?.map((n) => (
        <p key={n} className="text-sm text-muted-foreground">Context: {n}</p>
      ))}
    </div>
  );
}
