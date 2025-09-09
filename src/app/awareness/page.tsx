import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { articles } from "@/lib/articles";
import { BookOpen, ArrowRight } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { SaveArticleButton } from "@/components/save-article-button";

export default function AwarenessPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <BookOpen className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Cybersecurity Awareness Hub
          </h1>
          <p className="text-muted-foreground">
            Expand your knowledge with our collection of articles and guides.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
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
    </main>
  );
}
