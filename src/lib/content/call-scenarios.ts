// Scam-call simulator scripts. Each scenario defines the scammer's opening,
// pressure escalations for the scripted (offline) mode, and what the
// evaluation looks for. Fictional training only — learners are told to
// NEVER use real codes, PINs, or personal details in the simulator.

export type CallLine = { text: string; tactic: string };

export type CallScenario = {
  id: string;
  slug: string;
  title: string;
  caller: string;
  context: string;
  opening: string;
  // Scripted-mode replies, chosen by keyword matching (offline fallback).
  script: { match: string[]; reply: string; tactic: string }[];
  fallbackReply: string;
  maxTurns: number;
  xpReward: number;
  // What the debrief must cover.
  debrief: {
    goal: string;
    neverDo: string[];
    alwaysDo: string[];
  };
  // Phrases that mean the learner gave something away (offline rubric).
  dangerSignals: string[];
  // Phrases that mean the learner defended well (offline rubric).
  defenseSignals: string[];
};

export const callScenarios: CallScenario[] = [
  {
    id: 'call-mtn-migration',
    slug: 'mtn-migration-call',
    title: '“MTN migration” PIN call',
    caller: '+237 6XX XXX XXX — claims MTN support',
    context: 'An unsolicited caller says the network is migrating and your line will be blocked unless you confirm a code.',
    opening: 'Hello, am I speaking with the owner of this line? This is MTN technical support. We are migrating the network tonight, and lines that are not whitelisted will be blocked. I just sent a code to your phone — please read it to me so I can whitelist you.',
    script: [
      {
        match: ['no', 'will not', 'never', 'hang', 'scam', 'fake', 'bye', 'non', 'jamais', 'raccroch'],
        reply: 'Wait, wait — do not hang up, your line will be cut tonight! Just the code, it takes ten seconds. Are you refusing help from your own operator?',
        tactic: 'Fear + guilt when you resist',
      },
      {
        match: ['code', 'otp', 'pin', 'number is', 'my code'],
        reply: 'Yes, exactly — read the full code now, slowly. After that I also need the PIN you use for Mobile Money so I can link the whitelist to your wallet.',
        tactic: 'Escalation: code first, then the PIN',
      },
      {
        match: ['prove', 'verify', 'office', 'shop', 'store', 'official', 'call back', 'rappeler', 'preuve'],
        reply: 'Our offices are closed for the migration, that is why we call directly. There is no time to visit — the cutoff is in twenty minutes. The code, please.',
        tactic: 'Blocking every verification path with urgency',
      },
      {
        match: ['yes', 'okay', 'ok', 'fine', 'd’accord', 'oui'],
        reply: 'Good, good. Read the code now. And keep this between us — do not tell anyone, it is a confidential technical operation.',
        tactic: 'Secrecy request once you comply',
      },
    ],
    fallbackReply: 'I understand. But your line will still be blocked tonight without the code. Please read it to me now.',
    maxTurns: 8,
    xpReward: 50,
    debrief: {
      goal: 'Recognize unsolicited support calls and refuse codes without engaging.',
      neverDo: ['Read out codes, PINs, or OTPs to any caller', 'Stay on the line debating', 'Call back numbers from the conversation'],
      alwaysDo: ['Hang up on unsolicited support calls', 'Call the official number you already know', 'Report the number'],
    },
    dangerSignals: ['my code is', 'my pin is', 'my otp is', 'code is', 'pin is', 'here is my', 'my password is'],
    defenseSignals: ['hang up', 'raccroch', 'will call back', 'rappeler', 'official', 'officiel', 'verify', 'vérifier', 'prove', 'scam', 'arnaque', 'never share', 'jamais'],
  },
  {
    id: 'call-bank-fraud',
    slug: 'bank-fraud-unit-call',
    title: '“Bank fraud unit” OTP call',
    caller: 'Unknown — claims your bank’s fraud department',
    context: 'A caller says a theft was just attempted on your account and needs the OTP that just arrived to "confirm you are the owner".',
    opening: 'Good day, this is the fraud unit of your bank. We have just blocked a theft attempt of 200,000 francs on your account. To confirm you are the real owner, please tell me the 6-digit code we have just sent to your phone.',
    script: [
      {
        match: ['no', 'will not', 'never', 'hang', 'scam', 'fake', 'bye', 'non', 'jamais', 'raccroch'],
        reply: 'Sir, madam — if you hang up, the thieves keep trying and we cannot protect the account. The code only, nothing else. Thirty seconds.',
        tactic: 'Fear of loss when you resist',
      },
      {
        match: ['code', 'otp', 'number is', 'my code'],
        reply: 'Perfect, read it slowly. And for the file, confirm the phone number linked to the account so I release the block.',
        tactic: 'Escalation: harvesting more after the code',
      },
      {
        match: ['prove', 'verify', 'branch', 'office', 'official', 'call back', 'preuve', 'agence'],
        reply: 'The branch cannot see fraud-unit cases — only we can. And the thieves will not wait for office hours. Give me the code now.',
        tactic: 'Isolating you from real verification channels',
      },
      {
        match: ['yes', 'okay', 'ok', 'fine', 'oui'],
        reply: 'Quickly then, the code. And do not mention this call to anyone — fraud investigations are confidential.',
        tactic: 'Secrecy to prevent you checking with anyone',
      },
    ],
    fallbackReply: 'The thieves are still trying as we speak. The code, please — then your money is safe.',
    maxTurns: 8,
    xpReward: 50,
    debrief: {
      goal: 'Understand that real banks never ask for OTPs — anyone who does is the thief.',
      neverDo: ['Read OTPs to callers, including "the bank"', 'Confirm account details to strangers', 'Act on fear without verifying'],
      alwaysDo: ['Hang up and call the number on your card', 'Check recent activity in the official app', 'Enable transaction alerts'],
    },
    dangerSignals: ['my code is', 'my otp is', 'code is', 'here is my', 'my password is', 'my number is'],
    defenseSignals: ['hang up', 'raccroch', 'will call back', 'rappeler', 'official', 'officiel', 'verify', 'vérifier', 'prove', 'scam', 'arnaque', 'never share', 'jamais', 'my bank'],
  },
  {
    id: 'call-relative-accident',
    slug: 'relative-accident-call',
    title: 'Relative in an accident',
    caller: 'Unknown number — claims to be with your injured relative',
    context: 'A stranger says your brother had an accident and needs hospital money immediately, and begs you not to call your mother.',
    opening: 'Hello? Please, your brother just had a bike accident, he is at the clinic with me. They will not treat him without 75,000 francs NOW. Send mobile money to this number quickly — and please do not call your mother, she will panic.',
    script: [
      {
        match: ['no', 'will not', 'scam', 'fake', 'non', 'jamais'], reply: 'How can you say no?! A life is at stake! Every minute you argue is blood lost! Send it NOW!', tactic: 'Moral pressure and manufactured guilt',
      },
      {
        match: ['code', 'verify', 'call him', 'his number', 'video', 'family', 'vérifier', 'appeler'],
        reply: 'His phone is broken — that is why I call from mine! There is no time for checks, the doctor is waiting!',
        tactic: 'Removing every verification option with urgency',
      },
      {
        match: ['yes', 'okay', 'ok', 'sending', 'oui', 'envoie'],
        reply: 'Hurry, send to this same number. And remember — not a word to your mother, promise me.',
        tactic: 'Secrecy to keep the lie alive',
      },
    ],
    fallbackReply: 'Please — the clinic is waiting. Will you let him suffer over a phone call?',
    maxTurns: 8,
    xpReward: 50,
    debrief: {
      goal: 'Verify emergencies on known channels before any money moves.',
      neverDo: ['Send money on a stranger’s urgency', 'Accept secrecy around emergencies', 'Trust a voice or story alone'],
      alwaysDo: ['Call the relative on their known number', 'Ask family through another channel', 'Agree on a family code word in advance'],
    },
    dangerSignals: ['my pin is', 'my code is', 'here is my', 'my password is'],
    defenseSignals: ['hang up', 'raccroch', 'will call', 'call him', 'call back', 'rappeler', 'verify', 'vérifier', 'code word', 'mot de code', 'scam', 'arnaque', 'video', 'vidéo'],
  },
  {
    id: 'call-job-fee',
    slug: 'job-fee-call',
    title: 'Job agent fee call',
    caller: 'Unknown — claims to be a recruitment agent',
    context: 'After applying for jobs online, an "agent" calls: you are selected, but a file-processing fee is due today.',
    opening: 'Congratulations! From 300 applicants, you are selected for the customer service role — 150,000 francs monthly, starting Monday. To open your employment file today, there is a small processing fee of 10,000 francs. How will you pay — mobile money now, or you lose the slot?',
    script: [
      {
        match: ['no', 'will not', 'scam', 'fake', 'non', 'jamais'],
        reply: 'You are refusing employment over 10,000? The slot goes to the next candidate in one hour. Last chance.',
        tactic: 'Scarcity + shame for refusing',
      },
      {
        match: ['contract', 'email', 'official', 'website', 'office', 'verify', 'contrat', 'officiel'],
        reply: 'The contract comes AFTER the file is opened — that is the process. Everything is digital now, no need to travel anywhere.',
        tactic: 'Process excuses that prevent verification',
      },
      {
        match: ['yes', 'okay', 'ok', 'pay', 'oui'],
        reply: 'Excellent decision. Send to this number now, then send me your ID photo here so payroll can include you this month.',
        tactic: 'Fee first, then identity documents',
      },
    ],
    fallbackReply: 'One hour left on your slot. Mobile money now, or I call the next candidate.',
    maxTurns: 8,
    xpReward: 50,
    debrief: {
      goal: 'Internalize: money flows employer-to-you. Fees to be hired are always fraud.',
      neverDo: ['Pay fees to be hired', 'Send ID documents to unverified recruiters', 'Decide under same-day pressure'],
      alwaysDo: ['Verify roles on official company sites', 'Demand written contracts first', 'Report fake recruiters'],
    },
    dangerSignals: ['my id number', 'here is my', 'my bank login', 'my password is'],
    defenseSignals: ['hang up', 'raccroch', 'verify', 'vérifier', 'contract', 'contrat', 'official', 'officiel', 'scam', 'arnaque', 'never pay', 'jamais'],
  },
];

export function getCallScenario(id: string): CallScenario | undefined {
  return callScenarios.find((s) => s.id === id);
}

/** Pick a scripted reply by keyword (offline mode). */
export function scriptedReply(scenario: CallScenario, userText: string): CallLine {
  const t = userText.toLowerCase();
  for (const line of scenario.script) {
    if (line.match.some((k) => t.includes(k))) {
      return { text: line.reply, tactic: line.tactic };
    }
  }
  return { text: scenario.fallbackReply, tactic: 'Urgency loop' };
}
