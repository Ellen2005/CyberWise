import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8" aria-busy="true" aria-label="Loading">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading CyberWise…</p>
    </main>
  );
}
