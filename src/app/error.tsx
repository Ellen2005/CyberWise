'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <CardTitle className="font-headline text-2xl">Something went wrong</CardTitle>
          <CardDescription>
            We ran into a problem loading this page. Your progress is safe.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button onClick={() => reset()} className="w-full touch-target">
            Try again
          </Button>
          <Button variant="outline" asChild className="w-full touch-target">
            <a href="/">Back to dashboard</a>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
