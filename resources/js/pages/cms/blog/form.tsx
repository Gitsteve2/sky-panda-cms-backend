import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';

interface Category { id: number; name: string }
interface Post {
    id?: number;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    featured_image?: string;
    read_time?: string;
    blog_category_id?: number | null;
    is_featured?: boolean;
    is_published?: boolean;
    published_at?: string;
    meta_title?: string;
    meta_description?: string;
}

export default function BlogForm({ post, categories }: { post: Post | null; categories: Category[] }) {
    const { data, setData, post: postReq, put, processing, errors } = useForm({
        title: post?.title ?? '',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt ?? '',
        content: post?.content ?? '',
        featured_image: post?.featured_image ?? '',
        read_time: post?.read_time ?? '',
        blog_category_id: post?.blog_category_id?.toString() ?? '',
        is_featured: post?.is_featured ?? false,
        is_published: post?.is_published ?? false,
        published_at: post?.published_at ?? '',
        meta_title: post?.meta_title ?? '',
        meta_description: post?.meta_description ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (post?.id) {
            put(`/cms/blog/${post.id}`);
        } else {
            postReq('/cms/blog');
        }
    };

    return (
        <>
            <Head title={post ? `Edit: ${post.title}` : 'New Blog Post'} />
            <div className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/cms/blog"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <h1 className="text-2xl font-bold">{post ? `Edit Post` : 'New Blog Post'}</h1>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle>Post Content</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label>Title *</Label>
                                <Input value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Slug</Label>
                                    <Input value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="auto-generated" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Read Time</Label>
                                    <Input value={data.read_time} onChange={(e) => setData('read_time', e.target.value)} placeholder="5 min read" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label>Excerpt</Label>
                                <textarea
                                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label>Content (HTML)</Label>
                                <textarea
                                    className="w-full min-h-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="<p>Your blog post content here...</p>"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Category</Label>
                                    <Select value={data.blog_category_id} onValueChange={(v) => setData('blog_category_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No category</SelectItem>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Featured Image URL</Label>
                                    <Input value={data.featured_image} onChange={(e) => setData('featured_image', e.target.value)} placeholder="/image.jpg" />
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} />
                                    <span className="text-sm font-medium">Published</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} />
                                    <span className="text-sm font-medium">Featured</span>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label>Meta Title</Label>
                                <Input value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label>Meta Description</Label>
                                <textarea
                                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/cms/blog">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
