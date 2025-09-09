import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Newspaper,
  BookOpen,
  KeyRound,
  MessageSquareWarning,
  BrainCircuit,
  HeartHandshake,
  ArrowRight,
  ScanLine,
  DatabaseZap,
  Wrench,
} from "lucide-react";
import Link from 'next/link';

const features = [
  {
    icon: <ScanLine className="h-8 w-8 text-primary" />,
    title: 'Is This Legit? Scanner',
    description: 'Paste in suspicious text or links and let our AI tell you if it looks like a scam.',
    link: '/tools/legit-scanner',
  },
  {
    icon: <DatabaseZap className="h-8 w-8 text-primary" />,
    title: 'Breach Alert Checker',
    description: 'Check if your email has been exposed in known data breaches using the official "Have I Been Pwned" service.',
    link: '/tools/breach-checker',
  },
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: 'Security Troubleshooter',
    description: 'Describe a security problem and get AI-powered, device-specific solutions and steps to fix it.',
    link: '/tools/device-scanner',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'AI Advisor',
    description: 'Get personalized cybersecurity advice based on your digital habits from our advanced AI.',
    link: '/tools/advice-generator',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Password Analyzer',
    description: 'Check the strength of your passwords and get suggestions for improvement.',
    link: '/tools/password-analyzer',
  },
  {
    icon: <KeyRound className="h-8 w-8 text-primary" />,
    title: 'Password Generator',
    description: 'Create strong, unique, and secure passwords for all your accounts.',
    link: '/tools/password-generator',
  },
  {
    icon: <MessageSquareWarning className="h-8 w-8 text-primary" />,
    title: 'Phishing Simulator',
    description: 'Learn to identify phishing attempts with our interactive email simulator.',
    link: '/tools/phishing-simulator',
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: 'Awareness Hub',
    description: 'Browse articles and guides to enhance your cybersecurity knowledge.',
    link: '/awareness',
  },
  {
    icon: <Newspaper className="h-8 w-8 text-primary" />,
    title: 'Cyber News Feed',
    description: 'Stay updated with the latest cybersecurity news from around the world.',
    link: '/news',
  },
  {
    icon: <HeartHandshake className="h-8 w-8 text-primary" />,
    title: 'Account Recovery',
    description: 'Guides to help you recover your lost or compromised accounts.',
    link: '/tools/account-recovery',
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome to CyberWise, your personal cybersecurity companion.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Link href={feature.link} key={index} className="flex">
            <Card className="flex flex-col w-full hover:border-primary/80 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                {feature.icon}
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0 flex justify-end">
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
