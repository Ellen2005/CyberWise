import { getCallScenario } from '../content/call-scenarios';

export type CallVerdict = {
  infoProtected: number; // 0-100: did they avoid leaking codes/PINs/details?
  verification: number; // 0-100: did they try to verify independently?
  composure: number; // 0-100: short replies, no begging, ended the call?
  overall: number;
  mistakes: string[];
  strengths: string[];
};

export type CallTurn = { role: 'scammer' | 'user'; text: string };

/**
 * Offline rubric: scores a simulated call from the transcript alone.
 * Used when no AI key is configured, and as a floor under AI judging.
 */
export function evaluateCallOffline(scenarioId: string, turns: CallTurn[]): CallVerdict {
  const scenario = getCallScenario(scenarioId);
  const userLines = turns.filter((t) => t.role === 'user').map((t) => t.text.toLowerCase());
  const joined = userLines.join('\n');
  const mistakes: string[] = [];
  const strengths: string[] = [];

  const dangerHits = scenario?.dangerSignals.filter((s) => joined.includes(s)) ?? [];
  const defenseHits = scenario?.defenseSignals.filter((s) => joined.includes(s)) ?? [];

  // Sharing anything code/PIN-like is catastrophic, even once.
  // Bare digit strings count: in this simulator there is no legitimate
  // reason to dictate numbers to a stranger.
  const sharedSecret = dangerHits.length > 0 || /\b\d{4,8}\b/.test(joined);
  if (sharedSecret) {
    mistakes.push('You shared (or nearly shared) a code, PIN, or personal detail. In a real call that single message empties accounts.');
  } else if (userLines.length > 0) {
    strengths.push('You kept codes, PINs, and personal details to yourself.');
  }

  if (defenseHits.length > 0) {
    strengths.push('You pushed for independent verification instead of obeying the caller.');
  } else {
    mistakes.push('You never tried to verify through an independent channel (official number, known contact, app).');
  }

  // Long, chatty calls favor the scammer: engagement beyond ~6 user turns loses composure points.
  const turnsPenalty = Math.max(0, userLines.length - 6) * 8;
  if (userLines.length === 0) {
    mistakes.push('You stayed silent the whole call — in training that is safe, but practice one refusal line out loud.');
  } else if (userLines.length <= 4) {
    strengths.push('Short call, few words: the less you say, the less they can use.');
  }

  const infoProtected = sharedSecret ? 10 : 95;
  const verification = defenseHits.length > 0 ? 90 : 25;
  const composure = Math.max(15, 90 - turnsPenalty - (sharedSecret ? 30 : 0));
  const overall = Math.round(infoProtected * 0.45 + verification * 0.35 + composure * 0.2);

  return { infoProtected, verification, composure, overall, mistakes, strengths };
}
