// "What Would You Do?" decision scenarios.
export type WWYDChoice = {
  id: string;
  text: string;
  verdict: 'safe' | 'risky' | 'unsafe';
  feedback: string;
};

export type WWYDScenario = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  situation: string;
  choices: WWYDChoice[];
  nextSteps: string[];
  xpReward: number;
};

export const wwydScenarios: WWYDScenario[] = [
  {
    id: 'wwyd-bank-whatsapp',
    slug: 'bank-message-on-whatsapp',
    title: '“Your bank” messages on WhatsApp',
    topic: 'Phishing',
    situation: 'You get a WhatsApp message: “Hello, this is your bank. Suspicious activity detected. Confirm your account now via this link or it will be closed.”',
    choices: [
      { id: 'a', text: 'Tap the link and log in quickly before the account closes', verdict: 'unsafe', feedback: 'Banks do not secure accounts via WhatsApp links. You would hand credentials to an impersonator.' },
      { id: 'b', text: 'Reply asking them to prove they are the bank', verdict: 'risky', feedback: 'Replying confirms your number is active. Scammers will keep pressuring you.' },
      { id: 'c', text: 'Ignore it, open your bank app yourself, and report/block the sender', verdict: 'safe', feedback: 'Correct. Independent verification plus report/block breaks the attack and protects others.' },
    ],
    nextSteps: ['Check your bank app directly', 'Block and report the number', 'Never share OTPs with anyone'],
    xpReward: 30,
  },
  {
    id: 'wwyd-otp-friend',
    slug: 'friend-asks-for-otp',
    title: 'A “friend” urgently needs your OTP',
    topic: 'Social engineering',
    situation: 'A friend’s account messages you: “Please send me the code you just received — I used your number by mistake and I’m locked out!”',
    choices: [
      { id: 'a', text: 'Send the code — they sound desperate', verdict: 'unsafe', feedback: 'That code likely authorizes access to YOUR account. The “friend” account may be hacked.' },
      { id: 'b', text: 'Call your friend on a different channel to verify first', verdict: 'safe', feedback: 'Correct. Out-of-band verification exposes impersonation. Never forward codes.' },
      { id: 'c', text: 'Screenshot the code and post it in a group to ask if it is safe', verdict: 'risky', feedback: 'Sharing codes anywhere exposes them. Verify privately instead.' },
    ],
    nextSteps: ['Never share OTPs', 'Verify identity on another channel', 'If the friend is hacked, tell them to recover their account'],
    xpReward: 30,
  },
  {
    id: 'wwyd-job-telegram',
    slug: 'instant-job-on-telegram',
    title: 'Instant job on Telegram',
    topic: 'Scams',
    situation: 'Stranger on Telegram: “Remote task job, $50/day. Just pay a $20 starter fee for training materials and you begin today.”',
    choices: [
      { id: 'a', text: 'Pay the $20 — small risk for a job', verdict: 'unsafe', feedback: 'Starter/training fees for simple remote work are a classic job-scam pattern.' },
      { id: 'b', text: 'Ask for a contract, company site, and time to verify', verdict: 'safe', feedback: 'Correct. Real employers tolerate verification; scammers pressure you not to.' },
      { id: 'c', text: 'Send your ID first to “speed things up”, then decide on payment', verdict: 'unsafe', feedback: 'ID + payment is identity theft plus financial loss.' },
    ],
    nextSteps: ['Search company + scam', 'Never pay to get hired', 'Report the account'],
    xpReward: 30,
  },
  {
    id: 'wwyd-bully-group',
    slug: 'friend-mocked-in-group',
    title: 'A friend is mocked in a group chat',
    topic: 'Cyberbullying',
    situation: 'In a class group chat, several people mock a friend’s photo with cruel jokes. The friend goes silent. Others urge you to join in.',
    choices: [
      { id: 'a', text: 'Join the jokes so you are not targeted too', verdict: 'unsafe', feedback: 'Joining harms the victim and makes you part of the abuse. Silence + private support is safer.' },
      { id: 'b', text: 'Privately check on your friend, save evidence, and report the abuse', verdict: 'safe', feedback: 'Correct. Private support, evidence, and reporting protect without escalating publicly.' },
      { id: 'c', text: 'Publicly insult the bullies back', verdict: 'risky', feedback: 'Retaliation often escalates and can get you punished too. Report instead.' },
    ],
    nextSteps: ['Message your friend privately', 'Save screenshots with dates', 'Report to the platform / trusted adult'],
    xpReward: 30,
  },
  {
    id: 'wwyd-qr-restaurant',
    slug: 'qr-code-sticker-swap',
    title: 'QR code looks tampered',
    topic: 'Safe browsing',
    situation: 'At a café, the table QR menu has a sticker placed over the original code. It looks slightly crooked.',
    choices: [
      { id: 'a', text: 'Scan it anyway — QR codes are always safe', verdict: 'unsafe', feedback: 'Stickers over QR codes are a real quishing (QR phishing) trick leading to fake payment/login pages.' },
      { id: 'b', text: 'Ask staff for the real menu/link and inspect the URL preview before opening', verdict: 'safe', feedback: 'Correct. Verify the source and preview the destination. Do not enter credentials from a random QR.' },
      { id: 'c', text: 'Scan with airplane mode on so it “cannot harm you”', verdict: 'risky', feedback: 'Offline does not make a malicious link safe once you reconnect and enter data.' },
    ],
    nextSteps: ['Verify with staff', 'Preview URLs before opening', 'Type payment addresses yourself'],
    xpReward: 30,
  },
  {
    id: 'wwyd-wifi-airport',
    slug: 'free-airport-wifi',
    title: 'Free airport Wi-Fi asks for login',
    topic: 'Public Wi-Fi',
    situation: 'Airport Wi-Fi “FREE_FAST_WIFI” asks you to log in with your email + social password to connect.',
    choices: [
      { id: 'a', text: 'Enter your social password — you need internet', verdict: 'unsafe', feedback: 'Captive portals never need your social password. That is credential harvesting (evil-twin hotspot).' },
      { id: 'b', text: 'Use mobile data or confirm the official network name with staff; avoid logging into sensitive accounts', verdict: 'safe', feedback: 'Correct. Verify the network and avoid sensitive logins on public Wi-Fi. A VPN helps if you must use it.' },
      { id: 'c', text: 'Connect but only “quickly check your bank”', verdict: 'risky', feedback: 'Banking on unverified public Wi-Fi exposes session data. Wait for a trusted connection.' },
    ],
    nextSteps: ['Verify hotspot names with staff', 'Avoid banking on public Wi-Fi', 'Keep OS/VPN updated'],
    xpReward: 30,
  },
];
