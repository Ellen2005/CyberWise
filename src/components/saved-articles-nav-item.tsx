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
import { useLanguage } from '@/components/language-provider';

export default function SavedArticlesNavItem({ inSubmenu = false }: { inSubmenu?: boolean }) {
  const { user } = useUser();
  const pathname = usePathname();
  const { t } = useLanguage();

  if (!user) {
    return null;
  }

  if (inSubmenu) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={pathname.startsWith('/saved')}>
          <Link href="/saved">
            <Bookmark />
            <span>{t.nav.saved}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={t.nav.saved}
        className="justify-start"
        isActive={pathname.startsWith('/saved')}
      >
        <Link href="/saved">
          <Bookmark />
          <span>{t.nav.saved}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
