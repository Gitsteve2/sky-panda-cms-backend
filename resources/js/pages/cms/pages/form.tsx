import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';

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
            setData('slug', title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
        }
        setData('title', title);
    };

    return (
        <>
            <Head title={page ? `Edit ${page.title}` : 'New Page'} />
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/cms/pages"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <h1 className="text-2xl font-bold">{page ? `Edit: ${page.title}` : 'New Page'}</h1>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle>Page Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="title">Page Title *</Label>
                                <Input id="title" value={data.title} onChange={(e) => autoSlug(e.target.value)} required />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="auto-generated-from-title" />
                                <InputError message={errors.slug} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Internal description for this page"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    checked={data.is_published}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                    className="rounded"
                                />
                                <Label htmlFor="is_published">Published</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="meta_title">Meta Title</Label>
                                <Input id="meta_title" value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="meta_description">Meta Description</Label>
                                <textarea
                                    id="meta_description"
                                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="og_image">OG Image URL</Label>
                                <Input id="og_image" value={data.og_image} onChange={(e) => setData('og_image', e.target.value)} placeholder="/image.jpg" />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : page ? 'Update Page' : 'Create Page'}
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
