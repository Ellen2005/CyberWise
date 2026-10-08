import { NextResponse } from 'next/server';
import { generateCyberNews } from '@/ai/flows/cybersecurity-news-generator';
import { adminDb } from '@/lib/server/admin-db';
import { rateLimit } from '@/lib/security/rate-limiter';

/**
 * Scheduled news refresh. Call every few hours from Vercel Cron:
 *   GET /api/news/refresh?key=<CRON_SECRET>
 * Writes the shared cache the news page reads, so readers never wait on AI.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const expected = process.env.CRON_SECRET;
  if (!expected || searchParams.get('key') !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Refreshing costs an AI call: cap manual/cron hits well above the 6h schedule.
  const { allowed } = rateLimit('news-refresh', 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many refreshes' }, { status: 429 });
  }

  try {
    const result = await generateCyberNews();
    if (result.error || result.newsItems.length === 0) {
      return NextResponse.json({ error: result.error ?? 'Empty result' }, { status: 502 });
    }
    await adminDb()
      .collection('newsCache')
      .doc('current')
      .set({ items: result.newsItems, updatedAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, count: result.newsItems.length });
  } catch (e: any) {
    console.error('news refresh failed:', e);
    return NextResponse.json({ error: e.message ?? 'Refresh failed' }, { status: 500 });
  }
}
