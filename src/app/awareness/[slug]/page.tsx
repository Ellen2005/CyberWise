import { articles } from "@/lib/articles";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SaveArticleButton } from "@/components/save-article-button";

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="relative h-64 md:h-96 w-full">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover"
          priority
          data-ai-hint={article.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto max-w-4xl -mt-24 md:-mt-32 relative z-10 px-4">
        <div className="bg-card p-6 md:p-8 rounded-lg shadow-xl">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <Badge variant="secondary" className="mb-4">{article.category}</Badge>
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary">
                {article.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-6">{article.description}</p>
            </div>
            <div className="flex-shrink-0 ml-4 mt-2">
              <SaveArticleButton articleSlug={article.slug} />
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none py-8 text-lg text-foreground/80 prose-headings:font-headline prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
