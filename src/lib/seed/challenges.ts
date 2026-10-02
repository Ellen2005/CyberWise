// ============================================
// CyberWise Seed Challenges
// Structured content model — ready to be migrated to Firestore.
// ============================================

import type { Challenge, ChallengeHint, ChallengeType } from '@/types';

export const challengeCategories: { id: string; name: string; description: string }[] = [
  { id: 'phishing', name: 'Phishing', description: 'Spot and analyze phishing attempts.' },
  { id: 'log-analysis', name: 'Log Analysis', description: 'Investigate logs for suspicious activity.' },
  { id: 'osint', name: 'OSINT', description: 'Open-source intelligence investigations.' },
  { id: 'crypto', name: 'Cryptography', description: 'Break and understand ciphers.' },
  { id: 'web', name: 'Web Security', description: 'Web application vulnerabilities.' },
  { id: 'forensics', name: 'Digital Forensics', description: 'Investigate digital evidence.' },
  { id: 'network', name: 'Network Security', description: 'Analyze network traffic and events.' },
  { id: 'stego', name: 'Steganography', description: 'Hidden data in plain sight.' },
  { id: 'misc', name: 'Miscellaneous', description: 'A bit of everything.' },
];

export const seedChallenges: Challenge[] = [
  {
    id: 'challenge-phishing-001',
    slug: 'spot-the-phishing-email',
    title: 'Spot the Phishing Email',
    description: 'Analyze a suspicious email and identify the red flags that reveal it as a phishing attempt.',
    type: 'phishing',
    categoryId: 'phishing',
    difficulty: 'beginner',
    points: 100,
    xpReward: 50,
    estimatedMinutes: 10,
    learningObjectives: [
      'Identify common phishing indicators',
      'Understand how attackers create urgency',
      'Learn to inspect sender addresses and links',
    ],
    prompt: `You receive this email at work:

**From:** "IT Support" <support@company-updates.net>
**Subject:** URGENT: Your account will be suspended

> Dear Employee,
> 
> Our system detected unusual login activity on your account. Your access will be suspended within 24 hours unless you verify your identity.
> 
> Click here to verify your account now: http://company-updates.net/verify
> 
> IT Administration

Which of the following is the STRONGEST indicator that this is a phishing email?`,
    flag: 'B', // multiple-choice answer
    hintIds: ['hint-phishing-001-1', 'hint-phishing-001-2', 'hint-phishing-001-3'],
    solutionExplanation: `This is a phishing email. The strongest indicator is that the sender's domain ("company-updates.net") does not match your company's real domain. The email also creates false urgency ("suspended within 24 hours") and asks you to click a link rather than contact support directly — classic phishing behavior.`,
    skillIds: ['skill-fundamentals', 'skill-phishing-awareness', 'skill-email-security'],
    prerequisites: [],
    published: true,
    order: 1,
  },
  {
    id: 'challenge-phishing-002',
    slug: 'analyze-the-suspicious-link',
    title: 'Analyze the Suspicious Link',
    description: 'Dissect a URL to determine whether it is legitimate or malicious.',
    type: 'phishing',
    categoryId: 'phishing',
    difficulty: 'beginner',
    points: 100,
    xpReward: 50,
    estimatedMinutes: 8,
    learningObjectives: [
      'Understand URL structure (protocol, domain, path)',
      'Learn to identify typosquatting and misleading subdomains',
    ],
    prompt: `A message claims to be from PayPal and contains this link:

https://paypal.com.secure-login.co/verify-account

What is the ACTUAL domain name of this link?`,
    flag: 'secure-login.co',
    hintIds: ['hint-phishing-002-1', 'hint-phishing-002-2'],
    solutionExplanation: `The actual domain is "secure-login.co". Everything before the first single slash determines the domain, and you should read from right to left until that slash. Here, "paypal.com" is only a subdomain of "secure-login.co" — a classic typosquatting trick to impersonate PayPal.`,
    skillIds: ['skill-fundamentals', 'skill-phishing-awareness', 'skill-email-security'],
    prerequisites: ['challenge-phishing-001'],
    published: true,
    order: 2,
  },
  {
    id: 'challenge-log-001',
    slug: 'find-the-brute-force',
    title: 'Find the Brute Force',
    description: 'Analyze authentication logs to identify a brute-force attack.',
    type: 'log-analysis',
    categoryId: 'log-analysis',
    difficulty: 'easy',
    points: 150,
    xpReward: 75,
    estimatedMinutes: 15,
    learningObjectives: [
      'Recognize brute-force patterns in auth logs',
      'Identify the attacker IP',
      'Understand account lockout policies',
    ],
    prompt: `You are a SOC analyst reviewing the following authentication log for the server "web01":

\`\`\`
2026-09-01 00:01:23 192.168.1.50  FAILED_LOGIN  user=jdoe
2026-09-01 00:01:25 45.227.253.1   FAILED_LOGIN  user=jdoe
2026-09-01 00:01:27 45.227.253.1   FAILED_LOGIN  user=jdoe
2026-09-01 00:01:30 45.227.253.1   FAILED_LOGIN  user=jdoe
2026-09-01 00:01:32 45.227.253.1   FAILED_LOGIN  user=jdoe
2026-09-01 00:01:35 45.227.253.1   FAILED_LOGIN  user=jdoe
2026-09-01 00:01:38 45.227.253.1   FAILED_LOGIN  user=jdoe
2026-09-01 00:01:40 45.227.253.1   FAILED_LOGIN  user=jdoe
2026-09-01 00:01:42 45.227.253.1   FAILED_LOGIN  user=jdoe
2026-09-01 00:01:45 45.227.253.1   FAILED_LOGIN  user=jdoe
2026-09-01 00:01:47 45.227.253.1   FAILED_LOGIN  user=jdoe
2026-09-01 00:02:01 45.227.253.1   SUCCESS_LOGIN  user=jdoe
\`\`\`

What is the IP address of the attacker?`,
    flag: '45.227.253.1',
    hintIds: ['hint-log-001-1', 'hint-log-001-2'],
    solutionExplanation: `The attacker is 45.227.253.1. The log shows 11 rapid failed login attempts from this external IP (45.227.253.1 is not in the RFC1918 private range), followed by a successful login — the classic signature of a brute-force attack. The 192.168.1.50 entry is a single failed login from the local network, likely just a mistyped password.`,
    skillIds: ['skill-soc', 'skill-log-analysis', 'skill-threat-hunting'],
    prerequisites: [],
    published: true,
    order: 3,
  },
  {
    id: 'challenge-crypto-001',
    slug: 'decode-the-caesar-cipher',
    title: 'Decode the Caesar Cipher',
    description: 'A classic substitution cipher — crack the message.',
    type: 'crypto',
    categoryId: 'crypto',
    difficulty: 'beginner',
    points: 100,
    xpReward: 50,
    estimatedMinutes: 10,
    learningObjectives: [
      'Understand the Caesar cipher',
      'Learn frequency analysis basics',
      'Recognize weaknesses in weak encryption',
    ],
    prompt: `An attacker left this message on a compromised server:

\`WKH IODJ LV F\EHUVHFXUH\`

It was encrypted using a Caesar cipher with a shift of 3.

What is the decrypted message? (Provide the full decoded text in lowercase)`,
    flag: 'the flag is cybersecurity',
    hintIds: ['hint-crypto-001-1', 'hint-crypto-001-2'],
    solutionExplanation: `A Caesar cipher shifts each letter by a fixed amount. With a shift of 3, "WKH" → "THE", "IODJ" → "FLAG", "LV" → "IS", "F\EHUVHFXUH" → "CYBERSECURE". The message reads: "the flag is cybersecurity". Caesar ciphers are trivially broken with frequency analysis or brute force because there are only 25 possible shifts.`,
    skillIds: ['skill-cryptography'],
    prerequisites: [],
    published: true,
    order: 4,
  },
  {
    id: 'challenge-web-001',
    slug: 'xss-reflected',
    title: 'Reflected XSS — Spot the Flaw',
    description: 'Identify a reflected cross-site scripting vulnerability in vulnerable code.',
    type: 'web',
    categoryId: 'web',
    difficulty: 'easy',
    points: 150,
    xpReward: 75,
    estimatedMinutes: 12,
    learningObjectives: [
      'Recognize reflected XSS vulnerabilities',
      'Understand why unsanitized user input is dangerous',
      'Learn the fix (output encoding)',
    ],
    prompt: `You are reviewing this Node.js request handler:

\`\`\`javascript
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send('<h1>Search Results for: ' + query + '</h1>');
});
\`\`\`

What is the PRIMARY vulnerability in this code?`,
    flag: 'reflected-xss',
    hintIds: ['hint-web-001-1', 'hint-web-001-2'],
    solutionExplanation: `The code reflects the "q" query parameter directly into the HTML response without any encoding or sanitization. This is reflected cross-site scripting (XSS). An attacker can craft a URL like /search?q=<script>alert(1)</script> to execute JavaScript in the victim's browser. The fix is to escape HTML entities before rendering user input (e.g., using a templating engine that auto-escapes, or encodeURI/escapeHtml).`,
    skillIds: ['skill-web-security', 'skill-secure-coding'],
    prerequisites: [],
    published: true,
    order: 5,
  },
  {
    id: 'challenge-web-002',
    slug: 'sql-injection-login-bypass',
    title: 'SQL Injection Login Bypass',
    description: 'Find a SQL injection flaw in a vulnerable login form.',
    type: 'web',
    categoryId: 'web',
    difficulty: 'easy',
    points: 150,
    xpReward: 75,
    estimatedMinutes: 12,
    learningObjectives: [
      'Recognize SQL injection vulnerabilities',
      'Understand how parameterized queries prevent injection',
    ],
    prompt: `This PHP login code is vulnerable:

\`\`\`php
$user = $_POST['username'];
$pass = $_POST['password'];
$query = "SELECT * FROM users WHERE username = '$user' AND password = '$pass'";
$result = mysqli_query($conn, $query);
\`\`\`

A user submits the username: \`admin' -- \` and any password. What happens?`,
    flag: 'sql-injection-bypass',
    hintIds: ['hint-web-002-1', 'hint-web-002-2'],
    solutionExplanation: `The username "admin' -- " comments out the password check, turning the query into: SELECT * FROM users WHERE username = 'admin' -- ' AND password = '...'. The -- starts a SQL comment, so the password condition is ignored. This lets an attacker log in as admin without knowing the password. The fix is parameterized queries / prepared statements.`,
    skillIds: ['skill-web-security', 'skill-secure-coding'],
    prerequisites: ['challenge-web-001'],
    published: true,
    order: 6,
  },
  {
    id: 'challenge-osint-001',
    slug: 'investigate-the-fake-company',
    title: 'Investigate the Fake Company',
    description: 'Use OSINT techniques to expose a fictional company that is actually a front for a scam.',
    type: 'osint',
    categoryId: 'osint',
    difficulty: 'easy',
    points: 150,
    xpReward: 75,
    estimatedMinutes: 15,
    learningObjectives: [
      'Apply basic OSINT investigation techniques',
      'Cross-reference public information',
      'Identify inconsistencies that reveal fraud',
    ],
    prompt: `A job offer email directs you to a website for "Aurora Solutions Ltd" (aurora-solutions.example). You gather these facts:

1. The website lists an office at "123 Main Street, New York, NY."
2. The "About Us" page claims the company was founded in 2012 and has 500 employees.
3. A reverse image search of the office photos shows they are stock photos from a 2008 design asset pack.
4. The domain aurora-solutions.example was registered 3 weeks ago.
5. The email address on the site is support@aurora-solutions.example.
6. There is no record of "Aurora Solutions Ltd" in any business registry.

Which SINGLE piece of evidence is the strongest sign of a scam?`,
    flag: 'no-business-registry',
    hintIds: ['hint-osint-001-1', 'hint-osint-001-2'],
    solutionExplanation: `While the stock photos, recent domain registration, and mismatch between claimed age and domain age are all suspicious, the strongest evidence that this is a front is the complete absence of the company in any business registry. Legitimate companies operating for 13 years with 500 employees would have verifiable registration records. The others are strong corroborating indicators, but only one is a definitive disqualifier.`,
    skillIds: ['skill-osint', 'skill-phishing-awareness'],
    prerequisites: [],
    published: true,
    order: 7,
  },
  {
    id: 'challenge-investigation-001',
    slug: 'acme-breach-investigation',
    title: 'Acme Corp Breach Investigation',
    description: 'Investigate a fictional data breach from logs and identify the initial access vector.',
    type: 'investigation',
    categoryId: 'log-analysis',
    difficulty: 'medium',
    points: 300,
    xpReward: 150,
    estimatedMinutes: 25,
    learningObjectives: [
      'Trace a breach from initial access to impact',
      'Identify the compromised account',
      'Understand the attacker TTPs',
    ],
    prompt: `You are an incident responder at Acme Corp. Users are reporting unusual activity. You are given the following evidence:

**Evidence 1 — VPN Logs:**
\`\`\`
2026-09-02 08:12:44  VPN_LOGIN_SUCCESS  user=ana.rivera  ip=10.0.0.42  from=203.0.113.5
2026-09-02 08:13:10  VPN_LOGIN_SUCCESS  user=ana.rivera  ip=10.0.0.42  from=203.0.113.5
2026-09-02 08:30:55  VPN_LOGIN_SUCCESS  user=tom.chen    ip=10.0.0.19  from=198.51.100.77
\`\`\`

**Evidence 2 — Email Security Logs:**
\`\`\`
2026-09-01 17:45:02  EMAIL_OPENED  user=tom.chen  attachment=invoice_9.pdf
2026-09-01 17:45:30  EMAIL_LINK_CLICKED  user=tom.chen  url=http://secure-docs.example/invoice
\`\`\`

**Evidence 3 — Authentication Logs (AD):**
\`\`\`
2026-09-02 08:45:11  SUCCESS_LOGIN  user=ana.rivera  source=10.0.0.42
2026-09-02 08:46:33  PASSWORD_CHANGE  user=ana.rivera  source=10.0.0.42
2026-09-02 08:47:00  SUCCESS_LOGIN  user=ana.rivera  source=10.0.0.42
2026-09-02 08:47:11  SUCCESS_LOGIN  user=svc_backup  source=10.0.0.42
\`\`\`

What is the most likely INITIAL ACCESS vector for this breach?`,
    flag: 'phishing-email-attachment',
    hintIds: ['hint-investigation-001-1', 'hint-investigation-001-2', 'hint-investigation-001-3'],
    solutionExplanation: `The initial access was a phishing email. Tom Chen received an email with an attachment (invoice_9.pdf) and clicked a link (http://secure-docs.example/invoice) on Sept 1 — this is the classic delivery stage. The next day, ana.rivera's account was logged into from an external IP (203.0.113.5), her password was changed, and then the svc_backup service account was accessed — indicating lateral movement after the attacker gained credentials. The attacker likely used the phishing email as the delivery mechanism to install malware or harvest credentials, which led to the account compromise.`,
    skillIds: ['skill-incident-response', 'skill-log-analysis', 'skill-threat-hunting'],
    prerequisites: ['challenge-log-001'],
    published: true,
    order: 8,
  },
];

export const seedHints: Record<string, ChallengeHint[]> = {
  'challenge-phishing-001': [
    { id: 'hint-phishing-001-1', challengeId: 'challenge-phishing-001', level: 1, content: 'Look carefully at the sender email address. Does the domain look like your company domain?' },
    { id: 'hint-phishing-001-2', challengeId: 'challenge-phishing-001', level: 2, content: 'Attackers often use domains similar but not identical to real ones. "company-updates.net" is NOT "yourcompany.com".' },
    { id: 'hint-phishing-001-3', challengeId: 'challenge-phishing-001', level: 3, content: 'The strongest indicator is the sender domain mismatch — the link destination is only secondary evidence.' },
  ],
  'challenge-phishing-002': [
    { id: 'hint-phishing-002-1', challengeId: 'challenge-phishing-002', level: 1, content: 'The domain is everything between the "://" and the first single slash "/".' },
    { id: 'hint-phishing-002-2', challengeId: 'challenge-phishing-002', level: 2, content: 'Read the URL from right to left until the first slash. Everything before it is the real domain, and everything before that is a subdomain.' },
  ],
  'challenge-log-001': [
    { id: 'hint-log-001-1', challengeId: 'challenge-log-001', level: 1, content: 'Look for a single IP that is making many rapid failed attempts in a short time.' },
    { id: 'hint-log-001-2', challengeId: 'challenge-log-001', level: 2, content: 'Private IP ranges are 10.x.x.x, 172.16-31.x.x, and 192.168.x.x. The attacker is external.' },
  ],
  'challenge-crypto-001': [
    { id: 'hint-crypto-001-1', challengeId: 'challenge-crypto-001', level: 1, content: 'A Caesar shift of 3 means each letter moves 3 positions back in the alphabet. W → T, K → H, H → E.' },
    { id: 'hint-crypto-001-2', challengeId: 'challenge-crypto-001', level: 2, content: 'Decode the full message: WKH→THE, IODJ→FLAG, LV→IS, F\EHUVHFXUH→???' },
  ],
  'challenge-web-001': [
    { id: 'hint-web-001-1', challengeId: 'challenge-web-001', level: 1, content: 'What does the "q" parameter contain, and where is it rendered?' },
    { id: 'hint-web-001-2', challengeId: 'challenge-web-001', level: 2, content: 'The code inserts user input directly into the HTML response without encoding — this is a classic client-side script injection.' },
  ],
  'challenge-web-002': [
    { id: 'hint-web-002-1', challengeId: 'challenge-web-002', level: 1, content: 'What SQL characters can alter the meaning of the query? Pay attention to the single quotes.' },
    { id: 'hint-web-002-2', challengeId: 'challenge-web-002', level: 2, content: 'The "--" sequence in SQL starts a comment — anything after it is ignored.' },
  ],
  'challenge-osint-001': [
    { id: 'hint-osint-001-1', challengeId: 'challenge-osint-001', level: 1, content: 'Which piece of evidence could NOT be easily faked on a website?' },
    { id: 'hint-osint-001-2', challengeId: 'challenge-osint-001', level: 2, content: 'Stock photos and domain age can both be faked or manipulated. What requires a genuine external record?' },
  ],
  'challenge-investigation-001': [
    { id: 'hint-investigation-001-1', challengeId: 'challenge-investigation-001', level: 1, content: 'What happened BEFORE the VPN login? Timeline matters.' },
    { id: 'hint-investigation-001-2', challengeId: 'challenge-investigation-001', level: 2, content: 'Tom Chen opened an attachment and clicked a link. What do attackers typically use as the delivery method?' },
    { id: 'hint-investigation-001-3', challengeId: 'challenge-investigation-001', level: 3, content: 'The email attachment + link click on Sept 1 is the delivery stage; the VPN login from an external IP on Sept 2 is the result of that initial compromise.' },
  ],
};

export const CHALLENGE_TYPE_META: Record<ChallengeType, { label: string; icon: string; color: string }> = {
  'phishing': { label: 'Phishing', icon: 'Fish', color: 'text-orange-400' },
  'log-analysis': { label: 'Log Analysis', icon: 'ClipboardList', color: 'text-blue-400' },
  'osint': { label: 'OSINT', icon: 'Search', color: 'text-purple-400' },
  'crypto': { label: 'Cryptography', icon: 'KeyRound', color: 'text-yellow-400' },
  'web': { label: 'Web Security', icon: 'Globe', color: 'text-emerald-400' },
  'forensics': { label: 'Forensics', icon: 'FlaskConical', color: 'text-red-400' },
  'network': { label: 'Network', icon: 'Network', color: 'text-cyan-400' },
  'stego': { label: 'Steganography', icon: 'Eye', color: 'text-pink-400' },
  'reverse-engineering': { label: 'Reverse Eng.', icon: 'Wrench', color: 'text-gray-400' },
  'linux': { label: 'Linux', icon: 'Terminal', color: 'text-amber-400' },
  'windows': { label: 'Windows', icon: 'AppWindow', color: 'text-sky-400' },
  'misc': { label: 'Misc', icon: 'Puzzle', color: 'text-lime-400' },
  'secure-coding': { label: 'Secure Coding', icon: 'Code', color: 'text-emerald-300' },
  'investigation': { label: 'Investigation', icon: 'Radar', color: 'text-indigo-400' },
};

export const DIFFICULTY_META: Record<string, { label: string; color: string; points: number }> = {
  'beginner': { label: 'Beginner', color: 'text-green-400 bg-green-400/10 border-green-400/20', points: 50 },
  'easy': { label: 'Easy', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', points: 100 },
  'medium': { label: 'Medium', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', points: 200 },
  'hard': { label: 'Hard', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', points: 350 },
  'expert': { label: 'Expert', color: 'text-red-400 bg-red-400/10 border-red-400/20', points: 500 },
};