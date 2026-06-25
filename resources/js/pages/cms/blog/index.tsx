import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, FilePlus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    const deletePost = (post: Post) => {
        if (!confirm(`Delete "${post.title}"?`)) return;
        router.delete(`/cms/blog/${post.id}`);
    };

    return (
        <>
            <Head title="Blog Posts" />
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
                        <p className="text-muted-foreground mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/cms/blog-categories">Categories</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/cms/blog/create">
                                <FilePlus className="h-4 w-4 mr-2" />
                                New Post
                            </Link>
                        </Button>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border py-20 text-center">
                        <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">No blog posts yet.</p>
                        <Button asChild className="mt-4" variant="outline">
                            <Link href="/cms/blog/create">Write your first post</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-xl border border-border overflow-hidden bg-card">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Post</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <BookOpen className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm flex items-center gap-2">
                                                        {post.title}
                                                        {post.is_featured && (
                                                            <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200" variant="outline">Featured</Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">/{post.slug}{post.read_time ? ` · ${post.read_time}` : ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            {post.category ? (
                                                <Badge variant="outline" className="text-xs" style={{ borderColor: post.category.color, color: post.category.color }}>
                                                    {post.category.name}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className={`text-xs ${post.is_published ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}
                                                variant="outline"
                                            >
                                                {post.is_published ? 'Published' : 'Draft'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/cms/blog/${post.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => deletePost(post)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
