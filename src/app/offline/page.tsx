import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, ShieldCheck } from 'lucide-react';
import { POWERS } from '@/lib/content/sessions';

export default function OfflinePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <WifiOff className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold">You are offline</h1>
          <p className="text-muted-foreground">
            No connection — but safety does not need one. Review the 5 Powers; everything else returns with signal.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {POWERS.map((p, i) => (
          <Card key={p.id} className={i === 0 ? 'sm:col-span-2' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-xl">{i + 1}. {p.name}</CardTitle>
            </CardHeader>
            <CardContent><CardDescription className="text-sm">{p.desc}</CardDescription></CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-primary/40">
        <CardHeader><CardTitle className="flex items-center gap-2 font-headline text-lg"><ShieldCheck className="h-5 w-5" />When signal returns</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="min-h-[44px]"><Link href="/">Retry dashboard</Link></Button>
          <Button asChild variant="outline" className="min-h-[44px]"><Link href="/powers">5 Powers poster</Link></Button>
        </CardContent>
      </Card>
    </main>
  );
}
