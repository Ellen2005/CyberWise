import { z } from 'zod';

export const POST_KINDS = ['story', 'tip', 'question'] as const;
export type PostKind = (typeof POST_KINDS)[number];

export const POST_STATUSES = ['pending', 'approved', 'rejected'] as const;

export const communityPostSchema = z.object({
  kind: z.enum(POST_KINDS),
  title: z
    .string()
    .min(4, { message: 'Give it a short title (4+ characters).' })
    .max(120, { message: 'Keep titles under 120 characters.' }),
  body: z
    .string()
    .min(20, { message: 'Write at least a few sentences (20+ characters).' })
    .max(2000, { message: 'Keep posts under 2000 characters.' }),
});

export type CommunityPostInput = z.infer<typeof communityPostSchema>;

/** Shared-house rules shown on the submission form and enforced by moderators. */
export const COMMUNITY_RULES = [
  'Share experiences and tips, never instructions for attacks, scams, or harassment.',
  'No phone numbers, OTPs, passwords, or personal addresses — yours or anyone\u2019s.',
  'No naming or shaming private individuals; describe patterns, not people.',
  'Posts stay pending until a moderator approves them.',
];
