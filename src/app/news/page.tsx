'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { generateCyberNews, NewsItem } from "@/ai/flows/cybersecurity-news-generator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsImpact } from "@/components/news-impact";

type CachedNews = {
  timestamp: number;
  items: NewsItem[];
};

const CACHE_KEY = 'cyberwise_news_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fallbackNews: NewsItem[] = [
    { title: "AI News Feed Failed to Load", source: "System Alert", date: "Just now", description: "There was an error fetching the latest news from the AI. This is often caused by an invalid API key or exceeding the service quota. Please check your .env file and Google AI plan. Showing static fallback news.", link: "#", imageId: "news1" },
    { title: "Major Tech Firm Releases Emergency Security Patch", source: "CyberSys", date: "1 hour ago", description: "A critical vulnerability affecting millions of users was discovered and patched today. Users are urged to update their software immediately.", link: "#", imageId: "news2" },
    { title: "New Phishing Scam Targets Online Shoppers", source: "SecureWeb", date: "3 hours ago", description: "A sophisticated phishing campaign is impersonating major e-commerce sites to steal credit card information.", link: "#", imageId: "news3" },
    { title: "Global Privacy Regulations: What You Need to Know", source: "Data Guardian", date: "8 hours ago", description: "New data privacy laws are coming into effect next month, impacting how companies handle user information.", link: "#", imageId: "news4" },
    { title: "Rise of AI-Powered Malware a 'Game Changer,' Say Experts", source: "FutureThreats", date: "1 day ago", description: "Security researchers are warning about a new generation of malware that uses artificial intelligence to adapt and evade detection.", link: "#", imageId: "news5" },
    { title: "Critical Flaw Found in Popular IoT Devices", source: "ConnectSecure", date: "1 day ago", description: "Millions of smart home devices are vulnerable to remote takeover due to a newly discovered flaw in their firmware.", link: "#", imageId: "news6" },
    { title: "Mobile Banking Trojan Steals Credentials from Thousands", source: "MobileThreats", date: "2 days ago", description: "A new Android malware is overlaying fake login screens on popular banking apps to steal user credentials.", link: "#", imageId: "news7" },
    { title: "Cloud Misconfiguration Leads to Massive Data Leak", source: "CloudWatch", date: "2 days ago", description: "A major corporation exposed sensitive customer data due to an improperly secured cloud storage bucket.", link: "#", imageId: "news8" },
    { title: "Nation-State Hackers Target Critical Infrastructure", source: "GovIntel", date: "3 days ago", description: "Government agencies have issued a warning about advanced persistent threat (APT) groups targeting energy and water facilities.", link: "#", imageId: "news9" },
    { title: "The Debate Over Data Privacy Heats Up in Congress", source: "Policy Weekly", date: "3 days ago", description: "Lawmakers are debating a new federal data privacy bill that could change how companies handle user data.", link: "#", imageId: "news10" },
    { title: "Encryption Standard 'Weaker Than Believed,' Researchers Claim", source: "CryptoJournal", date: "4 days ago", description: "A new academic paper suggests a widely used encryption algorithm may have subtle weaknesses.", link: "#", imageId: "news11" },
    { title: "Supply Chain Attack Hits Hundreds of Software Companies", source: "DevSecOps", date: "4 days ago", description: "Attackers compromised a popular developer tool to inject malicious code into hundreds of downstream software projects.", link: "#", imageId: "news12" },
    { title: "Zero-Day Exploit for Popular Browser Sold Online", source: "DarkWeb Intel", date: "5 days ago", description: "A previously unknown vulnerability for a major web browser is being actively sold on underground forums.", link: "#", imageId: "news13" },
    { title: "Healthcare Provider Pays Ransom After Crippling Cyberattack", source: "HealthSec", date: "5 days ago", description: "A major hospital network was forced to pay a ransom to restore systems after a ransomware attack disrupted patient care.", link: "#", imageId: "news14" },
    { title: "Financial Scammers Using Deepfakes to Impersonate CEOs", source: "FinCrime Report", date: "6 days ago", description: "Fraudsters are using AI-generated audio to impersonate executives and authorize fraudulent wire transfers.", link: "#", imageId: "news15" },
    { title: "New Security Patch for Critical Server Vulnerability", source: "Tech Journal", date: "6 days ago", description: "A critical vulnerability has been patched in widely used server software. Admins are urged to update their systems immediately.", link: "#", imageId: "news16" },
    { title: "Insider Threat Leads to Corporate Espionage Case", source: "CorpSec", date: "1 week ago", description: "A disgruntled employee was arrested for stealing and selling corporate trade secrets to a competitor.", link: "#", imageId: "news17" },
    { title: "Massive Phishing Campaign Uses QR Codes to Bypass Filters", source: "EmailGuard", date: "1 week ago", description: "Attackers are embedding malicious links in QR codes within emails to evade traditional security scanners.", link: "#", imageId: "news18" },
    { title: "Privacy Flaw in Social Media App Exposes User Locations", source: "AppSec", date: "8 days ago", description: "A popular social networking app was found to be leaking precise user location data without their consent.", link: "#", imageId: "news19" },
    { title: "Government Mandates Stronger Cybersecurity for Defense Contractors", source: "Defense News", date: "9 days ago", description: "New regulations will require companies in the defense industry to meet higher cybersecurity standards.", link: "#", imageId: "news20" }
];

function NewsSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(5)].map((_, index) => (
        <Card key={index} className="flex flex-col md:flex-row overflow-hidden">
          <div className="relative h-48 md:h-auto md:w-1/3 lg:w-1/4">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="flex flex-col flex-1">
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-3/4" /></CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-1/2" />
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-1/3" />
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<"api_key" | "quota" | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setErrorType(null);

      // --- Caching Logic Start ---
      try {
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { timestamp, items }: CachedNews = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setNewsItems(items);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Could not read news cache", e);
      }
      // --- Caching Logic End ---
      
      try {
        // The flow now returns an object with an optional 'error' property
        const cyberNews = await generateCyberNews();

        if (cyberNews.error) {
          // If the error property exists, it means the AI call failed.
          console.error("Failed to generate cyber news:", cyberNews.error);
          setNewsItems(fallbackNews);
          if (cyberNews.error.includes('quota') || cyberNews.error.includes('429')) {
            setErrorType("quota");
          } else {
            setErrorType("api_key");
          }
        } else {
          // Success case
          setNewsItems(cyberNews.newsItems);

          // --- Caching Logic Start ---
          try {
              const cache: CachedNews = {
                  timestamp: Date.now(),
                  items: cyberNews.newsItems,
              };
              sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
          } catch (e) {
              console.error("Could not write to news cache", e);
          }
          // --- Caching Logic End ---
        }
      } catch (error: any) {
        // This is a fallback for unexpected network/server errors
        console.error("Unexpected transport error fetching news:", error);
        setNewsItems(fallbackNews);
        setErrorType("api_key");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Newspaper className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Cybersecurity News Feed
          </h1>
          <p className="text-muted-foreground">
            The latest AI-generated headlines from the world of cybersecurity. Refreshes every 5 minutes.
          </p>
        </div>
      </div>

       {errorType && (
         <Alert variant="destructive">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>AI News Feed Failed to Load</AlertTitle>
           <AlertDescription>
             {errorType === 'quota'
              ? "You have exceeded the free tier quota for the generative AI service. Please check your Google AI plan and billing details. Showing static fallback news instead."
              : "There was an error fetching live news from the AI. This is often caused by an invalid or missing API key. Please check your .env file. Showing static fallback news instead."
             }
           </AlertDescription>
         </Alert>
       )}

      {loading ? (
        <NewsSkeleton />
      ) : (
        <div className="space-y-6">
          {newsItems.map((item, index) => {
            const image = PlaceHolderImages.find(p => p.id === item.imageId);
            return (
              <Card key={index} className="flex flex-col md:flex-row overflow-hidden hover:border-primary/80 transition-all duration-300">
                {image && (
                   <div className="relative h-48 md:h-auto md:w-1/3 lg:w-1/4">
                      <Image
                        src={image.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                      />
                    </div>
                )}
                <div className="flex flex-col flex-1">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
                    <CardDescription>
                      <span className="font-semibold">{item.source}</span> - <span className="text-muted-foreground">{item.date}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    <p className="text-foreground/80">{item.description}</p>
                    <NewsImpact title={item.title} description={item.description} />
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-primary">AI-generated summary. Full article not available.</p>
                  </CardFooter>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
