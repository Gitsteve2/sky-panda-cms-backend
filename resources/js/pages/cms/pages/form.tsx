import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, FileText } from 'lucide-react';
import InputError from '@/components/input-error';
import { MediaPicker } from '@/components/media-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Page {
    id?: number;
    title?: string;
    slug?: string;
    description?: string;
    meta_title?: string;
    meta_description?: string;
    og_image?: string;
    is_published?: boolean;
}

export default function PageForm({ page }: { page: Page | null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: page?.title ?? '',
        slug: page?.slug ?? '',
        description: page?.description ?? '',
        meta_title: page?.meta_title ?? '',
        meta_description: page?.meta_description ?? '',
        og_image: page?.og_image ?? '',
        is_published: page?.is_published ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (page?.id) {
            put(`/cms/pages/${page.id}`);
        } else {
            post('/cms/pages');
        }
    };

    const autoSlug = (title: string) => {
        if (!page?.id) {
            setData(
                'slug',
                title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, ''),
            );
        }

        setData('title', title);
    };

    return (
        <>
            <Head title={page ? `Edit ${page.title}` : 'New Page'} />
            <div className="max-w-2xl space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/cms/pages">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {page ? 'Edit Page' : 'New Page'}
                            </h1>
                            {page?.title && (
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    {page.title}
                                </p>
                            )}
                        </div>
                    </div>
                    {data.is_published ? (
                        <Badge
                            className="border-green-200 bg-green-100 text-green-700"
                            variant="outline"
                        >
                            <Eye className="mr-1 h-3 w-3" />
                            Published
                        </Badge>
                    ) : (
                        <Badge
                            className="border-amber-200 bg-amber-100 text-amber-700"
                            variant="outline"
                        >
                            <EyeOff className="mr-1 h-3 w-3" />
                            Draft
                        </Badge>
                    )}
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-border bg-muted/30 pb-4">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <FileText className="h-4 w-4 text-primary" />
                                Page Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="title">Page Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => autoSlug(e.target.value)}
                                    required
                                    placeholder="Home"
                                    className="text-base"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="slug">Slug (URL path)</Label>
                                <div className="flex">
                                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                                        /
                                    </span>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData('slug', e.target.value)
                                        }
                                        placeholder="auto-generated-from-title"
                                        className="rounded-l-none font-mono text-sm"
                                    />
                                </div>
                                <InputError message={errors.slug} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">
                                    Internal Description
                                </Label>
                                <textarea
                                    id="description"
                                    className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Internal notes about this page"
                                />
                            </div>

                            <label className="flex cursor-pointer items-center gap-3">
                                <div
                                    className={`relative h-6 w-10 rounded-full transition-colors ${data.is_published ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                >
                                    <div
                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${data.is_published ? 'translate-x-5' : 'translate-x-1'}`}
                                    />
                                </div>
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    checked={data.is_published}
                                    onChange={(e) =>
                                        setData(
                                            'is_published',
                                            e.target.checked,
                                        )
                                    }
                                    className="sr-only"
                                />
                                <div>
                                    <div className="text-sm font-medium">
                                        Published
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Visible on website
                                    </div>
                                </div>
                            </label>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-border bg-muted/30 pb-4">
                            <CardTitle className="text-base">
                                SEO Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="meta_title">Meta Title</Label>
                                <Input
                                    id="meta_title"
                                    value={data.meta_title}
                                    onChange={(e) =>
                                        setData('meta_title', e.target.value)
                                    }
                                    placeholder="SEO title (defaults to page title)"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="meta_description">
                                    Meta Description
                                </Label>
                                <textarea
                                    id="meta_description"
                                    className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={data.meta_description}
                                    onChange={(e) =>
                                        setData(
                                            'meta_description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="120–160 characters for search results"
                                />
                            </div>
                            <MediaPicker
                                label="OG Image"
                                value={data.og_image}
                                onChange={(url) => setData('og_image', url)}
                                accept="image"
                                placeholder="/images/og-cover.jpg"
                            />
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Saving...'
                                : page
                                  ? 'Update Page'
                                  : 'Create Page'}
                        </Button>
                        <Button variant="outline" type="button" asChild>
                            <Link href="/cms/pages">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
