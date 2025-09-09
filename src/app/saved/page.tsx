'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { articles } from "@/lib/articles";
import { Bookmark, ArrowRight, BookOpen } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SaveArticleButton } from '@/components/save-article-button';
import { Skeleton } from '@/components/ui/skeleton';

export default function SavedArticlesPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const savedArticlesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'savedArticles');
  }, [user, firestore]);

  const { data: savedSlugs, loading: articlesLoading } = useCollection(savedArticlesQuery);

  const savedArticles = savedSlugs
    ? articles.filter(article => savedSlugs.some(slugDoc => slugDoc.slug === article.slug))
    : [];
    
  const isLoading = userLoading || articlesLoading;

  if (isLoading) {
    return (
       <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center gap-4">
                <Bookmark className="h-10 w-10 text-primary" />
                <div>
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    Saved Articles
                </h1>
                <p className="text-muted-foreground">
                    Your personal collection of cybersecurity knowledge.
                </p>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="p-0">
                             <Skeleton className="h-48 w-full" />
                            <div className="p-6">
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-5/6 mt-2" />
                        </CardContent>
                         <CardFooter>
                              <Skeleton className="h-8 w-24" />
                         </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    )
  }

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
        <Bookmark className="h-16 w-16 text-muted-foreground" />
        <h1 className="font-headline text-3xl font-bold">Sign in to See Your Saved Articles</h1>
        <p className="text-muted-foreground">Log in to build your personal cybersecurity library.</p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Bookmark className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Saved Articles
          </h1>
          <p className="text-muted-foreground">
            Your personal collection of cybersecurity knowledge.
          </p>
        </div>
      </div>
      
      {savedArticles.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/50" />
            <h2 className="mt-6 font-headline text-2xl font-semibold">No Articles Saved Yet</h2>
            <p className="mt-2 text-muted-foreground">
                Head over to the Awareness Hub to start building your collection.
            </p>
            <Button asChild variant="outline" className="mt-6">
                <Link href="/awareness">Browse Articles</Link>
            </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedArticles.map((article) => (
             <Card key={article.slug} className="flex flex-col w-full group overflow-hidden hover:border-primary/80 hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                    <Link href={`/awareness/${article.slug}`}>
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={article.imageHint}
                    />
                    </Link>
                </div>
                <div className="p-6">
                    <Link href={`/awareness/${article.slug}`}>
                    <CardTitle className="font-headline text-xl ">{article.title}</CardTitle>
                    </Link>
                </div>
                </CardHeader>
                <CardContent className="flex-grow">
                <CardDescription>{article.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">{article.category}</p>
                 <div className="flex items-center gap-1">
                    <SaveArticleButton articleSlug={article.slug} />
                    <Link href={`/awareness/${article.slug}`} className="flex items-center gap-2 text-primary hover:underline">
                        <span>Read More</span>
                        <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
                </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
