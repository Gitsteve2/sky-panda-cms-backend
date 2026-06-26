import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export interface NavSection {
    label?: string;
    items: NavItem[];
}

export function NavMain({ sections = [] }: { sections: NavSection[] }) {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="flex flex-col gap-4">
            {sections.map((section, sIndex) => (
                <SidebarGroup key={section.label || sIndex} className="px-2 py-0">
                    {section.label && (
                        <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/50 px-3 mb-1.5 select-none">
                            {section.label}
                        </SidebarGroupLabel>
                    )}
                    <SidebarMenu>
                        {section.items.map((item) => {
                            const active = item.href === '/cms' 
                                ? isCurrentUrl(item.href) 
                                : isCurrentOrParentUrl(item.href);

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={active}
                                        tooltip={{ children: item.title }}
                                        className="relative transition-all duration-200 group-data-[collapsible=icon]:p-2 group/btn"
                                    >
                                        <Link href={item.href} prefetch className="flex items-center gap-3">
                                            {item.icon && (
                                                <item.icon className="h-4 w-4 shrink-0 transition-colors group-hover/btn:text-primary" />
                                            )}
                                            <span className="font-medium">{item.title}</span>
                                            {active && <div className="sidebar-active-indicator" />}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </div>
    );
}
