import { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpen, Calendar, Clock, LayoutDashboard, Mail, Search, Sparkles, Star, X } from 'lucide-react';
import type { Auth } from '@/types';

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
    posts_count?: number;
}

interface BlogPostItem {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    featured_image?: string | null;
    read_time?: string | null;
    is_featured: boolean;
    is_published: boolean;
    published_at?: string | null;
    author_name?: string | null;
    category?: Category | null;
}

export default function PublicBlogIndex({
    posts,
    categories,
}: {
    posts: BlogPostItem[];
    categories: Category[];
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const filteredPosts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return posts.filter((post) => {
            if (activeCategory !== 'all') {
                const postCatSlug = post.category?.slug || post.category?.name?.toLowerCase().replace(/\s+/g, '-');
                if (postCatSlug !== activeCategory) return false;
            }
            if (q) {
                const match =
                    post.title.toLowerCase().includes(q) ||
                    (post.excerpt || '').toLowerCase().includes(q) ||
                    (post.category?.name || '').toLowerCase().includes(q) ||
                    (post.author_name || '').toLowerCase().includes(q);
                if (!match) return false;
            }
            return true;
        });
    }, [posts, activeCategory, searchQuery]);

    const featuredPost = useMemo(
        () => filteredPosts.find((p) => p.is_featured) ?? filteredPosts[0] ?? null,
        [filteredPosts],
    );

    const remainingPosts = useMemo(
        () => (featuredPost ? filteredPosts.filter((p) => p.id !== featuredPost.id) : []),
        [filteredPosts, featuredPost],
    );

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="Blog & Investment Insights | Panda Towers" />

            <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-sans">
                {/* Top Navigation Header */}
                <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8EDE6]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <img
                                src="/Sky-Panda-Towers-Logo-1.png"
                                alt="Panda Towers"
                                className="h-10 w-auto object-contain"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            <span className="font-bold text-lg tracking-tight text-[#0D4D2A]">PANDA TOWERS</span>
                        </Link>

                        <nav className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="text-sm font-medium text-[#5F5E5A] hover:text-[#1A9E55] transition-colors hidden sm:inline"
                            >
                                Home
                            </Link>
                            <Link
                                href="/blog"
                                className="text-sm font-bold text-[#1A9E55] transition-colors"
                            >
                                Blog & Articles
                            </Link>
                            {auth?.user ? (
                                <Link
                                    href="/cms/blog"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#0D4D2A] text-white hover:bg-[#1A9E55] transition-colors shadow-xs"
                                >
                                    <LayoutDashboard className="h-3.5 w-3.5" />
                                    Manage Articles in CMS
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border border-[#0D4D2A] text-[#0D4D2A] hover:bg-[#0D4D2A] hover:text-white transition-colors"
                                >
                                    CMS Login
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Banner */}
                <section
                    className="py-16 md:py-22 text-white text-center relative overflow-hidden border-b"
                    style={{ backgroundColor: '#0D4D2A', borderColor: 'rgba(192,221,151,0.2)' }}
                >
                    <div
                        className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-20 pointer-events-none blur-3xl"
                        style={{ backgroundColor: '#2ECC71' }}
                    />
                    <div
                        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-20 pointer-events-none blur-3xl"
                        style={{ backgroundColor: '#1A9E55' }}
                    />

                    <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-5">
                        <div
                            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border"
                            style={{
                                backgroundColor: 'rgba(192,221,151,0.15)',
                                borderColor: 'rgba(192,221,151,0.3)',
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-[#2ECC71]" />
                            <span className="text-[11px] font-extrabold tracking-[0.2em] text-[#2ECC71] uppercase">
                                Investment Insights
                            </span>
                        </div>

                        <h1 className="font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight max-w-3xl mx-auto text-white">
                            Make informed decisions{' '}
                            <span style={{ color: '#2ECC71' }}>about your money.</span>
                        </h1>

                        <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: '#9FE1CB' }}>
                            Market analysis, investment guides, and project updates from the Panda Towers team.
                        </p>
                    </div>
                </section>

                {/* Sticky Category Filter & Search Bar */}
                <div className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-[#E8EDE6] shadow-2xs">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar items-center" role="tablist">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeCategory === 'all'}
                                onClick={() => setActiveCategory('all')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                                    activeCategory === 'all'
                                        ? 'text-white shadow-sm'
                                        : 'text-[#5F5E5A] border hover:border-[#1A9E55] hover:text-[#1A9E55]'
                                }`}
                                style={{
                                    backgroundColor: activeCategory === 'all' ? '#0D4D2A' : '#F4FAF0',
                                    borderColor: activeCategory === 'all' ? '#0D4D2A' : '#C0DD97',
                                }}
                            >
                                All Articles ({posts.length})
                            </button>

                            {categories.map((cat) => {
                                const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
                                const isActive = activeCategory === slug;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveCategory(slug)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                                            isActive
                                                ? 'text-white shadow-sm'
                                                : 'text-[#5F5E5A] border hover:border-[#1A9E55] hover:text-[#1A9E55]'
                                        }`}
                                        style={{
                                            backgroundColor: isActive ? '#0D4D2A' : '#F4FAF0',
                                            borderColor: isActive ? '#0D4D2A' : '#C0DD97',
                                        }}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="relative sm:w-64 shrink-0">
                            <Search className="h-3.5 w-3.5 text-[#888780] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full h-9 pl-8 pr-8 rounded-full border border-[#C0DD97] bg-[#F4FAF0]/60 text-xs text-[#1A1A1A] placeholder:text-[#888780] focus:outline-none focus:border-[#1A9E55]"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888780] hover:text-[#1A1A1A]"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Blog Articles Section */}
                <section className="py-14 sm:py-20 bg-white flex-1">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                        {filteredPosts.length === 0 ? (
                            <div className="text-center py-20 bg-[#F4FAF0] rounded-3xl border border-[#C0DD97] space-y-3">
                                <BookOpen className="h-10 w-10 text-[#1A9E55] mx-auto opacity-70" />
                                <p className="text-base font-bold text-[#0D4D2A]">No published articles match your filter.</p>
                                <p className="text-xs text-[#5F5E5A]">Try selecting another category or clearing your search.</p>
                                {(activeCategory !== 'all' || searchQuery) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveCategory('all');
                                            setSearchQuery('');
                                        }}
                                        className="mt-2 px-5 py-2 rounded-full text-xs font-bold bg-[#0D4D2A] text-white hover:bg-[#1A9E55] transition-colors"
                                    >
                                        Show All Articles
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Featured Spotlight Article */}
                                {featuredPost && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="w-2 h-2 rounded-full bg-[#1A9E55]" />
                                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A9E55]">
                                                {featuredPost.is_featured ? 'Featured Article' : 'Spotlight Article'}
                                            </span>
                                        </div>

                                        <article className="group rounded-3xl overflow-hidden border border-[#E8EDE6] bg-white shadow-sm hover:shadow-xl transition-all duration-300 grid lg:grid-cols-12">
                                            <Link
                                                href={`/blog/${featuredPost.slug}`}
                                                className="lg:col-span-7 relative min-h-[260px] sm:min-h-[360px] bg-gray-100 overflow-hidden block"
                                            >
                                                <img
                                                    src={featuredPost.featured_image || '/exterior.jpg'}
                                                    alt={featuredPost.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src = '/exterior.jpg';
                                                    }}
                                                />
                                                {featuredPost.is_featured && (
                                                    <div className="absolute top-4 left-4">
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[#0D4D2A] text-[#2ECC71] shadow">
                                                            <Star className="h-3 w-3 fill-[#2ECC71]" />
                                                            Featured
                                                        </span>
                                                    </div>
                                                )}
                                            </Link>

                                            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span
                                                            className="text-xs font-bold px-3 py-1 rounded-full border"
                                                            style={{
                                                                backgroundColor: '#F4FAF0',
                                                                borderColor: '#C0DD97',
                                                                color: '#1A9E55',
                                                            }}
                                                        >
                                                            {featuredPost.category?.name ?? 'General'}
                                                        </span>
                                                        <span className="text-xs text-[#888780] flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5 text-[#1A9E55]" />
                                                            {featuredPost.read_time || '5 min read'}
                                                        </span>
                                                    </div>

                                                    <h2 className="font-bold text-2xl sm:text-3xl leading-snug text-[#1A1A1A] group-hover:text-[#1A9E55] transition-colors">
                                                        <Link href={`/blog/${featuredPost.slug}`} className="hover:underline">
                                                            {featuredPost.title}
                                                        </Link>
                                                    </h2>

                                                    {featuredPost.excerpt && (
                                                        <p className="text-xs sm:text-sm leading-relaxed text-[#5F5E5A] line-clamp-4">
                                                            {featuredPost.excerpt}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="pt-5 border-t border-[#E8EDE6] flex items-center justify-between">
                                                    <div className="text-xs text-[#888780] space-y-0.5">
                                                        <div className="font-semibold text-[#1A1A1A]">
                                                            {featuredPost.author_name || 'Panda Towers Team'}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(featuredPost.published_at)}
                                                        </div>
                                                    </div>

                                                    <Link
                                                        href={`/blog/${featuredPost.slug}`}
                                                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A9E55] group-hover:text-[#0D4D2A] transition-all"
                                                    >
                                                        <span>Read article</span>
                                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                )}

                                {/* Latest Articles Grid */}
                                {remainingPosts.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="w-2 h-2 rounded-full bg-[#1A9E55]" />
                                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A9E55]">
                                                Latest Articles
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {remainingPosts.map((post) => (
                                                <article
                                                    key={post.id}
                                                    className="group bg-white rounded-2xl overflow-hidden border border-[#E8EDE6] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                                                >
                                                    <div>
                                                        <Link
                                                            href={`/blog/${post.slug}`}
                                                            className="relative h-48 sm:h-52 overflow-hidden bg-gray-100 block"
                                                        >
                                                            <img
                                                                src={post.featured_image || '/exterior.jpg'}
                                                                alt={post.title}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                loading="lazy"
                                                                onError={(e) => {
                                                                    (e.currentTarget as HTMLImageElement).src = '/exterior.jpg';
                                                                }}
                                                            />
                                                            <div className="absolute top-3 left-3">
                                                                <span
                                                                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs"
                                                                    style={{
                                                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                                        borderColor: '#C0DD97',
                                                                        color: '#1A9E55',
                                                                    }}
                                                                >
                                                                    {post.category?.name ?? 'General'}
                                                                </span>
                                                            </div>
                                                        </Link>

                                                        <div className="p-6 space-y-3">
                                                            <div className="flex items-center justify-between text-xs text-[#888780]">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3.5 h-3.5 text-[#1A9E55]" />
                                                                    {post.read_time || '5 min read'}
                                                                </span>
                                                                <span>{formatDate(post.published_at)}</span>
                                                            </div>

                                                            <h3 className="font-bold text-base sm:text-lg line-clamp-2 leading-snug text-[#1A1A1A] group-hover:text-[#1A9E55] transition-colors">
                                                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                                            </h3>

                                                            {post.excerpt && (
                                                                <p className="text-xs text-[#5F5E5A] leading-relaxed line-clamp-3">
                                                                    {post.excerpt}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="px-6 py-4 border-t border-[#F4FAF0] flex items-center justify-between">
                                                        <span className="text-xs font-medium text-[#5F5E5A] truncate max-w-[140px]">
                                                            {post.author_name || 'Panda Towers Team'}
                                                        </span>
                                                        <Link
                                                            href={`/blog/${post.slug}`}
                                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A9E55] group-hover:text-[#0D4D2A] transition-colors"
                                                        >
                                                            <span>Read article</span>
                                                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                                        </Link>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="py-16 border-t border-[#C0DD97]" style={{ backgroundColor: '#F4FAF0' }}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl"
                            style={{ backgroundColor: '#0D4D2A' }}
                        >
                            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
                                <div
                                    className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center border"
                                    style={{
                                        backgroundColor: 'rgba(192,221,151,0.15)',
                                        borderColor: 'rgba(192,221,151,0.3)',
                                    }}
                                >
                                    <Mail className="w-6 h-6 text-[#2ECC71]" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] block mb-2 text-[#C0DD97]">
                                        STAY INFORMED
                                    </span>
                                    <h2 className="font-bold text-2xl sm:text-3xl text-white leading-tight">
                                        Get Investor Intelligence
                                    </h2>
                                    <p className="text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed text-[#9FE1CB]">
                                        Get market updates and Panda Towers 001 project news delivered straight to your inbox.
                                    </p>
                                </div>

                                {subscribed ? (
                                    <div
                                        className="p-4 rounded-2xl inline-flex items-center gap-2 text-xs sm:text-sm font-bold border"
                                        style={{
                                            backgroundColor: 'rgba(46,204,113,0.15)',
                                            borderColor: '#2ECC71',
                                            color: '#2ECC71',
                                        }}
                                    >
                                        Thank you for subscribing to Panda Towers updates!
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (newsletterEmail) setSubscribed(true);
                                        }}
                                        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                                    >
                                        <input
                                            type="email"
                                            required
                                            value={newsletterEmail}
                                            onChange={(e) => setNewsletterEmail(e.target.value)}
                                            placeholder="Enter your email address..."
                                            className="flex-1 px-5 py-3 rounded-full text-xs sm:text-sm text-white outline-none border placeholder:text-[#9FE1CB]/60"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            className="px-7 py-3 rounded-full font-bold text-xs sm:text-sm transition-all hover:bg-[#F4FAF0] shadow-lg bg-white text-[#0D4D2A]"
                                        >
                                            Subscribe
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#0D4D2A] text-[#9FE1CB] py-8 border-t border-white/10 text-center text-xs">
                    <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span>© {new Date().getFullYear()} Panda Towers 001. All rights reserved.</span>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://pandatowers.africa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors"
                            >
                                pandatowers.africa
                            </a>
                            <Link href="/cms/blog" className="hover:text-white transition-colors">
                                CMS Portal
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

