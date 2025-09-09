'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Sparkles, Wrench, AlertCircle, CheckCircle } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { getTroubleshootingResult, FormState } from '@/app/tools/device-scanner/actions';
import { useToast } from '@/hooks/use-toast';
import { useFormStatus } from 'react-dom';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
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

export default function DeviceTroubleshooter() {
  const initialState: FormState = { message: '' };
  const [state, formAction] = useActionState(getTroubleshootingResult, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== 'success') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
        <Card>
            <form action={formAction}>
                <CardHeader>
                    <CardTitle>Describe Your Security Concern</CardTitle>
                    <CardDescription>
                        Explain the problem you're facing, and our AI will provide device-specific troubleshooting steps.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="concern">What is the problem?</Label>
                        <Textarea 
                            id="concern" 
                            name="concern"
                            placeholder="e.g., I'm getting too many spam calls and texts, and I'm worried my number has leaked."
                            required
                            className="min-h-[100px]"
                        />
                         {state.issues?.map((issue) => (
                            <p key={issue} className="text-sm text-destructive flex items-center gap-1"><AlertCircle size={14} />{issue}</p>
                        ))}
                    </div>
                    <div className="space-y-3">
                        <Label>What type of device are you using?</Label>
                        <RadioGroup name="deviceType" defaultValue="iPhone" className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="iPhone" id="r-iphone" />
                                <Label htmlFor="r-iphone">iPhone</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Android" id="r-android" />
                                <Label htmlFor="r-android">Android</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Windows" id="r-windows" />
                                <Label htmlFor="r-windows">Windows PC</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Mac" id="r-mac" />
                                <Label htmlFor="r-mac">Mac</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>

      {state.message === 'success' && state.result && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Wrench className="h-8 w-8 text-primary" />
              <CardTitle className="font-headline text-2xl text-primary">Troubleshooting Plan</CardTitle>
            </div>
            <CardDescription>Here are some potential causes and steps you can take to resolve the issue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <h3 className="font-headline text-lg font-semibold mb-2">Possible Causes</h3>
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {state.result.possibleCauses.map((cause, index) => <li key={index}>{cause}</li>)}
                </ul>
            </div>
             <div>
                <h3 className="font-headline text-lg font-semibold mb-2">Step-by-Step Remedies</h3>
                 <Accordion type="single" collapsible className="w-full" defaultValue={state.result.remedies[0]?.title}>
                    {state.result.remedies.map((remedy, index) => (
                        <AccordionItem value={remedy.title} key={index}>
                            <AccordionTrigger>{index + 1}. {remedy.title}</AccordionTrigger>
                            <AccordionContent className="prose prose-invert max-w-none text-base text-foreground/80">
                                <p>{remedy.instruction}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
             <div>
                <h3 className="font-headline text-lg font-semibold mb-2">Preventative Tips</h3>
                <ul className="space-y-2">
                     {state.result.preventativeTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{tip}</span>
                        </li>
                     ))}
                </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
