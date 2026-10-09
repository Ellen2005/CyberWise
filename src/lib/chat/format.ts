/** Initials for chat avatars: first letters of the first two name words. */
export function initials(name: string): string {
  const words = name.replace(/[@<>()0-9+]/g, ' ').split(/[\s._-]+/).filter(Boolean);
  return (words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?');
}

/** Deterministic avatar hue so each sender keeps one color. */
export function hue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

/** Pressure language worth flagging with an urgency ribbon. */
export function isUrgent(text: string): boolean {
  return /urgent|24\s?h|hour|now\b|suspend|block|expire|immediately|tout de suite|urgence|2\s?heures/i.test(text);
}

/** Voice-note scenarios render a player instead of a text bubble. */
export function isVoice(channel: string, message: string): boolean {
  return /voice|vocal|note vocale/i.test(`${channel} ${message.slice(0, 60)}`);
}
