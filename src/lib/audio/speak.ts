// Shared narration engine. Browser speech synthesis varies wildly by device,
// so we: (1) pick the highest-quality matching voice, (2) shape each persona
// with rate/pitch so characters sound different, (3) always fail silently.
// Honest limitation: on-device voices still sound synthetic — the app never
// claims otherwise, and scenarios teach that real clones sound MORE human.

export type Persona = 'narrator' | 'scammer' | 'victim' | 'friend';

const PROFILES: Record<Persona, { rate: number; pitch: number; volume: number }> = {
  narrator: { rate: 0.95, pitch: 1.0, volume: 1.0 },
  // Slightly rushed and flat: pressure you can hear.
  scammer: { rate: 1.08, pitch: 0.85, volume: 1.0 },
  victim: { rate: 0.9, pitch: 1.1, volume: 0.95 },
  friend: { rate: 1.0, pitch: 1.05, volume: 1.0 },
};

export function personaProfile(persona: Persona) {
  return PROFILES[persona];
}

type VoiceLike = { name: string; lang: string; localService: boolean };

/** Prefer on-device natural voices, then vendor neural names, then anything matching. */
export function pickVoice<T extends VoiceLike>(voices: T[], lang: 'en' | 'fr'): T | null {
  const prefix = lang === 'fr' ? 'fr' : 'en';
  const pool = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix));
  if (pool.length === 0) return null;
  const neural = pool.find((v) =>
    /natural|neural|google\s+(us|français|france)|microsoft\s+\w+\s+online/i.test(v.name)
  );
  if (neural) return neural;
  const local = pool.find((v) => v.localService);
  return local ?? pool[0];
}

export function speakText(
  text: string,
  opts: { lang?: string; persona?: Persona; onend?: () => void; onerror?: () => void } = {}
): boolean {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    const synth = window.speechSynthesis;
    synth.cancel();
    const lang = opts.lang === 'fr' ? 'fr' : 'en';
    const utter = new SpeechSynthesisUtterance(text.slice(0, 600));
    utter.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
    const profile = PROFILES[opts.persona ?? 'narrator'];
    utter.rate = profile.rate;
    utter.pitch = profile.pitch;
    utter.volume = profile.volume;
    const voice = pickVoice(synth.getVoices() as unknown as VoiceLike[], lang);
    if (voice) utter.voice = voice as unknown as SpeechSynthesisVoice;
    if (opts.onend) utter.onend = opts.onend;
    if (opts.onerror) utter.onerror = opts.onerror;
    synth.speak(utter);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel();
  } catch { /* noop */ }
}
