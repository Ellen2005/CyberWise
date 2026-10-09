import { NextResponse } from 'next/server';
import { fetchKevItems } from '@/lib/server/kev';
import { adminDb } from '@/lib/server/admin-db';
import { rateLimit } from '@/lib/security/rate-limiter';

/**
 * Scheduled news refresh. Call every few hours from Vercel Cron:
 *   GET /api/news/refresh?key=<CRON_SECRET>
 * Writes the shared cache the news page reads, so readers never wait on AI.
 * Source: CISA KEV catalog only — no generated filler, ever.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const expected = process.env.CRON_SECRET;
  if (!expected || searchParams.get('key') !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Refreshing costs one upstream fetch: cap hits well above the 6h schedule.
  const { allowed } = rateLimit('news-refresh', 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many refreshes' }, { status: 429 });
  }

  try {
    const items = await fetchKevItems(20);
    if (items.length === 0) {
      return NextResponse.json({ error: 'KEV feed unreachable' }, { status: 502 });
    }
    await adminDb()
      .collection('newsCache')
      .doc('current')
      .set({ items, updatedAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, count: items.length });
  } catch (e: any) {
    console.error('news refresh failed:', e);
    return NextResponse.json({ error: e.message ?? 'Refresh failed' }, { status: 500 });
  }
}
