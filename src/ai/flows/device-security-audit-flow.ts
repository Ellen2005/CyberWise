'use server';

/**
 * @fileOverview An AI agent for troubleshooting user-described security concerns.
 *
 * - troubleshootDevice - A function that handles the troubleshooting.
 * - TroubleshootDeviceInput - The input type for the troubleshootDevice function.
 * - TroubleshootDeviceOutput - The return type for the troubleshootDevice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TroubleshootDeviceInputSchema = z.object({
    concern: z.string().min(10).describe("A user's description of their security problem (e.g., 'I get too many scam calls')."),
    deviceType: z.enum(['iPhone', 'Android', 'Windows', 'Mac']).describe("The type of device the user has."),
});
type TroubleshootDeviceInput = z.infer<typeof TroubleshootDeviceInputSchema>;

const StepSchema = z.object({
    title: z.string().describe("A short, clear title for the troubleshooting step."),
    instruction: z.string().describe("The detailed instruction for the user to follow. This should be specific to the deviceType provided.")
});

const TroubleshootDeviceOutputSchema = z.object({
  possibleCauses: z.array(z.string()).describe("A list of 2-3 likely causes for the user's concern."),
  remedies: z.array(StepSchema).describe("A list of step-by-step remedies tailored to the user's deviceType."),
  preventativeTips: z.array(z.string()).describe("A list of 2-3 alternative or preventative tips."),
});
type TroubleshootDeviceOutput = z.infer<typeof TroubleshootDeviceOutputSchema>;


export async function troubleshootDevice(input: TroubleshootDeviceInput): Promise<TroubleshootDeviceOutput> {
  return troubleshootDeviceFlow(input);
}

const troubleshootPrompt = ai.definePrompt({
  name: 'troubleshootDevicePrompt',
  input: { schema: TroubleshootDeviceInputSchema },
  output: { schema: TroubleshootDeviceOutputSchema },
  prompt: `You are a helpful and clear cybersecurity expert. A user has a security concern with their device.
  
  Analyze their concern and device type to provide a helpful troubleshooting guide.

  User's Concern: {{{concern}}}
  Device Type: {{{deviceType}}}

  Your response should include:
  1.  A list of 'possibleCauses' for the problem.
  2.  A list of 'remedies', which are step-by-step instructions. These steps MUST be specific and accurate for the given 'deviceType'. For example, if the device is an iPhone, refer to 'Settings > Phone > Silence Unknown Callers', not a generic instruction.
  3.  A list of 'preventativeTips' that offer other ways to avoid the problem in the future.

  Generate a clear, actionable, and user-friendly response.
  `,
});

const troubleshootDeviceFlow = ai.defineFlow(
  {
    name: 'troubleshootDeviceFlow',
    inputSchema: TroubleshootDeviceInputSchema,
    outputSchema: TroubleshootDeviceOutputSchema,
  },
  async (input) => {
    const {output} = await troubleshootPrompt(input);
    return output!;
  }
);
