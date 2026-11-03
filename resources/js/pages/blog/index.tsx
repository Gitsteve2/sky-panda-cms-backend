import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Calendar,
    Clock,
    LayoutDashboard,
    Mail,
    Search,
    Sparkles,
    Star,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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
                const postCatSlug =
                    post.category?.slug ||
                    post.category?.name?.toLowerCase().replace(/\s+/g, '-');

                if (postCatSlug !== activeCategory) {
                    return false;
                }
            }

            if (q) {
                const match =
                    post.title.toLowerCase().includes(q) ||
                    (post.excerpt || '').toLowerCase().includes(q) ||
                    (post.category?.name || '').toLowerCase().includes(q) ||
                    (post.author_name || '').toLowerCase().includes(q);

                if (!match) {
                    return false;
                }
            }

            return true;
        });
    }, [posts, activeCategory, searchQuery]);

    const featuredPost = useMemo(
        () =>
            filteredPosts.find((p) => p.is_featured) ??
            filteredPosts[0] ??
            null,
        [filteredPosts],
    );

    const remainingPosts = useMemo(
        () =>
            featuredPost
                ? filteredPosts.filter((p) => p.id !== featuredPost.id)
                : [],
        [filteredPosts, featuredPost],
    );

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) {
            return '';
        }

        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="Blog & Investment Insights | Panda Towers" />

            <div className="flex min-h-screen flex-col bg-white font-sans text-[#1A1A1A]">
                {/* Top Navigation Header */}
                <header className="sticky top-0 z-40 border-b border-[#E8EDE6] bg-white/95 backdrop-blur-md">
                    <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-3">
                            <img
                                src="/Sky-Panda-Towers-Logo-1.png"
                                alt="Panda Towers"
                                className="h-10 w-auto object-contain"
                                onError={(e) => {
                                    (
                                        e.currentTarget as HTMLImageElement
                                    ).style.display = 'none';
                                }}
                            />
                            <span className="text-lg font-bold tracking-tight text-[#0D4D2A]">
                                PANDA TOWERS
                            </span>
                        </Link>

                        <nav className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="hidden text-sm font-medium text-[#5F5E5A] transition-colors hover:text-[#1A9E55] sm:inline"
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
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0D4D2A] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#1A9E55]"
                                >
                                    <LayoutDashboard className="h-3.5 w-3.5" />
                                    Manage Articles in CMS
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#0D4D2A] px-4 py-2 text-xs font-bold text-[#0D4D2A] transition-colors hover:bg-[#0D4D2A] hover:text-white"
                                >
                                    CMS Login
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Banner */}
                <section
                    className="relative overflow-hidden border-b py-16 text-center text-white md:py-22"
                    style={{
                        backgroundColor: '#0D4D2A',
                        borderColor: 'rgba(192,221,151,0.2)',
                    }}
                >
                    <div
                        className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full opacity-20 blur-3xl"
                        style={{ backgroundColor: '#2ECC71' }}
                    />
                    <div
                        className="pointer-events-none absolute -right-32 -bottom-32 h-80 w-80 rounded-full opacity-20 blur-3xl"
                        style={{ backgroundColor: '#1A9E55' }}
                    />

                    <div className="relative z-10 mx-auto max-w-4xl space-y-5 px-4">
                        <div
                            className="inline-flex items-center space-x-2 rounded-full border px-4 py-1.5"
                            style={{
                                backgroundColor: 'rgba(192,221,151,0.15)',
                                borderColor: 'rgba(192,221,151,0.3)',
                            }}
                        >
                            <Sparkles className="h-4 w-4 text-[#2ECC71]" />
                            <span className="text-[11px] font-extrabold tracking-[0.2em] text-[#2ECC71] uppercase">
                                Investment Insights
                            </span>
                        </div>

                        <h1 className="mx-auto max-w-3xl text-3xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Make informed decisions{' '}
                            <span style={{ color: '#2ECC71' }}>
                                about your money.
                            </span>
                        </h1>

                        <p
                            className="mx-auto max-w-2xl text-sm leading-relaxed sm:text-base"
                            style={{ color: '#9FE1CB' }}
                        >
                            Market analysis, investment guides, and project
                            updates from the Panda Towers team.
                        </p>
                    </div>
                </section>

                {/* Sticky Category Filter & Search Bar */}
                <div className="sticky top-[72px] z-30 border-b border-[#E8EDE6] bg-white/95 shadow-2xs backdrop-blur-md">
                    <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                        <div
                            className="no-scrollbar flex items-center gap-2 overflow-x-auto"
                            role="tablist"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeCategory === 'all'}
                                onClick={() => setActiveCategory('all')}
                                className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                                    activeCategory === 'all'
                                        ? 'text-white shadow-sm'
                                        : 'border text-[#5F5E5A] hover:border-[#1A9E55] hover:text-[#1A9E55]'
                                }`}
                                style={{
                                    backgroundColor:
                                        activeCategory === 'all'
                                            ? '#0D4D2A'
                                            : '#F4FAF0',
                                    borderColor:
                                        activeCategory === 'all'
                                            ? '#0D4D2A'
                                            : '#C0DD97',
                                }}
                            >
                                All Articles ({posts.length})
                            </button>

                            {categories.map((cat) => {
                                const slug =
                                    cat.slug ||
                                    cat.name.toLowerCase().replace(/\s+/g, '-');
                                const isActive = activeCategory === slug;

                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveCategory(slug)}
                                        className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                                            isActive
                                                ? 'text-white shadow-sm'
                                                : 'border text-[#5F5E5A] hover:border-[#1A9E55] hover:text-[#1A9E55]'
                                        }`}
                                        style={{
                                            backgroundColor: isActive
                                                ? '#0D4D2A'
                                                : '#F4FAF0',
                                            borderColor: isActive
                                                ? '#0D4D2A'
                                                : '#C0DD97',
                                        }}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="relative shrink-0 sm:w-64">
                            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#888780]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles..."
                                className="h-9 w-full rounded-full border border-[#C0DD97] bg-[#F4FAF0]/60 pr-8 pl-8 text-xs text-[#1A1A1A] placeholder:text-[#888780] focus:border-[#1A9E55] focus:outline-none"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-[#888780] hover:text-[#1A1A1A]"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Blog Articles Section */}
                <section className="flex-1 bg-white py-14 sm:py-20">
                    <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
                        {filteredPosts.length === 0 ? (
                            <div className="space-y-3 rounded-3xl border border-[#C0DD97] bg-[#F4FAF0] py-20 text-center">
                                <BookOpen className="mx-auto h-10 w-10 text-[#1A9E55] opacity-70" />
                                <p className="text-base font-bold text-[#0D4D2A]">
                                    No published articles match your filter.
                                </p>
                                <p className="text-xs text-[#5F5E5A]">
                                    Try selecting another category or clearing
                                    your search.
                                </p>
                                {(activeCategory !== 'all' || searchQuery) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveCategory('all');
                                            setSearchQuery('');
                                        }}
                                        className="mt-2 rounded-full bg-[#0D4D2A] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#1A9E55]"
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
                                        <div className="mb-4 flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-[#1A9E55]" />
                                            <span className="text-[11px] font-bold tracking-[0.2em] text-[#1A9E55] uppercase">
                                                {featuredPost.is_featured
                                                    ? 'Featured Article'
                                                    : 'Spotlight Article'}
                                            </span>
                                        </div>

                                        <article className="group grid overflow-hidden rounded-3xl border border-[#E8EDE6] bg-white shadow-sm transition-all duration-300 hover:shadow-xl lg:grid-cols-12">
                                            <Link
                                                href={`/blog/${featuredPost.slug}`}
                                                className="relative block min-h-[260px] overflow-hidden bg-gray-100 sm:min-h-[360px] lg:col-span-7"
                                            >
                                                <img
                                                    src={
                                                        featuredPost.featured_image ||
                                                        '/exterior.jpg'
                                                    }
                                                    alt={featuredPost.title}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    onError={(e) => {
                                                        (
                                                            e.currentTarget as HTMLImageElement
                                                        ).src = '/exterior.jpg';
                                                    }}
                                                />
                                                {featuredPost.is_featured && (
                                                    <div className="absolute top-4 left-4">
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#0D4D2A] px-3 py-1 text-[11px] font-bold text-[#2ECC71] shadow">
                                                            <Star className="h-3 w-3 fill-[#2ECC71]" />
                                                            Featured
                                                        </span>
                                                    </div>
                                                )}
                                            </Link>

                                            <div className="flex flex-col justify-between space-y-6 p-6 sm:p-10 lg:col-span-5">
                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span
                                                            className="rounded-full border px-3 py-1 text-xs font-bold"
                                                            style={{
                                                                backgroundColor:
                                                                    '#F4FAF0',
                                                                borderColor:
                                                                    '#C0DD97',
                                                                color: '#1A9E55',
                                                            }}
                                                        >
                                                            {featuredPost
                                                                .category
                                                                ?.name ??
                                                                'General'}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs text-[#888780]">
                                                            <Clock className="h-3.5 w-3.5 text-[#1A9E55]" />
                                                            {featuredPost.read_time ||
                                                                '5 min read'}
                                                        </span>
                                                    </div>

                                                    <h2 className="text-2xl leading-snug font-bold text-[#1A1A1A] transition-colors group-hover:text-[#1A9E55] sm:text-3xl">
                                                        <Link
                                                            href={`/blog/${featuredPost.slug}`}
                                                            className="hover:underline"
                                                        >
                                                            {featuredPost.title}
                                                        </Link>
                                                    </h2>

                                                    {featuredPost.excerpt && (
                                                        <p className="line-clamp-4 text-xs leading-relaxed text-[#5F5E5A] sm:text-sm">
                                                            {
                                                                featuredPost.excerpt
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between border-t border-[#E8EDE6] pt-5">
                                                    <div className="space-y-0.5 text-xs text-[#888780]">
                                                        <div className="font-semibold text-[#1A1A1A]">
                                                            {featuredPost.author_name ||
                                                                'Panda Towers Team'}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(
                                                                featuredPost.published_at,
                                                            )}
                                                        </div>
                                                    </div>

                                                    <Link
                                                        href={`/blog/${featuredPost.slug}`}
                                                        className="inline-flex items-center gap-2 text-xs font-bold text-[#1A9E55] transition-all group-hover:text-[#0D4D2A] sm:text-sm"
                                                    >
                                                        <span>
                                                            Read article
                                                        </span>
                                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                )}

                                {/* Latest Articles Grid */}
                                {remainingPosts.length > 0 && (
                                    <div>
                                        <div className="mb-6 flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-[#1A9E55]" />
                                            <span className="text-[11px] font-bold tracking-[0.2em] text-[#1A9E55] uppercase">
                                                Latest Articles
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                            {remainingPosts.map((post) => (
                                                <article
                                                    key={post.id}
                                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E8EDE6] bg-white shadow-xs transition-all duration-300 hover:shadow-xl"
                                                >
                                                    <div>
                                                        <Link
                                                            href={`/blog/${post.slug}`}
                                                            className="relative block h-48 overflow-hidden bg-gray-100 sm:h-52"
                                                        >
                                                            <img
                                                                src={
                                                                    post.featured_image ||
                                                                    '/exterior.jpg'
                                                                }
                                                                alt={post.title}
                                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                loading="lazy"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    (
                                                                        e.currentTarget as HTMLImageElement
                                                                    ).src =
                                                                        '/exterior.jpg';
                                                                }}
                                                            />
                                                            <div className="absolute top-3 left-3">
                                                                <span
                                                                    className="rounded-full border px-2.5 py-0.5 text-[11px] font-bold shadow-xs"
                                                                    style={{
                                                                        backgroundColor:
                                                                            'rgba(255, 255, 255, 0.95)',
                                                                        borderColor:
                                                                            '#C0DD97',
                                                                        color: '#1A9E55',
                                                                    }}
                                                                >
                                                                    {post
                                                                        .category
                                                                        ?.name ??
                                                                        'General'}
                                                                </span>
                                                            </div>
                                                        </Link>

                                                        <div className="space-y-3 p-6">
                                                            <div className="flex items-center justify-between text-xs text-[#888780]">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="h-3.5 w-3.5 text-[#1A9E55]" />
                                                                    {post.read_time ||
                                                                        '5 min read'}
                                                                </span>
                                                                <span>
                                                                    {formatDate(
                                                                        post.published_at,
                                                                    )}
                                                                </span>
                                                            </div>

                                                            <h3 className="line-clamp-2 text-base leading-snug font-bold text-[#1A1A1A] transition-colors group-hover:text-[#1A9E55] sm:text-lg">
                                                                <Link
                                                                    href={`/blog/${post.slug}`}
                                                                >
                                                                    {post.title}
                                                                </Link>
                                                            </h3>

                                                            {post.excerpt && (
                                                                <p className="line-clamp-3 text-xs leading-relaxed text-[#5F5E5A]">
                                                                    {
                                                                        post.excerpt
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between border-t border-[#F4FAF0] px-6 py-4">
                                                        <span className="max-w-[140px] truncate text-xs font-medium text-[#5F5E5A]">
                                                            {post.author_name ||
                                                                'Panda Towers Team'}
                                                        </span>
                                                        <Link
                                                            href={`/blog/${post.slug}`}
                                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A9E55] transition-colors group-hover:text-[#0D4D2A]"
                                                        >
                                                            <span>
                                                                Read article
                                                            </span>
                                                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
                <section
                    className="border-t border-[#C0DD97] py-16"
                    style={{ backgroundColor: '#F4FAF0' }}
                >
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div
                            className="relative overflow-hidden rounded-3xl p-8 text-center shadow-xl sm:p-12"
                            style={{ backgroundColor: '#0D4D2A' }}
                        >
                            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
                                <div
                                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border"
                                    style={{
                                        backgroundColor:
                                            'rgba(192,221,151,0.15)',
                                        borderColor: 'rgba(192,221,151,0.3)',
                                    }}
                                >
                                    <Mail className="h-6 w-6 text-[#2ECC71]" />
                                </div>
                                <div>
                                    <span className="mb-2 block text-[10px] font-bold tracking-[0.16em] text-[#C0DD97] uppercase">
                                        STAY INFORMED
                                    </span>
                                    <h2 className="text-2xl leading-tight font-bold text-white sm:text-3xl">
                                        Get Investor Intelligence
                                    </h2>
                                    <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#9FE1CB] sm:text-sm">
                                        Get market updates and Panda Towers 001
                                        project news delivered straight to your
                                        inbox.
                                    </p>
                                </div>

                                {subscribed ? (
                                    <div
                                        className="inline-flex items-center gap-2 rounded-2xl border p-4 text-xs font-bold sm:text-sm"
                                        style={{
                                            backgroundColor:
                                                'rgba(46,204,113,0.15)',
                                            borderColor: '#2ECC71',
                                            color: '#2ECC71',
                                        }}
                                    >
                                        Thank you for subscribing to Panda
                                        Towers updates!
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();

                                            if (newsletterEmail) {
                                                setSubscribed(true);
                                            }
                                        }}
                                        className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
                                    >
                                        <input
                                            type="email"
                                            required
                                            value={newsletterEmail}
                                            onChange={(e) =>
                                                setNewsletterEmail(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter your email address..."
                                            className="flex-1 rounded-full border px-5 py-3 text-xs text-white outline-none placeholder:text-[#9FE1CB]/60 sm:text-sm"
                                            style={{
                                                backgroundColor:
                                                    'rgba(255, 255, 255, 0.1)',
                                                borderColor:
                                                    'rgba(255, 255, 255, 0.2)',
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            className="rounded-full bg-white px-7 py-3 text-xs font-bold text-[#0D4D2A] shadow-lg transition-all hover:bg-[#F4FAF0] sm:text-sm"
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
                <footer className="border-t border-white/10 bg-[#0D4D2A] py-8 text-center text-xs text-[#9FE1CB]">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
                        <span>
                            © {new Date().getFullYear()} Panda Towers 001. All
                            rights reserved.
                        </span>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://pandatowers.africa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-white"
                            >
                                pandatowers.africa
                            </a>
                            <Link
                                href="/cms/blog"
                                className="transition-colors hover:text-white"
                            >
                                CMS Portal
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
