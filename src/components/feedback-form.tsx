'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function FeedbackForm({ contentType = 'platform', contentId = '' }: { contentType?: string; contentId?: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [kind, setKind] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!user || !firestore) {
      toast({ title: 'Sign in to send feedback', description: 'We need your account so admins can follow up.' });
      return;
    }
    if (message.trim().length < 5) {
      toast({ variant: 'destructive', title: 'Too short', description: 'Please describe the issue in a few words.' });
      return;
    }
    setSending(true);
    try {
      const ref = doc(collection(firestore, 'feedback'));
      await setDoc(ref, {
        userId: user.uid,
        contentType,
        contentId: contentId || null,
        type: kind,
        message: message.trim().slice(0, 2000),
        status: 'open',
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setMessage('');
      toast({ title: 'Thanks!', description: 'Your report was sent to the CyberWise team.' });
    } catch {
      toast({ variant: 'destructive', title: 'Could not send', description: 'Check your connection and try again.' });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Feedback received. Admins triage reports in the admin console. <Button variant="link" className="h-auto p-0" onClick={() => setSent(false)}>Send another</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg">Report a problem or suggest content</CardTitle>
        <CardDescription>Wrong answer, confusing lesson, harmful content, or an idea — admins review every report.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="fb-kind">Type</Label>
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger id="fb-kind" className="min-h-[44px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="wrong-answer">Wrong answer</SelectItem>
              <SelectItem value="confusing">Confusing content</SelectItem>
              <SelectItem value="inappropriate">Inappropriate content</SelectItem>
              <SelectItem value="suggestion">Suggestion</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="fb-msg">Details</Label>
          <Textarea id="fb-msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What happened? Which page?" className="min-h-[100px]" maxLength={2000} />
        </div>
        <Button onClick={submit} disabled={sending} className="min-h-[44px]">
          {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Send report
        </Button>
        {!user && <p className="text-xs text-muted-foreground">Sign in required to send.</p>}
      </CardContent>
    </Card>
  );
}
