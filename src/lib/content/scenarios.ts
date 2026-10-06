// Core CyberWise scenario engine content: everyday messaging + social threats.
// Loop: SEE -> THINK -> DECIDE -> CONSEQUENCE -> LEARN -> PROTECT.

export type ScenarioChoice = {
  id: string;
  text: string;
  verdict: 'safe' | 'risky' | 'unsafe';
  consequenceTitle: string;
  consequence: string;
  feedback: string;
};

export type Scenario = {
  id: string;
  slug: string;
  title: string;
  category: string;
  channel: string;
  sender: string;
  message: string;
  contextNotes?: string[];
  thinkPrompt: string;
  choices: ScenarioChoice[];
  redFlags: { label: string; explanation: string }[];
  protect: string[];
  xpReward: number;
};

export const scenarios: Scenario[] = [
  {
    id: 'sc-whatsapp-verify',
    slug: 'whatsapp-verification-scam',
    title: 'WhatsApp account verification',
    category: 'Everyday scams',
    channel: 'WhatsApp',
    sender: '+237 6XX XXX XXX (unknown number)',
    message: 'URGENT! Your WhatsApp account will be SUSPENDED in 24 hours due to unusual activity. Verify your account here now: bit.ly/wapp-verify-9x2',
    contextNotes: ['You did not request anything.', 'The number is not in your contacts.'],
    thinkPrompt: 'Before choosing: who is really sending this, and what do they want you to do in a hurry?',
    choices: [
      {
        id: 'click',
        text: 'Tap the link and enter my number and code',
        verdict: 'unsafe',
        consequenceTitle: 'You entered your number and the 6-digit code.',
        consequence: 'That code was your WhatsApp registration code. The scammer registers YOUR number on THEIR phone. You are logged out everywhere. They message your contacts asking for Mobile Money "emergency help" — as you.',
        feedback: 'Registration codes are keys to the account. WhatsApp never asks for them via links, and shortened links hide the real destination.',
      },
      {
        id: 'reply',
        text: 'Reply and ask if this is really WhatsApp',
        verdict: 'risky',
        consequenceTitle: 'You replied. They answer politely and pressure harder.',
        consequence: '"Yes, this is the verification department. Your case is urgent — verify in the next 10 minutes or lose your chats." Replying told them your number is active and anxious. The pressure continues until you slip.',
        feedback: 'Engaging keeps you in the trap. Scammers are patient; every reply is information.',
      },
      {
        id: 'forward',
        text: 'Forward it to friends to warn them',
        verdict: 'risky',
        consequenceTitle: 'Your friends get the message — with the live link.',
        consequence: 'One friend taps it and loses her account. Warnings that spread the live link do the attacker\'s distribution work for them.',
        feedback: 'Never forward live scam links. Warn with words or a screenshot, never the tappable message.',
      },
      {
        id: 'verify',
        text: 'Ignore it. Open WhatsApp itself and check Settings',
        verdict: 'safe',
        consequenceTitle: 'You open WhatsApp directly. Everything is normal.',
        consequence: 'No alerts, no suspension, account healthy. You block and report the number. Nothing happens — which is exactly the win.',
        feedback: 'Correct. The official app is the source of truth. Report + block protects the next person too.',
      },
    ],
    redFlags: [
      { label: 'Urgency + threat', explanation: '"Suspended in 24 hours" is pressure to stop you thinking.' },
      { label: 'Unknown sender', explanation: 'WhatsApp communicates through the app, not random numbers.' },
      { label: 'Shortened link', explanation: 'bit.ly hides where you really go.' },
      { label: 'Code request setup', explanation: 'Any path ending in "enter the code" hands over the account.' },
    ],
    protect: ['Never share 6-digit registration codes with anyone.', 'Verify through the official app, typed or tapped by you.', 'Block and report, then tell one person about the pattern.'],
    xpReward: 40,
  },
  {
    id: 'sc-momo-reward',
    slug: 'mobile-money-reward-scam',
    title: 'Mobile Money reward',
    category: 'Everyday scams',
    channel: 'SMS',
    sender: 'M0B1LE-M0NEY (spelled with zeros)',
    message: 'Congratulations! You have received 25,000 FCFA Mobile Money reward. Dial *126*9*673211*25000# with your PIN to claim before midnight.',
    thinkPrompt: 'Money you never earned, claimed with your PIN, expiring tonight. What is each of those elements doing?',
    choices: [
      {
        id: 'dial',
        text: 'Dial the code and enter my PIN to claim',
        verdict: 'unsafe',
        consequenceTitle: 'You dialed. The "claim" was a transfer.',
        consequence: 'The USSD code sent money FROM your wallet to the scammer, authorized by YOUR PIN. Mobile Money transfers are instant and effectively irreversible. The 25,000 FCFA never existed.',
        feedback: 'A PIN authorizes movement of YOUR money. No real reward is ever claimed by entering your PIN into a code from a message.',
      },
      {
        id: 'call',
        text: 'Call the number back to confirm',
        verdict: 'risky',
        consequenceTitle: 'A friendly "agent" answers and walks you through it.',
        consequence: 'The agent is the scammer. They guide you to "validate" — which is the same transfer, narrated kindly. Calling back also confirms your line is live for future attempts.',
        feedback: 'Scammers staff their own helplines. Confirm through the official customer-care number you already know, never the one in the message.',
      },
      {
        id: 'balance',
        text: 'Check my MoMo balance in the official app first',
        verdict: 'safe',
        consequenceTitle: 'Balance: unchanged. No reward anywhere.',
        consequence: 'Real rewards appear in your balance or official app notifications. Nothing arrived, so nothing exists. You delete the SMS and report it as spam.',
        feedback: 'Correct. The wallet itself is the source of truth — check it before believing any message about money.',
      },
    ],
    redFlags: [
      { label: 'Unsolicited reward', explanation: 'You cannot win money you never earned or applied for.' },
      { label: 'PIN in the claim path', explanation: 'Your PIN protects YOUR funds. Any claim requiring it is a withdrawal in disguise.' },
      { label: 'Midnight deadline', explanation: 'Expiry pressure blocks the balance check that would expose the lie.' },
      { label: 'Lookalike sender', explanation: 'Zeros instead of the letter O — built to fool a quick glance.' },
    ],
    protect: ['Your PIN authorizes YOUR payments only — never enter it to "receive".', 'Check the official app balance before acting on money messages.', 'Report spam SMS to your operator.'],
    xpReward: 40,
  },
  {
    id: 'sc-mtn-support',
    slug: 'mtn-support-pin-request',
    title: '"MTN support" needs your PIN',
    category: 'Everyday scams',
    channel: 'Phone call',
    sender: 'Caller claiming to be MTN customer care',
    message: '"Hello, this is MTN support. We are migrating the network and your line will be blocked. Please confirm the code we just sent you so we can whitelist your SIM." A 4-digit code arrives by SMS as he speaks.',
    thinkPrompt: 'He called you, he creates the emergency, and the solution is a code from your phone. Whose problem is he actually solving?',
    choices: [
      {
        id: 'give',
        text: 'Read out the code so my line stays active',
        verdict: 'unsafe',
        consequenceTitle: 'You read the code. The call goes quiet, then dead.',
        consequence: 'That code authorized a SIM swap / wallet reset. Within the hour your line stops working and your Mobile Money is drained. The "support agent" was never support.',
        feedback: 'No real operator needs codes from your screen. Anyone who asks is impersonating — hang up.',
      },
      {
        id: 'hangup-verify',
        text: 'Hang up and call the official MTN care number myself',
        verdict: 'safe',
        consequenceTitle: 'Official care: "There is no migration, your line is fine."',
        consequence: 'Five minutes on the real helpline confirms it was fiction. The scammer number gets reported and blocked.',
        feedback: 'Correct. Hang up, then verify through a channel YOU choose. The few minutes feel slow — that is the point.',
      },
      {
        id: 'argue',
        text: 'Stay on the line and argue with him',
        verdict: 'risky',
        consequenceTitle: 'He stays calm and keeps new reasons coming.',
        consequence: 'Twenty minutes later you are tired, and "just to prove the line works, enter..." — exhaustion is part of the script. Professionals keep you talking until you comply.',
        feedback: 'Do not debate scammers. Every minute on the line is a minute they can wear you down. Hang up.',
      },
    ],
    redFlags: [
      { label: 'Unsolicited support call', explanation: 'Operators do not call about migrations and demand codes.' },
      { label: 'Code from YOUR phone', explanation: 'Codes sent to you authenticate YOU. Reading them out transfers that power.' },
      { label: 'Blocking threat', explanation: 'Fear of losing your line overrides caution — by design.' },
    ],
    protect: ['Hang up on unsolicited "support" calls.', 'Call back only on official numbers you already know.', 'Never read out codes, PINs, or OTPs to anyone.'],
    xpReward: 40,
  },
  {
    id: 'sc-apk-data',
    slug: 'free-data-apk',
    title: 'Free data app from a friend',
    category: 'Malware',
    channel: 'WhatsApp (friend\'s account)',
    sender: 'Your friend (or someone on their account)',
    message: 'Bro install this app, it gives free MTN data every week. I don chop my own. [FreeData.apk, 8MB]',
    thinkPrompt: 'Free data, outside the Play Store, from a friend who may not be your friend. What needs checking before installing anything?',
    choices: [
      {
        id: 'install',
        text: 'Install it — my friend would not harm me',
        verdict: 'unsafe',
        consequenceTitle: 'Installed. It asks for SMS + contacts permission "to activate".',
        consequence: 'It is spyware. It reads your OTP SMS messages (bye-bye MoMo and bank codes), uploads your contacts, and forwards itself to everyone you know — as you. Your friend\'s account was hacked; that is why "he" sent it.',
        feedback: 'APKs outside official stores bypass all safety screening. "Free" apps that demand SMS access are harvesting OTPs.',
      },
      {
        id: 'forward',
        text: 'Forward it to the group so everyone benefits',
        verdict: 'unsafe',
        consequenceTitle: 'Twelve people install it within the hour.',
        consequence: 'You just became the distribution channel. The malware thanks you by texting itself from every infected phone — including yours.',
        feedback: 'Forwarding unverified APKs multiplies harm. One install is a victim; forwarding is an outbreak.',
      },
      {
        id: 'verify',
        text: 'Ask my friend on a call, and check the Play Store first',
        verdict: 'safe',
        consequenceTitle: 'On the call, your friend is confused — he sent nothing.',
        consequence: 'His account was hacked last night. No such app exists on the Play Store. You warn the group with WORDS, he recovers his account, nobody installs anything.',
        feedback: 'Correct. Verify the sender on another channel, and only install from official stores. Two checks, thirty seconds, total protection.',
      },
    ],
    redFlags: [
      { label: 'APK outside the store', explanation: 'Sideloaded apps skip malware screening entirely.' },
      { label: 'Too-good freebie', explanation: '"Free data weekly" is bait priced to travel fast.' },
      { label: 'Permission grab', explanation: 'SMS + contacts access on a data app has one purpose: OTP theft and spreading.' },
      { label: 'Possibly hacked sender', explanation: 'Trusted accounts get hijacked precisely to send malware.' },
    ],
    protect: ['Install apps only from the Play Store / App Store.', 'Deny SMS and contacts permissions to apps that do not need them.', 'Verify surprising messages from friends on a different channel.'],
    xpReward: 50,
  },
  {
    id: 'sc-friend-emergency',
    slug: 'friend-emergency-money',
    title: '"Friend" needs emergency money',
    category: 'Social engineering',
    channel: 'WhatsApp',
    sender: 'Childhood friend (new number: "I lost my phone")',
    message: 'Bro please I dey for hospital with mama, bill na 50k and dem no go treat am. Abeg send 20k MoMo to this number, I go refund you tomorrow morning. No tell anyone, I shame.',
    thinkPrompt: 'Real emergency or scripted emergency? Which details can you verify without sending money?',
    choices: [
      {
        id: 'send',
        text: 'Send the 20k immediately — family emergency first',
        verdict: 'unsafe',
        consequenceTitle: 'Sent. "Thank you bro, refund tomorrow." Tomorrow never comes.',
        consequence: 'The number goes silent. Your real friend, reached the next day, knows nothing about any hospital. The story — hospital, shame, secrecy, deadline — was assembled to make verification feel rude.',
        feedback: 'Urgency plus secrecy is the emergency-scam fingerprint. Real emergencies survive a 2-minute verification call.',
      },
      {
        id: 'call',
        text: 'Call his old number and ask family before sending anything',
        verdict: 'safe',
        consequenceTitle: 'His old number picks up. He is at home, healthy.',
        consequence: 'His old account was hacked months ago and lay dormant. You report the new number, warn mutual friends, and zero francs move.',
        feedback: 'Correct. Verify on a channel the scammer does not control. Money can wait two minutes; scams cannot survive them.',
      },
      {
        id: 'half',
        text: 'Send half now to help, verify later',
        verdict: 'risky',
        consequenceTitle: 'You send 10k "to show good faith".',
        consequence: 'Then comes the second act: "the hospital says 10k no reach, complete am." Partial payment proves you pay — it never proves the story.',
        feedback: 'Half a scam is still a scam. Verification comes BEFORE any amount, not after.',
      },
    ],
    redFlags: [
      { label: 'New number + lost phone story', explanation: 'Classic setup to explain why you cannot reach the "real" them.' },
      { label: 'Secrecy request', explanation: '"No tell anyone" removes the one person who would spot the lie.' },
      { label: 'Refund promise', explanation: 'Tomorrow\'s refund costs the scammer nothing today.' },
    ],
    protect: ['Verify emergencies on a known channel before sending money.', 'Treat secrecy requests as a red flag, not a confidence.', 'If a friend is hacked, help them recover — do not pay the hacker.'],
    xpReward: 40,
  },
  {
    id: 'sc-fb-login',
    slug: 'facebook-login-alert',
    title: 'Facebook login warning',
    category: 'Account security',
    channel: 'SMS + link',
    sender: 'Faceb00k Security (SMS)',
    message: 'Your Facebook account was logged into from Douala on a new device. If this was NOT you, secure your account now: faceb00k-secure.com/login',
    thinkPrompt: 'The alert feels real because logins DO get flagged. What separates this message from a real one?',
    choices: [
      {
        id: 'login-link',
        text: 'Open the link and log in to secure my account',
        verdict: 'unsafe',
        consequenceTitle: 'The page looks exactly like Facebook. You log in.',
        consequence: 'It was a pixel-perfect fake on faceb00k-secure.com. Your password and session now belong to someone else, who locks you out and runs scams on your friends within the hour.',
        feedback: 'Lookalike domains (faceb00k with zeros) plus a login form equals credential harvest. Always navigate to the app yourself.',
      },
      {
        id: 'app-check',
        text: 'Open the Facebook app myself and check active sessions',
        verdict: 'safe',
        consequenceTitle: 'Settings > Security: only your own devices. No Douala login.',
        consequence: 'There was no login at all — the SMS invented it. You enable two-factor authentication while you are there, and report the SMS.',
        feedback: 'Correct. The app\'s session list is ground truth. A two-minute check beats any link.',
      },
      {
        id: 'ignore-all',
        text: 'Ignore it completely and change nothing',
        verdict: 'risky',
        consequenceTitle: 'This time it was fake. Nothing happens.',
        consequence: 'But ignoring ALL such alerts is dangerous too — one day a real one arrives and you will scroll past it. The safe habit is verify-in-app, not ignore-forever.',
        feedback: 'Ignoring worked by luck. Build the verify-in-app habit so real alerts get caught too.',
      },
    ],
    redFlags: [
      { label: 'Lookalike domain', explanation: 'faceb00k-secure.com is not facebook.com — zeros for letter O.' },
      { label: 'Invented incident', explanation: 'The "Douala login" never happened; specifics make lies believable.' },
      { label: 'Login via link', explanation: 'Real platforms say "open your app", never "log in here".' },
    ],
    protect: ['Type facebook.com yourself or use the app — never the link.', 'Check active sessions and turn on two-factor authentication.', 'Treat every login alert as "verify", never as "click".'],
    xpReward: 50,
  },
  {
    id: 'sc-wifi-twin',
    slug: 'cafe-wifi-twin',
    title: 'Cafe Wi-Fi that wants your login',
    category: 'Safe browsing',
    channel: 'In person (cafe)',
    sender: 'Network list: "CAFE_FREE_WIFI_FAST" (open, strong signal)',
    message: 'You join. A login page opens: "Welcome! Log in with your Google or Facebook account to enjoy free Wi-Fi." The cafe\'s real Wi-Fi name, written on the wall, is "Cafe_Noura_2024" (locked, password on receipt).',
    thinkPrompt: 'Two networks, one asking for your social login. What does a Wi-Fi hotspot legitimately need from you?',
    choices: [
      {
        id: 'google-login',
        text: 'Log in with Google — I need internet now',
        verdict: 'unsafe',
        consequenceTitle: 'The page accepts anything and connects you.',
        consequence: 'It was an evil-twin hotspot run from a laptop in the corner. Your Google credentials went straight to it, and all your traffic now flows through the attacker. "It worked" is exactly how the trap feels.',
        feedback: 'Wi-Fi portals never need your Google or Facebook password. A login form on a hotspot is credential harvest with free internet as bait.',
      },
      {
        id: 'ask-staff',
        text: 'Ask staff for the real network and use mobile data meanwhile',
        verdict: 'safe',
        consequenceTitle: 'Staff point at the wall: the locked one with the receipt password.',
        consequence: 'You join the real network, and the fake portal never sees you. The owner thanks you and unplugs... well, reports the rogue hotspot.',
        feedback: 'Correct. Staff know their network name. When in doubt, mobile data beats mystery Wi-Fi.',
      },
      {
        id: 'bank-quick',
        text: 'Connect to the open one but only do "one quick bank check"',
        verdict: 'risky',
        consequenceTitle: 'Bank page loads fine. All good?',
        consequence: 'Maybe — or maybe your session was sniffed on an unencrypted, attacker-run network. Banking on unknown Wi-Fi gambles the account that holds your money.',
        feedback: 'Never bank on unverified public Wi-Fi. Wait for mobile data or a VPN on a trusted network.',
      },
    ],
    redFlags: [
      { label: 'Social login for Wi-Fi', explanation: 'Hotspots need at most a voucher code — never your Google/Facebook password.' },
      { label: 'Name mismatch', explanation: 'The real network is on the wall; the tempting one is not.' },
      { label: 'Open + strongest signal', explanation: 'Attackers broadcast loud, open networks to attract connections.' },
    ],
    protect: ['Confirm hotspot names with staff.', 'Never enter real passwords into captive portals.', 'Use mobile data for banking; keep your OS and apps updated.'],
    xpReward: 40,
  },
];
