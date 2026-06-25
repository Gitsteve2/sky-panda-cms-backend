import { Head, Link } from '@inertiajs/react';
import { BookOpen, Building2, FileText, HelpCircle, LayoutGrid, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardProps {
    stats: {
        pages: number;
        blog_posts: number;
        published_posts: number;
        testimonials: number;
        faqs: number;
        unit_types: number;
    };
    recent_posts: Array<{
        id: number;
        title: string;
        slug: string;
        is_published: boolean;
        created_at: string;
        category?: { name: string; color: string };
    }>;
}

export default function Dashboard({ stats, recent_posts }: DashboardProps) {
    const statCards = [
        { label: 'Pages', value: stats.pages, icon: FileText, href: '/cms/pages', color: 'text-blue-600' },
        { label: 'Blog Posts', value: stats.blog_posts, sub: `${stats.published_posts} published`, icon: BookOpen, href: '/cms/blog', color: 'text-green-600' },
        { label: 'Testimonials', value: stats.testimonials, icon: Star, href: '/cms/testimonials', color: 'text-yellow-600' },
        { label: 'FAQs', value: stats.faqs, icon: HelpCircle, href: '/cms/faq', color: 'text-purple-600' },
        { label: 'Unit Types', value: stats.unit_types, icon: Building2, href: '/cms/investment', color: 'text-orange-600' },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Panda Towers CMS</h1>
                    <p className="text-muted-foreground mt-1">Manage all content for Panda Towers 001 website.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {statCards.map((card) => (
                        <Link key={card.label} href={card.href}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <card.icon className={`h-5 w-5 ${card.color}`} />
                                    </div>
                                    <div className="text-2xl font-bold">{card.value}</div>
                                    <div className="text-sm text-muted-foreground">{card.label}</div>
                                    {card.sub && <div className="text-xs text-muted-foreground mt-0.5">{card.sub}</div>}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            {[
                                { label: 'New Blog Post', href: '/cms/blog/create' },
                                { label: 'Manage Pages', href: '/cms/pages' },
                                { label: 'Add FAQ', href: '/cms/faq' },
                                { label: 'Edit Hero', href: '/cms/settings' },
                                { label: 'Upload Media', href: '/cms/media' },
                                { label: 'Navigation', href: '/cms/navigation' },
                            ].map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex items-center justify-center rounded-md border border-border bg-muted/30 px-3 py-2 text-sm font-medium hover:bg-muted transition-colors text-center"
                                >
                                    {action.label}
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Recent Blog Posts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {recent_posts.length === 0 && (
                                <p className="text-sm text-muted-foreground">No blog posts yet.</p>
                            )}
                            {recent_posts.map((post) => (
                                <div key={post.id} className="flex items-center justify-between gap-2">
                                    <Link href={`/cms/blog/${post.id}/edit`} className="text-sm hover:underline truncate flex-1">
                                        {post.title}
                                    </Link>
                                    <Badge variant={post.is_published ? 'default' : 'secondary'} className="text-xs shrink-0">
                                        {post.is_published ? 'Live' : 'Draft'}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* CMS Module Grid */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">All CMS Modules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {[
                                { label: 'Pages & Sections', desc: 'Manage pages and dynamic sections', href: '/cms/pages', icon: FileText },
                                { label: 'Blog Posts', desc: 'Articles and investment insights', href: '/cms/blog', icon: BookOpen },
                                { label: 'FAQ', desc: 'Questions and answers', href: '/cms/faq', icon: HelpCircle },
                                { label: 'Testimonials', desc: 'Investor success stories', href: '/cms/testimonials', icon: Star },
                                { label: 'Investment', desc: 'Units, pricing and amenities', href: '/cms/investment', icon: Building2 },
                                { label: 'Navigation', desc: 'Menu and links', href: '/cms/navigation', icon: LayoutGrid },
                                { label: 'Media Library', desc: 'Images and videos', href: '/cms/media', icon: LayoutGrid },
                                { label: 'Site Settings', desc: 'Hero, branding, social', href: '/cms/settings', icon: LayoutGrid },
                            ].map((mod) => (
                                <Link key={mod.label} href={mod.href} className="group rounded-lg border border-border p-4 hover:border-primary hover:bg-primary/5 transition-all">
                                    <mod.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary mb-2" />
                                    <div className="font-medium text-sm">{mod.label}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{mod.desc}</div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
