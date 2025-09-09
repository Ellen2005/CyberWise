
'use server';

/**
 * @fileOverview An AI agent for checking if an email has appeared in simulated data breaches.
 *
 * - checkForBreaches - A function that handles the breach check.
 * - CheckForBreachesInput - The input type for the checkForBreaches function.
 * - CheckForBreachesOutput - The return type for the checkForBreaches function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckForBreachesInputSchema = z.object({
  email: z.string().email().describe('The email address to check for breaches.'),
});
export type CheckForBreachesInput = z.infer<typeof CheckForBreachesInputSchema>;

const BreachInfoSchema = z.object({
    name: z.string().describe("The name of the breached service (e.g., 'MyFitnessPal', 'Canva', 'Twitter')."),
    date: z.string().describe("The approximate date of the breach (e.g., 'October 2018', 'July 2019')."),
    description: z.string().describe("A brief, one-sentence description of what data was compromised (e.g., 'Usernames, email addresses, and salted passwords were exposed.').")
});

const CheckForBreachesOutputSchema = z.object({
  breaches: z.array(BreachInfoSchema).describe("An array of fictional data breaches associated with the email. Generate between 0 and 5 breaches."),
  recommendation: z.string().describe("A short, actionable recommendation for the user based on the findings.")
});
export type CheckForBreachesOutput = z.infer<typeof CheckForBreachesOutputSchema>;


export async function checkForBreaches(input: CheckForBreachesInput): Promise<CheckForBreachesOutput> {
  return breachCheckerFlow(input);
}

const breachCheckerPrompt = ai.definePrompt({
  name: 'breachCheckerPrompt',
  input: {schema: CheckForBreachesInputSchema},
  output: {schema: CheckForBreachesOutputSchema},
  prompt: `You are a cybersecurity expert simulating a data breach check for the email address: {{{email}}}.

  Your task is to generate a short, fictional list of 0 to 5 data breaches this email might have been involved in. These should sound like real, well-known breaches.

  For each breach, provide the service name, an approximate date, and a one-sentence summary of the exposed data.

  After the list, provide a single, concise recommendation for the user. If no breaches are found, congratulate them. If breaches are found, advise them to change passwords on the affected sites and enable 2FA.
  `,
});

const breachCheckerFlow = ai.defineFlow(
  {
    name: 'breachCheckerFlow',
    inputSchema: CheckForBreachesInputSchema,
    outputSchema: CheckForBreachesOutputSchema,
  },
  async input => {
    const {output} = await breachCheckerPrompt(input);
    return output!;
  }
);
