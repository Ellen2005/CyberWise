"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef } from "react";
import { getAdvice, FormState } from "@/app/tools/advice-generator/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Get Advice
        </>
      )}
    </Button>
  );
}

export default function AdviceGeneratorForm() {
  const initialState: FormState = { message: "" };
  const [state, formAction] = useActionState(getAdvice, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === "success") {
      formRef.current?.reset();
    }
    if (state.message !== "" && state.message !== "success") {
        toast({
            title: "Error",
            description: state.message,
            variant: "destructive",
        })
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <Card>
        <form ref={formRef} action={formAction}>
          <CardHeader>
            <CardTitle>Describe Your Situation</CardTitle>
            <CardDescription>
              The more detail you provide, the better the AI-generated advice will be.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="digitalHabits" className="text-lg font-headline">Digital Habits</Label>
              <Textarea
                id="digitalHabits"
                name="digitalHabits"
                placeholder="e.g., 'I frequently use public Wi-Fi on my laptop and phone. I browse social media, shop on Amazon, and use online banking apps. I sometimes download software from third-party websites...'"
                className="min-h-[120px]"
                defaultValue={state.fields?.digitalHabits}
                required
              />
              {state.issues
                ?.filter((issue) => issue.includes("digital habits"))
                .map((issue) => (
                  <p key={issue} className="text-sm text-destructive flex items-center gap-1"><AlertCircle size={14} />{issue}</p>
                ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="potentialVulnerabilities" className="text-lg font-headline">Potential Vulnerabilities</Label>
              <Textarea
                id="potentialVulnerabilities"
                name="potentialVulnerabilities"
                placeholder="e.g., 'I tend to reuse the same password for multiple sites. I'm not sure if my home Wi-Fi is secure. I often click on email links without thinking...'"
                className="min-h-[120px]"
                defaultValue={state.fields?.potentialVulnerabilities}
                required
              />
               {state.issues
                ?.filter((issue) => issue.includes("vulnerabilities"))
                .map((issue) => (
                  <p key={issue} className="text-sm text-destructive flex items-center gap-1"><AlertCircle size={14} />{issue}</p>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.advice && (
        <Card className="bg-gradient-to-br from-card to-background border-primary">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-8 w-8 text-primary" />
              <CardTitle className="font-headline text-2xl text-primary">Your Personalized Advice</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none text-lg text-foreground/90">
                {state.advice.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
