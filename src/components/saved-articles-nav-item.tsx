'use client';

import { useUser } from '@/firebase';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';

export default function SavedArticlesNavItem() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip="Saved Articles"
        className="justify-start"
      >
        <Link href="/saved">
          <Bookmark />
          <span>Saved Articles</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
