import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Check,
    Clock,
    Copy,
    EyeOff,
    Pencil,
    Share2,
} from 'lucide-react';
import { useState } from 'react';
import type { Auth } from '@/types';

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface BlogPostDetail {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    content?: string | null;
    featured_image?: string | null;
    read_time?: string | null;
    is_featured: boolean;
    is_published: boolean;
    published_at?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    author_name?: string | null;
    category?: Category | null;
    author?: { id: number; name: string } | null;
}

export default function PublicBlogShow({
    post,
    related,
}: {
    post: BlogPostDetail;
    related: BlogPostDetail[];
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [copied, setCopied] = useState(false);

    const authorName =
        post.author_name || post.author?.name || 'Panda Towers Team';
    const initials = authorName
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

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

    const copyArticleLink = () => {
        if (typeof window === 'undefined') {
            return;
        }

        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <>
            <Head title={`${post.meta_title || post.title} | Panda Towers`} />

            <div className="flex min-h-screen flex-col bg-white font-sans text-[#1A1A1A]">
                {/* Draft Banner for Administrators */}
                {!post.is_published && (
                    <div className="bg-amber-500 px-4 py-2.5 text-xs font-semibold text-white">
                        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <EyeOff className="h-4 w-4 shrink-0" />
                                <span>
                                    DRAFT PREVIEW MODE — This article is
                                    currently unpublished and only visible to
                                    logged-in CMS administrators.
                                </span>
                            </div>
                            <Link
                                href={`/cms/blog/${post.id}/edit`}
                                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-bold text-amber-700 transition-colors hover:bg-amber-50"
                            >
                                <Pencil className="h-3 w-3" />
                                Edit & Publish in CMS
                            </Link>
                        </div>
                    </div>
                )}

                {/* Navigation Header */}
                <header className="sticky top-0 z-40 border-b border-[#E8EDE6] bg-white/95 backdrop-blur-md">
                    <div className="mx-auto flex h-[70px] max-w-5xl items-center justify-between px-4 sm:px-6">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#0D4D2A] transition-colors hover:text-[#1A9E55]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog
                        </Link>

                        <div className="flex items-center gap-3">
                            {auth?.user && (
                                <Link
                                    href={`/cms/blog/${post.id}/edit`}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#C0DD97] bg-[#F4FAF0] px-3.5 py-1.5 text-xs font-bold text-[#0D4D2A] transition-colors hover:bg-[#0D4D2A] hover:text-white"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit Article
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Article Header Section */}
                <section className="border-b border-[#C0DD97]/60 bg-[#F4FAF0] py-12">
                    <div className="mx-auto max-w-4xl space-y-5 px-4 sm:px-6">
                        {post.category && (
                            <span className="inline-flex items-center rounded-full bg-[#0D4D2A] px-3.5 py-1 text-xs font-bold text-[#2ECC71]">
                                {post.category.name}
                            </span>
                        )}

                        <h1 className="text-3xl leading-tight font-bold text-[#1A1A1A] sm:text-4xl md:text-5xl">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 pt-1 text-sm text-[#5F5E5A]">
                            {post.published_at && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-[#1A9E55]" />
                                    <span>{formatDate(post.published_at)}</span>
                                </div>
                            )}
                            {post.read_time && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-[#1A9E55]" />
                                    <span>{post.read_time}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3.5 pt-2">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0D4D2A] text-sm font-bold text-white">
                                {initials}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-[#1A1A1A]">
                                    {authorName}
                                </div>
                                <div className="text-xs text-[#5F5E5A]">
                                    Panda Towers Editorial & Research
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Image */}
                {post.featured_image && (
                    <section className="pt-8">
                        <div className="mx-auto max-w-4xl px-4 sm:px-6">
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="h-64 w-full rounded-2xl border border-[#E8EDE6] object-cover shadow-lg sm:h-96"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                        '/exterior.jpg';
                                }}
                            />
                        </div>
                    </section>
                )}

                {/* Article Body & Author Sidebar */}
                <section className="flex-1 py-12">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6">
                        <div className="grid gap-10 md:grid-cols-4">
                            <div className="space-y-8 md:col-span-3">
                                {post.excerpt && (
                                    <p className="border-l-4 border-[#1A9E55] pl-4 text-base leading-relaxed font-medium text-[#5F5E5A] italic sm:text-lg">
                                        {post.excerpt}
                                    </p>
                                )}

                                <article className="prose prose-lg max-w-none space-y-4 leading-relaxed text-[#1A1A1A] [&_a]:text-[#1A9E55] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#1A9E55] [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#0D4D2A] [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0D4D2A] [&_h3]:text-lg [&_h3]:font-semibold [&_img]:my-6 [&_img]:rounded-xl [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: post.content ?? '',
                                        }}
                                    />
                                </article>

                                {/* Share Bar */}
                                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-b border-[#E8EDE6] py-6">
                                    <span className="flex items-center gap-2 text-sm font-bold text-[#1A1A1A]">
                                        <Share2 className="h-4 w-4 text-[#1A9E55]" />
                                        Share this article:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={copyArticleLink}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-[#C0DD97] bg-[#F4FAF0] px-3.5 py-2 text-xs font-bold text-[#0D4D2A] transition-colors hover:bg-[#0D4D2A] hover:text-white"
                                        >
                                            {copied ? (
                                                <Check className="h-3.5 w-3.5" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5" />
                                            )}
                                            {copied
                                                ? 'Link Copied!'
                                                : 'Copy Link'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* About the Author Sidebar */}
                            <div className="md:col-span-1">
                                <div className="sticky top-24 space-y-4 rounded-2xl border border-[#E8EDE6] bg-[#F4FAF0]/60 p-5">
                                    <h3 className="text-sm font-bold text-[#0D4D2A]">
                                        About the Author
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0D4D2A] text-xs font-bold text-white">
                                            {initials}
                                        </div>
                                        <div className="text-sm font-bold text-[#1A1A1A]">
                                            {authorName}
                                        </div>
                                    </div>
                                    <p className="text-xs leading-relaxed text-[#5F5E5A]">
                                        Real estate investment analyst covering
                                        Kenyan property market trends, rental
                                        yields, and wealth-building strategies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Articles */}
                {related.length > 0 && (
                    <section className="border-t border-[#C0DD97] bg-[#F4FAF0] py-14">
                        <div className="mx-auto max-w-5xl px-4 sm:px-6">
                            <h2 className="mb-8 text-center text-2xl font-bold text-[#0D4D2A]">
                                Related Articles
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {related.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E8EDE6] bg-white shadow-xs transition-all hover:shadow-md"
                                    >
                                        <div>
                                            {item.featured_image && (
                                                <Link
                                                    href={`/blog/${item.slug}`}
                                                    className="block h-48 overflow-hidden bg-gray-100"
                                                >
                                                    <img
                                                        src={
                                                            item.featured_image
                                                        }
                                                        alt={item.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                                        onError={(e) => {
                                                            (
                                                                e.currentTarget as HTMLImageElement
                                                            ).src =
                                                                '/exterior.jpg';
                                                        }}
                                                    />
                                                </Link>
                                            )}
                                            <div className="space-y-3 p-6">
                                                {item.category && (
                                                    <span className="inline-block rounded-full border border-[#C0DD97] bg-[#F4FAF0] px-2.5 py-0.5 text-[11px] font-bold text-[#1A9E55]">
                                                        {item.category.name}
                                                    </span>
                                                )}
                                                <h3 className="line-clamp-2 text-lg font-bold text-[#1A1A1A]">
                                                    <Link
                                                        href={`/blog/${item.slug}`}
                                                        className="hover:text-[#1A9E55]"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </h3>
                                                {item.excerpt && (
                                                    <p className="line-clamp-3 text-xs leading-relaxed text-[#5F5E5A]">
                                                        {item.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-[#F4FAF0] px-6 py-4 text-xs text-[#888780]">
                                            <span>
                                                {formatDate(item.published_at)}
                                            </span>
                                            <Link
                                                href={`/blog/${item.slug}`}
                                                className="inline-flex items-center gap-1 font-bold text-[#1A9E55] hover:text-[#0D4D2A]"
                                            >
                                                Read More{' '}
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="bg-[#0D4D2A] py-8 text-center text-xs text-[#9FE1CB]">
                    <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
                        <span>
                            © {new Date().getFullYear()} Panda Towers 001. All
                            rights reserved.
                        </span>
                        <Link
                            href="/blog"
                            className="transition-colors hover:text-white"
                        >
                            ← Back to All Articles
                        </Link>
                    </div>
                </footer>
            </div>
        </>
    );
}
