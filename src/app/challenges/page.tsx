'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Clock, Lock, CheckCircle2, Flame, Trophy } from 'lucide-react';
import { seedChallenges, challengeCategories, CHALLENGE_TYPE_META, DIFFICULTY_META } from '@/lib/seed/challenges';
import { seedHints } from '@/lib/seed/challenges';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { NamedIcon } from '@/components/icon-map';
import type { ChallengeType, Difficulty } from '@/types';

export default function ChallengesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Load user's completed challenges for status display
  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'attempts');
  }, [user, firestore]);
  const { data: attempts } = useCollection(userDocRef);

  const completedIds = useMemo(() => {
    if (!attempts) return new Set<string>();
    return new Set(
      attempts
        .filter((a: any) => a.contentType === 'challenge' && a.status === 'completed')
        .map((a: any) => a.contentId)
    );
  }, [attempts]);

  const solvedIds = useMemo(() => {
    if (!attempts) return new Set<string>();
    return new Set(
      attempts
        .filter((a: any) => a.contentType === 'challenge' && a.correct)
        .map((a: any) => a.contentId)
    );
  }, [attempts]);

  const filtered = useMemo(() => {
    return seedChallenges
      .filter((c) => c.published)
      .filter((c) => {
        if (categoryFilter !== 'all' && c.categoryId !== categoryFilter) return false;
        if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) return false;
        if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.description.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [search, categoryFilter, difficultyFilter]);

  const solvedCount = solvedIds.size;
  const totalCount = seedChallenges.filter((c) => c.published).length;

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Target className="h-10 w-10 text-primary" />
          <div>
            <h1 className="font-headline text-4xl font-bold tracking-tight">Challenges</h1>
            <p className="text-muted-foreground">Put your skills to the test. Solve challenges, earn XP, and unlock badges.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <CheckCircle2 className="mr-1 h-4 w-4 text-green-400" />
            {solvedCount}/{totalCount} solved
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search challenges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {challengeCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="sm:w-[160px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            {Object.entries(DIFFICULTY_META).map(([key, meta]) => (
              <SelectItem key={key} value={key}>{meta.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Challenge Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Target className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="mt-6 font-headline text-2xl font-semibold">No challenges found</h2>
          <p className="mt-2 text-muted-foreground">Try adjusting your filters or search.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((challenge) => {
            const typeMeta = CHALLENGE_TYPE_META[challenge.type];
            const diffMeta = DIFFICULTY_META[challenge.difficulty];
            const isCompleted = completedIds.has(challenge.id);
            const isSolved = solvedIds.has(challenge.id);
            const hintCount = seedHints[challenge.id]?.length || 0;
            const isLocked = challenge.prerequisites.length > 0 && !challenge.prerequisites.every((p) => solvedIds.has(p));
            const card = (
                <Card className="flex flex-col w-full group overflow-hidden hover:border-primary/80 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <NamedIcon name={typeMeta.icon} className={cn('h-6 w-6', typeMeta.color)} />
                      {isSolved ? (
                        <Badge className="bg-green-500/15 text-green-400 border-green-500/30">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Solved
                        </Badge>
                      ) : isLocked ? (
                        <Badge variant="secondary">
                          <Lock className="mr-1 h-3 w-3" /> Locked
                        </Badge>
                      ) : null}
                    </div>
                    <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">
                      {challenge.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={cn("text-xs px-2 py-1 rounded-full border", diffMeta.color)}>
                        {diffMeta.label}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full border border-primary/20 text-primary bg-primary/5">
                        {typeMeta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-400" /> {challenge.points} pts
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {challenge.estimatedMinutes} min
                      </span>
                      {hintCount > 0 && <span className="text-xs">{hintCount} hints</span>}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      {isLocked ? 'Complete prerequisites first' : isCompleted ? 'Review Challenge' : 'Start Challenge'} →
                    </span>
                  </CardFooter>
                </Card>
            );
            if (isLocked) {
              return <div key={challenge.id} className="flex opacity-80" title="Locked — complete prerequisites first">{card}</div>;
            }
            return (
              <Link href={`/challenges/${challenge.slug}`} key={challenge.id} className="flex">
                {card}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}