import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 overflow-hidden" style={{ background: 'oklch(0.18 0.06 155)' }}>
            {/* Texture background layers */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-[140px]"
                    style={{ background: 'oklch(0.45 0.12 155 / 0.15)' }}
                />
                <div
                    className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-[140px]"
                    style={{ background: 'oklch(0.38 0.10 155 / 0.12)' }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle, oklch(0.7 0 0 / 0.03) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
            </div>

            <div className="relative w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
                <div className="flex flex-col gap-6 rounded-2xl p-8 bg-card border border-border/40 shadow-[0_24px_64px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 p-2 ring-1 ring-primary/20">
                                <AppLogoIcon />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
                            <p className="text-sm text-muted-foreground text-center">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
