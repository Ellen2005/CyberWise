'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Clock, CheckCircle2 } from 'lucide-react';
import { seedLessons } from '@/lib/seed/lessons';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';

const LEVELS = [
  { id: 1, name: 'Stay Safe Online', desc: 'Everyday habits that stop most attacks.', slugs: ['what-is-cybersecurity', 'password-security', 'two-factor-authentication'] },
  { id: 2, name: 'Recognize Threats', desc: 'Spot phishing, scams, and malware.', slugs: ['phishing-basics', 'malware-and-ransomware'] },
  { id: 3, name: 'Investigate', desc: 'Check senders, links, and networks like an analyst.', slugs: ['networks-101', 'everyday-smart-devices'] },
  { id: 4, name: 'Respond', desc: 'Secure accounts, preserve evidence, report. Practice in Get Help and the simulators.', slugs: [] as string[], links: [{ href: '/help/been-scammed', title: 'Response checklists', desc: 'Clicked, paid, hacked, harassed — what to do first.' }, { href: '/simulators/wwyd', title: 'What Would You Do?', desc: 'Decide, then learn safe vs risky.' }] },
  { id: 5, name: 'Cybersecurity Foundations', desc: 'Technical basics for curious learners.', slugs: [] as string[], links: [{ href: '/challenges', title: 'Hands-on challenges', desc: 'Log analysis, web basics, crypto, OSINT.' }] },
  { id: 6, name: 'Practical Cybersecurity', desc: 'Guided investigations end-to-end.', slugs: [] as string[], links: [{ href: '/challenges/acme-breach-investigation', title: 'Acme breach investigation', desc: 'Trace initial access to impact from evidence.' }] },
];

export default function LearnPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const attemptsRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, 'users', user.uid, 'attempts') : null),
    [user, firestore]
  );
  const { data: attempts } = useCollection(attemptsRef as any);
  const completed = useMemo(
    () => new Set((attempts as any[] | null)?.filter((a) => a.status === 'completed' && (a.contentType === 'lesson' || a.contentType === 'quiz')).map((a) => a.contentId) ?? []),
    [attempts]
  );

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <GraduationCap className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">Learning Paths</h1>
          <p className="text-muted-foreground">Start with Level 1. Short lessons, plain language, quizzes that explain why.</p>
        </div>
      </div>

      {LEVELS.map((level) => (
        <section key={level.id} className="space-y-3">
          <h2 className="font-headline text-xl font-semibold">Level {level.id} — {level.name}</h2>
          <p className="text-sm text-muted-foreground">{level.desc}</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {seedLessons.filter((l) => level.slugs.includes(l.slug)).map((lesson) => {
              const done = completed.has(lesson.id);
              return (
                <Link key={lesson.id} href={`/learn/${lesson.slug}`} className="flex">
                  <Card className="flex w-full flex-col transition-all hover:border-primary/80 hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary">{lesson.difficulty}</Badge>
                        {done && <CheckCircle2 className="h-5 w-5 text-green-500" aria-label="Completed" />}
                      </div>
                      <CardTitle className="font-headline text-xl">{lesson.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{lesson.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{lesson.estimatedMinutes} min</span>
                      <span>+{lesson.xpReward} XP</span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
            {(level.links ?? []).map((l) => (
              <Link key={l.href} href={l.href} className="flex">
                <Card className="flex w-full flex-col border-primary/30 transition-all hover:border-primary/80 hover:shadow-lg">
                  <CardHeader>
                    <Badge variant="secondary">Practice</Badge>
                    <CardTitle className="font-headline text-xl">{l.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{l.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="space-y-3">
        <h2 className="font-headline text-xl font-semibold">All lessons</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {seedLessons.filter((l) => l.published).map((lesson) => (
            <Link key={lesson.id} href={`/learn/${lesson.slug}`} className="flex">
              <Card className="flex w-full flex-col transition-all hover:border-primary/80">
                <CardHeader>
                  <CardTitle className="font-headline text-lg">{lesson.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">+{lesson.xpReward} XP · {lesson.estimatedMinutes} min</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
