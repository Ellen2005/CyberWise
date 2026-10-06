'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Bot,
  BrainCircuit,
  CalendarCheck2,
  CalendarRange,
  Compass,
  DatabaseZap,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  MessagesSquare,
  MessageSquareWarning,
  Newspaper,
  ScanEye,
  ScanLine,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Target,
  Trophy,
  Wrench,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import SavedArticlesNavItem from '@/components/saved-articles-nav-item';
import { cn } from '@/lib/utils';

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavGroup = { label: string; icon: LucideIcon; defaultOpen: boolean; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    label: 'Learn',
    icon: GraduationCap,
    defaultOpen: true,
    items: [
      { href: '/learn', label: 'Learning Paths', icon: GraduationCap },
      { href: '/plans', label: 'Guided Plans', icon: CalendarRange },
      { href: '/scenarios', label: 'Scenarios', icon: MessagesSquare },
      { href: '/spot-the-scam', label: 'Spot the Scam', icon: ScanEye },
      { href: '/stories', label: 'Cyber Stories', icon: Compass },
      { href: '/daily', label: 'Daily', icon: CalendarCheck2 },
      { href: '/mentor', label: 'AI Mentor', icon: Bot },
      { href: '/leaderboards', label: 'Leaderboards', icon: Trophy },
    ],
  },
  {
    label: 'Practice',
    icon: Target,
    defaultOpen: true,
    items: [
      { href: '/challenges', label: 'Challenges', icon: Target },
      { href: '/simulators/phishing', label: 'Phishing Lab', icon: ScanSearch },
      { href: '/simulators/scam', label: 'Scam Lab', icon: ShieldAlert },
      { href: '/simulators/wwyd', label: 'What Would You Do', icon: HelpCircle },
      { href: '/help/been-scammed', label: 'Get Help', icon: LifeBuoy },
    ],
  },
  {
    label: 'Tools',
    icon: Wrench,
    defaultOpen: false,
    items: [
      { href: '/tools/legit-scanner', label: 'Legit Scanner', icon: ScanLine },
      { href: '/tools/breach-checker', label: 'Breach Checker', icon: DatabaseZap },
      { href: '/tools/device-scanner', label: 'Troubleshooter', icon: Wrench },
      { href: '/tools/advice-generator', label: 'AI Advisor', icon: BrainCircuit },
      { href: '/tools/password-analyzer', label: 'Password Analyzer', icon: ShieldCheck },
      { href: '/tools/password-generator', label: 'Password Generator', icon: KeyRound },
      { href: '/tools/phishing-simulator', label: 'Phishing Simulator', icon: MessageSquareWarning },
      { href: '/tools/account-recovery', label: 'Account Recovery', icon: HeartHandshake },
    ],
  },
  {
    label: 'Library',
    icon: BookOpen,
    defaultOpen: false,
    items: [
      { href: '/awareness', label: 'Awareness Hub', icon: BookOpen },
      { href: '/news', label: 'News Feed', icon: Newspaper },
      { href: '/admin', label: 'Admin', icon: ShieldCheck },
    ],
  },
];

function GroupNav({ group }: { group: NavGroup }) {
  const pathname = usePathname();
  const GroupIcon = group.icon;
  const isChildActive = group.items.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <Collapsible defaultOpen={group.defaultOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={group.label}
            isActive={isChildActive}
            className="justify-start"
          >
            <GroupIcon />
            <span>{group.label}</span>
            <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {group.items.map((item) => {
              const ItemIcon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <SidebarMenuSubItem key={item.href}>
                  <SidebarMenuSubButton asChild isActive={active}>
                    <Link href={item.href}>
                      <ItemIcon className={cn(active && 'text-primary')} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
            {group.label === 'Library' && <SavedArticlesNavItem inSubmenu />}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const dashboardActive = pathname === '/';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip="Dashboard"
          isActive={dashboardActive}
          className="justify-start"
        >
          <Link href="/">
            <LayoutDashboard />
            <span>Dashboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {GROUPS.map((group) => (
        <GroupNav key={group.label} group={group} />
      ))}
    </SidebarMenu>
  );
}
