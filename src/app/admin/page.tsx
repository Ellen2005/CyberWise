'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Users, Flag, Bot, GraduationCap, LayoutDashboard, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { seedLessons } from '@/lib/seed/lessons';
import { seedChallenges } from '@/lib/seed/challenges';
import { cyberStories } from '@/lib/content/stories';
import { phishingScenarios } from '@/lib/content/phishing-scenarios';
import { scamScenarios } from '@/lib/content/scam-scenarios';
import { wwydScenarios } from '@/lib/content/wwyd-scenarios';
import { responseGuides } from '@/lib/content/response-guides';
import { BADGES } from '@/lib/gamification/engine';
import { useToast } from '@/hooks/use-toast';

function useIsAdmin() {
  const { user } = useUser();
  const firestore = useFirestore();
  const ref = useMemoFirebase(() => (user && firestore ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
  const { data, loading } = useDoc(ref as any);
  return { user, isAdmin: (data as any)?.role === 'admin', loading, firestore };
}

function Overview() {
  const rows = [
    { label: 'Lessons', count: seedLessons.length, href: '/learn' },
    { label: 'Challenges', count: seedChallenges.length, href: '/challenges' },
    { label: 'Cyber stories', count: cyberStories.length, href: '/stories' },
    { label: 'Phishing scenarios', count: phishingScenarios.length, href: '/simulators/phishing' },
    { label: 'Scam scenarios', count: scamScenarios.length, href: '/simulators/scam' },
    { label: 'WWYD situations', count: wwydScenarios.length, href: '/simulators/wwyd' },
    { label: 'Response guides', count: responseGuides.length, href: '/help/been-scammed' },
    { label: 'Badges', count: BADGES.length, href: '/profile' },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map((r) => (
        <Card key={r.label}>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{r.label}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{r.count}</p>
            <Button asChild variant="link" className="h-auto p-0"><Link href={r.href}>View live</Link></Button>
          </CardContent>
        </Card>
      ))}
      <Card className="sm:col-span-2 lg:col-span-4">
        <CardHeader><CardTitle className="font-headline text-lg">Publishing workflow</CardTitle>
        <CardDescription>Seed content ships with the app. New Firestore-backed items (AI content, feedback, program copy) are reviewed here before they go live. Grant the admin role in the Firebase console (users collection → role = "admin").</CardDescription></CardHeader>
      </Card>
    </div>
  );
}

function UsersTab({ firestore }: { firestore: any }) {
  const q = useMemoFirebase(() => (firestore ? query(collection(firestore, 'users'), orderBy('xp', 'desc'), limit(50)) : null), [firestore]);
  const { data, loading } = useCollection(q as any);
  const users = ((data as any[]) ?? []);
  return (
    <Card>
      <CardHeader><CardTitle className="font-headline">Users (top 50 by XP)</CardTitle><CardDescription>Read-only here. Role changes must be made in the Firebase console or via a Cloud Function (client rules only allow owners to edit their own profile).</CardDescription></CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading…</p> : users.length === 0 ? <p className="text-muted-foreground">No users found (or insufficient permission).</p> : (
          <ol className="divide-y">
            {users.map((u: any) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span className="font-medium">{u.displayName ?? 'Learner'} <span className="text-muted-foreground">· {u.email}</span></span>
                <span className="flex items-center gap-2">
                  <Badge variant="secondary">{u.role ?? 'user'}</Badge>
                  <span className="text-muted-foreground">{u.xp ?? 0} XP · Lv {u.level ?? 1} · 🔥{u.streak ?? 0}</span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

function FeedbackTab({ firestore }: { firestore: any }) {
  const q = useMemoFirebase(() => (firestore ? query(collection(firestore, 'feedback'), limit(50)) : null), [firestore]);
  const { data, loading } = useCollection(q as any);
  const { toast } = useToast();
  const items = ((data as any[]) ?? []);
  const setStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(firestore, 'feedback', id), { status });
      toast({ title: 'Updated', description: `Report marked ${status}.` });
    } catch { toast({ variant: 'destructive', title: 'Update failed', description: 'Check permissions.' }); }
  };
  return (
    <Card>
      <CardHeader><CardTitle className="font-headline">Feedback & reports</CardTitle><CardDescription>User-submitted bugs, wrong answers, and suggestions. Update status as you triage.</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        {loading ? <p className="text-muted-foreground">Loading…</p> : items.length === 0 ? <p className="text-muted-foreground">No reports yet. Users can submit from the Get Help page.</p> : items.map((f: any) => (
          <div key={f.id} className="rounded-md border p-3 text-sm">
            <p className="flex flex-wrap items-center gap-2"><Badge>{f.type ?? 'feedback'}</Badge><Badge variant="secondary">{f.status ?? 'open'}</Badge><span className="text-muted-foreground">{f.contentType}{f.contentId ? `/${f.contentId}` : ''}</span></p>
            <p className="mt-2">{f.message}</p>
            <div className="mt-2 flex gap-2">
              {['open', 'reviewing', 'resolved'].map((s) => (
                <Button key={s} size="sm" variant={f.status === s ? 'default' : 'outline'} onClick={() => setStatus(f.id, s)}>{s}</Button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AIContentTab({ firestore }: { firestore: any }) {
  const q = useMemoFirebase(() => (firestore ? query(collection(firestore, 'aiContent'), limit(50)) : null), [firestore]);
  const { data, loading } = useCollection(q as any);
  const { toast } = useToast();
  const items = ((data as any[]) ?? []);
  const remove = async (id: string) => {
    try { await deleteDoc(doc(firestore, 'aiContent', id)); toast({ title: 'Deleted' }); }
    catch { toast({ variant: 'destructive', title: 'Delete failed' }); }
  };
  return (
    <Card>
      <CardHeader><CardTitle className="font-headline">AI-generated content review</CardTitle><CardDescription>Items created via AI tools land here for review. Delete anything unsuitable before publishing elsewhere.</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        {loading ? <p className="text-muted-foreground">Loading…</p> : items.length === 0 ? <p className="text-muted-foreground">Queue is empty.</p> : items.map((c: any) => (
          <div key={c.id} className="rounded-md border p-3 text-sm">
            <p className="font-medium">{c.title ?? c.id}</p>
            <p className="mt-1 text-muted-foreground line-clamp-3">{c.body ?? JSON.stringify(c).slice(0, 200)}</p>
            <Button size="sm" variant="destructive" className="mt-2" onClick={() => remove(c.id)}>Delete</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ProgramsTab({ firestore }: { firestore: any }) {
  const { toast } = useToast();
  const [safety, setSafety] = useState('');
  const [advanced, setAdvanced] = useState('');
  const [note, setNote] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = doc(firestore, 'config', 'programs');

  const load = async () => {
    try {
      const snap = await getDoc(ref);
      const d: any = snap.exists() ? snap.data() : {};
      setSafety(d.safetyTrack ?? '');
      setAdvanced(d.advancedTrack ?? '');
      setNote(d.opportunitiesNote ?? '');
      setLoaded(true);
    } catch { toast({ variant: 'destructive', title: 'Load failed', description: 'Check permissions.' }); }
  };
  if (!loaded) load();

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(ref, { safetyTrack: safety, advancedTrack: advanced, opportunitiesNote: note, updatedAt: serverTimestamp() }, { merge: true });
      toast({ title: 'Saved', description: 'Programs page will use this copy.' });
    } catch { toast({ variant: 'destructive', title: 'Save failed', description: 'Admin only.' }); }
    finally { setSaving(false); }
  };

  return (
    <Card>
      <CardHeader><CardTitle className="font-headline">Training programs copy</CardTitle><CardDescription>Editable without code. Leave blank to use the built-in defaults. Never promise jobs — keep the “possible opportunities” wording.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1"><Label htmlFor="pg-safety">Stay Safe track</Label><Textarea id="pg-safety" value={safety} onChange={(e) => setSafety(e.target.value)} placeholder="Default: Levels 1–4 description…" className="min-h-[100px]" /></div>
        <div className="space-y-1"><Label htmlFor="pg-adv">Practical track</Label><Textarea id="pg-adv" value={advanced} onChange={(e) => setAdvanced(e.target.value)} placeholder="Default: Levels 5–6 description…" className="min-h-[100px]" /></div>
        <div className="space-y-1"><Label htmlFor="pg-note">Opportunities note</Label><Input id="pg-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Possible opportunities may include…" /></div>
        <Button onClick={save} disabled={saving} className="min-h-[44px]">{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save programs copy</Button>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const { user, isAdmin, loading, firestore } = useIsAdmin();

  if (loading) return <main className="flex flex-1 items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></main>;
  if (!user) return <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center"><ShieldCheck className="h-12 w-12 text-muted-foreground" /><h1 className="font-headline text-2xl font-bold">Sign in required</h1><Button asChild><Link href="/login?next=/admin">Sign in</Link></Button></main>;
  if (!isAdmin) return <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center"><ShieldCheck className="h-12 w-12 text-muted-foreground" /><h1 className="font-headline text-2xl font-bold">Admins only</h1><p className="max-w-md text-muted-foreground">Your account does not have the admin role. Ask an administrator to set role = "admin" on your user document in the Firebase console.</p><Button asChild variant="outline"><Link href="/">Dashboard</Link></Button></main>;

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-10 w-10 text-primary" />
        <div><h1 className="font-headline text-3xl font-bold md:text-4xl">Admin console</h1><p className="text-muted-foreground">Content, users, reports, AI review, programs.</p></div>
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users"><Users className="mr-1 h-4 w-4" />Users</TabsTrigger>
          <TabsTrigger value="feedback"><Flag className="mr-1 h-4 w-4" />Reports</TabsTrigger>
          <TabsTrigger value="ai"><Bot className="mr-1 h-4 w-4" />AI review</TabsTrigger>
          <TabsTrigger value="programs"><GraduationCap className="mr-1 h-4 w-4" />Programs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4"><Overview /></TabsContent>
        <TabsContent value="users" className="mt-4"><UsersTab firestore={firestore} /></TabsContent>
        <TabsContent value="feedback" className="mt-4"><FeedbackTab firestore={firestore} /></TabsContent>
        <TabsContent value="ai" className="mt-4"><AIContentTab firestore={firestore} /></TabsContent>
        <TabsContent value="programs" className="mt-4"><ProgramsTab firestore={firestore} /></TabsContent>
      </Tabs>
    </main>
  );
}
