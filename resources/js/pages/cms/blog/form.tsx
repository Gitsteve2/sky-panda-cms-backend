import { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Clock,
    ExternalLink,
    Eye,
    EyeOff,
    Globe,
    Plus,
    RefreshCw,
    Save,
    Send,
    Sparkles,
    Star,
    Trash2,
    User,
    Wand2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RichEditor } from '@/components/rich-editor';
import { MediaPicker } from '@/components/media-picker';
import { ConfirmDialog } from '@/components/confirm-dialog';
import InputError from '@/components/input-error';
import { usePermission } from '@/hooks/use-permission';
import type { Auth } from '@/types';

interface Category {
    id: number;
    name: string;
    color?: string;
}

interface AuthorOption {
    id: number;
    name: string;
    email: string;
}

interface Post {
    id?: number;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    featured_image?: string;
    read_time?: string;
    blog_category_id?: number | null;
    author_id?: number | null;
    author_name?: string | null;
    is_featured?: boolean;
    is_published?: boolean;
    published_at?: string;
    meta_title?: string;
    meta_description?: string;
}

function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function calculateReadingTime(html: string): string {
    const plain = (html || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (!plain) return '1 min read';
    const words = plain.split(' ').length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function formatDateForInput(dateStr?: string): string {
    if (!dateStr) return new Date().toISOString().slice(0, 10);
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
    return d.toISOString().slice(0, 10);
}

function getCsrf() {
    return decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '');
}

export default function BlogForm({
    post,
    categories: initialCategories,
    authors = [],
}: {
    post: Post | null;
    categories: Category[];
    authors?: AuthorOption[];
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { can } = usePermission();
    const canDelete = can('blog.delete');

    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(post?.slug));
    const [readTimeManuallyEdited, setReadTimeManuallyEdited] = useState(Boolean(post?.read_time));
    const [previewOpen, setPreviewOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Quick New Category Modal State
    const [newCatOpen, setNewCatOpen] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatColor, setNewCatColor] = useState('#16a34a');
    const [creatingCat, setCreatingCat] = useState(false);

    const defaultAuthorId = post ? (post.author_id ? String(post.author_id) : 'custom') : (auth?.user?.id ? String(auth.user.id) : 'custom');
    const defaultAuthorName = post?.author_name || auth?.user?.name || 'Panda Towers Team';

    const { data, setData, post: postReq, put, transform, processing, errors } = useForm({
        title: post?.title ?? '',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt ?? '',
        content: post?.content ?? '',
        featured_image: post?.featured_image ?? '',
        read_time: post?.read_time ?? '3 min read',
        blog_category_id: post?.blog_category_id ? String(post.blog_category_id) : 'none',
        author_id: defaultAuthorId,
        author_name: defaultAuthorName,
        is_featured: post?.is_featured ?? false,
        is_published: post?.is_published ?? true,
        published_at: formatDateForInput(post?.published_at),
        meta_title: post?.meta_title ?? '',
        meta_description: post?.meta_description ?? '',
    });

    const handleTitleChange = (val: string) => {
        setData((prev) => ({
            ...prev,
            title: val,
            slug: slugManuallyEdited ? prev.slug : slugify(val),
        }));
    };

    const handleContentChange = (html: string) => {
        setData((prev) => ({
            ...prev,
            content: html,
            read_time: readTimeManuallyEdited ? prev.read_time : calculateReadingTime(html),
        }));
    };

    const autoGenerateExcerpt = () => {
        const plain = (data.content || '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        if (!plain) {
            toast.info('Write some article content first to generate an excerpt.');
            return;
        }
        const generated = plain.length > 175 ? plain.slice(0, 172).trim() + '...' : plain;
        setData('excerpt', generated);
        toast.success('Excerpt generated from content.');
    };

    const handleAuthorSelect = (val: string) => {
        if (val === 'custom') {
            setData((prev) => ({ ...prev, author_id: 'custom' }));
            return;
        }
        const found = authors.find((a) => String(a.id) === val);
        setData((prev) => ({
            ...prev,
            author_id: val,
            author_name: found ? found.name : prev.author_name,
        }));
    };

    const handleCreateQuickCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        setCreatingCat(true);
        try {
            const res = await fetch('/cms/blog-categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrf(),
                },
                body: JSON.stringify({
                    name: newCatName.trim(),
                    color: newCatColor,
                }),
            });
            if (res.ok) {
                const created: Category = await res.json();
                setCategories((prev) => [...prev, created]);
                setData('blog_category_id', String(created.id));
                setNewCatName('');
                setNewCatOpen(false);
                toast.success(`Category "${created.name}" created and selected.`);
            } else {
                toast.error('Could not create category.');
            }
        } catch {
            toast.error('Network error while creating category.');
        } finally {
            setCreatingCat(false);
        }
    };

    const submitForm = (publishOverride?: boolean) => {
        transform((formData) => ({
            ...formData,
            blog_category_id: formData.blog_category_id === 'none' || !formData.blog_category_id ? '' : formData.blog_category_id,
            author_id: formData.author_id === 'custom' || !formData.author_id ? '' : formData.author_id,
            is_published: publishOverride !== undefined ? publishOverride : formData.is_published,
        }));

        if (post?.id) {
            put(`/cms/blog/${post.id}`);
        } else {
            postReq('/cms/blog');
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        submitForm();
    };

    const selectedCategoryName =
        categories.find((c) => String(c.id) === data.blog_category_id)?.name ?? 'General';

    return (
        <>
            <Head title={post ? `Edit: ${post.title}` : 'New Blog Article'} />
            <div className="max-w-6xl space-y-6 animate-in fade-in-50 duration-200">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-9 w-9 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground"
                        >
                            <Link href="/cms/blog">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    {post ? 'Edit Article' : 'Create New Article'}
                                </h1>
                                {data.is_published ? (
                                    <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold text-xs px-2.5 py-0.5" variant="outline">
                                        <Eye className="h-3 w-3 mr-1" />
                                        Published
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-semibold text-xs px-2.5 py-0.5" variant="outline">
                                        <EyeOff className="h-3 w-3 mr-1" />
                                        Draft
                                    </Badge>
                                )}
                                {data.is_featured && (
                                    <Badge className="bg-copper/10 text-copper border-copper/20 font-semibold text-xs px-2.5 py-0.5" variant="outline">
                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                        Featured
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {post ? `Updating article: ${post.title}` : 'Compose and publish a new article for the Panda Towers website.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9"
                            onClick={() => setPreviewOpen(true)}
                        >
                            <Eye className="h-4 w-4 mr-1.5" />
                            Preview Article
                        </Button>
                        {post?.slug && (
                            <Button type="button" variant="outline" size="sm" asChild className="h-9">
                                <Link href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-1.5" />
                                    View on Site
                                </Link>
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9"
                            disabled={processing || !data.title.trim()}
                            onClick={() => submitForm(false)}
                        >
                            <Save className="h-4 w-4 mr-1.5" />
                            Save as Draft
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            className="h-9 shadow-green"
                            disabled={processing || !data.title.trim()}
                            onClick={() => submitForm(true)}
                        >
                            <Send className="h-4 w-4 mr-1.5" />
                            {processing ? 'Saving...' : post?.is_published ? 'Update Published' : 'Publish Now'}
                        </Button>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-border/50 shadow-xs overflow-hidden">
                                <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                        <BookOpen className="h-4.5 w-4.5 text-primary" />
                                        Article Content
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Provide the headline, summary excerpt, and full rich-text body for your readers.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-5">
                                    {/* Title */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="title" className="font-semibold text-sm">
                                            Article Title <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            placeholder="e.g. Why Real Estate Investment Remains King in Nairobi"
                                            required
                                            className="h-10 text-sm font-medium focus-visible:ring-primary/20 focus-visible:border-primary"
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    {/* Slug & Read Time */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="slug" className="font-semibold text-sm">
                                                    URL Slug
                                                </Label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setData('slug', slugify(data.title));
                                                        setSlugManuallyEdited(false);
                                                    }}
                                                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                                                    title="Regenerate slug from title"
                                                >
                                                    <RefreshCw className="h-3 w-3" />
                                                    Generate from title
                                                </button>
                                            </div>
                                            <Input
                                                id="slug"
                                                value={data.slug}
                                                onChange={(e) => {
                                                    setSlugManuallyEdited(true);
                                                    setData('slug', e.target.value);
                                                }}
                                                placeholder="auto-generated-from-title"
                                                className="h-10 font-mono text-xs focus-visible:ring-primary/20 focus-visible:border-primary bg-muted/20"
                                            />
                                            <InputError message={errors.slug} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="read_time" className="font-semibold text-sm">
                                                    Reading Time
                                                </Label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setData('read_time', calculateReadingTime(data.content));
                                                        setReadTimeManuallyEdited(false);
                                                    }}
                                                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                                                >
                                                    <Clock className="h-3 w-3" />
                                                    Auto-calculate
                                                </button>
                                            </div>
                                            <Input
                                                id="read_time"
                                                value={data.read_time}
                                                onChange={(e) => {
                                                    setReadTimeManuallyEdited(true);
                                                    setData('read_time', e.target.value);
                                                }}
                                                placeholder="e.g. 5 min read"
                                                className="h-10 focus-visible:ring-primary/20 focus-visible:border-primary"
                                            />
                                            <InputError message={errors.read_time} />
                                        </div>
                                    </div>

                                    {/* Excerpt */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="excerpt" className="font-semibold text-sm">
                                                Article Excerpt / Summary
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={autoGenerateExcerpt}
                                                className="text-[11px] text-primary hover:underline flex items-center gap-1"
                                            >
                                                <Wand2 className="h-3 w-3" />
                                                Auto-fill from content
                                            </button>
                                        </div>
                                        <textarea
                                            id="excerpt"
                                            className="w-full min-h-[85px] rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-muted-foreground/55"
                                            value={data.excerpt}
                                            onChange={(e) => setData('excerpt', e.target.value)}
                                            placeholder="Write a brief, engaging summary displayed on article cards (optional — auto-generated if left blank)..."
                                        />
                                        <div className="flex justify-between text-[11px] text-muted-foreground">
                                            <span>Shown on the blog listing page and social previews.</span>
                                            <span>{data.excerpt.length} / 300 chars</span>
                                        </div>
                                        <InputError message={errors.excerpt} />
                                    </div>

                                    {/* Content Body */}
                                    <div className="space-y-1.5">
                                        <Label className="font-semibold text-sm">Content Body</Label>
                                        <RichEditor
                                            value={data.content}
                                            onChange={handleContentChange}
                                            placeholder="Begin writing your article here... Use the toolbar to format headings, lists, links, or insert images."
                                            minHeight={380}
                                        />
                                        <InputError message={errors.content} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SEO Meta Section */}
                            <Card className="border-border/50 shadow-xs overflow-hidden">
                                <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                        <Globe className="h-4.5 w-4.5 text-primary" />
                                        Search Engine Optimization (SEO)
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Customize how this article appears on Google and social media shares.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-5">
                                    {/* Live Google Snippet Preview */}
                                    <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-1">
                                        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                            Search Engine Result Preview
                                        </div>
                                        <div className="text-xs text-emerald-700 dark:text-emerald-400 truncate">
                                            https://pandatowers.africa/blog/{data.slug || 'article-slug'}
                                        </div>
                                        <div className="text-base font-semibold text-blue-700 dark:text-blue-400 truncate">
                                            {data.meta_title || data.title || 'Article Title'} | Panda Towers
                                        </div>
                                        <div className="text-xs text-muted-foreground line-clamp-2">
                                            {data.meta_description || data.excerpt || 'Provide an excerpt or meta description to preview how search engines summarize this article.'}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="meta_title" className="font-semibold text-sm">
                                            Meta Title
                                        </Label>
                                        <Input
                                            id="meta_title"
                                            value={data.meta_title}
                                            onChange={(e) => setData('meta_title', e.target.value)}
                                            placeholder="SEO Title (defaults to main article title if left blank)"
                                            className="h-10 focus-visible:ring-primary/20 focus-visible:border-primary"
                                        />
                                        <InputError message={errors.meta_title} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="meta_description" className="font-semibold text-sm">
                                                Meta Description
                                            </Label>
                                            <span className="text-[11px] text-muted-foreground">
                                                {data.meta_description.length} / 160 recommended
                                            </span>
                                        </div>
                                        <textarea
                                            id="meta_description"
                                            className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-muted-foreground/55"
                                            value={data.meta_description}
                                            onChange={(e) => setData('meta_description', e.target.value)}
                                            placeholder="Brief article synopsis shown in search results (defaults to excerpt if left blank)"
                                        />
                                        <InputError message={errors.meta_description} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Controls */}
                        <div className="space-y-6">
                            {/* Publishing & Visibility */}
                            <Card className="border-border/50 shadow-xs overflow-hidden">
                                <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                        <Sparkles className="h-4.5 w-4.5 text-primary" />
                                        Publishing & Status
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Control when and where this article is displayed.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-5">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div
                                            className={`mt-0.5 relative w-10 h-6 rounded-full transition-colors shrink-0 ${
                                                data.is_published ? 'bg-primary' : 'bg-muted-foreground/30'
                                            }`}
                                        >
                                            <div
                                                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                                    data.is_published ? 'translate-x-5' : 'translate-x-1'
                                                }`}
                                            />
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={data.is_published}
                                            onChange={(e) => setData('is_published', e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                                Publish on website
                                            </div>
                                            <div className="text-xs text-muted-foreground leading-relaxed">
                                                {data.is_published
                                                    ? 'Article will appear on the live Panda Towers Blog page.'
                                                    : 'Saved privately as a draft until published.'}
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div
                                            className={`mt-0.5 relative w-10 h-6 rounded-full transition-colors shrink-0 ${
                                                data.is_featured ? 'bg-copper' : 'bg-muted-foreground/30'
                                            }`}
                                        >
                                            <div
                                                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                                    data.is_featured ? 'translate-x-5' : 'translate-x-1'
                                                }`}
                                            />
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-bold text-foreground group-hover:text-copper transition-colors">
                                                Featured article
                                            </div>
                                            <div className="text-xs text-muted-foreground leading-relaxed">
                                                Highlight as the top featured spotlight article on the blog page.
                                            </div>
                                        </div>
                                    </label>

                                    <div className="space-y-1.5 pt-2 border-t border-border/50">
                                        <Label htmlFor="published_at" className="font-semibold text-xs flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            Publication Date
                                        </Label>
                                        <Input
                                            id="published_at"
                                            type="date"
                                            value={data.published_at}
                                            onChange={(e) => setData('published_at', e.target.value)}
                                            className="h-9 text-xs"
                                        />
                                        <InputError message={errors.published_at} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Author & Category Card */}
                            <Card className="border-border/50 shadow-xs overflow-hidden">
                                <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                        <User className="h-4.5 w-4.5 text-primary" />
                                        Author & Category
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Assign the article author and topic category.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    {/* Author Selection */}
                                    <div className="space-y-1.5">
                                        <Label className="font-semibold text-sm">Author Account</Label>
                                        <Select value={data.author_id} onValueChange={handleAuthorSelect}>
                                            <SelectTrigger className="h-10 text-sm">
                                                <SelectValue placeholder="Select author" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {authors.map((a) => (
                                                    <SelectItem key={a.id} value={String(a.id)}>
                                                        {a.name}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="custom">Custom Author Name</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="author_name" className="font-semibold text-sm">
                                            Displayed Author Name
                                        </Label>
                                        <Input
                                            id="author_name"
                                            value={data.author_name}
                                            onChange={(e) => setData('author_name', e.target.value)}
                                            placeholder="e.g. Panda Towers Research"
                                            className="h-10 text-sm"
                                        />
                                        <p className="text-[11px] text-muted-foreground">
                                            Shown on the article byline and "About the Author" card.
                                        </p>
                                        <InputError message={errors.author_name} />
                                    </div>

                                    {/* Category Selection */}
                                    <div className="space-y-1.5 pt-2 border-t border-border/50">
                                        <div className="flex items-center justify-between">
                                            <Label className="font-semibold text-sm">Article Category</Label>
                                            <button
                                                type="button"
                                                onClick={() => setNewCatOpen(true)}
                                                className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                                New Category
                                            </button>
                                        </div>
                                        <Select value={data.blog_category_id} onValueChange={(v) => setData('blog_category_id', v)}>
                                            <SelectTrigger className="h-10 text-sm">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Uncategorized</SelectItem>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.blog_category_id} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Featured Image Card */}
                            <Card className="border-border/50 shadow-xs overflow-hidden">
                                <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                                    <CardTitle className="text-base font-bold text-foreground">Featured Cover Image</CardTitle>
                                    <CardDescription className="text-xs">
                                        Upload a high-resolution cover photo or select from the media library.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-5">
                                    <MediaPicker
                                        value={data.featured_image}
                                        onChange={(url) => setData('featured_image', url)}
                                        accept="image"
                                        collection="blog"
                                        placeholder="/storage/media/blog/cover.jpg"
                                    />
                                    <InputError message={errors.featured_image} />
                                </CardContent>
                            </Card>

                            {/* Submission & Delete Controls */}
                            <div className="flex flex-col gap-2.5 pt-1">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-11 font-semibold text-sm shadow-green hover:scale-[1.01] transition-transform"
                                >
                                    {processing
                                        ? 'Saving Article...'
                                        : post
                                          ? 'Save & Update Article'
                                          : data.is_published
                                            ? 'Publish Article'
                                            : 'Save Draft Article'}
                                </Button>

                                <Button variant="outline" asChild className="w-full h-10 text-sm">
                                    <Link href="/cms/blog">Cancel & Return to List</Link>
                                </Button>

                                {post?.id && canDelete && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full h-10 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive mt-2"
                                        onClick={() => setDeleteConfirmOpen(true)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1.5" />
                                        Delete This Article
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Quick Add Category Dialog */}
            <Dialog open={newCatOpen} onOpenChange={setNewCatOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Blog Category</DialogTitle>
                        <DialogDescription>
                            Add a new category and assign it to this article immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateQuickCategory} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label>Category Name *</Label>
                            <Input
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                placeholder="e.g. Market Insights"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Badge Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={newCatColor}
                                    onChange={(e) => setNewCatColor(e.target.value)}
                                    className="h-10 w-14 p-1 cursor-pointer"
                                />
                                <Input
                                    value={newCatColor}
                                    onChange={(e) => setNewCatColor(e.target.value)}
                                    className="flex-1 font-mono text-xs"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setNewCatOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={creatingCat}>
                                {creatingCat ? 'Creating...' : 'Create Category'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Live Website Article Preview Dialog */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                    <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 bg-background/95 backdrop-blur border-b border-border">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                Website Preview
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                Previewing how this article looks on pandatowers.africa
                            </span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setPreviewOpen(false)}>
                            Close Preview
                        </Button>
                    </div>

                    {/* Panda Towers Website Styled Article Preview */}
                    <div className="bg-white text-[#1A1A1A] min-h-[500px]">
                        <div className="py-10 px-6 sm:px-10 bg-[#F4FAF0] border-b border-[#C0DD97]/60">
                            <div className="max-w-3xl mx-auto space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-[#0D4D2A] text-white">
                                        {selectedCategoryName}
                                    </span>
                                    {!data.is_published && (
                                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-amber-500 text-white">
                                            Draft Preview
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-2xl sm:text-4xl font-bold leading-tight text-[#1A1A1A]">
                                    {data.title || 'Untitled Article'}
                                </h1>

                                <div className="flex flex-wrap items-center gap-5 text-xs text-[#5F5E5A]">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-[#1A9E55]" />
                                        {data.published_at
                                            ? new Date(data.published_at).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                              })
                                            : 'Today'}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-[#1A9E55]" />
                                        {data.read_time || '3 min read'}
                                    </span>
                                    <span className="flex items-center gap-2 font-semibold text-[#0D4D2A]">
                                        <span className="w-6 h-6 rounded-full bg-[#1A9E55] text-white flex items-center justify-center text-[10px] font-bold">
                                            {(data.author_name || 'PT')
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </span>
                                        {data.author_name || 'Panda Towers Team'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 space-y-8">
                            {data.featured_image && (
                                <img
                                    src={data.featured_image}
                                    alt={data.title}
                                    className="w-full max-h-96 object-cover rounded-2xl shadow-md border border-gray-100"
                                />
                            )}

                            {data.excerpt && (
                                <p className="text-base font-medium text-[#5F5E5A] border-l-4 border-[#1A9E55] pl-4 italic leading-relaxed">
                                    {data.excerpt}
                                </p>
                            )}

                            {data.content ? (
                                <div
                                    className="prose max-w-none text-sm sm:text-base leading-relaxed text-[#1A1A1A] space-y-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#1A9E55] [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-[#1A9E55] [&_a]:underline [&_img]:rounded-xl"
                                    dangerouslySetInnerHTML={{ __html: data.content }}
                                />
                            ) : (
                                <p className="text-sm text-gray-400 italic">No article content written yet.</p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation on Edit Page */}
            {post?.id && (
                <ConfirmDialog
                    open={deleteConfirmOpen}
                    onOpenChange={setDeleteConfirmOpen}
                    title="Delete this article?"
                    description={`Are you sure you want to permanently delete "${post.title}"? This action cannot be undone.`}
                    confirmText="Delete Permanently"
                    variant="destructive"
                    isLoading={isDeleting}
                    onConfirm={() => {
                        setIsDeleting(true);
                        router.delete(`/cms/blog/${post.id}`, {
                            onFinish: () => setIsDeleting(false),
                        });
                    }}
                />
            )}
        </>
    );
}
