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
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import Link from 'next/link';
import Logo from '@/components/logo';
import { Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { UserNav } from '@/components/user-nav';
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
                <AppSidebar />
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