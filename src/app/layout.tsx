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
  Bookmark,
  ScanLine,
  DatabaseZap,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { UserNav } from '@/components/user-nav';
import SavedArticlesNavItem from '@/components/saved-articles-nav-item';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'CyberWise',
  description: 'Your personal cybersecurity companion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          inter.variable,
          spaceGrotesk.variable,
          'font-body antialiased'
        )}
      >
        <FirebaseClientProvider>
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
                      href="/"
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
                  </SidebarGroup>

                  <SidebarGroup>
                    <SidebarGroupLabel>Learn</SidebarGroupLabel>
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
                      href="https://github.com/firebase/studio"
                      asChild
                      tooltip="GitHub"
                      target="_blank"
                      className="justify-start"
                    >
                      <Link href="https://github.com/firebase/studio">
                        <Github />
                        <span>Source Code</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
