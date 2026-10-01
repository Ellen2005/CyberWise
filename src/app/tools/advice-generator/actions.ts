"use server";

import { generateCybersecurityAdvice } from "@/ai/flows/cybersecurity-advice-generator";
import { guardActionRateLimit } from "@/lib/security/action-rate-limit";
import { z } from "zod";

const adviceSchema = z.object({
  digitalHabits: z.string().min(10, { message: "Please describe your digital habits in more detail." }).max(2000),
  potentialVulnerabilities: z.string().min(10, { message: "Please describe your potential vulnerabilities in more detail." }).max(2000),
});

export type FormState = {
  message: string;
  advice?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function getAdvice(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = adviceSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: "Please fix the errors below.",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  try {
    await guardActionRateLimit("advice-generator", 10, 60_000);
  } catch (e: any) {
    return { message: e.message || "Too many requests. Please wait and try again.", fields: parsed.data };
  }

  try {
    const result = await generateCybersecurityAdvice(parsed.data);
    return { message: "success", advice: result.advice };
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
