import { Head, Link } from '@inertiajs/react';
import { BookOpen, Building2, FileText, HelpCircle, Star, TrendingUp, ArrowRight, Image, Menu, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';

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
        { label: 'Pages', value: stats.pages, icon: FileText, href: '/cms/pages', iconBg: 'bg-primary/10 text-primary border-primary/20' },
        { label: 'Blog Posts', value: stats.blog_posts, sub: `${stats.published_posts} published`, icon: BookOpen, href: '/cms/blog', iconBg: 'bg-copper/10 text-copper border-copper/20' },
        { label: 'Testimonials', value: stats.testimonials, icon: Star, href: '/cms/testimonials', iconBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
        { label: 'FAQs', value: stats.faqs, icon: HelpCircle, href: '/cms/faq', iconBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
        { label: 'Unit Types', value: stats.unit_types, icon: Building2, href: '/cms/investment', iconBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    ];

    const quickActions = [
        { label: 'New Blog Post', href: '/cms/blog/create', desc: 'Write & publish content' },
        { label: 'Manage Pages', href: '/cms/pages', desc: 'Edit page sections' },
        { label: 'Add FAQ', href: '/cms/faq', desc: 'Answer common questions' },
        { label: 'Edit Hero', href: '/cms/settings', desc: 'Update hero slides' },
        { label: 'Upload Media', href: '/cms/media', desc: 'Add images & videos' },
        { label: 'Navigation', href: '/cms/navigation', desc: 'Manage menu links' },
    ];

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-8 animate-in fade-in-50 duration-300">
                {/* Page header */}
                <PageHeader 
                    title={`${greeting()}, Administrator`}
                    description="Here is an overview of your Panda Towers CMS content."
                    action={
                        <Button asChild className="shadow-green hover:scale-[1.02] transition-transform">
                            <Link href="/cms/blog/create">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                New Blog Post
                            </Link>
                        </Button>
                    }
                />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {statCards.map((card) => (
                        <Link key={card.label} href={card.href} className="block group">
                            <div className="rounded-xl border border-border/50 bg-card p-5 shadow-xs transition-all duration-200 group-hover:shadow-md group-hover:border-primary/30 group-hover:-translate-y-0.5">
                                <div className={`inline-flex p-2 rounded-lg border ${card.iconBg} mb-3`}>
                                    <card.icon className="h-4 w-4" />
                                </div>
                                <div className="text-3xl font-bold text-foreground tracking-tight">{card.value}</div>
                                <div className="text-sm font-semibold text-foreground/80 mt-1">{card.label}</div>
                                {card.sub ? (
                                    <div className="text-xs text-muted-foreground mt-1.5">{card.sub}</div>
                                ) : (
                                    <div className="text-xs text-muted-foreground mt-1.5">Manage details</div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Quick Actions */}
                    <Card className="border-border/50 shadow-xs">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-bold tracking-tight">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="group flex flex-col gap-0.5 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-xs"
                                >
                                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                                    <span className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{action.desc}</span>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Recent Posts */}
                    <Card className="border-border/50 shadow-xs">
                        <CardHeader className="pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-bold tracking-tight">Recent Blog Posts</CardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground">
                                <Link href="/cms/blog" className="flex items-center">
                                    View all <ArrowRight className="h-3 w-3 ml-1" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {recent_posts.length === 0 ? (
                                <div className="py-12 text-center text-sm text-muted-foreground">
                                    No blog posts yet. Click "New Blog Post" to get started.
                                </div>
                            ) : (
                                recent_posts.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/cms/blog/${post.id}/edit`}
                                        className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`h-2 w-2 rounded-full shrink-0 ${post.is_published ? 'bg-primary' : 'bg-amber-400'}`} />
                                            <span className="text-sm font-medium truncate text-foreground/90">{post.title}</span>
                                        </div>
                                        {post.category && (
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 shrink-0" style={{ borderColor: `${post.category.color}40`, color: post.category.color, backgroundColor: `${post.category.color}08` }}>
                                                {post.category.name}
                                            </Badge>
                                        )}
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* All Modules */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">All CMS Modules</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {[
                            { label: 'Pages & Sections', desc: 'Manage page layouts & dynamic site content', href: '/cms/pages', icon: FileText, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
                            { label: 'Blog Posts', desc: 'Publish project articles and updates', href: '/cms/blog', icon: BookOpen, color: 'bg-green-500/10 text-green-500 border-green-500/20' },
                            { label: 'FAQ System', desc: 'Add or modify questions and answers', href: '/cms/faq', icon: HelpCircle, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
                            { label: 'Testimonials', desc: 'Display client reviews and success ratings', href: '/cms/testimonials', icon: Star, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
                            { label: 'Investment Portfolio', desc: 'Configure unit types, prices, and amenities', href: '/cms/investment', icon: Building2, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
                            { label: 'Header Navigation', desc: 'Organize header links and redirects', href: '/cms/navigation', icon: Menu, color: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
                            { label: 'Media Library', desc: 'Upload, manage, and fetch static media assets', href: '/cms/media', icon: Image, color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
                            { label: 'Site Settings', desc: 'Configure hero banners, branding, & links', href: '/cms/settings', icon: Settings, color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
                        ].map((mod) => (
                            <Link
                                key={mod.label}
                                href={mod.href}
                                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
                            >
                                <div className={`inline-flex p-2.5 rounded-lg border ${mod.color} shrink-0`}>
                                    <mod.icon className="h-4.5 w-4.5" />
                                </div>
                                <div className="space-y-1">
                                    <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{mod.label}</div>
                                    <div className="text-xs text-muted-foreground leading-relaxed">{mod.desc}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
