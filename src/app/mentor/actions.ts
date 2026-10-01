'use server';

import { z } from 'zod';
import { askMentor } from '@/ai/flows/cyber-mentor';
import { guardActionRateLimit } from '@/lib/security/action-rate-limit';

const mentorSchema = z.object({
  question: z
    .string()
    .min(2, { message: 'Please ask a question.' })
    .max(1000, { message: 'Keep questions under 1000 characters.' }),
});

export type MentorState = {
  answer?: string;
  error?: string;
};

export async function getMentorAnswer(
  question: string
): Promise<MentorState> {
  const parsed = mentorSchema.safeParse({ question });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid question.' };
  }

  try {
    await guardActionRateLimit('mentor', 10, 60_000);
  } catch (e: any) {
    return { error: e.message };
  }

  try {
    const result = await askMentor({ question: parsed.data.question });
    return { answer: result.answer };
  } catch (e: any) {
    console.error('mentor failed:', e);
    if (e.message && (e.message.includes('quota') || e.message.includes('429'))) {
      return { error: 'AI quota exceeded. Try again later, or use the quick FAQs below.' };
    }
    if (e.message && e.message.includes('API key')) {
      return { error: 'AI_KEY_MISSING' };
    }
    return { error: 'AI_UNAVAILABLE' };
  }
}
