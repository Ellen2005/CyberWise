import PasswordStrengthAnalyzer from "@/components/password-strength-analyzer";
import { ShieldCheck } from "lucide-react";

export default function PasswordAnalyzerPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Password Strength Analyzer
          </h1>
          <p className="text-muted-foreground">
            Test the strength of your password and get tips for improvement.
          </p>
        </div>
      </div>
      <PasswordStrengthAnalyzer />
    </main>
  );
}
