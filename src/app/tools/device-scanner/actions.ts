"use server";

import { troubleshootDevice } from "@/ai/flows/device-security-audit-flow";
import { guardActionRateLimit } from "@/lib/security/action-rate-limit";
import { z } from 'zod';

const TroubleshootDeviceInputSchema = z.object({
    concern: z.string().min(10, {message: "Please describe your concern in more detail."}).max(2000),
    deviceType: z.enum(['iPhone', 'Android', 'Windows', 'Mac']),
});

const StepSchema = z.object({
    title: z.string(),
    instruction: z.string()
});

const TroubleshootDeviceOutputSchema = z.object({
  possibleCauses: z.array(z.string()),
  remedies: z.array(StepSchema),
  preventativeTips: z.array(z.string()),
});
type TroubleshootDeviceOutput = z.infer<typeof TroubleshootDeviceOutputSchema>;


export type FormState = {
  message: string;
  result?: TroubleshootDeviceOutput;
  fields?: Record<string, any>;
  issues?: string[];
};

export async function getTroubleshootingResult(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = TroubleshootDeviceInputSchema.safeParse(formData);

  if (!parsed.success) {
      return {
          message: "Please fix the errors below.",
          fields: formData,
          issues: parsed.error.issues.map((issue) => issue.message),
      }
  }

  try {
    await guardActionRateLimit("device-scanner", 10, 60_000);
  } catch (e: any) {
    return { message: e.message || "Too many requests. Please wait and try again." };
  }

  try {
    const result = await troubleshootDevice(parsed.data);
    return { message: "success", result };
  } catch (e: any) {
    console.error(e);
    if (e.message && (e.message.includes('quota') || e.message.includes('429'))) {
       return {
         message: "You have exceeded the free tier quota for the generative AI service. Please check your Google AI plan and billing details.",
       };
    }
    if (e.message && e.message.includes("API key not valid")) {
       return {
         message: "The AI service API key is not valid. Please check your .env file.",
       };
    }
    return {
      message: e.message || "An unexpected error occurred. This may be due to an invalid API key or a network issue. Please try again.",
    };
  }
}
