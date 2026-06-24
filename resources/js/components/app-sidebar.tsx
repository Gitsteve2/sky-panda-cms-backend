import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    FileText,
    HelpCircle,
    Image,
    LayoutGrid,
    Menu,
    MessageSquare,
    Palette,
    Settings,
    Star,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
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
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/cms', icon: LayoutGrid },
    { title: 'Pages', href: '/cms/pages', icon: FileText },
    { title: 'Blog', href: '/cms/blog', icon: BookOpen },
    { title: 'FAQ', href: '/cms/faq', icon: HelpCircle },
    { title: 'Testimonials', href: '/cms/testimonials', icon: Star },
    { title: 'Investment', href: '/cms/investment', icon: Building2 },
    { title: 'Navigation', href: '/cms/navigation', icon: Menu },
    { title: 'Media', href: '/cms/media', icon: Image },
    { title: 'Settings', href: '/cms/settings', icon: Settings },
];

const footerNavItems: NavItem[] = [
    { title: 'Website', href: 'http://localhost:5173', icon: Palette },
    { title: 'Docs', href: 'https://laravel.com/docs', icon: BookOpen },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/cms" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
