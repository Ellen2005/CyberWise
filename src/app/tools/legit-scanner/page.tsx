import { ScanLine } from "lucide-react";
import LegitScannerForm from "@/components/legit-scanner-form";
import { UrlExplainer } from "@/components/url-explainer";

export default function LegitScannerPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <ScanLine className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            "Is This Legit?" Scanner
          </h1>
          <p className="text-muted-foreground">
            Copy-paste a suspicious email, message, or URL for an instant AI-powered analysis.
          </p>
        </div>
      </div>
      <LegitScannerForm />
      <UrlExplainer />
    </main>
  );
}
