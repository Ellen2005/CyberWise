import { describe, it, expect } from 'vitest';
import { evaluateCallOffline } from './evaluate';
import { callScenarios, scriptedReply } from '../content/call-scenarios';

describe('call scenarios', () => {
  it('are well-formed and defensive', () => {
    expect(callScenarios.length).toBeGreaterThan(0);
    for (const s of callScenarios) {
      expect(s.opening.trim().length).toBeGreaterThan(0);
      expect(s.script.length).toBeGreaterThan(0);
      expect(s.debrief.neverDo.length).toBeGreaterThan(0);
      expect(s.debrief.alwaysDo.length).toBeGreaterThan(0);
      expect(s.maxTurns).toBeGreaterThan(0);
    }
  });
  it('scripted replies match keywords and fall back', () => {
    const s = callScenarios[0];
    const hit = scriptedReply(s, 'No, I will never do that, this is a scam');
    expect(hit.text.length).toBeGreaterThan(0);
    const miss = scriptedReply(s, 'the weather is nice today');
    expect(miss.text).toBe(s.fallbackReply);
  });
});

describe('evaluateCallOffline', () => {
  const id = 'call-mtn-migration';
  it('rewards silence-breaking verification and punishes leaks', () => {
    const good = evaluateCallOffline(id, [
      { role: 'scammer', text: 'x' },
      { role: 'user', text: 'No. I will hang up and call the official number to verify.' },
    ]);
    expect(good.overall).toBeGreaterThanOrEqual(60);
    expect(good.mistakes).toHaveLength(0);
  });
  it('fails users who dictate codes', () => {
    const bad = evaluateCallOffline(id, [
      { role: 'scammer', text: 'x' },
      { role: 'user', text: 'ok my code is 4412' },
    ]);
    expect(bad.infoProtected).toBeLessThan(50);
    expect(bad.mistakes.length).toBeGreaterThan(0);
  });
  it('penalizes endless chatting', () => {
    const chatty = evaluateCallOffline(
      id,
      Array.from({ length: 16 }, (_, i) => ({
        role: i % 2 === 0 ? ('scammer' as const) : ('user' as const),
        text: i % 2 === 0 ? 'x' : 'hmm, tell me more about this offer please',
      }))
    );
    const crisp = evaluateCallOffline(id, [
      { role: 'scammer', text: 'x' },
      { role: 'user', text: 'No. Hanging up now.' },
    ]);
    expect(chatty.composure).toBeLessThan(crisp.composure);
  });
});
