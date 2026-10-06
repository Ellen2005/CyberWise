// "Spot the Scam" hotspot game: tap the suspicious parts of real-looking messages.
// Segments without a flagId are innocent — tapping them costs accuracy.

export type SpotSegment = { text: string; flagId?: string };
export type SpotFlag = { id: string; label: string; explanation: string };

export type SpotItem = {
  id: string;
  slug: string;
  title: string;
  kind: string;
  intro: string;
  isScam: boolean;
  segments: SpotSegment[];
  flags: SpotFlag[];
  xpReward: number;
};

export const spotItems: SpotItem[] = [
  {
    id: 'spot-bank-sms',
    slug: 'bank-sms-alert',
    title: 'Bank SMS alert',
    kind: 'SMS',
    intro: 'Tap every part that looks suspicious. If the message looks legitimate, press "Looks legitimate" instead.',
    isScam: true,
    segments: [
      { text: 'From: BANK-ALERTS\n', flagId: 'sender' },
      { text: 'Dear Customer, ', flagId: 'generic' },
      { text: 'your account will be BLOCKED in 2 hours ', flagId: 'urgency' },
      { text: 'unless you confirm here: ', },
      { text: 'http://bank-verify-support.com/login', flagId: 'link' },
    ],
    flags: [
      { id: 'sender', label: 'Sender name', explanation: 'All-caps "BANK-ALERTS" is not how your bank addresses you. Real alerts come from your saved bank sender ID or the app itself.' },
      { id: 'generic', label: '"Dear Customer"', explanation: 'Your bank knows your name. Mass scams cannot personalize.' },
      { id: 'urgency', label: '"BLOCKED in 2 hours"', explanation: 'Two-hour threats exist to stop you checking. Real banks give notice through the app.' },
      { id: 'link', label: 'The link', explanation: 'bank-verify-support.com is not your bank\'s domain, and it uses plain http. Hover or long-press before ever tapping.' },
    ],
    xpReward: 30,
  },
  {
    id: 'spot-real-bank',
    slug: 'real-bank-app-alert',
    title: 'In-app security notice',
    kind: 'Bank app',
    intro: 'Not everything alarming is fake. Read carefully.',
    isScam: false,
    segments: [
      { text: 'Inside your bank app > Notifications:\n' },
      { text: '"New sign-in: Chrome on Windows, Douala, just now. If this was you, no action needed. If not, change your password in the app and call the number on your card."' },
    ],
    flags: [],
    xpReward: 30,
  },
  {
    id: 'spot-job-post',
    slug: 'job-posting-compare',
    title: 'Remote job posting',
    kind: 'Job ad',
    intro: 'A job ad forwarded in a student group. Tap the red flags.',
    isScam: true,
    segments: [
      { text: 'DATA ENTRY — $1,200/month, remote, ', flagId: 'pay' },
      { text: 'NO experience, NO interview. ', flagId: 'nointerview' },
      { text: 'Apply by DM with your full name, ID photo and bank details. ', flagId: 'docs' },
      { text: 'Only 3 slots left!', flagId: 'scarcity' },
    ],
    flags: [
      { id: 'pay', label: 'High pay, remote, easy', explanation: 'Premium pay for simple remote work with no bar to entry is money-mule or fee-scam bait.' },
      { id: 'nointerview', label: 'No interview', explanation: 'No legitimate employer hires without speaking to you.' },
      { id: 'docs', label: 'ID + bank by DM', explanation: 'Documents and bank details over chat enable identity theft before any contract exists.' },
      { id: 'scarcity', label: '"Only 3 slots"', explanation: 'Fake scarcity rushes you past verification.' },
    ],
    xpReward: 30,
  },
  {
    id: 'spot-real-job',
    slug: 'real-job-posting',
    title: 'Internship posting',
    kind: 'Job ad',
    intro: 'Compare with the previous one. Is this one also fake?',
    isScam: false,
    segments: [
      { text: 'From the company\'s verified careers page:\n' },
      { text: '"6-month paid internship, Yaounde (hybrid). Requirements, stipend range, and application DEADLINE listed. Apply via the portal; shortlisted candidates are contacted for a written test and panel interview. We never charge fees."' },
    ],
    flags: [],
    xpReward: 30,
  },
  {
    id: 'spot-uni-mail',
    slug: 'university-it-mail',
    title: 'University IT email',
    kind: 'Email',
    intro: 'An email about your student account. Inspect it.',
    isScam: true,
    segments: [
      { text: 'From: IT Helpdesk <itdesk@univ-student-portal.com>\n', flagId: 'domain' },
      { text: 'Subject: Password expires TODAY\n', flagId: 'subject' },
      { text: 'Dear Student, renew now or lose access to classes and email. ', flagId: 'threat' },
      { text: 'Renew: http://univ-student-portal.com/renew', flagId: 'link' },
    ],
    flags: [
      { id: 'domain', label: 'Wrong domain', explanation: 'Your university uses its own .edu address, not univ-student-portal.com.' },
      { id: 'subject', label: 'Expiry panic', explanation: 'Expiry threats push same-day clicks without verification.' },
      { id: 'threat', label: 'Losing classes', explanation: 'Targeting what students fear most — access to school.' },
      { id: 'link', label: 'Renewal link', explanation: 'Password changes happen inside the official portal, never from an emailed http link.' },
    ],
    xpReward: 30,
  },
  {
    id: 'spot-giveaway',
    slug: 'giveaway-post',
    title: 'Phone giveaway post',
    kind: 'Social media',
    intro: 'A giveaway post doing big numbers. What is off?',
    isScam: true,
    segments: [
      { text: 'iPhone 15 GIVEAWAY Whoever comments "WIN" gets selected! ', flagId: 'mechanic' },
      { text: 'Winners pay 3,000 FCFA delivery ONLY. ', flagId: 'fee' },
      { text: 'Account: 214 followers, created this month. ', flagId: 'account' },
    ],
    flags: [
      { id: 'mechanic', label: 'Comment-to-win', explanation: 'Engagement bait: comments boost the post to more victims.' },
      { id: 'fee', label: 'Delivery fee', explanation: 'Prizes never require winner payments — this is the entire business model of the scam.' },
      { id: 'account', label: 'Tiny new account', explanation: 'Real brands run giveaways from established verified accounts.' },
    ],
    xpReward: 30,
  },
  {
    id: 'spot-delivery',
    slug: 'delivery-fee-sms',
    title: 'Delivery SMS',
    kind: 'SMS',
    intro: 'You did order something last week. Does that make this real?',
    isScam: true,
    segments: [
      { text: 'Your package could not be delivered. ', },
      { text: 'Pay 1,500 FCFA redelivery fee: ', flagId: 'fee' },
      { text: 'dlvry-track-pay.com/940011', flagId: 'link' },
    ],
    flags: [
      { id: 'fee', label: 'Redelivery fee by link', explanation: 'Carriers do not collect small fees through SMS links. Context ("I ordered something") is exactly what the scam borrows.' },
      { id: 'link', label: 'Lookalike domain', explanation: 'dlvry-track-pay.com is not the carrier. Paste tracking numbers into the official site instead.' },
    ],
    xpReward: 30,
  },
  {
    id: 'spot-otp-call',
    slug: 'otp-verification-call',
    title: '"Verification" call',
    kind: 'Phone + SMS',
    intro: 'A call and an SMS arrive together. Read both.',
    isScam: true,
    segments: [
      { text: 'Caller: "This is your bank\'s fraud unit. We blocked a theft attempt. Tell me the code we just sent to confirm YOU are the owner." ', flagId: 'script' },
      { text: 'SMS (real bank sender ID): "Your OTP is 441208. Never share it."', flagId: 'otp' },
    ],
    flags: [
      { id: 'script', label: 'The script', explanation: 'Fear ("theft attempt") + flattery ("confirm YOU are the owner") — the OTP is the actual target.' },
      { id: 'otp', label: 'Real OTP, wrong hands', explanation: 'The SMS is genuinely from your bank — triggered BY the scammer\'s login attempt. Reading it out hands them your account. "Never share it" includes callers claiming to be the bank.' },
    ],
    xpReward: 40,
  },
];
