// Fictional scam-awareness scenarios. Defensive only: red flags, tactics, safe actions.
export type ScamScenario = {
  id: string;
  slug: string;
  title: string;
  category: string;
  story: string;
  redFlags: { id: string; label: string; explanation: string }[];
  tactics: string[];
  neverShare: string[];
  howToVerify: string[];
  howToReport: string[];
  ifAlreadySent: string[];
  xpReward: number;
};

export const scamScenarios: ScamScenario[] = [
  {
    id: 'scam-job',
    slug: 'fake-job-offer',
    title: 'Fake job offer',
    category: 'Jobs',
    story: 'You get a message: “Work from home, earn $800/week, no experience needed. Just receive packages and reship them.” They ask for your address, ID photo, and bank details to “set up payroll”.',
    redFlags: [
      { id: 'pay-first', label: 'Too good, too easy', explanation: 'High pay for simple reshipping with no interview is a money-mule setup.' },
      { id: 'id-bank', label: 'ID + bank details early', explanation: 'Real payroll happens after a contract, not over chat.' },
      { id: 'off-platform', label: 'Moves off platform fast', explanation: 'Scammers push to private chat to avoid moderation.' },
    ],
    tactics: ['Authority (fake company)', 'Urgency (limited slots)', 'Trust (friendly recruiter)'],
    neverShare: ['ID photos', 'Bank login', 'OTP codes', 'Home address before a verified contract'],
    howToVerify: ['Search the company + “scam”', 'Check the official careers page', 'Call a public company number — never the number they gave you'],
    howToReport: ['Report the account on the platform', 'Save screenshots with dates', 'Tell a trusted person'],
    ifAlreadySent: ['Stop all contact', 'Contact your bank if you shared financial info', 'Watch for identity-theft signs for weeks'],
    xpReward: 40,
  },
  {
    id: 'scam-scholarship',
    slug: 'fake-scholarship',
    title: 'Fake scholarship',
    category: 'Education',
    story: '“You won a scholarship! Pay a $40 registration fee to unlock $2,000.” They send a professional-looking letter with logos and pressure you to pay today.',
    redFlags: [
      { id: 'fee', label: 'Fee to receive money', explanation: 'Real scholarships deduct costs or are free — they never demand upfront payment.' },
      { id: 'unsolicited', label: 'You never applied', explanation: 'You cannot win what you never entered.' },
      { id: 'pressure', label: 'Pay today or lose it', explanation: 'Pressure blocks verification.' },
    ],
    tactics: ['Scarcity (one day only)', 'Authority (logos, titles)', 'Excitement (big prize)'],
    neverShare: ['Card details', 'National ID numbers', 'Bank login'],
    howToVerify: ['Check your school portal', 'Search the exact program name + scam', 'Ask a teacher or counselor'],
    howToReport: ['Report to the platform', 'Report to your school', 'Save the message as evidence'],
    ifAlreadySent: ['Contact your bank/card provider immediately', 'Do not send more money even if they promise a refund', 'Change passwords if you reused them'],
    xpReward: 40,
  },
  {
    id: 'scam-investment',
    slug: 'fake-investment-crypto',
    title: 'Fake investment / crypto doubling',
    category: 'Money',
    story: 'A friendly stranger shows screenshots of huge crypto profits: “Send 0.01 BTC and I will double it in 24 hours. Guaranteed.” They offer a “bonus” if you recruit friends.',
    redFlags: [
      { id: 'guarantee', label: 'Guaranteed returns', explanation: 'All real investing has risk. Guarantees are always fake.' },
      { id: 'double', label: 'Doubling promise', explanation: 'Money cannot double risk-free overnight.' },
      { id: 'recruit', label: 'Recruit friends for bonus', explanation: 'That is a pyramid pattern.' },
    ],
    tactics: ['Greed/curiosity', 'Social proof (fake screenshots)', 'Scarcity (spots limited)'],
    neverShare: ['Wallet seed phrases', 'Exchange passwords', 'ID documents'],
    howToVerify: ['Assume it is fake until proven otherwise', 'Check official regulator warnings', 'Ask someone experienced before sending anything'],
    howToReport: ['Report the account', 'Warn friends who were also contacted', 'Save wallet addresses and messages'],
    ifAlreadySent: ['Stop sending immediately', 'Treat sent crypto as likely unrecoverable — do not pay “recovery fees”', 'Secure your accounts and enable MFA'],
    xpReward: 50,
  },
  {
    id: 'scam-romance',
    slug: 'romance-scam-pattern',
    title: 'Romance scam pattern',
    category: 'Relationships',
    story: 'Someone charming messages daily, falls quickly, avoids video calls, then has an “emergency”: hospital bill, stranded abroad, or a blocked inheritance. They ask for gift cards or transfers — and secrecy.',
    redFlags: [
      { id: 'fast', label: 'Too fast, too intense', explanation: 'Love-bombing builds trust quickly to lower caution.' },
      { id: 'no-meet', label: 'Never meets on video', explanation: 'Excuses for no live calls suggest a fake identity.' },
      { id: 'emergency', label: 'Emergency + secrecy', explanation: 'Real emergencies do not require gift cards or silence.' },
    ],
    tactics: ['Emotional manipulation', 'Isolation (“don’t tell anyone”)', 'Urgency (emergency now)'],
    neverShare: ['Intimate photos', 'Financial details', 'Home/routine details'],
    howToVerify: ['Reverse-image search profile photos', 'Insist on a live video call', 'Talk to a trusted friend about it'],
    howToReport: ['Block and report the profile', 'Save messages as evidence', 'Seek support — this is not your fault'],
    ifAlreadySent: ['Stop sending money', 'Tell a trusted person', 'If images were shared, report for non-consensual sharing risk and get support'],
    xpReward: 50,
  },
  {
    id: 'scam-tech-support',
    slug: 'fake-tech-support',
    title: 'Fake tech support call',
    category: 'Tech support',
    story: 'A caller claims to be “Microsoft support”: your computer has a virus. They ask you to install remote-access software and read out codes from your screen.',
    redFlags: [
      { id: 'cold-call', label: 'Unsolicited support call', explanation: 'Real companies do not call you about viruses out of nowhere.' },
      { id: 'remote', label: 'Remote-access request', explanation: 'That gives them control of your device.' },
      { id: 'codes', label: 'Reads OTP/screen codes', explanation: 'Codes are keys — anyone asking for them is impersonating.' },
    ],
    tactics: ['Authority (big brand)', 'Fear (virus, data loss)', 'Urgency (act now)'],
    neverShare: ['OTP codes', 'Passwords', 'Remote access', 'Card numbers'],
    howToVerify: ['Hang up and contact support via the official app/site yourself', 'Never call back the number they gave you'],
    howToReport: ['Report the number', 'Tell family — these calls target many people', 'Scan your device if you installed anything'],
    ifAlreadySent: ['Disconnect from the internet', 'Uninstall the remote tool', 'Change passwords from a clean device and enable MFA'],
    xpReward: 50,
  },
  {
    id: 'scam-shop',
    slug: 'fake-online-shop',
    title: 'Fake online shop / giveaway',
    category: 'Shopping',
    story: 'An ad sells premium sneakers at 90% off. The site has no reviews, no real address, only card payment, and a countdown timer. A “giveaway” variant asks you to pay “shipping” to claim a free phone.',
    redFlags: [
      { id: 'price', label: 'Impossible discount', explanation: 'Extreme discounts on premium goods signal counterfeits or non-delivery.' },
      { id: 'no-trace', label: 'No verifiable business', explanation: 'No address, no reviews, newly registered domain.' },
      { id: 'shipping-fee', label: 'Fee to claim “free” prize', explanation: 'Free prizes never need your card for shipping via a random link.' },
    ],
    tactics: ['Scarcity (timer)', 'Greed (huge discount)', 'Trust (stolen product photos)'],
    neverShare: ['Card CVV', 'OTP codes', 'ID documents'],
    howToVerify: ['Search shop name + reviews/scam', 'Check domain age and contact details', 'Prefer cash-on-delivery or buyer-protected payments'],
    howToReport: ['Report the ad and site', 'Save order confirmations', 'Dispute via your payment provider if charged'],
    ifAlreadySent: ['Contact your bank about the charge', 'Monitor statements for weeks', 'Do not “verify” by sending more info'],
    xpReward: 40,
  },
];
