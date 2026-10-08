'use server';

import { z } from 'zod';
import { scamCallTurn, judgeCall } from '@/ai/flows/scam-call';
import { scriptedReply, getCallScenario } from '@/lib/content/call-scenarios';
import { evaluateCallOffline, type CallTurn } from '@/lib/calls/evaluate';
import { guardActionRateLimit } from '@/lib/security/action-rate-limit';

const turnSchema = z.object({
  scenarioId: z.string().min(1).max(80),
  transcript: z
    .array(z.object({ role: z.enum(['scammer', 'user']), text: z.string().min(1).max(500) }))
    .max(20),
});

function hasKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
}

export type CallTurnState = {
  reply?: string;
  tactic?: string;
  shouldEnd?: boolean;
  offline?: boolean;
  error?: string;
};

/** One scammer turn: AI persona when a key exists, scripted fallback otherwise. */
export async function getScammerReply(scenarioId: string, transcript: CallTurn[]): Promise<CallTurnState> {
  const parsed = turnSchema.safeParse({ scenarioId, transcript });
  if (!parsed.success) return { error: 'Invalid call state.' };

  try {
    await guardActionRateLimit('scam-call', 20, 60_000);
  } catch (e: any) {
    return { error: e.message };
  }

  if (!hasKey()) {
    const scenario = getCallScenario(scenarioId);
    if (!scenario) return { error: 'Unknown scenario.' };
    const lastUser = [...parsed.data.transcript].reverse().find((t) => t.role === 'user');
    const line = scriptedReply(scenario, lastUser?.text ?? '');
    return { reply: line.text, tactic: line.tactic, shouldEnd: false, offline: true };
  }

  try {
    const result = await scamCallTurn(parsed.data);
    return { reply: result.reply, tactic: result.tactic, shouldEnd: result.shouldEnd };
  } catch (e: any) {
    console.error('scam call turn failed:', e);
    const scenario = getCallScenario(scenarioId);
    if (!scenario) return { error: 'AI_UNAVAILABLE' };
    const lastUser = [...parsed.data.transcript].reverse().find((t) => t.role === 'user');
    const line = scriptedReply(scenario, lastUser?.text ?? '');
    return { reply: line.text, tactic: line.tactic, shouldEnd: false, offline: true };
  }
}

export type JudgeState = {
  scores?: { infoProtected: number; verification: number; composure: number; overall: number };
  mistakes?: string[];
  strengths?: string[];
  tip?: string;
  offline?: boolean;
  error?: string;
};

/** Evaluate the recorded transcript: AI judge when possible, rubric otherwise. */
export async function judgeCallTranscript(scenarioId: string, transcript: CallTurn[]): Promise<JudgeState> {
  const parsed = turnSchema.safeParse({ scenarioId, transcript });
  if (!parsed.success) return { error: 'Invalid transcript.' };

  if (!hasKey()) {
    const r = evaluateCallOffline(scenarioId, parsed.data.transcript);
    return {
      scores: { infoProtected: r.infoProtected, verification: r.verification, composure: r.composure, overall: r.overall },
      mistakes: r.mistakes,
      strengths: r.strengths,
      tip: 'The single safest habit: hang up on unsolicited callers, then verify through a channel you choose.',
      offline: true,
    };
  }

  try {
    await guardActionRateLimit('scam-call-judge', 10, 60_000);
    const r = await judgeCall(parsed.data);
    const overall = Math.round(r.infoProtected * 0.45 + r.verification * 0.35 + r.composure * 0.2);
    return {
      scores: { infoProtected: r.infoProtected, verification: r.verification, composure: r.composure, overall },
      mistakes: r.mistakes,
      strengths: r.strengths,
      tip: r.tip,
    };
  } catch (e) {
    console.error('judge failed:', e);
    const r = evaluateCallOffline(scenarioId, parsed.data.transcript);
    return {
      scores: { infoProtected: r.infoProtected, verification: r.verification, composure: r.composure, overall: r.overall },
      mistakes: r.mistakes,
      strengths: r.strengths,
      tip: 'The single safest habit: hang up on unsolicited callers, then verify through a channel you choose.',
      offline: true,
    };
  }
}
