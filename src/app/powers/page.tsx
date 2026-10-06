import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { POWERS } from '@/lib/content/sessions';

export default function PowersPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">The 5 Safety Powers</h1>
          <p className="text-muted-foreground">Five words to remember after every session. Say them aloud.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {POWERS.map((p, i) => (
          <Card key={p.id} className={i === 0 ? 'sm:col-span-2 border-primary/40' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-2xl tracking-wide">{i + 1}. {p.name}</CardTitle>
            </CardHeader>
            <CardContent><CardDescription className="text-base">{p.desc}</CardDescription></CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button asChild className="min-h-[44px]"><Link href="/scenarios">Practice the powers now</Link></Button>
        <Button asChild variant="outline" className="min-h-[44px]"><Link href="/sessions">Back to sessions</Link></Button>
      </div>
    </main>
  );
}
