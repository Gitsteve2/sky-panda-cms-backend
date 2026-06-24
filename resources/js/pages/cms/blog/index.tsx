import { Head, Link, router } from '@inertiajs/react';
import { FilePlus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Blog Posts</h1>
                        <p className="text-sm text-muted-foreground mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
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

                <Card>
                    <CardContent className="p-0">
                        {posts.length === 0 && (
                            <div className="py-12 text-center text-muted-foreground">No posts yet.</div>
                        )}
                        <div className="divide-y">
                            {posts.map((post) => (
                                <div key={post.id} className="flex items-center gap-4 px-6 py-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium truncate">{post.title}</span>
                                            {post.is_featured && <Badge variant="default" className="text-xs bg-amber-500">Featured</Badge>}
                                            <Badge variant={post.is_published ? 'default' : 'secondary'} className="text-xs">
                                                {post.is_published ? 'Published' : 'Draft'}
                                            </Badge>
                                            {post.category && (
                                                <Badge variant="outline" className="text-xs" style={{ borderColor: post.category.color, color: post.category.color }}>
                                                    {post.category.name}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            /{post.slug} {post.read_time ? `· ${post.read_time}` : ''} · {new Date(post.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/cms/blog/${post.id}/edit`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => deletePost(post)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
