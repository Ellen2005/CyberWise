// Rule-based personalized recommendations from attempts + interests.
// Pure functions — testable, no Firebase dependency.

export type AttemptLike = {
  contentType: string;
  contentId: string;
  status: string;
  correct?: boolean;
  xpEarned?: number;
};

export type Recommendation = {
  href: string;
  title: string;
  reason: string;
  topic: string;
};

type TopicRule = {
  topic: string;
  strengthsLabel: string;
  recommend: Recommendation;
  review: Recommendation;
};

// Map content ids / challenge types to awareness topics.
const CHALLENGE_TOPICS: Record<string, string> = {
  'challenge-phishing-001': 'Phishing',
  'challenge-phishing-002': 'Phishing',
  'challenge-osint-001': 'Scams',
  'challenge-log-001': 'Investigate',
  'challenge-investigation-001': 'Investigate',
  'challenge-crypto-001': 'Foundations',
  'challenge-web-001': 'Foundations',
  'challenge-web-002': 'Foundations',
};

const LESSON_TOPICS: Record<string, string> = {
  'lesson-what-is-cybersecurity': 'Basics',
  'lesson-password-security': 'Passwords',
  'lesson-mfa': 'Passwords',
  'lesson-phishing': 'Phishing',
  'lesson-networks-101': 'Investigate',
  'lesson-malware-ransomware': 'Malware',
};

const RULES: TopicRule[] = [
  {
    topic: 'Phishing',
    strengthsLabel: 'Phishing detection',
    recommend: { href: '/learn/phishing-basics', title: 'Phishing Basics', reason: 'You missed phishing clues — start with the red-flags lesson.', topic: 'Phishing' },
    review: { href: '/simulators/phishing', title: 'Phishing investigation lab', reason: 'Practice inspecting senders and links.', topic: 'Phishing' },
  },
  {
    topic: 'Passwords',
    strengthsLabel: 'Passwords & MFA',
    recommend: { href: '/learn/password-security', title: 'Password Security', reason: 'Unique passwords stop most account takeovers.', topic: 'Passwords' },
    review: { href: '/learn/two-factor-authentication', title: 'Two-Factor Authentication', reason: 'Add the second lock to your accounts.', topic: 'Passwords' },
  },
  {
    topic: 'Scams',
    strengthsLabel: 'Scam spotting',
    recommend: { href: '/simulators/scam', title: 'Scam awareness lab', reason: 'You struggled with scam scenarios — practice the patterns.', topic: 'Scams' },
    review: { href: '/stories/the-scholarship-message', title: 'Story: The Scholarship Message', reason: 'Learn advance-fee scams through a story.', topic: 'Scams' },
  },
  {
    topic: 'Investigate',
    strengthsLabel: 'Investigation',
    recommend: { href: '/learn/networks-101', title: 'Networks 101', reason: 'Domains, DNS, and HTTPS make phishing easier to judge.', topic: 'Investigate' },
    review: { href: '/simulators/wwyd', title: 'What Would You Do?', reason: 'Decide with clues, not guesses.', topic: 'Investigate' },
  },
  {
    topic: 'Basics',
    strengthsLabel: 'Safety basics',
    recommend: { href: '/learn/what-is-cybersecurity', title: 'What is Cybersecurity?', reason: 'A quick refresher on the core ideas.', topic: 'Basics' },
    review: { href: '/daily', title: "Today's challenge", reason: 'A small daily step keeps skills fresh.', topic: 'Basics' },
  },
  {
    topic: 'Malware',
    strengthsLabel: 'Malware defense',
    recommend: { href: '/learn/malware-and-ransomware', title: 'Malware & Ransomware', reason: 'Backups and updates beat ransomware.', topic: 'Malware' },
    review: { href: '/help/been-scammed', title: 'If a download looks suspicious', reason: 'Know the checklist before you need it.', topic: 'Malware' },
  },
];

function topicOf(a: AttemptLike): string | null {
  if (a.contentType === 'challenge') return CHALLENGE_TOPICS[a.contentId] ?? null;
  if (a.contentType === 'lesson' || a.contentType === 'quiz') return LESSON_TOPICS[a.contentId] ?? null;
  if (a.contentType === 'story') return 'Stories';
  return null;
}

export function summarizePerformance(attempts: AttemptLike[]): {
  strengths: string[];
  weakAreas: string[];
  byTopic: Record<string, { total: number; failed: number }>;
} {
  const byTopic: Record<string, { total: number; failed: number }> = {};
  for (const a of attempts) {
    const t = topicOf(a);
    if (!t) continue;
    byTopic[t] = byTopic[t] ?? { total: 0, failed: 0 };
    byTopic[t].total += 1;
    if (a.status === 'failed' || a.correct === false) byTopic[t].failed += 1;
  }
  const strengths: string[] = [];
  const weakAreas: string[] = [];
  for (const [topic, s] of Object.entries(byTopic)) {
    if (s.total >= 2 && s.failed === 0) {
      const rule = RULES.find((r) => r.topic === topic);
      strengths.push(rule?.strengthsLabel ?? topic);
    } else if (s.failed > 0 || (s.total >= 3 && s.failed > 0)) {
      weakAreas.push(topic);
    }
  }
  // Any single failure is a weak signal worth addressing.
  for (const [topic, s] of Object.entries(byTopic)) {
    if (s.failed > 0 && !weakAreas.includes(topic)) weakAreas.push(topic);
  }
  return { strengths, weakAreas, byTopic };
}

export function recommendNext(
  attempts: AttemptLike[],
  interests: string[] = [],
  completedIds: string[] = []
): Recommendation[] {
  const { weakAreas } = summarizePerformance(attempts);
  const out: Recommendation[] = [];
  const seen = new Set<string>();

  const push = (r: Recommendation) => {
    if (seen.has(r.href)) return;
    seen.add(r.href);
    out.push(r);
  };

  // 1. Weak areas first — recommend then review.
  for (const topic of weakAreas) {
    const rule = RULES.find((r) => r.topic === topic);
    if (!rule) continue;
    if (!completedIds.includes(rule.recommend.href)) push(rule.recommend);
    push(rule.review);
    if (out.length >= 3) break;
  }

  // 2. Interests mapped to rules.
  const interestMap: Record<string, string> = {
    Phishing: 'Phishing',
    Scams: 'Scams',
    Passwords: 'Passwords',
    'Social media safety': 'Phishing',
    Cyberbullying: 'Basics',
    Privacy: 'Basics',
    'Mobile security': 'Malware',
  };
  for (const i of interests) {
    const topic = interestMap[i];
    const rule = RULES.find((r) => r.topic === topic);
    if (rule && out.length < 3) push(rule.review);
  }

  // 3. Default starter path.
  const defaults: Recommendation[] = [
    { href: '/learn/what-is-cybersecurity', title: 'What is Cybersecurity?', reason: 'Start with the 8-minute basics.', topic: 'Basics' },
    { href: '/simulators/phishing', title: 'Phishing investigation lab', reason: 'The most common attack, hands-on.', topic: 'Phishing' },
    { href: '/daily', title: "Today's challenge", reason: 'One small step today.', topic: 'Basics' },
  ];
  for (const d of defaults) {
    if (out.length >= 3) break;
    push(d);
  }

  return out.slice(0, 3);
}
