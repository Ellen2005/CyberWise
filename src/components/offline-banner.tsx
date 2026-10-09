'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { WifiOff } from 'lucide-react';

/** Visible connectivity failures need visible UI, not silent hangs. */
export function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  if (online) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-black" role="alert">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>
        No connection — your progress saves when signal returns.{' '}
        <Link href="/offline" className="underline">Open offline safety</Link>
      </span>
    </div>
  );
}
