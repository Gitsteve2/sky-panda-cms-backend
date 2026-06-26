import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    description?: string;
    badge?: { label: string; variant?: 'default' | 'success' | 'warning' | 'copper' };
    actions?: ReactNode;
    icon?: LucideIcon;
    className?: string;
}

export function PageHeader({ title, description, badge, actions, icon: Icon, className }: PageHeaderProps) {
    const badgeClass = {
        default: 'badge-neutral',
        success: 'badge-success',
        warning: 'badge-warning',
        copper:  'badge-copper',
    }[badge?.variant ?? 'default'];

    return (
        <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
            <div className="flex items-start gap-3.5 min-w-0">
                {Icon && (
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/15">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                )}
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                        {badge && (
                            <span className={badgeClass}>{badge.label}</span>
                        )}
                    </div>
                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
                    )}
                </div>
            </div>
            {actions && (
                <div className="flex shrink-0 items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}
