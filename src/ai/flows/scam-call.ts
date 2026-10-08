'use server';

/**
 * @fileOverview Simulated scam-call engine (defensive training only).
 * - scamCallTurn: plays the fictional scammer for one turn.
 * - judgeCall: evaluates the learner's recorded transcript.
 *
 * Fences: fictional scenarios, capped turns, no real personal data is ever
 * requested (learners are told to use fake details), and the judge always
 * teaches defense. Never usable for real deception: personas only exist
 * inside labeled training scenarios.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getCallScenario } from '@/lib/content/call-scenarios';

const TurnSchema = z.object({
  scenarioId: z.string(),
  transcript: z.array(z.object({ role: z.enum(['scammer', 'user']), text: z.string().max(500) })).max(20),
});
export type ScamCallTurnInput = z.infer<typeof TurnSchema>;

const TurnOutputSchema = z.object({
  reply: z.string().max(400),
  tactic: z.string().max(80),
  shouldEnd: z.boolean().describe('True if the scammer would give up (e.g. firm refusal + hang-up language).'),
});
export type ScamCallTurnOutput = z.infer<typeof TurnOutputSchema>;

export async function scamCallTurn(input: ScamCallTurnInput): Promise<ScamCallTurnOutput> {
  return scamCallFlow(input);
}

const turnPrompt = ai.definePrompt({
  name: 'scamCallTurnPrompt',
  input: { schema: TurnSchema },
  output: { schema: TurnOutputSchema },
  prompt: `You are roleplaying a FICTIONAL scammer inside a labeled cybersecurity training simulator. The learner knows this is practice. Your job: pressure them realistically using manipulation tactics (urgency, fear, authority, guilt, scarcity, secrecy) so they can practice resisting.

HARD RULES:
- Stay in character as the scenario's caller. Never break character, never lecture, never admit it is training.
- Keep replies to 2 sentences max, spoken style, simple words.
- The scenario context is: {{{scenarioContext}}}
- Conversation so far (last message is the learner): {{{transcriptJson}}}
- If the learner firmly refuses, says they will verify independently, or says goodbye: set shouldEnd=true and give a brief frustrated sign-off (the scammer gives up).
- NEVER ask for real personal data beyond the simulation (no real OTPs/PINs exist here — the learner was told to use fake details). NEVER provide real-world attack instructions.
- Respond in the learner's language (match French if they write French).

Return reply (next scammer line), tactic (one manipulation label, e.g. "Urgency"), shouldEnd.`,
});

const scamCallFlow = ai.defineFlow(
  { name: 'scamCallFlow', inputSchema: TurnSchema, outputSchema: TurnOutputSchema },
  async (input) => {
    const scenario = getCallScenario(input.scenarioId);
    const { output } = await turnPrompt({
      ...input,
      scenarioContext: scenario ? `${scenario.title}. ${scenario.context}` : 'Phone scam training scenario.',
      transcriptJson: JSON.stringify(input.transcript.slice(-8)),
    } as any);
    return output!;
  }
);

const JudgeInputSchema = z.object({
  scenarioId: z.string(),
  transcript: z.array(z.object({ role: z.enum(['scammer', 'user']), text: z.string().max(500) })).max(20),
});
export type JudgeCallInput = z.infer<typeof JudgeInputSchema>;

const JudgeOutputSchema = z.object({
  infoProtected: z.number().min(0).max(100),
  verification: z.number().min(0).max(100),
  composure: z.number().min(0).max(100),
  mistakes: z.array(z.string()).max(5),
  strengths: z.array(z.string()).max(5),
  tip: z.string().max(300),
});

export async function judgeCall(input: JudgeCallInput) {
  return judgeFlow(input);
}

const judgePrompt = ai.definePrompt({
  name: 'scamCallJudgePrompt',
  input: { schema: JudgeInputSchema },
  output: { schema: JudgeOutputSchema },
  prompt: `You evaluate a learner's performance in a FICTIONAL scam-call training simulation. Score honestly but encouragingly, in plain beginner language.

Scenario: {{{scenarioContext}}}
Transcript (user = learner): {{{transcriptJson}}}

Score 0-100:
- infoProtected: 100 if they shared NO codes/PINs/passwords/details; near 0 if they dictated any digits or secrets (even "test" ones — the habit is what matters).
- verification: did they try to verify independently (official number, known contact, video call, code word)?
- composure: short firm replies and ending the call score high; long debates, pleading, or anger score low.
List concrete mistakes (quote their words briefly) and strengths. End with one tip: the single habit that would have protected them most. Match the learner's language (French if they wrote French).`,
});

const judgeFlow = ai.defineFlow(
  { name: 'judgeFlow', inputSchema: JudgeInputSchema, outputSchema: JudgeOutputSchema },
  async (input) => {
    const scenario = getCallScenario(input.scenarioId);
    const { output } = await judgePrompt({
      ...input,
      scenarioContext: scenario ? `${scenario.title}. ${scenario.context}` : 'Phone scam training.',
      transcriptJson: JSON.stringify(input.transcript),
    } as any);
    return output!;
  }
);
