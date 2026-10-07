import { describe, it, expect } from 'vitest';
import { communityPostSchema } from './schema';

describe('communityPostSchema', () => {
  it('accepts a valid post', () => {
    const r = communityPostSchema.safeParse({
      kind: 'story',
      title: 'The call that almost got me',
      body: 'Someone called claiming to be support and asked for my code. I hung up and called back officially.',
    });
    expect(r.success).toBe(true);
  });
  it('rejects short titles and bodies', () => {
    expect(communityPostSchema.safeParse({ kind: 'tip', title: 'Hi', body: 'Long enough body text here for sure.' }).success).toBe(false);
    expect(communityPostSchema.safeParse({ kind: 'tip', title: 'A fine title here', body: 'short' }).success).toBe(false);
  });
  it('rejects unknown kinds', () => {
    expect(
      communityPostSchema.safeParse({ kind: 'rant', title: 'A fine title here', body: 'Long enough body text here for sure.' }).success
    ).toBe(false);
  });
});
