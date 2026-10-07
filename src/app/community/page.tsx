'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Loader2, Send } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { communityPostSchema, COMMUNITY_RULES, type PostKind } from '@/lib/community/schema';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/language-provider';

type Post = {
  id: string;
  authorId: string;
  displayName?: string;
  kind: PostKind;
  title: string;
  body: string;
  status: string;
  createdAt?: any;
};

const KIND_LABEL: Record<PostKind, string> = { story: 'Story', tip: 'Tip', question: 'Question' };

export default function CommunityPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { lang } = useLanguage();
  const [kind, setKind] = useState<PostKind>('story');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const feedQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'communityPosts'), orderBy('createdAt', 'desc'), limit(50)) : null),
    [firestore]
  );
  const { data, loading } = useCollection(feedQuery as any);
  const posts = useMemo(() => {
    const all = ((data as any[]) ?? []) as Post[];
    // Rules already filter server-side; mirror it client-side for guests.
    return all.filter((p) => p.status === 'approved' || (user && p.authorId === user.uid));
  }, [data, user]);
  const mine = useMemo(() => posts.filter((p) => user && p.authorId === user.uid), [posts, user]);

  const submit = async () => {
    if (!user || !firestore) {
      toast({ title: 'Sign in to post', description: 'Community posts need an account for moderation.' });
      return;
    }
    const parsed = communityPostSchema.safeParse({ kind, title: title.trim(), body: body.trim() });
    if (!parsed.success) {
      setErrors(parsed.error.issues.map((i) => i.message));
      return;
    }
    setErrors([]);
    setSending(true);
    try {
      await addDoc(collection(firestore, 'communityPosts'), {
        authorId: user.uid,
        displayName: user.displayName ?? 'Learner',
        kind: parsed.data.kind,
        title: parsed.data.title,
        body: parsed.data.body,
        lang,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setTitle('');
      setBody('');
      toast({ title: 'Sent for review', description: 'A moderator approves posts before they appear publicly.' });
    } catch {
      toast({ variant: 'destructive', title: 'Could not send', description: 'Check your connection and try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <Users className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold md:text-4xl">Community voices</h1>
          <p className="text-muted-foreground">Real experiences from learners. Every post is reviewed before it appears.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-headline">Share your experience</CardTitle><CardDescription>Signed-in members only. Posts stay pending until approved.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            {COMMUNITY_RULES.map((r) => (<li key={r}>{r}</li>))}
          </ul>
          <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
            <div className="space-y-1">
              <Label htmlFor="post-kind">Type</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as PostKind)}>
                <SelectTrigger id="post-kind" className="min-h-[44px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="tip">Tip</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="post-title">Title</Label>
              <Input id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The call that almost got me" maxLength={120} className="min-h-[44px]" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="post-body">Your story, tip, or question</Label>
            <Textarea id="post-body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="What happened? What did you learn? (no phone numbers or personal details)" className="min-h-[120px]" maxLength={2000} />
          </div>
          {errors.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-destructive">
              {errors.map((e) => (<li key={e}>{e}</li>))}
            </ul>
          )}
          <Button onClick={submit} disabled={sending} className="min-h-[44px]">
            {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Submit for review
          </Button>
          {!user && <p className="text-xs text-muted-foreground">Sign in required to post. Reading is open to everyone.</p>}
        </CardContent>
      </Card>

      {mine.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-headline text-xl font-semibold">Your posts</h2>
          {mine.filter((p) => p.status !== 'approved').map((p) => (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2"><Badge variant="secondary">{p.status}</Badge></div>
                <CardTitle className="font-headline text-lg">{p.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-headline text-xl font-semibold">Latest voices</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : posts.filter((p) => p.status === 'approved').length === 0 ? (
          <div className="rounded-lg border-2 border-dashed py-12 text-center">
            <p className="font-medium">No voices yet — yours could be first.</p>
            <p className="mt-1 text-sm text-muted-foreground">Share a scam you spotted or a tip that protected you.</p>
          </div>
        ) : (
          posts.filter((p) => p.status === 'approved').map((p) => (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge>{KIND_LABEL[p.kind] ?? p.kind}</Badge>
                  <span className="text-xs text-muted-foreground">{p.displayName ?? 'Learner'}</span>
                </div>
                <CardTitle className="font-headline text-lg">{p.title}</CardTitle>
              </CardHeader>
              <CardContent><p className="whitespace-pre-wrap text-sm leading-relaxed">{p.body}</p></CardContent>
            </Card>
          ))
        )}
      </section>
    </main>
  );
}
