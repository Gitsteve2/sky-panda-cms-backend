import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, Copy, EyeOff, Pencil, Share2 } from 'lucide-react';
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

    const authorName = post.author_name || post.author?.name || 'Panda Towers Team';
    const initials = authorName
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const copyArticleLink = () => {
        if (typeof window === 'undefined') return;
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <>
            <Head title={`${post.meta_title || post.title} | Panda Towers`} />

            <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-sans">
                {/* Draft Banner for Administrators */}
                {!post.is_published && (
                    <div className="bg-amber-500 text-white px-4 py-2.5 text-xs font-semibold">
                        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <EyeOff className="h-4 w-4 shrink-0" />
                                <span>
                                    DRAFT PREVIEW MODE — This article is currently unpublished and only visible to logged-in CMS administrators.
                                </span>
                            </div>
                            <Link
                                href={`/cms/blog/${post.id}/edit`}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-amber-700 font-bold hover:bg-amber-50 transition-colors"
                            >
                                <Pencil className="h-3 w-3" />
                                Edit & Publish in CMS
                            </Link>
                        </div>
                    </div>
                )}

                {/* Navigation Header */}
                <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8EDE6]">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 h-[70px] flex items-center justify-between">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#0D4D2A] hover:text-[#1A9E55] transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog
                        </Link>

                        <div className="flex items-center gap-3">
                            {auth?.user && (
                                <Link
                                    href={`/cms/blog/${post.id}/edit`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#F4FAF0] text-[#0D4D2A] border border-[#C0DD97] hover:bg-[#0D4D2A] hover:text-white transition-colors"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit Article
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Article Header Section */}
                <section className="py-12 bg-[#F4FAF0] border-b border-[#C0DD97]/60">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
                        {post.category && (
                            <span className="inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold bg-[#0D4D2A] text-[#2ECC71]">
                                {post.category.name}
                            </span>
                        )}

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#1A1A1A]">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-[#5F5E5A] pt-1">
                            {post.published_at && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#1A9E55]" />
                                    <span>{formatDate(post.published_at)}</span>
                                </div>
                            )}
                            {post.read_time && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[#1A9E55]" />
                                    <span>{post.read_time}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3.5 pt-2">
                            <div className="w-11 h-11 rounded-full bg-[#0D4D2A] flex items-center justify-center text-white font-bold text-sm">
                                {initials}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-[#1A1A1A]">{authorName}</div>
                                <div className="text-xs text-[#5F5E5A]">Panda Towers Editorial & Research</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Image */}
                {post.featured_image && (
                    <section className="pt-8">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6">
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-64 sm:h-96 object-cover rounded-2xl shadow-lg border border-[#E8EDE6]"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/exterior.jpg';
                                }}
                            />
                        </div>
                    </section>
                )}

                {/* Article Body & Author Sidebar */}
                <section className="py-12 flex-1">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="grid md:grid-cols-4 gap-10">
                            <div className="md:col-span-3 space-y-8">
                                {post.excerpt && (
                                    <p className="text-base sm:text-lg font-medium text-[#5F5E5A] border-l-4 border-[#1A9E55] pl-4 italic leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                )}

                                <article className="prose prose-lg max-w-none text-[#1A1A1A] leading-relaxed space-y-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#0D4D2A] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0D4D2A] [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#1A9E55] [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-[#1A9E55] [&_a]:underline [&_img]:rounded-xl [&_img]:my-6">
                                    <div dangerouslySetInnerHTML={{ __html: post.content ?? '' }} />
                                </article>

                                {/* Share Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-b border-[#E8EDE6] mt-10">
                                    <span className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                                        <Share2 className="h-4 w-4 text-[#1A9E55]" />
                                        Share this article:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={copyArticleLink}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border border-[#C0DD97] bg-[#F4FAF0] text-[#0D4D2A] hover:bg-[#0D4D2A] hover:text-white transition-colors"
                                        >
                                            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                            {copied ? 'Link Copied!' : 'Copy Link'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* About the Author Sidebar */}
                            <div className="md:col-span-1">
                                <div className="sticky top-24 rounded-2xl border border-[#E8EDE6] bg-[#F4FAF0]/60 p-5 space-y-4">
                                    <h3 className="font-bold text-sm text-[#0D4D2A]">About the Author</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#0D4D2A] flex items-center justify-center text-white font-bold text-xs shrink-0">
                                            {initials}
                                        </div>
                                        <div className="font-bold text-sm text-[#1A1A1A]">{authorName}</div>
                                    </div>
                                    <p className="text-xs text-[#5F5E5A] leading-relaxed">
                                        Real estate investment analyst covering Kenyan property market trends, rental yields, and wealth-building strategies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Articles */}
                {related.length > 0 && (
                    <section className="py-14 bg-[#F4FAF0] border-t border-[#C0DD97]">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6">
                            <h2 className="text-2xl font-bold mb-8 text-center text-[#0D4D2A]">Related Articles</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {related.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-2xl border border-[#E8EDE6] bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            {item.featured_image && (
                                                <Link href={`/blog/${item.slug}`} className="block h-48 overflow-hidden bg-gray-100">
                                                    <img
                                                        src={item.featured_image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).src = '/exterior.jpg';
                                                        }}
                                                    />
                                                </Link>
                                            )}
                                            <div className="p-6 space-y-3">
                                                {item.category && (
                                                    <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4FAF0] text-[#1A9E55] border border-[#C0DD97]">
                                                        {item.category.name}
                                                    </span>
                                                )}
                                                <h3 className="font-bold text-lg text-[#1A1A1A] line-clamp-2">
                                                    <Link href={`/blog/${item.slug}`} className="hover:text-[#1A9E55]">
                                                        {item.title}
                                                    </Link>
                                                </h3>
                                                {item.excerpt && (
                                                    <p className="text-xs text-[#5F5E5A] line-clamp-3 leading-relaxed">
                                                        {item.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-6 py-4 border-t border-[#F4FAF0] flex items-center justify-between text-xs text-[#888780]">
                                            <span>{formatDate(item.published_at)}</span>
                                            <Link
                                                href={`/blog/${item.slug}`}
                                                className="inline-flex items-center gap-1 font-bold text-[#1A9E55] hover:text-[#0D4D2A]"
                                            >
                                                Read More <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="bg-[#0D4D2A] text-[#9FE1CB] py-8 text-center text-xs">
                    <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span>© {new Date().getFullYear()} Panda Towers 001. All rights reserved.</span>
                        <Link href="/blog" className="hover:text-white transition-colors">
                            ← Back to All Articles
                        </Link>
                    </div>
                </footer>
            </div>
        </>
    );
}

