import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    CalendarDays,
    FileText,
    HelpCircle,
    Image,
    LayoutGrid,
    Menu,
    Settings,
    Star,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain, type NavSection } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

const groupedNavItems: NavSection[] = [
    {
        items: [
            { title: 'Dashboard', href: '/cms', icon: LayoutGrid }
        ]
    },
    {
        label: 'Content',
        items: [
            { title: 'Pages', href: '/cms/pages', icon: FileText },
            { title: 'Blog', href: '/cms/blog', icon: BookOpen },
            { title: 'FAQ', href: '/cms/faq', icon: HelpCircle },
            { title: 'Testimonials', href: '/cms/testimonials', icon: Star },
            { title: 'Project Updates', href: '/cms/project-updates', icon: CalendarDays },
        ]
    },
    {
        label: 'Site',
        items: [
            { title: 'Navigation', href: '/cms/navigation', icon: Menu },
            { title: 'Media', href: '/cms/media', icon: Image },
        ]
    },
    {
        label: 'System',
        items: [
            { title: 'Investment', href: '/cms/investment', icon: Building2 },
            { title: 'Settings', href: '/cms/settings', icon: Settings },
        ]
    }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-sidebar-border/40 py-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent active:bg-transparent">
                            <Link href="/cms" prefetch className="flex items-center gap-2">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-4">
                <NavMain sections={groupedNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/40 py-3">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
