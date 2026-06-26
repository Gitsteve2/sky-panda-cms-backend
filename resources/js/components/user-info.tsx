import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-primary/20 transition-all duration-200 group-hover:ring-primary/40">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold dark:bg-primary/20 dark:text-primary-foreground">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-1.5">
                    <span className="truncate font-semibold">{user.name}</span>
                    {!showEmail && (
                        <span className="flex items-center rounded bg-primary/10 px-1 py-0.5 text-[9px] font-medium text-primary uppercase tracking-wide">
                            Admin
                        </span>
                    )}
                </div>
                {showEmail ? (
                    <span className="truncate text-xs text-muted-foreground/80">
                        {user.email}
                    </span>
                ) : (
                    <span className="truncate text-[11px] text-sidebar-foreground/60">
                        System Administrator
                    </span>
                )}
            </div>
        </>
    );
}
