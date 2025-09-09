"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw, Check, Sparkles, Loader2, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatePasswordSuggestion, GeneratePasswordSuggestionOutput } from "@/ai/ai-password-suggestion";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

function ManualGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const { toast } = useToast();

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") {
        toast({
            title: "Error",
            description: "Please select at least one character type.",
            variant: "destructive"
        })
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setIsCopied(true);
    toast({
      title: "Copied!",
      description: "Password has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input 
          readOnly 
          value={password} 
          placeholder="Click 'Generate' to create a password"
          className="pr-20 text-lg font-mono tracking-wider"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!password}>
            {isCopied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={generatePassword}>
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="length">Password Length</Label>
            <span className="font-bold text-primary">{length}</span>
          </div>
          <Slider
            id="length"
            min={8}
            max={64}
            step={1}
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
            <Label htmlFor="uppercase">Include Uppercase (A-Z)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
            <Label htmlFor="lowercase">Include Lowercase (a-z)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
            <Label htmlFor="numbers">Include Numbers (0-9)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
            <Label htmlFor="symbols">Include Symbols (!@#...)</Label>
          </div>
        </div>
      </div>
      <Button onClick={generatePassword} className="w-full">Generate Password</Button>
    </div>
  )
}

function AiGenerator() {
    const [website, setWebsite] = useState("");
    const [length, setLength] = useState(16);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GeneratePasswordSuggestionOutput | null>(null);

    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const suggestion = await generatePasswordSuggestion({ website, length, includeSymbols });
            setResult(suggestion);
        } catch (e: any) {
            console.error(e);
            let errorMessage = "An unexpected error occurred. This may be due to an invalid API key.";
            if (e.message && (e.message.includes('quota') || e.message.includes('429'))) {
                errorMessage = "You have exceeded the free tier quota for the generative AI service. Please check your Google AI plan and billing details.";
            } else if (e.message && e.message.includes("API key not valid")) {
                errorMessage = "The AI service API key is not valid. Please check your .env file.";
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }
    
    const copyToClipboard = () => {
        if (!result?.password) return;
        navigator.clipboard.writeText(result.password);
        toast({
          title: "Copied!",
          description: "AI-generated password has been copied to your clipboard.",
        });
      };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="website">Website or Service</Label>
                    <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="e.g., Google, Facebook" required />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="ai-length">Password Length</Label>
                        <span className="font-bold text-primary">{length}</span>
                    </div>
                    <Slider id="ai-length" min={8} max={64} step={1} value={[length]} onValueChange={(value) => setLength(value[0])} />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="ai-symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                    <Label htmlFor="ai-symbols">Include Symbols (!@#...)</Label>
                </div>
                 <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                        </>
                    ) : (
                        <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate with AI
                        </>
                    )}
                </Button>
            </form>
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>AI Generation Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {result && (
                <Card className="bg-gradient-to-br from-card to-background border-primary">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BrainCircuit className="h-8 w-8 text-primary" />
                                <CardTitle className="font-headline text-2xl text-primary">AI Suggestion</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                                <Copy className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-2xl font-mono tracking-wider break-all text-center p-4 bg-muted rounded-md">{result.password}</p>
                        <div className="text-center">
                            <p className="font-bold text-lg">Strength: {result.strength}</p>
                            <p className="text-muted-foreground">{result.reason}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


export default function PasswordGenerator() {
  return (
    <Card className="w-full max-w-xl mx-auto">
        <Tabs defaultValue="manual">
            <CardHeader>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                    <TabsTrigger value="ai"><Sparkles className="mr-2 h-4 w-4" />AI Suggestion</TabsTrigger>
                </TabsList>
            </CardHeader>
            <TabsContent value="manual">
                <CardHeader className="pt-0">
                    <CardTitle>Manual Generator</CardTitle>
                    <CardDescription>Customize your password generation options.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ManualGenerator />
                </CardContent>
            </TabsContent>
            <TabsContent value="ai">
                 <CardHeader className="pt-0">
                    <CardTitle>AI-Powered Suggestion</CardTitle>
                    <CardDescription>Let AI generate a strong, memorable password for a specific site.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AiGenerator />
                </CardContent>
            </TabsContent>
        </Tabs>
    </Card>
  );
}
