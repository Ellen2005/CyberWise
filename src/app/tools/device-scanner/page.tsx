import { Wrench } from "lucide-react";
import DeviceTroubleshooter from "@/components/device-scanner";

export default function DeviceTroubleshooterPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Wrench className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Security Troubleshooter
          </h1>
          <p className="text-muted-foreground">
            Describe a problem and get AI-powered, device-specific solutions.
          </p>
        </div>
      </div>
      <DeviceTroubleshooter />
    </main>
  );
}
