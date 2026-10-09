// Shareable challenge text for WhatsApp/social. No personal data, ever:
// score + challenge + call to action. Pure functions for testability.

export type ShareKind = 'scenario' | 'spot' | 'risk' | 'call' | 'plan' | 'certificate';

export function buildResultText(
  kind: ShareKind,
  title: string,
  score: number | null,
  url: string
): { text: string; challenge: string } {
  const challenge =
    score !== null && score >= 80
      ? 'I scored high. Can you beat me?'
      : 'Think you can do better? Try it.';
  const scorePart = score !== null ? `I scored ${score}% on "${title}". ` : `I just finished "${title}". `;
  return {
    text: `${scorePart}${challenge} Learn it. Spot it. Stop it. ${url}`,
    challenge,
  };
}

export async function shareResult(
  text: string,
  url: string
): Promise<'shared' | 'copied' | 'failed'> {
  try {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      await (navigator as any).share({ title: 'WiseTap', text, url });
      return 'shared';
    }
  } catch {
    // User dismissed the sheet — fall through to clipboard.
  }
  try {
    await navigator.clipboard.writeText(`${text}`);
    return 'copied';
  } catch {
    return 'failed';
  }
}
