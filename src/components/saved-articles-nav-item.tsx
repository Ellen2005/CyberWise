'use client';

import { useUser } from '@/firebase';
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark } from 'lucide-react';

export default function SavedArticlesNavItem({ inSubmenu = false }: { inSubmenu?: boolean }) {
  const { user } = useUser();
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  if (inSubmenu) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={pathname.startsWith('/saved')}>
          <Link href="/saved">
            <Bookmark />
            <span>Saved Articles</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip="Saved Articles"
        className="justify-start"
        isActive={pathname.startsWith('/saved')}
      >
        <Link href="/saved">
          <Bookmark />
          <span>Saved Articles</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
