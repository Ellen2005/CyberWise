import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeartHandshake, Wrench } from "lucide-react";

const recoveryGuides = [
  {
    id: "google",
    service: "Google / Gmail",
    steps: [
      "Go to the Google Account Recovery page.",
      "Enter your email address or phone number and click 'Next'.",
      "Follow the on-screen instructions. You may be asked to enter the last password you remember, get a verification code on your recovery phone or email, or answer security questions.",
      "Once your identity is verified, you'll be able to reset your password.",
      "Pro Tip: Set up a recovery phone number and email address in your Google account beforehand to make this process easier."
    ]
  },
  {
    id: "facebook",
    service: "Facebook",
    steps: [
      "Go to the 'Find Your Account' page on Facebook.",
      "Enter your email, phone number, full name, or username associated with your account and click 'Search'.",
      "Follow the instructions to identify your account.",
      "Choose how you want to get the code to reset your password (email or SMS).",
      "Enter the code you receive and set a new password."
    ]
  },
  {
    id: "instagram",
    service: "Instagram",
    steps: [
      "On the login screen, tap 'Get help logging in' (Android) or 'Forgot password?' (iPhone).",
      "Enter your username, email, or phone number, then tap 'Next'.",
      "Select either your email address or phone number to receive a login link.",
      "Click the login link in the email or text message and follow the on-screen instructions to reset your password.",
      "If you can't access your email or phone, look for the 'Need more help?' option for further identity verification steps."
    ]
  },
  {
    id: "apple",
    service: "Apple ID",
    steps: [
      "Go to iforgot.apple.com.",
      "Enter your Apple ID (usually your email address).",
      "You'll be presented with options to reset your password, which may include answering security questions or using email authentication or two-factor authentication.",
      "Follow the chosen method to verify your identity and create a new password.",
      "If you have account recovery enabled, you may need to wait for a specific period before you can reset your password for security reasons."
    ]
  }
];

const deviceFixes = [
  {
    id: "slow-phone",
    service: "Device Running Slow",
    steps: [
      "Simple Restart: The oldest trick in the book. Turn your device completely off, wait 10 seconds, and turn it back on. This clears temporary files and can solve many performance issues.",
      "Close Background Apps: Double-tap your home button (iPhone) or use the recent apps button (Android) to swipe away apps you aren't actively using. They can consume memory and processing power in the background.",
      "Clear App Cache (Android): Go to Settings > Apps > [App Name] > Storage and tap 'Clear Cache'. This removes temporary files for that specific app without deleting your data. Do this for frequently used apps like browsers or social media.",
      "Free Up Storage: A device with less than 10% free space will slow down significantly. Go to your storage settings to see what's taking up space. Delete old photos, videos, unused apps, and large downloaded files."
    ]
  },
  {
    id: "not-charging",
    service: "Not Charging or Charging Slowly",
    steps: [
      "Check the Port for Debris: Gently inspect the charging port on your device. Lint and dust from your pocket can get compacted in there, preventing a good connection. Use a wooden or plastic toothpick (NEVER metal) to carefully scrape it out. A can of compressed air can also work wonders.",
      "Try a Different Cable and Adapter: Charging cables and power adapters fail all the time. Before assuming your device is broken, try a different cable and a different wall adapter that you know are working.",
      "Restart the Device: Sometimes, a software glitch can interfere with charging. A simple restart can often resolve this.",
      "Plug Directly into the Wall: Avoid using extension cords or USB hubs, which can sometimes provide insufficient power."
    ]
  },
  {
    id: "app-crashing",
    service: "An App Keeps Crashing",
    steps: [
      "Force Close and Re-open: The first step is to fully close the app and then open it again.",
      "Check for App Updates: Go to the App Store (iOS) or Play Store (Android) and see if there is an update available for the crashing app. Developers often release fixes for known bugs.",
      "Restart Your Device: A full device restart can clear up underlying software conflicts that may be causing the app to crash.",
      "Reinstall the App: If all else fails, delete the app from your device and then reinstall it from the app store. Note: This may delete app data that isn't saved to the cloud."
    ]
  },
  {
    id: "wifi-issues",
    service: "Can't Connect to Wi-Fi",
    steps: [
      "Toggle Wi-Fi Off and On: The simplest step is to go into your settings, turn Wi-Fi off, wait a few seconds, and turn it back on.",
      "Restart Your Phone and Your Router: Unplug your Wi-Fi router from power, wait 30 seconds, and plug it back in. While it's restarting, restart your phone as well. This solves the vast majority of home network issues.",
      "Forget the Network: Go to your Wi-Fi settings, find the problematic network, and tap 'Forget This Network'. Then, try connecting again by re-entering the password. This clears any old or corrupt connection settings.",
      "Check if Other Devices Can Connect: Is it just your phone, or are all devices unable to connect? If nothing can connect, the problem is likely with your router or internet service provider."
    ]
  }
];


export default function AccountRecoveryPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4 mb-4">
        <HeartHandshake className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Account & Device Recovery
          </h1>
          <p className="text-muted-foreground">
            Guides to reclaim your accounts and fix common device issues.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account Recovery Guides</CardTitle>
          <CardDescription>Select a service to see the steps to recover your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {recoveryGuides.map(guide => (
              <AccordionItem value={guide.id} key={guide.id}>
                <AccordionTrigger className="text-lg font-headline">{guide.service}</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
                    {guide.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Wrench className="h-6 w-6 text-primary" />
            <CardTitle>DIY Device Troubleshooting</CardTitle>
          </div>
          <CardDescription>Try these simple fixes for common device problems before seeking expensive repairs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {deviceFixes.map(guide => (
              <AccordionItem value={guide.id} key={guide.id}>
                <AccordionTrigger className="text-lg font-headline">{guide.service}</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal space-y-4 pl-6 text-muted-foreground">
                    {guide.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

    </main>
  );
}
