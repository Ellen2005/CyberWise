"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageSquareWarning, ThumbsUp, ThumbsDown, CheckCircle, XCircle, RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { phishingEmails, PhishingEmail } from "@/lib/phishing-emails";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

// Shuffle emails for a different order each time
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function PhishingSimulatorPage() {
  const [emails, setEmails] = useState<PhishingEmail[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userChoice, setUserChoice] = useState<null | "phishing" | "legitimate">(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    setEmails(shuffleArray(phishingEmails));
    setLoading(false);
  }, []);

  const handleChoice = (choice: "phishing" | "legitimate") => {
    const currentEmail = emails[currentIndex];
    const correct = (choice === "phishing" && currentEmail.isPhishing) || (choice === "legitimate" && !currentEmail.isPhishing);
    
    setUserChoice(choice);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore === emails.length) {
        toast({
            title: "Badge Unlocked! 🏅",
            description: "You've earned the 'Phishing Detective' badge for a perfect score!",
        });
        if (user && firestore) {
            const userDocRef = doc(firestore, 'users', user.uid);
            // Use updateDoc and arrayUnion to avoid overwriting other badges
             setDoc(userDocRef, { badges: arrayUnion('phishing-detective') }, { merge: true })
             .catch(console.error); // Log error without disturbing user
        }
      }
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setUserChoice(null);
    setCurrentIndex(currentIndex + 1);
  };
  
  const handleRestart = () => {
    setLoading(true);
    setEmails(shuffleArray(phishingEmails));
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setUserChoice(null);
    setLoading(false);
  }

  const currentEmail = emails[currentIndex];
  const isFinished = currentIndex >= emails.length;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <MessageSquareWarning className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Phishing Challenge
          </h1>
          <p className="text-muted-foreground">
            Test your skills. Can you tell which emails are real and which are fake?
          </p>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        {loading ? (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : isFinished ? (
            <div className="text-center p-8">
                <CardTitle className="text-3xl font-headline mb-4">Challenge Complete!</CardTitle>
                <CardDescription className="text-lg mb-6">
                    You scored {score} out of {emails.length}.
                </CardDescription>
                <Button onClick={handleRestart}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Play Again
                </Button>
            </div>
        ) : currentEmail && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Email #{currentIndex + 1} of {emails.length}</CardTitle>
              <CardDescription>From: {currentEmail.from}</CardDescription>
              <CardDescription>Subject: {currentEmail.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border rounded-lg p-4 font-mono text-sm bg-background/50 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: currentEmail.body.replace(/\[(.*?)\]/g, '<a href="#" class="text-blue-400 underline hover:text-blue-300">$1</a>') }}
              />
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              {!showResult ? (
                <div className="flex gap-4">
                  <Button variant="destructive" onClick={() => handleChoice("phishing")}>
                    <ThumbsDown className="mr-2 h-4 w-4" /> Phishing
                  </Button>
                  <Button variant="secondary" onClick={() => handleChoice("legitimate")}>
                    <ThumbsUp className="mr-2 h-4 w-4" /> Legitimate
                  </Button>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <Alert variant={isCorrect ? "default" : "destructive"} className={cn(isCorrect && "border-green-500")}>
                    {isCorrect ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4" />}
                    <AlertTitle className={cn(isCorrect ? "text-green-400" : "text-destructive")}>
                        {isCorrect ? "Correct!" : "Incorrect"}
                    </AlertTitle>
                    <AlertDescription>
                      {currentEmail.explanation}
                    </AlertDescription>
                  </Alert>
                  <Button onClick={handleNext}>Next Email</Button>
                </div>
              )}
            </CardFooter>
          </>
        )}
      </Card>
    </main>
  );
}
