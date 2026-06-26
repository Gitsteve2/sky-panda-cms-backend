import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Eye, EyeOff, Star, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
            <div className="max-w-5xl space-y-6 animate-in fade-in-50 duration-200">
                
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground">
                            <Link href="/cms/blog">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">{post ? 'Edit Blog Post' : 'New Blog Post'}</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {post ? `Modifying: ${post.title}` : 'Draft a new article or update for the website.'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {data.is_published ? (
                            <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold text-xs px-2.5 py-1" variant="outline">
                                <Eye className="h-3.5 w-3.5 mr-1.5" />Published
                            </Badge>
                        ) : (
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-semibold text-xs px-2.5 py-1" variant="outline">
                                <EyeOff className="h-3.5 w-3.5 mr-1.5" />Draft
                            </Badge>
                        )}
                        {data.is_featured && (
                            <Badge className="bg-copper/10 text-copper border-copper/20 font-semibold text-xs px-2.5 py-1" variant="outline">
                                <Star className="h-3.5 w-3.5 mr-1.5" />Featured
                            </Badge>
                        )}
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Main Content Fields */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-border/50 shadow-xs overflow-hidden">
                                <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                        <BookOpen className="h-4.5 w-4.5 text-primary" />Post Content
                                    </CardTitle>
                                    <CardDescription className="text-xs">Provide details and full content body.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-5">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="title" className="font-semibold text-sm">Title <span className="text-destructive">*</span></Label>
                                        <Input 
                                            id="title" 
                                            value={data.title} 
                                            onChange={(e) => setData('title', e.target.value)} 
                                            placeholder="Enter post title..." 
                                            required 
                                            className="h-10 text-sm focus-visible:ring-primary/20 focus-visible:border-primary" 
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="slug" className="font-semibold text-sm">Slug URL</Label>
                                            <Input 
                                                id="slug" 
                                                value={data.slug} 
                                                onChange={(e) => setData('slug', e.target.value)} 
                                                placeholder="auto-generated" 
                                                className="h-10 font-mono text-xs focus-visible:ring-primary/20 focus-visible:border-primary bg-muted/20" 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="read_time" className="font-semibold text-sm">Read Time</Label>
                                            <Input 
                                                id="read_time" 
                                                value={data.read_time} 
                                                onChange={(e) => setData('read_time', e.target.value)} 
                                                placeholder="e.g. 5 min read" 
                                                className="h-10 focus-visible:ring-primary/20 focus-visible:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="excerpt" className="font-semibold text-sm">Excerpt</Label>
                                        <textarea 
                                            id="excerpt"
                                            className="w-full min-h-[90px] rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-muted-foreground/55" 
                                            value={data.excerpt} 
                                            onChange={(e) => setData('excerpt', e.target.value)} 
                                            placeholder="Write a brief, catchy summary of this article..." 
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="font-semibold text-sm">Content Body</Label>
                                        <div className="border border-border/60 rounded-lg overflow-hidden">
                                            <RichEditor
                                                value={data.content}
                                                onChange={(v) => setData('content', v)}
                                                placeholder="Begin writing your post..."
                                                minHeight={360}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SEO Meta Section */}
                            <Card className="border-border/50 shadow-xs overflow-hidden">
                                <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                        <Globe className="h-4.5 w-4.5 text-primary" />Search Engine Optimization
                                    </CardTitle>
                                    <CardDescription className="text-xs">Optimize how this post appears on search engines.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="meta_title" className="font-semibold text-sm">Meta Title</Label>
                                        <Input 
                                            id="meta_title"
                                            value={data.meta_title} 
                                            onChange={(e) => setData('meta_title', e.target.value)} 
                                            placeholder="SEO Title (falls back to main title)" 
                                            className="h-10 focus-visible:ring-primary/20 focus-visible:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="meta_description" className="font-semibold text-sm">Meta Description</Label>
                                        <textarea 
                                            id="meta_description"
                                            className="w-full min-h-[90px] rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-muted-foreground/55" 
                                            value={data.meta_description} 
                                            onChange={(e) => setData('meta_description', e.target.value)} 
                                            placeholder="Brief post synopsis shown in Google searches (recommended 120-160 characters)" 
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar controls */}
                        <div className="space-y-6">
                            
                            {/* Publish Settings */}
                            <Card className="border-border/50 shadow-xs overflow-hidden">
                                <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                        <Sparkles className="h-4.5 w-4.5 text-primary" />Visibility Settings
                                    </CardTitle>
                                    <CardDescription className="text-xs">Control publishing status & visibility.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-5">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className={`mt-0.5 relative w-10 h-6 rounded-full transition-colors shrink-0 ${data.is_published ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_published ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </div>
                                        <input type="checkbox" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} className="sr-only" />
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Publish on website</div>
                                            <div className="text-xs text-muted-foreground leading-relaxed">Visible publicly once saved.</div>
                                        </div>
                                    </label>
                                    
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className={`mt-0.5 relative w-10 h-6 rounded-full transition-colors shrink-0 ${data.is_featured ? 'bg-copper' : 'bg-muted-foreground/30'}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_featured ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </div>
                                        <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="sr-only" />
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-bold text-foreground group-hover:text-copper transition-colors">Featured article</div>
                                            <div className="text-xs text-muted-foreground leading-relaxed">Pin article to home sections.</div>
                                        </div>
                                    </label>
                                </CardContent>
                            </Card>

                            {/* Meta taxonomy & Media */}
                            <Card className="border-border/50 shadow-xs overflow-hidden">
                                <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                                    <CardTitle className="text-base font-bold text-foreground">Taxonomy & Media</CardTitle>
                                    <CardDescription className="text-xs">Category classification & cover media.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-5">
                                    <div className="space-y-1.5">
                                        <Label className="font-semibold text-sm">Category Selection</Label>
                                        <Select value={data.blog_category_id} onValueChange={(v) => setData('blog_category_id', v)}>
                                            <SelectTrigger className="h-10">
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
                                    
                                    <div className="space-y-1.5 pt-1">
                                        <MediaPicker
                                            label="Featured Cover Image"
                                            value={data.featured_image}
                                            onChange={(url) => setData('featured_image', url)}
                                            accept="image"
                                            placeholder="/images/post-cover.jpg"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submission Controls */}
                            <div className="flex flex-col gap-2 pt-2">
                                <Button type="submit" disabled={processing} className="w-full h-11 font-semibold text-sm shadow-green hover:scale-[1.01] transition-transform">
                                    {processing ? 'Saving Changes...' : post ? 'Update Blog Post' : 'Publish Blog Post'}
                                </Button>
                                <Button variant="outline" asChild className="w-full h-11 text-sm">
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
