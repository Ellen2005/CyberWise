"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type StrengthLevel = "Weak" | "Medium" | "Strong" | "Very Strong";
type Check = {
  label: string;
  test: (password: string) => boolean;
};

const checks: Check[] = [
  { label: "At least 8 characters long", test: (p) => p.length >= 8 },
  { label: "Contains uppercase letters", test: (p) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letters", test: (p) => /[a-z]/.test(p) },
  { label: "Contains numbers", test: (p) => /\d/.test(p) },
  { label: "Contains symbols", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function PasswordStrengthAnalyzer() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = (): { level: StrengthLevel; score: number } => {
    let score = 0;
    if (!password) return { level: "Weak", score: 0 };

    const passedChecks = checks.filter(check => check.test(password)).length;
    score = (passedChecks / checks.length) * 100;
    
    if (password.length < 8) {
      score = Math.min(score, 25);
    } else if (password.length < 12) {
        score = Math.min(score, 75);
    }

    if (score < 40) return { level: "Weak", score };
    if (score < 80) return { level: "Medium", score };
    if (score < 100) return { level: "Strong", score };
    return { level: "Very Strong", score };
  };

  const { level, score } = getStrength();

  const getProgressColor = () => {
    switch (level) {
      case "Weak":
        return "bg-destructive";
      case "Medium":
        return "bg-yellow-500";
      case "Strong":
        return "bg-green-500";
      case "Very Strong":
        return "bg-primary";
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Analyze Your Password</CardTitle>
        <CardDescription>Enter a password to check its strength.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="pr-10"
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {password && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Strength:</span>
              <span className={cn(
                "font-bold text-lg",
                level === "Weak" && "text-destructive",
                level === "Medium" && "text-yellow-500",
                level === "Strong" && "text-green-500",
                level === "Very Strong" && "text-primary"
              )}>{level}</span>
            </div>
            <Progress value={score} className="h-3 [&>div]:transition-all" indicatorClassName={getProgressColor()} />
          </div>
        )}
        
        <div className="space-y-2">
            {checks.map((check, index) => {
                const passed = check.test(password);
                return (
                    <div key={index} className={cn(
                        "flex items-center text-sm",
                        password ? (passed ? "text-green-400" : "text-destructive") : "text-muted-foreground"
                    )}>
                        {password && (passed ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />)}
                        {!password && <XCircle className="h-4 w-4 mr-2 invisible" />}
                        <span>{check.label}</span>
                    </div>
                );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
