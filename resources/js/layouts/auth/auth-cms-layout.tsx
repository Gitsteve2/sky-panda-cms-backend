import type { AuthLayoutProps } from '@/types';

export default function AuthCmsLayout({
    children,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}