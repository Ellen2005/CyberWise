import { NextResponse } from 'next/server';
import { fetchKevItems } from '@/lib/server/kev';

export const dynamic = 'force-dynamic';

/**
 * Source-grounded threat items from CISA's Known Exploited Vulnerabilities
 * catalog (public, no key). Real CVEs, real vendors, real dates, NVD links.
 * Never invents, never fills with placeholders: fewer items beats fake items.
 */
export async function GET() {
  const items = await fetchKevItems(20);
  if (items.length === 0) {
    return NextResponse.json({ items: [], error: 'KEV feed unreachable' }, { status: 502 });
  }
  return NextResponse.json({ items });
}
