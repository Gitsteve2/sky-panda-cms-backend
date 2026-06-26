import { cn } from '@/lib/utils';

type StatusVariant = 'published' | 'draft' | 'active' | 'inactive' | 'featured' | 'pending' | 'archived';

interface StatusBadgeProps {
    status: StatusVariant | string;
    className?: string;
}

const config: Record<StatusVariant, { label: string; cls: string; dot: string }> = {
    published: { label: 'Published', cls: 'badge-success', dot: 'bg-green-500' },
    draft:     { label: 'Draft',     cls: 'badge-warning', dot: 'bg-amber-400' },
    active:    { label: 'Active',    cls: 'badge-success', dot: 'bg-green-500' },
    inactive:  { label: 'Inactive',  cls: 'badge-neutral', dot: 'bg-muted-foreground/40' },
    featured:  { label: 'Featured',  cls: 'badge-copper',  dot: 'bg-amber-500' },
    pending:   { label: 'Pending',   cls: 'badge-warning', dot: 'bg-amber-400' },
    archived:  { label: 'Archived',  cls: 'badge-neutral', dot: 'bg-muted-foreground/40' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const c = config[status as StatusVariant] ?? { label: status, cls: 'badge-neutral', dot: 'bg-muted-foreground/40' };
    return (
        <span className={cn(c.cls, className)}>
            <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', c.dot)} />
            {c.label}
        </span>
    );
}
