
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, User as UserIcon } from 'lucide-react';
import SecurityScoreChecklist from '@/components/security-score-checklist';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ProfileSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-64" />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-40" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, loading: profileLoading } = useDoc(userProfileRef);

  const isLoading = userLoading || profileLoading;

  if (isLoading) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <ProfileSkeleton />
        </main>
    );
  }

  if (!user) {
     return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
        <UserIcon className="h-16 w-16 text-muted-foreground" />
        <h1 className="font-headline text-3xl font-bold">Sign in to View Your Profile</h1>
        <p className="text-muted-foreground">Log in to see your badges and security score.</p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </main>
    );
  }

  const badges = userProfile?.badges || [];

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                <AvatarFallback className="text-3xl">{user.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="font-headline text-4xl font-bold tracking-tight">{user.displayName}</h1>
                <p className="text-muted-foreground text-lg">{user.email}</p>
            </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>My Badges</CardTitle>
                    <CardDescription>Achievements you've unlocked in CyberWise.</CardDescription>
                </CardHeader>
                <CardContent>
                    {badges.length === 0 ? (
                        <p className="text-muted-foreground">No badges earned yet. Try the Phishing Challenge to earn your first one!</p>
                    ) : (
                        <div className="flex gap-4">
                            {badges.includes('phishing-detective') && (
                                <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
                                    <Award className="h-12 w-12 text-yellow-400" />
                                    <h3 className="font-semibold">Phishing Detective</h3>
                                    <p className="text-xs text-muted-foreground">Perfect score in the Phishing Challenge</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <SecurityScoreChecklist />
    </main>
  );
}
