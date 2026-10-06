// Guided 7-day personal plans. Each day links existing content; finishing a day
// records a small XP attempt (contentId `plan-<plan>-d<day>`), so progress persists.

export type PlanDay = {
  day: number;
  title: string;
  desc: string;
  href: string;
  cta: string;
  minutes: number;
};

export type Plan = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  audience: string;
  xpPerDay: number;
  days: PlanDay[];
};

export const plans: Plan[] = [
  {
    id: 'plan-phishing-week',
    slug: 'phishing-week',
    title: '7-Day Phishing Challenge',
    tagline: 'From "is this real?" to confident investigator in a week.',
    audience: 'Anyone who gets suspicious messages',
    xpPerDay: 10,
    days: [
      { day: 1, title: 'The red flags', desc: 'Learn the 7 signs of phishing.', href: '/learn/phishing-basics', cta: 'Read the lesson', minutes: 10 },
      { day: 2, title: 'Investigate a bank scam', desc: 'Inspect sender, link, and urgency.', href: '/simulators/phishing', cta: 'Investigate', minutes: 10 },
      { day: 3, title: 'WhatsApp scenario', desc: 'Live the consequence of one tap.', href: '/scenarios/whatsapp-verification-scam', cta: 'Play scenario', minutes: 5 },
      { day: 4, title: 'Spot the bank SMS', desc: 'Tap every red flag.', href: '/spot-the-scam', cta: 'Inspect', minutes: 5 },
      { day: 5, title: 'Scholarship story', desc: 'Follow Amara\'s suspicious win.', href: '/stories/the-scholarship-message', cta: 'Play story', minutes: 6 },
      { day: 6, title: 'Try the analyzer', desc: 'Paste a real suspicious message you received.', href: '/tools/legit-scanner', cta: 'Scan', minutes: 5 },
      { day: 7, title: 'Final drill', desc: 'Phishing challenge + daily review.', href: '/daily', cta: 'Take the challenge', minutes: 10 },
    ],
  },
  {
    id: 'plan-account-security',
    slug: 'account-security-week',
    title: 'Account Security Week',
    tagline: 'Lock every important account, starting with email.',
    audience: 'Anyone reusing passwords or without MFA',
    xpPerDay: 10,
    days: [
      { day: 1, title: 'Why passwords fail', desc: 'Length beats complexity.', href: '/learn/password-security', cta: 'Read the lesson', minutes: 10 },
      { day: 2, title: 'The second lock', desc: 'How MFA stops takeovers.', href: '/learn/two-factor-authentication', cta: 'Read the lesson', minutes: 8 },
      { day: 3, title: 'One password everywhere?', desc: 'See what a leak really costs.', href: '/scenarios/one-password-everywhere', cta: 'Play scenario', minutes: 5 },
      { day: 4, title: 'Set up a manager', desc: 'Use the generator for one real account.', href: '/tools/password-generator', cta: 'Generate', minutes: 5 },
      { day: 5, title: 'Enable MFA on email', desc: 'Your email unlocks everything else.', href: '/learn/two-factor-authentication', cta: 'Review steps', minutes: 10 },
      { day: 6, title: 'Facebook login scenario', desc: 'Practice the verify-in-app habit.', href: '/scenarios/facebook-login-alert', cta: 'Play scenario', minutes: 5 },
      { day: 7, title: 'Recovery drill', desc: 'Know the hacked-account checklist cold.', href: '/help/been-scammed', cta: 'Review checklists', minutes: 10 },
    ],
  },
  {
    id: 'plan-student-safety',
    slug: 'student-safety-week',
    title: 'Student Cyber Safety',
    tagline: 'School accounts, scams targeting students, and kindness online.',
    audience: 'Students',
    xpPerDay: 10,
    days: [
      { day: 1, title: 'Safety basics', desc: 'The CIA triad in plain language.', href: '/learn/what-is-cybersecurity', cta: 'Read the lesson', minutes: 8 },
      { day: 2, title: 'Exam portal trap', desc: 'Results excitement is bait too.', href: '/scenarios/exam-results-portal', cta: 'Play scenario', minutes: 5 },
      { day: 3, title: 'Scholarship scams', desc: 'Fees-to-receive is always fake.', href: '/simulators/scam', cta: 'Practice', minutes: 10 },
      { day: 4, title: 'Fake certificates', desc: 'Diplomas without learning.', href: '/scenarios/fake-certificate-course', cta: 'Play scenario', minutes: 5 },
      { day: 5, title: 'Bullying response', desc: 'Support, evidence, report — never retaliate.', href: '/simulators/bullying', cta: 'Learn the chain', minutes: 6 },
      { day: 6, title: 'APK dangers', desc: 'Free-data apps and sideloading.', href: '/scenarios/free-data-apk', cta: 'Play scenario', minutes: 5 },
      { day: 7, title: 'Risk Check', desc: 'Measure your profile and get a path.', href: '/risk-check', cta: 'Check my risk', minutes: 10 },
    ],
  },
  {
    id: 'plan-family-safety',
    slug: 'family-safety-week',
    title: 'Family Cyber Safety',
    tagline: 'For parents: protect your children and yourself online.',
    audience: 'Parents and guardians',
    xpPerDay: 10,
    days: [
      { day: 1, title: 'What kids face', desc: 'Scams, strangers, bullying, oversharing.', href: '/learn/what-is-cybersecurity', cta: 'Read the lesson', minutes: 8 },
      { day: 2, title: 'Talk about bullying', desc: 'Learn the safe response chain together.', href: '/simulators/bullying', cta: 'Walk through it', minutes: 6 },
      { day: 3, title: 'The group-chat story', desc: 'A story to discuss as a family.', href: '/stories/the-group-chat-pile-on', cta: 'Play story', minutes: 6 },
      { day: 4, title: 'Secure the family accounts', desc: 'Unique passwords + MFA on shared devices.', href: '/learn/password-security', cta: 'Read together', minutes: 10 },
      { day: 5, title: 'Prize and giveaway traps', desc: 'Kids are prime targets for "winnings".', href: '/scenarios/influencer-giveaway-fee', cta: 'Play scenario', minutes: 5 },
      { day: 6, title: 'Stranger danger online', desc: 'Clone profiles and fake friends.', href: '/scenarios/fake-profile-friend-request', cta: 'Play scenario', minutes: 5 },
      { day: 7, title: 'Family agreement', desc: 'Write 3 household rules + do the Risk Check.', href: '/risk-check', cta: 'Finish strong', minutes: 10 },
    ],
  },
];
