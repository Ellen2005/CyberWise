import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/admin-db';

export const dynamic = 'force-dynamic';

/** Public read of the scheduled news cache. Falls back to null when stale/missing. */
export async function GET() {
  try {
    const snap = await adminDb().collection('newsCache').doc('current').get();
    if (!snap.exists) return NextResponse.json({ items: null });
    const data = snap.data() as { items: unknown[]; updatedAt?: string };
    const ageMs = data.updatedAt ? Date.now() - new Date(data.updatedAt).getTime() : Infinity;
    return NextResponse.json({
      items: ageMs < 6 * 60 * 60 * 1000 ? data.items : null,
      updatedAt: data.updatedAt ?? null,
    });
  } catch (e) {
    console.error('news cache read failed:', e);
    return NextResponse.json({ items: null });
  }
}
