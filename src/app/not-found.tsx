import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <Compass className="h-16 w-16 text-muted-foreground" />
      <h1 className="font-headline text-3xl font-bold">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist or is still being built. Try the dashboard or learning paths.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="touch-target">
          <Link href="/">Dashboard</Link>
        </Button>
        <Button asChild variant="outline" className="touch-target">
          <Link href="/learn">Learning paths</Link>
        </Button>
      </div>
    </main>
  );
}
