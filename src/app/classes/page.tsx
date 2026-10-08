'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { School, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import {
  collection, doc, setDoc, getDocs, query, where, serverTimestamp,
} from 'firebase/firestore';
import { makeClassCode, normalizeClassCode, isValidClassCode } from '@/lib/classes/code';
import { useToast } from '@/hooks/use-toast';

export default function ClassesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState<'create' | 'join' | null>(null);

  const myRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, 'users', user.uid, 'myClasses') : null),
    [user, firestore]
  );
  const { data: myClasses } = useCollection(myRef as any);
  const mine = ((myClasses as any[]) ?? []);

  const create = async () => {
    if (!user || !firestore || name.trim().length < 3) {
      toast({ variant: 'destructive', title: 'Name your class', description: 'Give the class a name first (3+ characters).' });
      return;
    }
    setBusy('create');
    try {
      const invite = makeClassCode();
      const ref = doc(collection(firestore, 'classes'));
      await setDoc(ref, { name: name.trim().slice(0, 80), code: invite, ownerId: user.uid, createdAt: serverTimestamp() });
      // Owner joins their own roster automatically.
      await setDoc(doc(firestore, 'classes', ref.id, 'members', user.uid), {
        displayName: user.displayName ?? 'Teacher',
        joinedAt: serverTimestamp(),
      });
      setName('');
      toast({ title: 'Class created', description: `Invite code: ${invite}. Share it with learners.` });
    } catch {
      toast({ variant: 'destructive', title: 'Could not create', description: 'Try again.' });
    } finally {
      setBusy(null);
    }
  };

  const join = async () => {
    if (!user || !firestore) {
      toast({ title: 'Sign in to join', description: 'You need an account to join a class.' });
      return;
    }
    const clean = normalizeClassCode(code);
    if (!isValidClassCode(clean)) {
      toast({ variant: 'destructive', title: 'Invalid code', description: 'Check the code and try again.' });
      return;
    }
    setBusy('join');
    try {
      const snap = await getDocs(query(collection(firestore, 'classes'), where('code', '==', clean)));
      if (snap.empty) {
        toast({ variant: 'destructive', title: 'No class found', description: 'No class uses that code.' });
        return;
      }
      const cls = snap.docs[0];
      await setDoc(doc(firestore, 'classes', cls.id, 'members', user.uid), {
        displayName: user.displayName ?? 'Learner',
        joinedAt: serverTimestamp(),
      });
      await setDoc(doc(firestore, 'users', user.uid, 'myClasses', cls.id), {
        classId: cls.id,
        name: (cls.data() as any).name ?? 'Class',
        joinedAt: serverTimestamp(),
      });
      setCode('');
      toast({ title: 'Joined!', description: 'Your progress now counts toward this class.' });
    } catch {
      toast({ variant: 'destructive', title: 'Could not join', description: 'Try again.' });
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <School className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Classes</h1>
          <p className="text-muted-foreground">Teachers create a class, share a 6-letter code, and see the roster. Learners join with the code.</p>
        </div>
      </div>

      {!user && (
        <Card><CardContent className="p-6 text-sm text-muted-foreground">Sign in to create or join a class.</CardContent></Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="font-headline">Create a class</CardTitle><CardDescription>For teachers, facilitators, parents.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="class-name">Class name</Label>
              <Input id="class-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Form 4 Safety Club" maxLength={80} className="min-h-[44px]" />
            </div>
            <Button onClick={create} disabled={busy === 'create' || !user} className="min-h-[44px]">
              {busy === 'create' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create + get code
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-headline">Join with a code</CardTitle><CardDescription>Got a code from your teacher? Enter it here.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="class-code">Invite code</Label>
              <Input id="class-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. KQ7M2X" maxLength={12} className="min-h-[44px] font-mono uppercase" />
            </div>
            <Button onClick={join} disabled={busy === 'join' || !user} className="min-h-[44px]">
              {busy === 'join' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Join class
            </Button>
          </CardContent>
        </Card>
      </div>

      {mine.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-headline text-xl font-semibold">My classes</h2>
          {mine.map((c: any) => (
            <Card key={c.id}>
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <span className="font-medium">{c.name}</span>
                <Button asChild size="sm" className="min-h-[36px]"><Link href={`/classes/${c.classId ?? c.id}`}>Open</Link></Button>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}
