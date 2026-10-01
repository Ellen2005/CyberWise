import type { LessonContentBlock } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lightbulb, AlertTriangle } from 'lucide-react';

export function LessonContentBlocks({ blocks }: { blocks: LessonContentBlock[] }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            if (block.level === 3) {
              return (
                <h3 key={i} className="font-headline text-xl font-semibold mt-6">
                  {block.text}
                </h3>
              );
            }
            return (
              <h2 key={i} className="font-headline text-2xl font-semibold mt-8">
                {block.text}
              </h2>
            );
          case 'text':
            return (
              <p key={i} className="text-foreground/90 leading-relaxed">
                {block.text}
              </p>
            );
          case 'list':
            return (
              <ul key={i} className="list-disc pl-6 space-y-2 text-foreground/90">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case 'code':
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono"
              >
                <code>{block.code}</code>
              </pre>
            );
          case 'callout': {
            const Icon =
              block.variant === 'warning'
                ? AlertTriangle
                : block.variant === 'tip'
                  ? Lightbulb
                  : Info;
            return (
              <Alert key={i} className="not-prose">
                <Icon className="h-4 w-4" />
                <AlertDescription>{block.text}</AlertDescription>
              </Alert>
            );
          }
          case 'image':
            return (
              <figure key={i} className="not-prose">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.url} alt={block.alt} className="rounded-lg border w-full max-h-80 object-cover" />
                {block.caption && (
                  <figcaption className="text-sm text-muted-foreground mt-2">{block.caption}</figcaption>
                )}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
