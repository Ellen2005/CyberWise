import { BrainCircuit } from "lucide-react";
import AdviceGeneratorForm from "@/components/advice-generator-form";

export default function AdviceGeneratorPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <BrainCircuit className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            AI-Powered Cybersecurity Advisor
          </h1>
          <p className="text-muted-foreground">
            Get customized cybersecurity advice based on your digital habits and vulnerabilities.
          </p>
        </div>
      </div>
      <AdviceGeneratorForm />
    </main>
  );
}
