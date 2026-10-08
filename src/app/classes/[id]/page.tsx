'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Check, School, Loader2 } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type Member = { id: string; displayName: string };
type MemberStat = Member & { xp: number | null; level: number | null; streak: number | null };

export default function ClassDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [members, setMembers] = useState<MemberStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user || !firestore) return;
    (async () => {
      try {
        const snap = await getDoc(doc(firestore, 'classes', params.id));
        if (!snap.exists()) {
          toast({ variant: 'destructive', title: 'Class not found', description: 'Check the link and try again.' });
          return;
        }
        const data = snap.data() as any;
        setName(data.name ?? 'Class');
        setCode(data.code ?? '');
        const owner = data.ownerId === user.uid;
        setIsOwner(owner);

        const memSnap = await getDocs(collection(firestore, 'classes', params.id, 'members'));
        const roster: Member[] = memSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        // Stats come from public profiles only — private profiles stay private.
        // This doubles as a privacy lesson: what you share is what others see.
        const withStats: MemberStat[] = await Promise.all(
          roster.map(async (m) => {
            try {
              const prof = await getDoc(doc(firestore, 'users', m.id));
              if (prof.exists()) {
                const p = prof.data() as any;
                if (p.profileVisibility === 'public' || m.id === user.uid) {
                  return { ...m, xp: p.xp ?? 0, level: p.level ?? 1, streak: p.streak ?? 0 };
                }
              }
            } catch { /* unreadable profile — treat as private */ }
            return { ...m, xp: null, level: null, streak: null };
          })
        );
        setMembers(withStats);
      } catch {
        toast({ variant: 'destructive', title: 'Could not load class', description: 'Try again.' });
      } finally {
        setLoading(false);
      }
    })();
  }, [user, firestore, params.id, toast]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy this code', description: code });
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-8">
      <Link href="/classes" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Classes
      </Link>
      <div className="flex items-center gap-3">
        <School className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold">{name || 'Class'}</h1>
          <p className="text-muted-foreground">{members.length} member{members.length === 1 ? '' : 's'}{isOwner ? ' · you own this class' : ''}</p>
        </div>
      </div>

      {code && (
        <Card className="border-primary/40">
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Invite code</p>
              <p className="font-mono text-2xl font-bold tracking-widest">{code}</p>
            </div>
            <Button variant="outline" onClick={copyCode} className="min-h-[44px]">
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Roster</CardTitle>
          <CardDescription>
            Stats show for public profiles and yourself only. Members with private profiles appear by name —
            visibility is their choice, and that is the point.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading roster…</p>
          ) : members.length === 0 ? (
            <p className="text-muted-foreground">No members yet. Share the invite code.</p>
          ) : (
            <ol className="divide-y">
              {members.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <span className="font-medium">
                    {m.displayName}
                    {m.id === user?.uid && <Badge variant="secondary" className="ml-2">you</Badge>}
                  </span>
                  <span className="text-muted-foreground">
                    {m.xp !== null ? `${m.xp} XP · Lv ${m.level} · ${m.streak}-day streak` : 'private profile'}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
