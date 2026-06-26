import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, FilePlus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { ConfirmDialog } from '@/components/confirm-dialog';

interface Category { id: number; name: string; color: string }
interface Post {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    is_featured: boolean;
    read_time?: string;
    created_at: string;
    category?: Category;
}

export default function BlogIndex({ posts, categories }: { posts: Post[]; categories: Category[] }) {
    const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

    return (
        <>
            <Head title="Blog Posts" />
            <div className="space-y-6 animate-in fade-in-50 duration-200">
                <PageHeader
                    title="Blog Posts"
                    description={`${posts.length} post${posts.length !== 1 ? 's' : ''} total`}
                    action={
                        <div className="flex items-center gap-2">
                            <Button variant="outline" asChild className="hover:bg-muted/50">
                                <Link href="/cms/blog-categories">Categories</Link>
                            </Button>
                            <Button asChild className="shadow-green hover:scale-[1.02] transition-transform">
                                <Link href="/cms/blog/create">
                                    <FilePlus className="h-4 w-4 mr-2" />
                                    New Post
                                </Link>
                            </Button>
                        </div>
                    }
                />

                {posts.length === 0 ? (
                    <EmptyState
                        icon={BookOpen}
                        title="No blog posts yet"
                        description="Write and publish articles, news, and updates about Panda Towers."
                        action={
                            <Button asChild>
                                <Link href="/cms/blog/create">Write your first post</Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/30">
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Post</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Category</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {posts.map((post) => (
                                        <tr key={post.id} className="hover:bg-muted/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                                        <BookOpen className="h-4.5 w-4.5 text-primary" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-sm text-foreground flex items-center gap-2">
                                                            <span className="truncate">{post.title}</span>
                                                            {post.is_featured && (
                                                                <Badge className="text-[10px] uppercase font-extrabold tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20" variant="outline">
                                                                    Featured
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                                            /{post.slug}{post.read_time ? ` · ${post.read_time}` : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                {post.category ? (
                                                    <Badge variant="outline" className="text-xs font-semibold" style={{ borderColor: `${post.category.color}40`, color: post.category.color, backgroundColor: `${post.category.color}08` }}>
                                                        {post.category.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground/60">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="text-sm text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={post.is_published ? 'published' : 'draft'} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                                                        <Link href={`/cms/blog/${post.id}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(post)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Delete blog post?"
                description={`Are you sure you want to delete "${deleteTarget?.title}"? This will permanently delete the post and its content.`}
                confirmText="Delete"
                variant="destructive"
                onConfirm={() => {
                    if (deleteTarget) {
                        router.delete(`/cms/blog/${deleteTarget.id}`);
                        setDeleteTarget(null);
                    }
                }}
            />
        </>
    );
}
