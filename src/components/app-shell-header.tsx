'use client';

import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import Logo from '@/components/logo';

export function AppShellHeader() {
  const { user, loading } = useUser();

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <SidebarTrigger className="md:hidden" aria-label="Open navigation menu" />
      <SidebarTrigger className="hidden md:inline-flex" aria-label="Toggle sidebar" />
      <Separator orientation="vertical" className="mr-2 h-6" />
      <Link href="/" className="flex items-center gap-2 font-headline font-semibold text-primary md:hidden">
        <Logo className="size-7" />
        CyberWise
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        {!loading && !user && (
          <Button asChild size="sm" variant="outline" className="md:hidden">
            <Link href="/login">
              <LogIn className="mr-1 h-4 w-4" />
              Sign in
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
