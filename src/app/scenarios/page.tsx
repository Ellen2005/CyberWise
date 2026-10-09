'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessagesSquare, CheckCircle2, Eye, Brain, ListChecks, MessageCircle, Mail, Phone, Globe } from 'lucide-react';

function channelIcon(channel: string) {
  const c = channel.toLowerCase();
  if (c.includes('whatsapp') || c.includes('sms') || c.includes('telegram')) return MessageCircle;
  if (c.includes('mail')) return Mail;
  if (c.includes('phone') || c.includes('call') || c.includes('appel')) return Phone;
  if (c.includes('instagram') || c.includes('facebook') || c.includes('social')) return MessagesSquare;
  return Globe;
}
import { scenarios } from '@/lib/content/scenarios';
import { scenarios2 } from '@/lib/content/scenarios-2';
import { localizeScenario } from '@/lib/content/localize';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useLanguage } from '@/components/language-provider';

export default function ScenariosPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');
  const ALL = useMemo(
    () => [...scenarios, ...scenarios2].map((s) => localizeScenario(s, lang)),
    [lang]
  );
  const [cat, setCat] = useState('all');

  const attemptsRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, 'users', user.uid, 'attempts') : null),
    [user, firestore]
  );
  const { data: attempts } = useCollection(attemptsRef as any);
  const done = useMemo(
    () =>
      new Set(
        ((attempts as any[]) ?? [])
          .filter((a) => a.status === 'completed' && a.contentType === 'quiz' && String(a.contentId).startsWith('sc-'))
          .map((a) => a.contentId)
      ),
    [attempts]
  );

  const cats = useMemo(() => ['all', ...Array.from(new Set(ALL.map((s) => s.category)))], []);
  const filtered = ALL.filter(
    (s) =>
      (cat === 'all' || s.category === cat) &&
      (!search || (s.title + s.message).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <MessagesSquare className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">{t.scenariosHub.title}</h1>
          <p className="text-muted-foreground">{t.scenariosHub.sub}</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 text-sm font-medium"><Eye className="h-4 w-4" />{t.player.steps[0]}</span>
          <span className="flex items-center gap-2 text-sm font-medium"><Brain className="h-4 w-4" />{t.player.steps[1]}</span>
          <span className="flex items-center gap-2 text-sm font-medium"><ListChecks className="h-4 w-4" />{t.player.steps[2]}</span>
          <span className="text-sm text-muted-foreground">{t.scenariosHub.loopNote}</span>
          <span className="ml-auto text-sm text-muted-foreground">{done.size}/{ALL.length} {t.scenariosHub.completed}</span>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder={t.scenariosHub.searchPh}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
          aria-label={t.scenariosHub.searchPh}
        />
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <Badge
              key={c}
              variant={cat === c ? 'default' : 'secondary'}
              className="cursor-pointer px-3 py-1.5"
              onClick={() => setCat(c)}
            >
              {c === 'all' ? 'All' : c}
            </Badge>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed py-16 text-center text-muted-foreground">
          {t.scenariosHub.noMatch}
        </div>
      ) : (
        <div className="grid animate-rise gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const ChannelIcon = channelIcon(s.channel);
            return (
            <Link key={s.id} href={`/scenarios/${s.slug}`} className="flex">
              <Card className="flex w-full flex-col transition-all hover:border-primary/80 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1"><ChannelIcon className="h-3.5 w-3.5" />{s.channel}</Badge>
                    {done.has(s.id) && <CheckCircle2 className="h-5 w-5 text-green-500" aria-label={t.scenariosHub.completed} />}
                  </div>
                  <CardTitle className="font-headline text-xl">{s.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{s.category}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">+{s.xpReward} XP</CardContent>
              </Card>
            </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
