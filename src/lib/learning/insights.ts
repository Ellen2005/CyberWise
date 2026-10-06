// Behavior-change measurement: recognition rate, decision rate, trends, per-topic bars.
// Pure functions over attempt records (works with AttemptLike shapes from Firestore).

import { scenarios } from '../content/scenarios';
import { scenarios2 } from '../content/scenarios-2';
import { phishingScenarios } from '../content/phishing-scenarios';
import { scamScenarios } from '../content/scam-scenarios';
import { wwydScenarios } from '../content/wwyd-scenarios';
import { spotItems } from '../content/spot-items';

export type AttemptLike = {
  contentId: string;
  contentType: string;
  status: string;
  correct?: boolean;
  submittedAt?: any;
};

export type TopicStat = { topic: string; total: number; correct: number; pct: number };

const RECOGNITION_TOPICS = new Set(['Phishing', 'Scams']);
const DECISION_SOURCES = new Set(['wwyd', 'scenario']);

function sourceOf(a: AttemptLike): 'wwyd' | 'scenario' | 'lab' | 'other' {
  if (a.contentId.startsWith('wwyd-')) return 'wwyd';
  if (a.contentId.startsWith('sc-') && !a.contentId.startsWith('scam-')) return 'scenario';
  return 'lab';
}

export function topicOfAttempt(a: AttemptLike): string | null {
  const id = a.contentId;
  const allSc = [...scenarios, ...scenarios2].find((s) => s.id === id);
  if (allSc) {
    const m: Record<string, string> = {
      'Everyday scams': 'Scams',
      'Social engineering': 'Social engineering',
      Malware: 'Malware',
      'Account security': 'Passwords',
      'Safe browsing': 'Safe browsing',
      'Job scams': 'Scams',
      'Student scams': 'Scams',
      'Email threats': 'Phishing',
    };
    return m[allSc.category] ?? allSc.category;
  }
  if (phishingScenarios.some((s) => s.id === id)) return 'Phishing';
  if (scamScenarios.some((s) => s.id === id)) return 'Scams';
  const w = wwydScenarios.find((s) => s.id === id);
  if (w) return w.topic;
  if (spotItems.some((s) => s.id === id)) return 'Phishing';
  if (id === 'challenge-phishing-001' || id === 'challenge-phishing-002') return 'Phishing';
  if (id === 'challenge-osint-001') return 'Scams';
  return null;
}

function ts(a: AttemptLike): number {
  const t = a.submittedAt;
  if (!t) return 0;
  if (typeof t.toMillis === 'function') return t.toMillis();
  if (typeof t.seconds === 'number') return t.seconds * 1000;
  const d = new Date(t).getTime();
  return Number.isNaN(d) ? 0 : d;
}

export type Insights = {
  total: number;
  recognition: { total: number; pct: number | null };
  decision: { total: number; pct: number | null };
  trend: { early: number | null; recent: number | null; delta: number | null };
  byTopic: TopicStat[];
};

export function computeInsights(attempts: AttemptLike[]): Insights {
  const graded = attempts.filter((a) => a.status === 'completed' || a.status === 'failed' || a.correct !== undefined);
  const correct = (a: AttemptLike) => a.correct === true || (a.status === 'completed' && a.correct !== false);

  const rec = graded.filter((a) => {
    const t = topicOfAttempt(a);
    return t !== null && RECOGNITION_TOPICS.has(t);
  });
  const dec = graded.filter((a) => DECISION_SOURCES.has(sourceOf(a)));

  const pct = (list: AttemptLike[]) =>
    list.length === 0 ? null : Math.round((list.filter(correct).length / list.length) * 100);

  const ordered = [...graded].sort((a, b) => ts(a) - ts(b));
  let early: number | null = null;
  let recent: number | null = null;
  if (ordered.length >= 6) {
    const third = Math.max(2, Math.floor(ordered.length / 3));
    early = pct(ordered.slice(0, third));
    recent = pct(ordered.slice(-third));
  }
  const delta = early !== null && recent !== null ? recent - early : null;

  const byTopicMap = new Map<string, { total: number; correct: number }>();
  for (const a of graded) {
    const t = topicOfAttempt(a);
    if (!t) continue;
    const e = byTopicMap.get(t) ?? { total: 0, correct: 0 };
    e.total += 1;
    if (correct(a)) e.correct += 1;
    byTopicMap.set(t, e);
  }
  const byTopic: TopicStat[] = [...byTopicMap.entries()]
    .map(([topic, s]) => ({ topic, total: s.total, correct: s.correct, pct: Math.round((s.correct / s.total) * 100) }))
    .sort((a, b) => b.total - a.total);

  return {
    total: graded.length,
    recognition: { total: rec.length, pct: pct(rec) },
    decision: { total: dec.length, pct: pct(dec) },
    trend: { early, recent, delta },
    byTopic,
  };
}
