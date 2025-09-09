'use client';
import { useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter } from '@/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Bookmark, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { FirestorePermissionError } from '@/firebase/errors';

export function SaveArticleButton({ articleSlug }: { articleSlug: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const articleRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'savedArticles', articleSlug);
  }, [user, firestore, articleSlug]);

  const { data: savedArticle, loading } = useDoc(articleRef);

  const isSaved = !!savedArticle;

  const handleSaveToggle = async () => {
    if (!firestore || !user || !articleRef) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be signed in to save articles.',
      });
      return;
    }
    setIsPending(true);

    if (isSaved) {
      deleteDoc(articleRef)
        .then(() => {
          toast({ title: 'Article removed from saved.' });
        })
        .catch(() => {
           const permissionError = new FirestorePermissionError({ path: articleRef.path, operation: 'delete' });
           errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => setIsPending(false));
    } else {
      const data = { slug: articleSlug, savedAt: serverTimestamp() };
      setDoc(articleRef, data)
        .then(() => {
          toast({ title: 'Article saved!' });
        })
        .catch(() => {
            const permissionError = new FirestorePermissionError({
              path: articleRef.path,
              operation: 'create',
              requestResourceData: data,
            });
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => setIsPending(false));
    }
  };
  
  if (!user) {
    return null; // Don't show the button if the user is not logged in.
  }
  
  if (loading) {
    return (
        <Button variant="ghost" size="icon" disabled>
            <Bookmark className="h-5 w-5" />
        </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleSaveToggle} disabled={isPending} title={isSaved ? 'Remove from saved' : 'Save article'}>
      {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Bookmark className={cn('h-5 w-5 transition-colors', isSaved && 'fill-primary text-primary')} /> }
    </Button>
  );
}
