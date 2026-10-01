"use server";

import { checkForBreaches, CheckForBreachesOutput } from "@/ai/flows/breach-checker-flow";
import { guardActionRateLimit } from "@/lib/security/action-rate-limit";
import { z } from "zod";

const breachCheckSchema = z.object({
  email: z.string().email(),
});

export type FormState = {
  message: string;
  result?: CheckForBreachesOutput;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function getBreachCheckResult(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = breachCheckSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: "Invalid email provided.",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  try {
    await guardActionRateLimit("breach-checker", 10, 60_000);
  } catch (e: any) {
    return { message: e.message || "Too many requests. Please wait and try again.", fields: parsed.data };
  }

  try {
    const result = await checkForBreaches(parsed.data);
    return { message: "success", result, fields: parsed.data };
  } catch (e: any) {
    console.error(e);
    if (e.message && (e.message.includes('quota') || e.message.includes('429'))) {
       return {
         message: "You have exceeded the free tier quota for the generative AI service. Please check your Google AI plan and billing details.",
         fields: parsed.data,
       };
    }
    if (e.message && e.message.includes("API key not valid")) {
       return {
         message: "The AI service API key is not valid. Please check your .env file.",
         fields: parsed.data,
       };
    }
    return {
      message: e.message || "An unexpected error occurred. This may be due to an invalid API key or a network issue. Please try again.",
      fields: parsed.data,
    };
  }
}
