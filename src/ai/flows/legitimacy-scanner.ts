
'use server';

/**
 * @fileOverview An AI agent for scanning text (like emails or URLs) for suspicious content.
 *
 * - scanContent - A function that handles the content analysis.
 * - ScanContentInput - The input type for the scanContent function.
 * - ScanContentOutput - The return type for the scanContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanContentInputSchema = z.object({
  content: z.string().min(10).describe('The text content to be analyzed for legitimacy, such as an email body or a URL.'),
});
export type ScanContentInput = z.infer<typeof ScanContentInputSchema>;

const ScanContentOutputSchema = z.object({
    verdict: z.enum(['Safe', 'Suspicious', 'Malicious']).describe("A single-word verdict on the content's legitimacy."),
    confidence: z.enum(['High', 'Medium', 'Low']).describe("The confidence level of the verdict."),
    reason: z.string().describe("A concise, one-to-three sentence explanation for the verdict, highlighting specific red flags if any were found."),
    flags: z.array(z.string()).describe("A list of specific red flags found, like 'Urgent Tone', 'Suspicious Link', 'Grammar Errors', 'Impersonation', 'Unsolicited Request'."),
    uncertainty: z.string().optional().describe("What cannot be determined from the message alone, e.g. whether the sender address is genuine without checking the official app."),
    doList: z.array(z.string()).optional().describe("Safe next steps, e.g. 'Verify through the official app'."),
    dontList: z.array(z.string()).optional().describe("Things the user must NOT do, e.g. 'Do not click the link'.")
});
export type ScanContentOutput = z.infer<typeof ScanContentOutputSchema>;


export async function scanContent(input: ScanContentInput): Promise<ScanContentOutput> {
  return legitimacyScannerFlow(input);
}

const scannerPrompt = ai.definePrompt({
  name: 'legitimacyScannerPrompt',
  input: {schema: ScanContentInputSchema},
  output: {schema: ScanContentOutputSchema},
  prompt: `You are a cybersecurity expert specializing in identifying phishing, scams, and malicious content. Analyze the following text and determine if it is legitimate.

  Your task is to provide a clear verdict, a confidence score, and a brief justification.

  Analyze this content:
  ---
  {{{content}}}
  ---

  CALIBRATION RULES (follow strictly):
  - Never declare something 'Safe' with High confidence from message text alone. If no warning signs are visible, say what you checked and add an 'uncertainty' note such as: "This shows no classic warning signs, but I cannot verify the sender from the message alone — confirm through the official app before acting."
  - 'Malicious' requires concrete red flags (impersonation, credential/OTP/money request, malicious link pattern, advance fee). Otherwise prefer 'Suspicious'.
  - Always fill 'uncertainty', 'doList' (2-3 safe next steps), and 'dontList' (2-3 things NOT to do).
  - Plain language for beginners. No threat scores.

  Based on your analysis, provide a structured response with:
  1.  **verdict**: 'Safe', 'Suspicious', or 'Malicious'.
  2.  **confidence**: Your confidence in this verdict ('High', 'Medium', 'Low').
  3.  **reason**: A short explanation for your verdict. If suspicious or malicious, point out the specific red flags you identified.
  4.  **flags**: A list of keywords for the identified red flags.
  5.  **uncertainty**: What cannot be determined from the message alone.
  6.  **doList**: Safe next steps.
  7.  **dontList**: Things the user must NOT do.
  `,
});

const legitimacyScannerFlow = ai.defineFlow(
  {
    name: 'legitimacyScannerFlow',
    inputSchema: ScanContentInputSchema,
    outputSchema: ScanContentOutputSchema,
  },
  async input => {
    const {output} = await scannerPrompt(input);
    return output!;
  }
);
