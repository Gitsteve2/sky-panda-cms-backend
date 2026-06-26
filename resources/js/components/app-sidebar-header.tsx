import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-card px-6 transition-all duration-200 ease-linear md:px-6">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
                <div className="h-4 w-px bg-border/60 mx-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-4">
                {/* Search trigger mockup */}
                <div className="relative hidden md:flex items-center w-60 h-9 rounded-lg border border-input bg-muted/40 px-3 text-muted-foreground/60 transition-all hover:bg-muted/60 hover:border-input/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                    <Search className="h-4 w-4 mr-2 text-muted-foreground/50 shrink-0" />
                    <span className="text-xs text-left grow">Search...</span>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>

                <div className="flex items-center gap-1.5">
                    {/* Dark/Light mode quick toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-foreground"
                        onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
                        title="Toggle theme"
                    >
                        {appearance === 'dark' ? (
                            <Sun className="h-4.5 w-4.5 transition-transform hover:rotate-45" />
                        ) : (
                            <Moon className="h-4.5 w-4.5 transition-transform hover:-rotate-12" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
                        title="Notifications"
                    >
                        <Bell className="h-4.5 w-4.5" />
                        <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
