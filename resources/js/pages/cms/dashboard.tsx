import { Head, Link } from '@inertiajs/react';
import { BookOpen, Building2, FileText, HelpCircle, LayoutGrid, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        { label: 'Pages', value: stats.pages, icon: FileText, href: '/cms/pages', bg: 'bg-blue-50', iconColor: 'text-blue-600', border: 'border-blue-100' },
        { label: 'Blog Posts', value: stats.blog_posts, sub: `${stats.published_posts} published`, icon: BookOpen, href: '/cms/blog', bg: 'bg-green-50', iconColor: 'text-green-600', border: 'border-green-100' },
        { label: 'Testimonials', value: stats.testimonials, icon: Star, href: '/cms/testimonials', bg: 'bg-amber-50', iconColor: 'text-amber-600', border: 'border-amber-100' },
        { label: 'FAQs', value: stats.faqs, icon: HelpCircle, href: '/cms/faq', bg: 'bg-purple-50', iconColor: 'text-purple-600', border: 'border-purple-100' },
        { label: 'Unit Types', value: stats.unit_types, icon: Building2, href: '/cms/investment', bg: 'bg-orange-50', iconColor: 'text-orange-600', border: 'border-orange-100' },
    ];

    const quickActions = [
        { label: 'New Blog Post', href: '/cms/blog/create', desc: 'Write & publish content' },
        { label: 'Manage Pages', href: '/cms/pages', desc: 'Edit page sections' },
        { label: 'Add FAQ', href: '/cms/faq', desc: 'Answer common questions' },
        { label: 'Edit Hero', href: '/cms/settings', desc: 'Update hero slides' },
        { label: 'Upload Media', href: '/cms/media', desc: 'Add images & videos' },
        { label: 'Navigation', href: '/cms/navigation', desc: 'Manage menu links' },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-8">
                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage all content for Panda Towers 001.</p>
                    </div>
                    <Button asChild>
                        <Link href="/cms/blog/create">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            New Post
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {statCards.map((card) => (
                        <Link key={card.label} href={card.href} className="block group">
                            <div className={`rounded-xl border ${card.border} ${card.bg} p-5 transition-all group-hover:shadow-md group-hover:scale-[1.02]`}>
                                <div className={`inline-flex p-2 rounded-lg bg-white/70 mb-3`}>
                                    <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                                </div>
                                <div className="text-3xl font-bold text-foreground">{card.value}</div>
                                <div className="text-sm font-medium text-foreground/80 mt-0.5">{card.label}</div>
                                {card.sub && <div className="text-xs text-muted-foreground mt-1">{card.sub}</div>}
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Quick Actions */}
                    <Card className="border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="group flex flex-col gap-0.5 rounded-lg border border-border bg-background p-3 hover:border-primary hover:bg-primary/5 transition-all"
                                >
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{action.label}</span>
                                    <span className="text-xs text-muted-foreground">{action.desc}</span>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Recent Posts */}
                    <Card className="border-border">
                        <CardHeader className="pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold">Recent Blog Posts</CardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
                                <Link href="/cms/blog">View all <ArrowRight className="h-3 w-3 ml-1" /></Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {recent_posts.length === 0 && (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    No blog posts yet.
                                </div>
                            )}
                            {recent_posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/cms/blog/${post.id}/edit`}
                                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/60 transition-colors"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${post.is_published ? 'bg-green-500' : 'bg-amber-400'}`} />
                                        <span className="text-sm truncate">{post.title}</span>
                                    </div>
                                    {post.category && (
                                        <Badge variant="outline" className="text-xs shrink-0" style={{ borderColor: post.category.color, color: post.category.color }}>
                                            {post.category.name}
                                        </Badge>
                                    )}
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* All Modules */}
                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">All Modules</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {[
                            { label: 'Pages & Sections', desc: 'Manage pages and dynamic sections', href: '/cms/pages', icon: FileText, color: 'text-blue-500' },
                            { label: 'Blog Posts', desc: 'Articles and investment insights', href: '/cms/blog', icon: BookOpen, color: 'text-green-500' },
                            { label: 'FAQ', desc: 'Questions and answers', href: '/cms/faq', icon: HelpCircle, color: 'text-purple-500' },
                            { label: 'Testimonials', desc: 'Investor success stories', href: '/cms/testimonials', icon: Star, color: 'text-amber-500' },
                            { label: 'Investment', desc: 'Units, pricing and amenities', href: '/cms/investment', icon: Building2, color: 'text-orange-500' },
                            { label: 'Navigation', desc: 'Menu and links', href: '/cms/navigation', icon: LayoutGrid, color: 'text-sky-500' },
                            { label: 'Media Library', desc: 'Images and videos', href: '/cms/media', icon: LayoutGrid, color: 'text-rose-500' },
                            { label: 'Site Settings', desc: 'Hero, branding, social', href: '/cms/settings', icon: LayoutGrid, color: 'text-indigo-500' },
                        ].map((mod) => (
                            <Link
                                key={mod.label}
                                href={mod.href}
                                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary hover:shadow-sm transition-all"
                            >
                                <div className="mt-0.5">
                                    <mod.icon className={`h-5 w-5 ${mod.color}`} />
                                </div>
                                <div>
                                    <div className="font-medium text-sm group-hover:text-primary transition-colors">{mod.label}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{mod.desc}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
