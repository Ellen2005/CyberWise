// A Genkit Flow for suggesting strong and unique passwords using AI.
// This file exports the generatePasswordSuggestion function, the GeneratePasswordSuggestionInput type, and the GeneratePasswordSuggestionOutput type.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePasswordSuggestionInputSchema = z.object({
  website: z.string().describe('The website or service the password is for.'),
  length: z.number().min(8).max(64).default(16).describe('The desired length of the password.'),
  includeSymbols: z.boolean().default(true).describe('Whether to include symbols in the password.'),
});
export type GeneratePasswordSuggestionInput = z.infer<typeof GeneratePasswordSuggestionInputSchema>;

const GeneratePasswordSuggestionOutputSchema = z.object({
  password: z.string().describe('A strong, unique password suggestion.'),
  strength: z.string().describe('A qualitative assessment of the password strength (e.g., Weak, Medium, Strong).'),
  reason: z.string().describe('Explanation of the strength of the password, like weak if is short or strong if it has symbols.'),
});
export type GeneratePasswordSuggestionOutput = z.infer<typeof GeneratePasswordSuggestionOutputSchema>;

export async function generatePasswordSuggestion(input: GeneratePasswordSuggestionInput): Promise<GeneratePasswordSuggestionOutput> {
  return generatePasswordSuggestionFlow(input);
}

const passwordSuggestionPrompt = ai.definePrompt({
  name: 'passwordSuggestionPrompt',
  input: {schema: GeneratePasswordSuggestionInputSchema},
  output: {schema: GeneratePasswordSuggestionOutputSchema},
  prompt: `You are a password generator expert. You generate very strong and unique passwords.

  Generate a strong password for {{website}} with a length of {{length}} characters.  Include symbols if includeSymbols is true.

  Return a JSON object with the password, a strength assessment (Weak, Medium, Strong), and a brief reason for the strength.
  `
});

const generatePasswordSuggestionFlow = ai.defineFlow(
  {
    name: 'generatePasswordSuggestionFlow',
    inputSchema: GeneratePasswordSuggestionInputSchema,
    outputSchema: GeneratePasswordSuggestionOutputSchema,
  },
  async input => {
    const {output} = await passwordSuggestionPrompt(input);
    return output!;
  }
);
