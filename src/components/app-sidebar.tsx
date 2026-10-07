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
  Presentation,
  ScanEye,
  ScanLine,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Target,
  Trophy,
  Users,
  Megaphone,
  Flag,
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
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';

type NavKey = keyof import('@/lib/i18n/dict').Dict['nav'];
type NavItem = { href: string; labelKey: NavKey; icon: LucideIcon };
type NavGroup = { labelKey: NavKey; icon: LucideIcon; defaultOpen: boolean; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    labelKey: 'learn',
    icon: GraduationCap,
    defaultOpen: true,
    items: [
      { href: '/learn', labelKey: 'learningPaths', icon: GraduationCap },
      { href: '/plans', labelKey: 'plans', icon: CalendarRange },
      { href: '/scenarios', labelKey: 'scenarios', icon: MessagesSquare },
      { href: '/spot-the-scam', labelKey: 'spotTheScam', icon: ScanEye },
      { href: '/stories', labelKey: 'stories', icon: Compass },
      { href: '/community', labelKey: 'community', icon: Users },
      { href: '/sessions', labelKey: 'sessions', icon: Presentation },
      { href: '/daily', labelKey: 'daily', icon: CalendarCheck2 },
      { href: '/mentor', labelKey: 'mentor', icon: Bot },
      { href: '/leaderboards', labelKey: 'leaderboards', icon: Trophy },
    ],
  },
  {
    labelKey: 'practice',
    icon: Target,
    defaultOpen: true,
    items: [
      { href: '/challenges', labelKey: 'challenges', icon: Target },
      { href: '/simulators/phishing', labelKey: 'phishingLab', icon: ScanSearch },
      { href: '/simulators/scam', labelKey: 'scamLab', icon: ShieldAlert },
      { href: '/simulators/wwyd', labelKey: 'wwyd', icon: HelpCircle },
      { href: '/help/been-scammed', labelKey: 'getHelp', icon: LifeBuoy },
      { href: '/report', labelKey: 'report', icon: Flag },
    ],
  },
  {
    labelKey: 'tools',
    icon: Wrench,
    defaultOpen: false,
    items: [
      { href: '/tools/legit-scanner', labelKey: 'legitScanner', icon: ScanLine },
      { href: '/tools/breach-checker', labelKey: 'breachChecker', icon: DatabaseZap },
      { href: '/tools/device-scanner', labelKey: 'troubleshooter', icon: Wrench },
      { href: '/tools/advice-generator', labelKey: 'aiAdvisor', icon: BrainCircuit },
      { href: '/tools/password-analyzer', labelKey: 'passwordAnalyzer', icon: ShieldCheck },
      { href: '/tools/password-generator', labelKey: 'passwordGenerator', icon: KeyRound },
      { href: '/tools/phishing-simulator', labelKey: 'phishingSimulator', icon: MessageSquareWarning },
      { href: '/tools/account-recovery', labelKey: 'accountRecovery', icon: HeartHandshake },
    ],
  },
  {
    labelKey: 'library',
    icon: BookOpen,
    defaultOpen: false,
    items: [
      { href: '/awareness', labelKey: 'awareness', icon: BookOpen },
      { href: '/news', labelKey: 'news', icon: Newspaper },
      { href: '/campaigns', labelKey: 'campaigns', icon: Megaphone },
      { href: '/admin', labelKey: 'admin', icon: ShieldCheck },
    ],
  },
];

function GroupNav({ group }: { group: NavGroup }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const GroupIcon = group.icon;
  const isChildActive = group.items.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <Collapsible defaultOpen={group.defaultOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={t.nav[group.labelKey]}
            isActive={isChildActive}
            className="justify-start"
          >
            <GroupIcon />
            <span>{t.nav[group.labelKey]}</span>
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
                      <span>{t.nav[item.labelKey]}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
            {group.labelKey === 'library' && <SavedArticlesNavItem inSubmenu />}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const dashboardActive = pathname === '/';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={t.nav.dashboard}
          isActive={dashboardActive}
          className="justify-start"
        >
          <Link href="/">
            <LayoutDashboard />
            <span>{t.nav.dashboard}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {GROUPS.map((group) => (
        <GroupNav key={group.labelKey} group={group} />
      ))}
    </SidebarMenu>
  );
}
