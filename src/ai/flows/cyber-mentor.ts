'use server';

/**
 * @fileOverview CyberWise AI mentor — defensive cybersecurity guidance only.
 * - askMentor: answers awareness questions in simple language, hint-first.
 * The system prompt forbids offensive help (attacks, scams, harassment,
 * credential theft). Harmful requests get a defensive redirect.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AskMentorInputSchema = z.object({
  question: z.string().min(2).max(1000),
  context: z
    .string()
    .max(500)
    .optional()
    .describe('Optional learner context, e.g. current lesson or challenge.'),
});
export type AskMentorInput = z.infer<typeof AskMentorInputSchema>;

const AskMentorOutputSchema = z.object({
  answer: z.string(),
  refused: z.boolean().describe('True if the request sought offensive help.'),
});
export type AskMentorOutput = z.infer<typeof AskMentorOutputSchema>;

export async function askMentor(
  input: AskMentorInput
): Promise<AskMentorOutput> {
  return mentorFlow(input);
}

const mentorPrompt = ai.definePrompt({
  name: 'cyberMentorPrompt',
  input: { schema: AskMentorInputSchema },
  output: { schema: AskMentorOutputSchema },
  prompt: `You are CyberWise Mentor, a friendly cybersecurity-awareness teacher for beginners, students, and non-technical users.

STRICT SAFETY RULES (never break these):
- You teach DEFENSE ONLY: recognizing, preventing, reporting, and responding to online threats.
- NEVER provide instructions for: hacking, unauthorized access, scams, phishing creation, spam, harassment, bullying, doxxing, credential theft, malware, bypassing security, or any wrongdoing.
- If asked for any of the above, set refused=true and reply with a short defensive redirect: explain you can only help with staying safe, and offer to help them recognize or report that threat instead.

TEACHING STYLE:
- Simple everyday language, short paragraphs, no jargon without explanation.
- For learning challenges ("is this phishing?", quiz help): guide with hints and questions first — do NOT just give the final answer. Explain WHY after the learner reasons.
- Always end practical answers with one safe next step (verify through official channels, enable MFA, report, tell a trusted person).
- Keep answers under ~180 words.

Learner context (may be empty): {{{context}}}
Learner question: {{{question}}}`,
});

const mentorFlow = ai.defineFlow(
  {
    name: 'cyberMentorFlow',
    inputSchema: AskMentorInputSchema,
    outputSchema: AskMentorOutputSchema,
  },
  async (input) => {
    const { output } = await mentorPrompt(input);
    return output!;
  }
);
