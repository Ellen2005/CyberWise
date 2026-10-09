// Precision-aware scoring for investigation labs (phishing, scam).
// Rewards finding real clues AND ignores nothing: every distractor picked
// costs points, so selecting everything is no longer a winning strategy.

export type InvestigationScore = {
  /** 0..1 */
  score: number;
  found: string[];
  missed: string[];
  falsePositives: string[];
};

export function scoreInvestigation(
  picked: string[],
  realClueIds: string[],
  verdictCorrect: boolean
): InvestigationScore {
  const real = new Set(realClueIds);
  const seen = new Set(picked);
  const found = [...seen].filter((id) => real.has(id));
  const missed = realClueIds.filter((id) => !seen.has(id));
  const falsePositives = [...seen].filter((id) => !real.has(id));

  const recall = realClueIds.length === 0 ? 1 : found.length / realClueIds.length;
  // Wrong picks cost in proportion to everything not found: selecting every
  // clue plus every distractor scores worse than careful selection.
  const denom = falsePositives.length + missed.length;
  const fpRate = denom === 0 ? 0 : falsePositives.length / denom;

  const raw = (verdictCorrect ? 0.45 : 0) + recall * 0.4 - fpRate * 0.35;
  return { score: Math.max(0, Math.round(raw * 100) / 100), found, missed, falsePositives };
}

export function passedInvestigation(s: InvestigationScore, threshold = 0.6): boolean {
  return s.score >= threshold;
}
