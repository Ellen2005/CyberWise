import type { Metadata } from 'next';
import './globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import {
  Sidebar,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import Logo from '@/components/logo';
import {
  ShieldCheck,
  Newspaper,
  BookOpen,
  KeyRound,
  MessageSquareWarning,
  BrainCircuit,
  HeartHandshake,
  LayoutDashboard,
  Github,
  ScanLine,
  DatabaseZap,
  Wrench,
  Trophy,
  Compass,
  GraduationCap,
  Bot,
  Target,
  CalendarCheck2,
  ScanSearch,
  ShieldAlert,
  HelpCircle,
  LifeBuoy,
  MessagesSquare,
  ScanEye,
  CalendarRange,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { UserNav } from '@/components/user-nav';
import SavedArticlesNavItem from '@/components/saved-articles-nav-item';
import { ThemeProvider } from '@/components/theme-provider';
import { AppShellHeader } from '@/components/app-shell-header';
import { AuthSessionSync } from '@/components/auth-session-sync';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'CyberWise',
  description: 'Learn it. Spot it. Stop it. Cybersecurity you can actually understand — realistic scenarios, simulators, and practical guidance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          spaceGrotesk.variable,
          'font-body antialiased'
        )}
      >
        <ThemeProvider>
        <FirebaseClientProvider>
          <AuthSessionSync />
          <SidebarProvider>
            <Sidebar
              variant="sidebar"
              collapsible="icon"
              className="border-r border-sidebar-border"
            >
              <SidebarHeader>
                <Link
                  href="/"
                  className="flex items-center gap-2 font-headline text-lg font-bold text-primary"
                >
                  <Logo className="size-8" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    CyberWise
                  </span>
                </Link>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Dashboard"
                      className="justify-start"
                    >
                      <Link href="/">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarGroup>
                    <SidebarGroupLabel>Learn</SidebarGroupLabel>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Learning Paths"
                        className="justify-start"
                      >
                        <Link href="/learn">
                          <GraduationCap />
                          <span>Learning Paths</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Challenges"
                        className="justify-start"
                      >
                        <Link href="/challenges">
                          <Target />
                          <span>Challenges</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Interactive Scenarios"
                        className="justify-start"
                      >
                        <Link href="/scenarios">
                          <MessagesSquare />
                          <span>Scenarios</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Spot the Scam"
                        className="justify-start"
                      >
                        <Link href="/spot-the-scam">
                          <ScanEye />
                          <span>Spot the Scam</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Guided Plans"
                        className="justify-start"
                      >
                        <Link href="/plans">
                          <CalendarRange />
                          <span>Plans</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Daily Challenge"
                        className="justify-start"
                      >
                        <Link href="/daily">
                          <CalendarCheck2 />
                          <span>Daily</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Phishing Investigation"
                        className="justify-start"
                      >
                        <Link href="/simulators/phishing">
                          <ScanSearch />
                          <span>Phishing Lab</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Scam Awareness"
                        className="justify-start"
                      >
                        <Link href="/simulators/scam">
                          <ShieldAlert />
                          <span>Scam Lab</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="What Would You Do"
                        className="justify-start"
                      >
                        <Link href="/simulators/wwyd">
                          <HelpCircle />
                          <span>What Would You Do</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Been Scammed Help"
                        className="justify-start"
                      >
                        <Link href="/help/been-scammed">
                          <LifeBuoy />
                          <span>Get Help</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Cyber Stories"
                        className="justify-start"
                      >
                        <Link href="/stories">
                          <Compass />
                          <span>Cyber Stories</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="AI Cyber Mentor"
                        className="justify-start"
                      >
                        <Link href="/mentor">
                          <Bot />
                          <span>AI Mentor</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Leaderboards"
                        className="justify-start"
                      >
                        <Link href="/leaderboards">
                          <Trophy />
                          <span>Leaderboards</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Admin Console"
                        className="justify-start"
                      >
                        <Link href="/admin">
                          <ShieldCheck />
                          <span>Admin</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SavedArticlesNavItem />
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Awareness Hub"
                        className="justify-start"
                      >
                        <Link href="/awareness">
                          <BookOpen />
                          <span>Awareness Hub</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="News Feed"
                        className="justify-start"
                      >
                        <Link href="/news">
                          <Newspaper />
                          <span>News Feed</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarGroup>

                  <SidebarGroup>
                    <SidebarGroupLabel>Tools</SidebarGroupLabel>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Legitimacy Scanner"
                        className="justify-start"
                      >
                        <Link href="/tools/legit-scanner">
                          <ScanLine />
                          <span>Legit Scanner</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Breach Checker"
                        className="justify-start"
                      >
                        <Link href="/tools/breach-checker">
                          <DatabaseZap />
                          <span>Breach Checker</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Security Troubleshooter"
                        className="justify-start"
                      >
                        <Link href="/tools/device-scanner">
                          <Wrench />
                          <span>Troubleshooter</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="AI Advisor"
                        className="justify-start"
                      >
                        <Link href="/tools/advice-generator">
                          <BrainCircuit />
                          <span>AI Advisor</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Password Analyzer"
                        className="justify-start"
                      >
                        <Link href="/tools/password-analyzer">
                          <ShieldCheck />
                          <span>Password Analyzer</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Password Generator"
                        className="justify-start"
                      >
                        <Link href="/tools/password-generator">
                          <KeyRound />
                          <span>Password Generator</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Phishing Simulator"
                        className="justify-start"
                      >
                        <Link href="/tools/phishing-simulator">
                          <MessageSquareWarning />
                          <span>Phishing Simulator</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip="Account Recovery"
                        className="justify-start"
                      >
                        <Link href="/tools/account-recovery">
                          <HeartHandshake />
                          <span>Account Recovery</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarGroup>
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                <div className="flex items-center justify-center p-2 group-data-[collapsible=icon]:hidden">
                  <UserNav />
                </div>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="GitHub"
                      className="justify-start"
                    >
                      <Link href="https://github.com/Ellen2005/CyberWise" target="_blank">
                        <Github />
                        <span>Source Code</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <AppShellHeader />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </FirebaseClientProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}