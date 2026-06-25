import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Eye, EyeOff, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichEditor } from '@/components/rich-editor';
import { MediaPicker } from '@/components/media-picker';
import InputError from '@/components/input-error';

interface Category { id: number; name: string }
interface Post {
    id?: number; title?: string; slug?: string; excerpt?: string;
    content?: string; featured_image?: string; read_time?: string;
    blog_category_id?: number | null; is_featured?: boolean; is_published?: boolean;
    published_at?: string; meta_title?: string; meta_description?: string;
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
        if (post?.id) put(`/cms/blog/${post.id}`);
        else postReq('/cms/blog');
    };

    return (
        <>
            <Head title={post ? `Edit: ${post.title}` : 'New Blog Post'} />
            <div className="max-w-4xl space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/cms/blog"><ArrowLeft className="h-4 w-4" /></Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{post ? 'Edit Post' : 'New Blog Post'}</h1>
                            {post?.title && <p className="text-muted-foreground mt-0.5 text-sm">{post.title}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {data.is_published ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />Published
                            </Badge>
                        ) : (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200" variant="outline">
                                <EyeOff className="h-3 w-3 mr-1" />Draft
                            </Badge>
                        )}
                        {data.is_featured && (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200" variant="outline">
                                <Star className="h-3 w-3 mr-1" />Featured
                            </Badge>
                        )}
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                        {/* Main content */}
                        <div className="col-span-2 space-y-5">
                            <Card className="overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-border pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <BookOpen className="h-4 w-4 text-primary" />Post Content
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-5 space-y-5">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="My Awesome Blog Post" required className="text-base" />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="slug">Slug</Label>
                                            <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="auto-generated" className="font-mono text-sm" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="read_time">Read Time</Label>
                                            <Input id="read_time" value={data.read_time} onChange={(e) => setData('read_time', e.target.value)} placeholder="5 min read" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Excerpt</Label>
                                        <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} placeholder="A short summary of this post..." />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Content</Label>
                                        <RichEditor
                                            value={data.content}
                                            onChange={(v) => setData('content', v)}
                                            placeholder="Write your blog post here..."
                                            minHeight={320}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-border pb-4">
                                    <CardTitle className="text-base">SEO</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-5 space-y-4">
                                    <div className="space-y-1.5">
                                        <Label>Meta Title</Label>
                                        <Input value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} placeholder="SEO title (defaults to post title)" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Meta Description</Label>
                                        <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} placeholder="Short description for search engines (120–160 chars)" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-5">
                            <Card className="overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-border pb-4">
                                    <CardTitle className="text-base">Publish</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-5 space-y-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className={`relative w-10 h-6 rounded-full transition-colors ${data.is_published ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_published ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </div>
                                        <input type="checkbox" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} className="sr-only" />
                                        <div>
                                            <div className="text-sm font-medium">Published</div>
                                            <div className="text-xs text-muted-foreground">Visible on website</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className={`relative w-10 h-6 rounded-full transition-colors ${data.is_featured ? 'bg-amber-500' : 'bg-muted-foreground/30'}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_featured ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </div>
                                        <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="sr-only" />
                                        <div>
                                            <div className="text-sm font-medium">Featured</div>
                                            <div className="text-xs text-muted-foreground">Highlighted post</div>
                                        </div>
                                    </label>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-border pb-4">
                                    <CardTitle className="text-base">Details</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-5 space-y-4">
                                    <div className="space-y-1.5">
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
                                    <MediaPicker
                                        label="Featured Image"
                                        value={data.featured_image}
                                        onChange={(url) => setData('featured_image', url)}
                                        accept="image"
                                        placeholder="/images/post-cover.jpg"
                                    />
                                </CardContent>
                            </Card>

                            <div className="flex flex-col gap-2">
                                <Button type="submit" disabled={processing} className="w-full">
                                    {processing ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
                                </Button>
                                <Button variant="outline" asChild className="w-full">
                                    <Link href="/cms/blog">Cancel</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
