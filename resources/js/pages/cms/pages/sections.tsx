import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Layers,
    Pencil,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { MediaPicker } from '@/components/media-picker';
import { RichEditor } from '@/components/rich-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SectionType {
    value: string;
    label: string;
    description: string;
}

interface Section {
    id: number;
    name: string;
    section_type: string;
    content: Record<string, unknown>;
    order: number;
    is_active: boolean;
    background_color?: string;
    background_image?: string;
    css_class?: string;
}

interface Page {
    id: number;
    title: string;
    slug: string;
    sections: Section[];
}

// ── per-type content form ──────────────────────────────────────────────────

function ContentForm({
    sectionType,
    content,
    setContent,
}: {
    sectionType: string;
    content: Record<string, unknown>;
    setContent: (key: string, value: unknown) => void;
}) {
    const str = (k: string, def = '') => (content[k] as string) ?? def;

    const field = (
        key: string,
        label: string,
        opts?: { placeholder?: string; multiline?: boolean; rich?: boolean },
    ) => (
        <div className="space-y-1.5" key={key}>
            <Label>{label}</Label>
            {opts?.rich ? (
                <RichEditor
                    value={str(key)}
                    onChange={(v) => setContent(key, v)}
                    placeholder={opts.placeholder}
                    minHeight={120}
                />
            ) : opts?.multiline ? (
                <textarea
                    className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                    value={str(key)}
                    onChange={(e) => setContent(key, e.target.value)}
                    placeholder={opts.placeholder}
                />
            ) : (
                <Input
                    value={str(key)}
                    onChange={(e) => setContent(key, e.target.value)}
                    placeholder={opts?.placeholder}
                />
            )}
        </div>
    );

    const heading2 = () => (
        <div className="grid grid-cols-2 gap-4">
            {field('heading', 'Heading', { placeholder: 'Section heading' })}
            {field('subheading', 'Subheading', {
                placeholder: 'Optional subheading',
            })}
        </div>
    );

    if (sectionType === 'hero') {
        return (
            <div className="space-y-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Content
                </p>
                {field('badge_text', 'Badge / Label', {
                    placeholder: 'e.g. Early Access Preview',
                })}
                {field('heading', 'Main Heading *', {
                    placeholder: 'Plant The Seed to',
                })}
                {field('heading_highlight', 'Highlighted Heading', {
                    placeholder: 'Your Legacy',
                })}
                {field('subheading', 'Subheading / Description', {
                    placeholder: 'Describe the hero section...',
                    multiline: true,
                })}

                <p className="pt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Primary CTA
                </p>
                <div className="grid grid-cols-3 gap-3">
                    {field('cta_text', 'Button Text', {
                        placeholder: 'See Our Brochure',
                    })}
                    {field('cta_url', 'Button URL', {
                        placeholder: 'https://...',
                    })}
                    <div className="space-y-1.5">
                        <Label>Open in</Label>
                        <Select
                            value={str('cta_target', '_blank')}
                            onValueChange={(v) => setContent('cta_target', v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_blank">New tab</SelectItem>
                                <SelectItem value="_self">Same tab</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <p className="pt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Secondary CTA (optional)
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {field('secondary_cta_text', 'Secondary Button Text', {
                        placeholder: 'Learn More',
                    })}
                    {field('secondary_cta_url', 'Secondary Button URL', {
                        placeholder: 'https://...',
                    })}
                </div>

                <p className="pt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Background
                </p>
                <div className="space-y-1.5">
                    <Label>Background Type</Label>
                    <Select
                        value={str('background_type', 'video')}
                        onValueChange={(v) => setContent('background_type', v)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="color">Color only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <MediaPicker
                    label="Background Video / Image"
                    value={str('background_src')}
                    onChange={(u) => setContent('background_src', u)}
                    accept="any"
                    placeholder="/video.mp4 or /image.jpg"
                />
                <MediaPicker
                    label="Poster / Fallback Image"
                    value={str('background_poster')}
                    onChange={(u) => setContent('background_poster', u)}
                    accept="image"
                    placeholder="/static-image.jpg"
                />
                {field('overlay_color', 'Overlay Color', {
                    placeholder: 'rgba(0,0,0,0.5)',
                })}
            </div>
        );
    }

    if (sectionType === 'text') {
        return (
            <div className="space-y-4">
                {heading2()}
                {field('content', 'Content', {
                    rich: true,
                    placeholder: 'Write your content here...',
                })}
            </div>
        );
    }

    if (sectionType === 'image_text') {
        return (
            <div className="space-y-4">
                {heading2()}
                {field('content', 'Body Text', {
                    rich: true,
                    placeholder: 'Write description...',
                })}
                <MediaPicker
                    label="Image"
                    value={str('image')}
                    onChange={(u) => setContent('image', u)}
                    accept="image"
                />
                <div className="space-y-1.5">
                    <Label>Image Position</Label>
                    <Select
                        value={str('image_position', 'right')}
                        onValueChange={(v) => setContent('image_position', v)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {field('cta_text', 'CTA Button Text', {
                        placeholder: 'Learn More',
                    })}
                    {field('cta_url', 'CTA Button URL', {
                        placeholder: 'https://...',
                    })}
                </div>
            </div>
        );
    }

    if (sectionType === 'cta') {
        return (
            <div className="space-y-4">
                {field('heading', 'Heading *', {
                    placeholder: 'Ready to get started?',
                })}
                {field('subheading', 'Subheading', {
                    placeholder: 'Join our growing community...',
                    multiline: true,
                })}
                <div className="grid grid-cols-2 gap-3">
                    {field('cta_text', 'Primary Button', {
                        placeholder: 'Get Started',
                    })}
                    {field('cta_url', 'Primary URL', {
                        placeholder: 'https://...',
                    })}
                    {field('secondary_cta_text', 'Secondary Button', {
                        placeholder: 'Learn More',
                    })}
                    {field('secondary_cta_url', 'Secondary URL', {
                        placeholder: 'https://...',
                    })}
                </div>
            </div>
        );
    }

    if (sectionType === 'video') {
        return (
            <div className="space-y-4">
                {heading2()}
                <MediaPicker
                    label="Video File"
                    value={str('video_url')}
                    onChange={(u) => setContent('video_url', u)}
                    accept="video"
                    placeholder="/video.mp4"
                />
                <MediaPicker
                    label="Poster Image (shown before play)"
                    value={str('video_poster')}
                    onChange={(u) => setContent('video_poster', u)}
                    accept="image"
                />
                {field('caption', 'Caption', {
                    placeholder: 'Optional video caption',
                })}
            </div>
        );
    }

    if (sectionType === 'map') {
        return (
            <div className="space-y-4">
                {heading2()}
                {field('address', 'Address', {
                    placeholder: 'Kinoo, Waiyaki Way, Nairobi',
                })}
                {field('embed_url', 'Google Maps Embed URL', {
                    placeholder: 'https://maps.google.com/maps?...',
                })}
                <div className="grid grid-cols-2 gap-3">
                    {field('lat', 'Latitude', { placeholder: '-1.2921' })}
                    {field('lng', 'Longitude', { placeholder: '36.8219' })}
                </div>
            </div>
        );
    }

    if (sectionType === 'form') {
        return (
            <div className="space-y-4">
                {heading2()}
                <div className="space-y-1.5">
                    <Label>Form Type</Label>
                    <Select
                        value={str('form_type', 'contact')}
                        onValueChange={(v) => setContent('form_type', v)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="contact">
                                Contact Form
                            </SelectItem>
                            <SelectItem value="newsletter">
                                Newsletter Signup
                            </SelectItem>
                            <SelectItem value="booking">
                                Booking / Inquiry
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {field('success_message', 'Success Message', {
                    placeholder: "Thank you! We'll be in touch.",
                })}
            </div>
        );
    }

    if (sectionType === 'cards') {
        return (
            <div className="space-y-4">
                {heading2()}
                <CardsEditor content={content} setContent={setContent} />
            </div>
        );
    }

    if (sectionType === 'gallery') {
        return (
            <div className="space-y-4">
                {heading2()}
                <div className="space-y-1.5">
                    <Label>Columns</Label>
                    <Select
                        value={String(content['columns'] ?? '3')}
                        onValueChange={(v) => setContent('columns', Number(v))}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2">2 columns</SelectItem>
                            <SelectItem value="3">3 columns</SelectItem>
                            <SelectItem value="4">4 columns</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <GalleryEditor content={content} setContent={setContent} />
            </div>
        );
    }

    // testimonials, stats, faq — data driven from their own sections
    if (['testimonials', 'stats', 'faq'].includes(sectionType)) {
        return (
            <div className="space-y-4">
                {heading2()}
                {field('subtext', 'Intro Paragraph', {
                    placeholder: 'Optional paragraph below the heading...',
                    multiline: true,
                })}
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                    The items for this section are managed in their dedicated
                    area of the CMS (Testimonials / Settings / FAQ).
                </div>
            </div>
        );
    }

    if (sectionType === 'custom') {
        return (
            <div className="space-y-4">
                {heading2()}
                <div className="space-y-1.5">
                    <Label>Custom HTML / Embed</Label>
                    <textarea
                        className="min-h-[160px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                        value={str('html')}
                        onChange={(e) => setContent('html', e.target.value)}
                        placeholder={'<div>Your custom HTML here...</div>'}
                    />
                </div>
            </div>
        );
    }

    // fallback — show generic fields + JSON
    return (
        <div className="space-y-4">
            {heading2()}
            <div className="space-y-1.5">
                <Label>Additional Data (JSON)</Label>
                <textarea
                    className="min-h-[140px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                    value={JSON.stringify(content, null, 2)}
                    onChange={() => {
                        try {
                            /* parent handles */
                        } catch {
                            /* noop */
                        }
                    }}
                    readOnly
                />
            </div>
        </div>
    );
}

// ── cards sub-editor ────────────────────────────────────────────────────────

interface CardItem {
    icon?: string;
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

function CardsEditor({
    content,
    setContent,
}: {
    content: Record<string, unknown>;
    setContent: (k: string, v: unknown) => void;
}) {
    const items: CardItem[] = (content['items'] as CardItem[]) ?? [];

    const update = (idx: number, field: keyof CardItem, value: string) => {
        const next = items.map((it, i) =>
            i === idx ? { ...it, [field]: value } : it,
        );
        setContent('items', next);
    };

    const add = () =>
        setContent('items', [...items, { title: '', description: '' }]);
    const remove = (idx: number) =>
        setContent(
            'items',
            items.filter((_, i) => i !== idx),
        );

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>Cards ({items.length})</Label>
                <Button type="button" variant="outline" size="sm" onClick={add}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add Card
                </Button>
            </div>
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="space-y-3 rounded-lg border border-border p-4"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            Card {idx + 1}
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(idx)}
                        >
                            <X className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs">Title</Label>
                            <Input
                                value={item.title ?? ''}
                                onChange={(e) =>
                                    update(idx, 'title', e.target.value)
                                }
                                placeholder="Card title"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Icon</Label>
                            <Input
                                value={item.icon ?? ''}
                                onChange={(e) =>
                                    update(idx, 'icon', e.target.value)
                                }
                                placeholder="Building2"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <textarea
                            className="min-h-[60px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            value={item.description ?? ''}
                            onChange={(e) =>
                                update(idx, 'description', e.target.value)
                            }
                            placeholder="Card description"
                        />
                    </div>
                    <MediaPicker
                        label="Card Image (optional)"
                        value={item.image ?? ''}
                        onChange={(u) => update(idx, 'image', u)}
                        accept="image"
                    />
                    <div className="space-y-1">
                        <Label className="text-xs">Link URL (optional)</Label>
                        <Input
                            value={item.url ?? ''}
                            onChange={(e) => update(idx, 'url', e.target.value)}
                            placeholder="https://..."
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── gallery sub-editor ──────────────────────────────────────────────────────

function GalleryEditor({
    content,
    setContent,
}: {
    content: Record<string, unknown>;
    setContent: (k: string, v: unknown) => void;
}) {
    const images: string[] = (content['images'] as string[]) ?? [];

    const update = (idx: number, url: string) => {
        const next = images.map((u, i) => (i === idx ? url : u));
        setContent('images', next);
    };
    const add = () => setContent('images', [...images, '']);
    const remove = (idx: number) =>
        setContent(
            'images',
            images.filter((_, i) => i !== idx),
        );

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>Images ({images.length})</Label>
                <Button type="button" variant="outline" size="sm" onClick={add}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add Image
                </Button>
            </div>
            {images.map((url, idx) => (
                <div key={idx} className="flex items-start gap-2">
                    <div className="flex-1">
                        <MediaPicker
                            label={`Image ${idx + 1}`}
                            value={url}
                            onChange={(u) => update(idx, u)}
                            accept="image"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-6"
                        onClick={() => remove(idx)}
                    >
                        <X className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                </div>
            ))}
        </div>
    );
}

// ── main page ───────────────────────────────────────────────────────────────

export default function PageSections({
    page,
    sectionTypes,
}: {
    page: Page;
    sectionTypes: SectionType[];
}) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);

    const addForm = useForm({
        name: '',
        section_type: 'hero',
        content: {} as Record<string, unknown>,
        order: page.sections.length + 1,
        is_active: true,
        background_color: '',
        background_image: '',
        css_class: '',
    });
    const editForm = useForm({
        name: '',
        section_type: 'hero',
        content: {} as Record<string, unknown>,
        order: 0,
        is_active: true,
        background_color: '',
        background_image: '',
        css_class: '',
    });

    const openEdit = (section: Section) => {
        setEditingSection(section);
        editForm.setData({
            name: section.name,
            section_type: section.section_type,
            content: section.content ?? {},
            order: section.order,
            is_active: section.is_active,
            background_color: section.background_color ?? '',
            background_image: section.background_image ?? '',
            css_class: section.css_class ?? '',
        });
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(`/cms/pages/${page.id}/sections`, {
            onSuccess: () => {
                setShowAddForm(false);
                addForm.reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingSection) {
            return;
        }

        editForm.put(`/cms/pages/${page.id}/sections/${editingSection.id}`, {
            onSuccess: () => setEditingSection(null),
        });
    };

    const deleteSection = (section: Section) => {
        if (!confirm(`Delete section "${section.name}"?`)) {
            return;
        }

        router.delete(`/cms/pages/${page.id}/sections/${section.id}`);
    };

    const moveSection = (section: Section, dir: 'up' | 'down') => {
        const sorted = [...page.sections].sort((a, b) => a.order - b.order);
        const idx = sorted.findIndex((s) => s.id === section.id);
        const swapIdx = dir === 'up' ? idx - 1 : idx + 1;

        if (swapIdx < 0 || swapIdx >= sorted.length) {
            return;
        }

        const items = sorted.map((s, i) => {
            if (i === idx) {
                return { id: s.id, order: sorted[swapIdx].order };
            }

            if (i === swapIdx) {
                return { id: s.id, order: sorted[idx].order };
            }

            return { id: s.id, order: s.order };
        });
        router.post(`/cms/pages/${page.id}/sections/reorder`, {
            sections: items,
        });
    };

    const renderSectionForm = ({
        form,
        onSubmit,
        submitLabel,
    }: {
        form: typeof addForm;
        onSubmit: (e: React.FormEvent) => void;
        submitLabel: string;
    }) => {
        const setContent = (key: string, value: unknown) => {
            form.setData('content', { ...form.data.content, [key]: value });
        };

        return (
            <form onSubmit={onSubmit} className="space-y-6">
                {/* Basic info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Section Name *</Label>
                        <Input
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            placeholder="Hero Banner"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Section Type *</Label>
                        <Select
                            value={form.data.section_type}
                            onValueChange={(v) => {
                                form.setData('section_type', v);
                                form.setData('content', {});
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sectionTypes.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {sectionTypes.find(
                    (t) => t.value === form.data.section_type,
                ) && (
                    <div className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-3 text-sm">
                        <span className="font-medium text-primary">
                            {
                                sectionTypes.find(
                                    (t) => t.value === form.data.section_type,
                                )?.label
                            }
                            :
                        </span>{' '}
                        <span className="text-muted-foreground">
                            {
                                sectionTypes.find(
                                    (t) => t.value === form.data.section_type,
                                )?.description
                            }
                        </span>
                    </div>
                )}

                {/* Dynamic content fields */}
                <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-5">
                    <ContentForm
                        sectionType={form.data.section_type}
                        content={form.data.content}
                        setContent={setContent}
                    />
                </div>

                {/* Layout overrides */}
                <div className="space-y-4 rounded-xl border border-border p-5">
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Layout / Styling (optional)
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Background Color</Label>
                            <Input
                                value={form.data.background_color}
                                onChange={(e) =>
                                    form.setData(
                                        'background_color',
                                        e.target.value,
                                    )
                                }
                                placeholder="#ffffff"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>CSS Class</Label>
                            <Input
                                value={form.data.css_class}
                                onChange={(e) =>
                                    form.setData('css_class', e.target.value)
                                }
                                placeholder="custom-class"
                            />
                        </div>
                    </div>
                    <MediaPicker
                        label="Section Background Image"
                        value={form.data.background_image}
                        onChange={(url) =>
                            form.setData('background_image', url)
                        }
                        accept="image"
                        placeholder="/images/section-bg.jpg"
                    />
                </div>

                <label className="flex cursor-pointer items-center gap-3">
                    <div
                        className={`relative h-6 w-10 rounded-full transition-colors ${form.data.is_active ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    >
                        <div
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.data.is_active ? 'translate-x-5' : 'translate-x-1'}`}
                        />
                    </div>
                    <input
                        type="checkbox"
                        checked={form.data.is_active}
                        onChange={(e) =>
                            form.setData('is_active', e.target.checked)
                        }
                        className="sr-only"
                    />
                    <div>
                        <div className="text-sm font-medium">Active</div>
                        <div className="text-xs text-muted-foreground">
                            Visible on website
                        </div>
                    </div>
                </label>

                <Button type="submit" disabled={form.processing}>
                    {form.processing ? 'Saving...' : submitLabel}
                </Button>
            </form>
        );
    };

    const sorted = [...page.sections].sort((a, b) => a.order - b.order);

    return (
        <>
            <Head title={`${page.title} — Sections`} />
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/cms/pages">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {page.title}
                            </h1>
                            <p className="mt-0.5 font-mono text-sm text-muted-foreground">
                                /{page.slug} · {page.sections.length} section
                                {page.sections.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => setShowAddForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Section
                    </Button>
                </div>

                {showAddForm && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">
                                Add New Section
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAddForm(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {renderSectionForm({
                                form: addForm,
                                onSubmit: submitAdd,
                                submitLabel: 'Add Section',
                            })}
                        </CardContent>
                    </Card>
                )}

                {sorted.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border py-20 text-center">
                        <Layers className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            No sections yet.
                        </p>
                        <Button
                            className="mt-4"
                            variant="outline"
                            onClick={() => setShowAddForm(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add your first section
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sorted.map((section, idx) => (
                            <div
                                key={section.id}
                                className={`flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-sm ${!section.is_active ? 'opacity-50' : ''}`}
                            >
                                <div className="flex flex-col gap-0.5">
                                    <button
                                        className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                                        onClick={() =>
                                            moveSection(section, 'up')
                                        }
                                        disabled={idx === 0}
                                    >
                                        <ChevronUp className="h-3 w-3" />
                                    </button>
                                    <button
                                        className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                                        onClick={() =>
                                            moveSection(section, 'down')
                                        }
                                        disabled={idx === sorted.length - 1}
                                    >
                                        <ChevronDown className="h-3 w-3" />
                                    </button>
                                </div>

                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <span className="text-xs font-bold text-primary">
                                        {idx + 1}
                                    </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-medium">
                                            {section.name}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {section.section_type}
                                        </Badge>
                                        {!section.is_active && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                Hidden
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                                        {(
                                            section.content as {
                                                heading?: string;
                                            }
                                        )?.heading ??
                                            (
                                                section.content as {
                                                    badge_text?: string;
                                                }
                                            )?.badge_text ??
                                            (
                                                section.content as {
                                                    html?: string;
                                                }
                                            )?.html?.slice(0, 60) ??
                                            'No content yet — click Edit to fill in the details'}
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEdit(section)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                        <span className="ml-1.5 text-xs">
                                            Edit
                                        </span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteSection(section)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog
                open={!!editingSection}
                onOpenChange={(open) => !open && setEditingSection(null)}
            >
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Edit Section: {editingSection?.name}
                        </DialogTitle>
                    </DialogHeader>
                    {renderSectionForm({
                        form: editForm,
                        onSubmit: submitEdit,
                        submitLabel: 'Save Changes',
                    })}
                </DialogContent>
            </Dialog>
        </>
    );
}
