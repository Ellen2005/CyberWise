// Short interactive defensive stories.
export type StoryChoice = { id: string; text: string; isSafe: boolean; feedback: string };
export type StoryNode = { id: string; title: string; narrative: string; choices: StoryChoice[]; isEnd?: boolean };

export type CyberStory = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  topic: string;
  estimatedMinutes: number;
  xpReward: number;
  nodes: StoryNode[];
  takeaway: string;
};

export const cyberStories: CyberStory[] = [
  {
    id: 'story-scholarship',
    slug: 'the-scholarship-message',
    title: 'The Scholarship Message',
    tagline: 'A student wins a scholarship she never applied for.',
    topic: 'Scams',
    estimatedMinutes: 6,
    xpReward: 40,
    nodes: [
      {
        id: 'n1',
        title: 'The exciting DM',
        narrative: 'Amara, a student, receives a DM: “Congratulations! You won a $3,000 scholarship. Pay a $30 processing fee in the next 12 hours to claim it.” Her heart races — fees are due next week.',
        choices: [
          { id: 'pay', text: 'Pay the $30 right away before the deadline', isSafe: false, feedback: 'Real scholarships never demand upfront fees under time pressure. This is an advance-fee pattern.' },
          { id: 'verify', text: 'Pause and verify through her school portal and counselor', isSafe: true, feedback: 'Correct. Independent verification is the defense. Excitement is exactly what the scammer exploits.' },
        ],
      },
      {
        id: 'n2',
        title: 'What Amara finds',
        narrative: 'The school portal shows no such scholarship. A search of the exact program name shows warnings from other students. The sender pressures her: “Pay now or lose your spot.” What should she do next?',
        choices: [
          { id: 'block-report', text: 'Block, report, and tell a friend/counselor', isSafe: true, feedback: 'Correct. Stop engagement, preserve evidence, report, and get support.' },
          { id: 'negotiate', text: 'Negotiate a smaller fee to “test” if it is real', isSafe: false, feedback: 'Any payment confirms you as a target. Scammers escalate once money moves.' },
        ],
        isEnd: true,
      },
    ],
    takeaway: 'Unsolicited winnings + upfront fee + urgency = scam. Verify through official channels, never pay to receive.',
  },
  {
    id: 'story-otp',
    slug: 'the-midnight-code',
    title: 'The Midnight Code',
    tagline: 'A “cousin” needs a code — urgently.',
    topic: 'Social engineering',
    estimatedMinutes: 5,
    xpReward: 40,
    nodes: [
      {
        id: 'n1',
        title: '1:42 AM message',
        narrative: 'Daniel gets a message from his cousin’s account: “Bro please, I used your number for my new account and the code went to you. Send it now, I’m locked out at the station!” A 6-digit code arrives seconds later.',
        choices: [
          { id: 'send', text: 'Forward the code — family helps family', isSafe: false, feedback: 'That code likely authorizes access to Daniel’s own account. Hacked accounts beg exactly like this.' },
          { id: 'call', text: 'Call his cousin on the normal number before doing anything', isSafe: true, feedback: 'Correct. Out-of-band verification defeats impersonation. Codes are never to be forwarded.' },
        ],
      },
      {
        id: 'n2',
        title: 'The truth',
        narrative: 'The call goes unanswered; the next morning his cousin says: “My account was hacked last night.” Daniel did not send the code. What is the safest follow-up?',
        choices: [
          { id: 'warn', text: 'Tell his cousin to recover the hacked account and warn mutual contacts', isSafe: true, feedback: 'Correct. Recovery plus warning stops the chain.' },
          { id: 'post-code', text: 'Post the code online to “expose” the hacker', isSafe: false, feedback: 'Posting codes exposes them to everyone. Handle privately.' },
        ],
        isEnd: true,
      },
    ],
    takeaway: 'Never forward OTPs. Verify identity on a different channel. Hacked accounts exploit trust + urgency.',
  },
  {
    id: 'story-bully',
    slug: 'the-group-chat-pile-on',
    title: 'The Group Chat Pile-On',
    tagline: 'Jokes stop being jokes.',
    topic: 'Cyberbullying',
    estimatedMinutes: 6,
    xpReward: 40,
    nodes: [
      {
        id: 'n1',
        title: 'The photo',
        narrative: 'Someone posts an edited, embarrassing photo of Lin in the class group. Laughing emojis flood in. Lin stops replying. You feel uncomfortable but others type “lol, add more”.',
        choices: [
          { id: 'join', text: 'Add a joke so you fit in', isSafe: false, feedback: 'Joining causes real harm and makes you part of the abuse.' },
          { id: 'support', text: 'Do not pile on. Message Lin privately to check in', isSafe: true, feedback: 'Correct. Private support matters more than public performance.' },
        ],
      },
      {
        id: 'n2',
        title: 'Next day',
        narrative: 'The photo spreads to another group. Lin is upset and scared to tell anyone. What helps most?',
        choices: [
          { id: 'evidence', text: 'Save evidence, report the posts, and encourage Lin to tell a trusted adult', isSafe: true, feedback: 'Correct. Evidence + report + trusted support is the safe chain. Do not retaliate.' },
          { id: 'revenge', text: 'Post an embarrassing photo of the bully as payback', isSafe: false, feedback: 'Retaliation escalates harm and can get you in trouble too.' },
        ],
        isEnd: true,
      },
    ],
    takeaway: 'Do not join, do not retaliate. Support privately, save evidence, report, and involve a trusted person.',
  },
];
