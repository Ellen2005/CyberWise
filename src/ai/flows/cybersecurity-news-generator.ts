'use server';

/**
 * @fileOverview A cybersecurity news generation AI agent.
 *
 * - generateCyberNews - A function that generates cybersecurity news.
 * - GenerateCyberNewsOutput - The return type for the generateCyberNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NewsItemSchema = z.object({
  title: z.string().describe("The headline of the news article."),
  source: z.string().describe("The fictional source of the news (e.g., 'CyberSec Today')."),
  date: z.string().describe("A relative date for the article (e.g., '1 day ago', '2 hours ago')."),
  description: z.string().describe("A brief, one or two sentence summary of the article."),
  link: z.string().default("#").describe("A placeholder link, should be '#'."),
  imageId: z.enum(['news1', 'news2', 'news3', 'news4', 'news5', 'news6', 'news7', 'news8', 'news9', 'news10', 'news11', 'news12', 'news13', 'news14', 'news15', 'news16', 'news17', 'news18', 'news19', 'news20']).describe("An image ID from the allowed list: news1 through news20.")
});

// This is the schema for what the AI prompt itself is expected to return.
const PromptOutputSchema = z.object({
  newsItems: z.array(NewsItemSchema).max(20).describe("An array of up to 20 recent-sounding cybersecurity news items.")
});

// This is the schema for the overall flow's output, which can include an error.
const GenerateCyberNewsOutputSchema = z.object({
  newsItems: z.array(NewsItemSchema),
  error: z.string().optional(),
});


export type NewsItem = z.infer<typeof NewsItemSchema>;
export type GenerateCyberNewsOutput = z.infer<typeof GenerateCyberNewsOutputSchema>;

export async function generateCyberNews(): Promise<GenerateCyberNewsOutput> {
  return generateCyberNewsFlow();
}

const newsPrompt = ai.definePrompt({
  name: 'generateCyberNewsPrompt',
  output: { schema: PromptOutputSchema },
  prompt: `You are a cybersecurity news aggregator. Generate a list of 20 recent, realistic, and varied cybersecurity news headlines. For each item, provide a title, a fictional source, a relative date, a short description, and an imageId from the list: news1, news2, ..., news20. Do not use the same imageId more than once.`
});

const generateCyberNewsFlow = ai.defineFlow(
  {
    name: 'generateCyberNewsFlow',
    outputSchema: GenerateCyberNewsOutputSchema,
  },
  async (): Promise<GenerateCyberNewsOutput> => {
    try {
        const { output } = await newsPrompt();
        // Fallback in case the model returns fewer than 20 items or duplicates imageIds
        const uniqueNewsItems = output?.newsItems ? [...new Map(output.newsItems.map(item => [item.imageId, item])).values()] : [];
        
        const allImageIds: NewsItem['imageId'][] = ['news1', 'news2', 'news3', 'news4', 'news5', 'news6', 'news7', 'news8', 'news9', 'news10', 'news11', 'news12', 'news13', 'news14', 'news15', 'news16', 'news17', 'news18', 'news19', 'news20'];
        const usedImageIds = new Set(uniqueNewsItems.map(item => item.imageId));

        for (const imageId of allImageIds) {
          if (uniqueNewsItems.length >= 20) break;
          if (!usedImageIds.has(imageId)) {
            uniqueNewsItems.push({
                title: "New Security Patch Released for Critical Server Vulnerability",
                source: "Tech Journal",
                date: `${uniqueNewsItems.length + 1} days ago`,
                description: "A critical vulnerability has been patched in widely used server software. Admins are urged to update their systems immediately.",
                link: "#",
                imageId: imageId
            });
          }
        }
        
        return { newsItems: uniqueNewsItems.slice(0, 20) };
    } catch (e: any) {
        // Instead of throwing, we return the error in the payload.
        // This prevents the Next.js development error overlay.
        return { newsItems: [], error: e.message || 'An unknown error occurred while generating news.' };
    }
  }
);
