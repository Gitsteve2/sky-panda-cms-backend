import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, ChevronDown, ChevronUp, GripVertical, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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

export default function PageSections({ page, sectionTypes }: { page: Page; sectionTypes: SectionType[] }) {
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
            onSuccess: () => { setShowAddForm(false); addForm.reset(); },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSection) return;
        editForm.put(`/cms/pages/${page.id}/sections/${editingSection.id}`, {
            onSuccess: () => setEditingSection(null),
        });
    };

    const deleteSection = (section: Section) => {
        if (!confirm(`Delete section "${section.name}"?`)) return;
        router.delete(`/cms/pages/${page.id}/sections/${section.id}`);
    };

    const moveSection = (section: Section, dir: 'up' | 'down') => {
        const sorted = [...page.sections].sort((a, b) => a.order - b.order);
        const idx = sorted.findIndex((s) => s.id === section.id);
        const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= sorted.length) return;
        const items = sorted.map((s, i) => {
            if (i === idx) return { id: s.id, order: sorted[swapIdx].order };
            if (i === swapIdx) return { id: s.id, order: sorted[idx].order };
            return { id: s.id, order: s.order };
        });
        router.post(`/cms/pages/${page.id}/sections/reorder`, { sections: items });
    };

    const SectionForm = ({
        form,
        onSubmit,
        submitLabel,
    }: {
        form: typeof addForm;
        onSubmit: (e: React.FormEvent) => void;
        submitLabel: string;
    }) => (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Section Name *</Label>
                    <Input
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="e.g. Hero Banner"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <Label>Section Type *</Label>
                    <Select value={form.data.section_type} onValueChange={(v) => form.setData('section_type', v)}>
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

            {/* Dynamic JSON content editor */}
            <div className="space-y-1">
                <Label>Content (JSON)</Label>
                <textarea
                    className="w-full min-h-[160px] rounded-md border border-input bg-background px-3 py-2 text-xs font-mono"
                    value={JSON.stringify(form.data.content, null, 2)}
                    onChange={(e) => {
                        try {
                            form.setData('content', JSON.parse(e.target.value));
                        } catch {
                            // keep invalid JSON in textarea while typing
                        }
                    }}
                    placeholder='{"heading": "My Section", "subheading": "Description..."}'
                />
                <p className="text-xs text-muted-foreground">
                    Type:{' '}
                    <strong>{sectionTypes.find((t) => t.value === form.data.section_type)?.label}</strong> —{' '}
                    {sectionTypes.find((t) => t.value === form.data.section_type)?.description}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                    <Label>Background Color</Label>
                    <Input
                        value={form.data.background_color}
                        onChange={(e) => form.setData('background_color', e.target.value)}
                        placeholder="#ffffff"
                    />
                </div>
                <div className="space-y-1">
                    <Label>Background Image</Label>
                    <Input
                        value={form.data.background_image}
                        onChange={(e) => form.setData('background_image', e.target.value)}
                        placeholder="/image.jpg"
                    />
                </div>
                <div className="space-y-1">
                    <Label>CSS Class</Label>
                    <Input
                        value={form.data.css_class}
                        onChange={(e) => form.setData('css_class', e.target.value)}
                        placeholder="custom-class"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_active"
                    checked={form.data.is_active}
                    onChange={(e) => form.setData('is_active', e.target.checked)}
                />
                <Label htmlFor="is_active">Active</Label>
            </div>

            <Button type="submit" disabled={form.processing}>
                {form.processing ? 'Saving...' : submitLabel}
            </Button>
        </form>
    );

    const sorted = [...page.sections].sort((a, b) => a.order - b.order);

    return (
        <>
            <Head title={`${page.title} — Sections`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/cms/pages"><ArrowLeft className="h-4 w-4" /></Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">{page.title} — Sections</h1>
                            <p className="text-sm text-muted-foreground">/{page.slug}</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowAddForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Section
                    </Button>
                </div>

                {showAddForm && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Add New Section</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <SectionForm form={addForm} onSubmit={submitAdd} submitLabel="Add Section" />
                        </CardContent>
                    </Card>
                )}

                {sorted.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No sections yet. Click "Add Section" to get started.
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-3">
                    {sorted.map((section, idx) => (
                        <Card key={section.id} className={!section.is_active ? 'opacity-50' : ''}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="h-5 w-5 text-muted-foreground shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{section.name}</span>
                                            <Badge variant="outline" className="text-xs">{section.section_type}</Badge>
                                            {!section.is_active && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                                            {JSON.stringify(section.content).slice(0, 80)}…
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button variant="ghost" size="sm" onClick={() => moveSection(section, 'up')} disabled={idx === 0}>
                                            <ChevronUp className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => moveSection(section, 'down')} disabled={idx === sorted.length - 1}>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => openEdit(section)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => deleteSection(section)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingSection} onOpenChange={(open) => !open && setEditingSection(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Section: {editingSection?.name}</DialogTitle>
                    </DialogHeader>
                    <SectionForm form={editForm} onSubmit={submitEdit} submitLabel="Save Changes" />
                </DialogContent>
            </Dialog>
        </>
    );
}
