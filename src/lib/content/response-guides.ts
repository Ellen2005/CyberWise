// Defensive response guides: stop, preserve, secure, report, get help.
export type ResponseGuide = {
  id: string;
  slug: string;
  title: string;
  whenToUse: string;
  steps: { title: string; detail: string }[];
};

export const responseGuides: ResponseGuide[] = [
  {
    id: 'rg-clicked-link',
    slug: 'clicked-suspicious-link',
    title: 'I clicked a suspicious link',
    whenToUse: 'You tapped a link and now worry it was phishing.',
    steps: [
      { title: 'Stop', detail: 'Close the page. Do not enter any info or download anything.' },
      { title: 'Do not log in again there', detail: 'If you already typed a password, treat it as exposed.' },
      { title: 'Preserve evidence', detail: 'Screenshot the message, sender, link, and time. Do not delete it yet.' },
      { title: 'Secure accounts', detail: 'From the official app/site (typed by you), change the password and enable MFA.' },
      { title: 'Check activity', detail: 'Review recent logins, messages sent, and connected devices.' },
      { title: 'Report', detail: 'Report the message on the platform (phishing/spam) and warn anyone you may have forwarded it to.' },
      { title: 'Tell someone', detail: 'If it was a work/school account, tell IT or your teacher quickly — speed helps.' },
    ],
  },
  {
    id: 'rg-gave-password',
    slug: 'gave-away-password-or-otp',
    title: 'I gave someone my password or OTP',
    whenToUse: 'You shared a password, code, or approved a login you should not have.',
    steps: [
      { title: 'Stop contact', detail: 'Do not send anything else, even if they threaten you.' },
      { title: 'Change it now', detail: 'From the official app/site, change the password immediately. Never reuse the old one.' },
      { title: 'Enable MFA', detail: 'Use an authenticator app where possible. Save backup codes offline.' },
      { title: 'Sign out everywhere', detail: 'Use “sign out of all devices” if the service offers it.' },
      { title: 'Check for changes', detail: 'Look for changed email, phone, forwarding rules, or new devices.' },
      { title: 'Report', detail: 'Report the account that tricked you. If work/school, notify IT.' },
    ],
  },
  {
    id: 'rg-sent-money',
    slug: 'sent-money-to-scammer',
    title: 'I sent money',
    whenToUse: 'You paid, transferred, or sent gift-card codes to a possible scammer.',
    steps: [
      { title: 'Stop sending', detail: 'Do not send more, even for promised refunds or “recovery fees”.' },
      { title: 'Preserve evidence', detail: 'Save receipts, addresses, messages, dates, and amounts.' },
      { title: 'Contact your provider', detail: 'Bank, card issuer, or transfer service — ask about dispute options quickly.' },
      { title: 'Report', detail: 'Report the account/ad. Reporting helps protect others.' },
      { title: 'Protect accounts', detail: 'If you shared financial details, ask your provider about next steps.' },
      { title: 'Get support', detail: 'Tell a trusted person. Money scams carry shame — support helps you act clearly.' },
    ],
  },
  {
    id: 'rg-hacked',
    slug: 'account-hacked',
    title: 'My account was hacked',
    whenToUse: 'You are locked out, see posts you did not make, or get reset emails you did not request.',
    steps: [
      { title: 'Try official recovery', detail: 'Use the service’s official “forgot password / hacked account” flow only.' },
      { title: 'Secure your email first', detail: 'Your email unlocks everything else — secure it before other accounts.' },
      { title: 'Enable MFA everywhere important', detail: 'Email, bank, social, school/work accounts.' },
      { title: 'Warn contacts', detail: 'Tell friends not to trust strange messages “from you” during the incident.' },
      { title: 'Review and clean', detail: 'Remove unknown devices, apps, forwarding rules, and connected logins.' },
      { title: 'Report the impersonation', detail: 'Report fake accounts using your name/photos.' },
    ],
  },
  {
    id: 'rg-harassed',
    slug: 'being-harassed-or-bullied',
    title: 'Someone is harassing me',
    whenToUse: 'Repeated abusive messages, threats, humiliation, impersonation, or rumor-spreading.',
    steps: [
      { title: 'Do not retaliate', detail: 'Do not reply angrily — it often escalates and can be used against you.' },
      { title: 'Save evidence', detail: 'Screenshots with names, dates, URLs. Back them up. Do not edit them.' },
      { title: 'Block and restrict', detail: 'Block accounts. Tighten profile privacy and friend/follower lists.' },
      { title: 'Report', detail: 'Report to the platform (harassment/bullying). Report threats that feel serious to a trusted adult or authority.' },
      { title: 'Tell someone you trust', detail: 'A parent, teacher, friend, counselor — you do not have to handle this alone.' },
      { title: 'Get support', detail: 'If you feel unsafe or overwhelmed, reach out to a local support person or helpline you trust.' },
    ],
  },
  {
    id: 'rg-info-exposed',
    slug: 'personal-info-exposed',
    title: 'My personal information was exposed',
    whenToUse: 'Address, photos, ID, location, or private details shared without consent (including doxxing risk).',
    steps: [
      { title: 'Document it', detail: 'Save links, screenshots, and where it was posted.' },
      { title: 'Request removal', detail: 'Use the platform’s privacy/report tools to request takedown.' },
      { title: 'Tighten privacy', detail: 'Make accounts private, remove location tags, review followers and old posts.' },
      { title: 'Watch for misuse', detail: 'Be alert for impersonation or phishing using the exposed details.' },
      { title: 'Tell someone', detail: 'A trusted adult, school, or workplace contact can help with removal and safety planning.' },
    ],
  },
  {
    id: 'rg-download',
    slug: 'downloaded-suspicious-file',
    title: 'I downloaded a suspicious file',
    whenToUse: 'You opened or downloaded an attachment, app, or “free” file you now distrust.',
    steps: [
      { title: 'Do not open it again', detail: 'If unopened, delete it. If opened, disconnect from the internet.' },
      { title: 'Update and scan', detail: 'Update your OS, then run a scan with built-in or reputable security software.' },
      { title: 'Change key passwords', detail: 'From a clean device, change email/bank passwords and enable MFA.' },
      { title: 'Back up what matters', detail: 'Back up photos/documents to a trusted location before any reset.' },
      { title: 'Get help if odd behavior continues', detail: 'Pop-ups, battery drain, unknown apps — ask a knowledgeable person or official support.' },
    ],
  },
  {
    id: 'rg-lost-device',
    slug: 'lost-or-stolen-phone',
    title: 'My phone was lost or stolen',
    whenToUse: 'Your device is gone and it holds your accounts, photos, money apps, and messages.',
    steps: [
      { title: 'Act fast, stay calm', detail: 'A prepared sequence beats panic. Work through these in order.' },
      { title: 'Lock and locate remotely', detail: 'From another device, use Google Find My Device (Android) or iCloud Find (iPhone) to ring, lock, or erase. Do this before anything else.' },
      { title: 'Block the SIM and mobile money', detail: 'Call your operator to block the SIM (stops OTP interception and SIM abuse) and freeze mobile-money/bank access via their helpline.' },
      { title: 'Sign out sessions remotely', detail: 'From a computer, sign out of email, WhatsApp companion devices, Facebook, and banking sessions.' },
      { title: 'Change key passwords', detail: 'Email first, then money and social accounts — from a trusted device.' },
      { title: 'Warn your circle', detail: 'Tell family and close contacts your number may be misused for scams "from you".' },
      { title: 'Report if stolen', detail: 'Report theft to local authorities with the IMEI (dial *#06# on any phone to learn how it looks — keep yours written down separately).' },
      { title: 'Prevent next time', detail: 'Screen lock + biometrics always on, automatic backups on, and know where Find My Device lives before you need it.' },
    ],
  },
  {
    id: 'rg-infected',
    slug: 'device-might-be-infected',
    title: 'I think my device is infected',
    whenToUse: 'Pop-ups, slowness, unknown apps, settings changed, or accounts acting strangely.',
    steps: [
      { title: 'Disconnect', detail: 'Turn off Wi-Fi/data to limit further harm.' },
      { title: 'Update + scan', detail: 'Install OS updates, then run a full scan.' },
      { title: 'Remove unknowns', detail: 'Uninstall apps/extensions you do not recognize.' },
      { title: 'Secure accounts', detail: 'Change important passwords from a different clean device if possible.' },
      { title: 'Back up + reset if needed', detail: 'If problems persist, back up files and consider a factory reset via official instructions.' },
    ],
  },
];
