import PasswordGenerator from "@/components/password-generator";
import { KeyRound } from "lucide-react";

export default function PasswordGeneratorPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <KeyRound className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Secure Password Generator
          </h1>
          <p className="text-muted-foreground">
            Create strong, unique, and random passwords to protect your accounts.
          </p>
        </div>
      </div>
      <PasswordGenerator />
    </main>
  );
}
