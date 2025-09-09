"use server";

import { scanContent } from "@/ai/flows/legitimacy-scanner";
import { z } from "zod";

const scannerSchema = z.object({
  content: z.string().min(10, { message: "Please paste at least 10 characters to scan." }),
});

export type ScanResult = Awaited<ReturnType<typeof scanContent>>;

export type FormState = {
  message: string;
  result?: ScanResult;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function getScanResult(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = scannerSchema.safeParse(formData);

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
    const result = await scanContent(parsed.data);
    return { message: "success", result };
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
