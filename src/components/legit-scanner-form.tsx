"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef } from "react";
import { getScanResult, FormState } from "@/app/tools/legit-scanner/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, AlertCircle, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Scanning...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Scan Content
        </>
      )}
    </Button>
  );
}

function ResultIcon({ verdict }: { verdict: 'Safe' | 'Suspicious' | 'Malicious' }) {
    switch (verdict) {
        case 'Safe':
            return <ShieldCheck className="h-8 w-8 text-green-500" />;
        case 'Suspicious':
            return <ShieldAlert className="h-8 w-8 text-yellow-500" />;
        case 'Malicious':
            return <Shield className="h-8 w-8 text-destructive" />;
        default:
            return <Shield className="h-8 w-8 text-muted-foreground" />;
    }
}

export default function LegitScannerForm() {
  const initialState: FormState = { message: "" };
  const [state, formAction] = useActionState(getScanResult, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === "success") {
      // Don't reset the form so user can see what they scanned
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
            <CardTitle>Content Scanner</CardTitle>
            <CardDescription>
              Paste the full text of a suspicious email, message, or a URL below. The AI will analyze it for red flags.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="content" className="text-lg font-headline">Content to Scan</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="e.g., 'Dear customer, your account has been suspended. Click here to verify your details: http://suspicious-link.com/login'"
                className="min-h-[150px] font-mono text-xs"
                defaultValue={state.fields?.content}
                required
              />
              {state.issues
                ?.map((issue) => (
                  <p key={issue} className="text-sm text-destructive flex items-center gap-1"><AlertCircle size={14} />{issue}</p>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.result && (
        <Card className={cn(
            "bg-gradient-to-br from-card to-background",
            state.result.verdict === 'Safe' && 'border-green-500',
            state.result.verdict === 'Suspicious' && 'border-yellow-500',
            state.result.verdict === 'Malicious' && 'border-destructive'
            )}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ResultIcon verdict={state.result.verdict} />
              <CardTitle className={cn(
                  "font-headline text-2xl",
                  state.result.verdict === 'Safe' && 'text-green-400',
                  state.result.verdict === 'Suspicious' && 'text-yellow-400',
                  state.result.verdict === 'Malicious' && 'text-destructive'
                  )}>
                    Verdict: {state.result.verdict} (Confidence: {state.result.confidence})
                </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-invert max-w-none text-lg text-foreground/90">
                <p>{state.result.reason}</p>
            </div>
            {state.result.flags && state.result.flags.length > 0 && (
                <div>
                    <h4 className="font-headline text-md mb-2">Flags Detected:</h4>
                    <div className="flex flex-wrap gap-2">
                        {state.result.flags.map(flag => (
                            <Badge key={flag} variant="secondary">{flag}</Badge>
                        ))}
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
