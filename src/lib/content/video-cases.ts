// Video-call verification drills. Teaches layered verification:
// a live gesture beats a recording, but only a shared secret beats
// real-time deepfakes. WiseTap never touches your camera — this
// simulates THEIR side of the call only.

export type VideoTest = { id: string; label: string; desc: string };

export type VideoCase = {
  id: string;
  title: string;
  caller: string;
  story: string;
  truth: 'recorded-loop' | 'real-person' | 'realtime-fake';
  callScript: string[];
  tests: VideoTest[];
  // What happens per test, keyed by test id.
  reactions: Record<string, string>;
  verdict: string;
  lesson: string;
  xpReward: number;
};

export const videoCases: VideoCase[] = [
  {
    id: 'vc-dad-loop',
    title: '“Dad” on video, asking for money',
    caller: 'Dad (video)',
    story: 'After the voice note, "Dad" agrees to a quick video call and demands MoMo money for the clinic.',
    truth: 'recorded-loop',
    callScript: [
      '"Son! Good, you see me — now send quickly, the doctor waits."',
      '"No time for questions, the network is bad here."',
    ],
    tests: [
      { id: 'wave', label: 'Ask him to wave at the camera', desc: 'A live person complies instantly.' },
      { id: 'fingers', label: 'Ask him to hold up 3 fingers', desc: 'Specific live gestures break loops.' },
      { id: 'codeword', label: 'Ask the family code word', desc: 'Shared secrets beat any video.' },
    ],
    reactions: {
      wave: 'He keeps talking over you, same head nod on repeat. The "live" call ignores your request.',
      fingers: 'The video glitches for a second — then continues as if nothing happened. Loops cannot improvise.',
      codeword: 'He changes the subject back to money: "Stop playing, send NOW!" A real father would just say the word.',
    },
    verdict: 'Recorded loop — NOT a live call.',
    lesson: 'Real people respond to live requests. When video ignores you, stalls, or dodges the code word, hang up and call the real number.',
    xpReward: 40,
  },
  {
    id: 'vc-mum-real',
    title: 'Mum video-calls about school fees',
    caller: 'Mum (video)',
    story: 'Mum video-calls asking you to confirm school-fee details. She looks and sounds right — but last month a fake "Mum" account messaged you.',
    truth: 'real-person',
    callScript: ['"Hello my child! It is really me — ask me anything, I have time."'],
    tests: [
      { id: 'wave', label: 'Ask her to wave', desc: 'Baseline live check.' },
      { id: 'codeword', label: 'Ask the family code word', desc: 'The decisive test.' },
      { id: 'memory', label: 'Ask something only she knows', desc: 'Shared history no AI was told.' },
    ],
    reactions: {
      wave: 'She laughs and waves exaggeratedly. Live, no delay games.',
      codeword: '"Mango tree!" — correct instantly, then she asks why you look so serious.',
      memory: 'She answers with a detail no dataset contains — and teases you for testing her.',
    },
    verdict: 'Real person — verified three ways.',
    lesson: 'Layer checks for people who matter: live gesture + code word + shared memory. Real family passes happily; fakes fail at least one.',
    xpReward: 40,
  },
  {
    id: 'vc-realtime-fake',
    title: 'The one that passes the wave test',
    caller: '"Agent" with your face? No — a recruiter on video',
    story: 'A recruiter video-calls about the job. She waves when asked. She holds up fingers. Then she asks for the processing fee.',
    truth: 'realtime-fake',
    callScript: ['"See? Live, as promised. Now about the 10,000 francs processing fee to lock your slot today…"'],
    tests: [
      { id: 'wave', label: 'Ask her to wave', desc: 'She passes — note that.' },
      { id: 'codeword', label: 'Ask for company proof instead', desc: 'No shared secret exists with strangers — demand verifiable facts.' },
      { id: 'money', label: 'Question the fee itself', desc: 'Attack the premise, not the pixels.' },
    ],
    reactions: {
      wave: 'She waves perfectly. Real-time deepfakes CAN do gestures — this test alone no longer suffices.',
      codeword: 'She deflects: "All our documents are digital, check our website" — a site registered last week.',
      money: 'The fee demand survives all video checks. Money flowing the wrong way is the verdict no filter can fake.',
    },
    verdict: 'Possibly AI-assisted — but the verdict never depended on video.',
    lesson: 'Advanced fakes pass gesture tests. Final layer is always logic: verify the company independently, never pay to be hired. Layer your defenses because each single test can fall.',
    xpReward: 50,
  },
];
