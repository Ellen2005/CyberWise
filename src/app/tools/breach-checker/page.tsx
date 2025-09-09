import { DatabaseZap } from "lucide-react";
import BreachChecker from "@/components/breach-checker";

export default function BreachCheckerPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <DatabaseZap className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Breach Alert Checker
          </h1>
          <p className="text-muted-foreground">
            Use the trusted "Have I Been Pwned?" service to see if your email has been in a data breach.
          </p>
        </div>
      </div>
      <BreachChecker />
    </main>
  );
}
