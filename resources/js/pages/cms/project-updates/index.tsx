import { Head, router, useForm } from '@inertiajs/react';
import { CalendarDays, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MediaPicker } from '@/components/media-picker';

interface ProjectUpdate {
    id: number;
    title: string;
    month: string;
    location: string;
    image?: string;
    status: string;
    highlight: string;
    description?: string;
    highlights: string[];
    is_current_phase: boolean;
    order: number;
    is_active: boolean;
}

const emptyForm = {
    title: '',
    month: '',
    location: 'Nairobi, Kenya',
    image: '',
    status: 'Planning',
    highlight: '',
    description: '',
    highlights: [] as string[],
    is_current_phase: false,
    order: 0,
    is_active: true,
};

const STATUS_OPTIONS = ['Planning', 'Pre-Construction', 'Ground Breaking', 'Under Construction', 'Completed'];

function UpdateForm({ form, onSubmit, label }: { form: ReturnType<typeof useForm<typeof emptyForm>>; onSubmit: (e: React.FormEvent) => void; label: string }) {
    const [highlightInput, setHighlightInput] = useState('');

    const addHighlight = () => {
        if (!highlightInput.trim()) return;
        form.setData('highlights', [...form.data.highlights, highlightInput.trim()]);
        setHighlightInput('');
    };

    const removeHighlight = (i: number) => {
        form.setData('highlights', form.data.highlights.filter((_, idx) => idx !== i));
    };

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                    <Label>Title *</Label>
                    <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} placeholder="Panda Towers 001 – Phase 1: Ground Breaking" required />
                </div>
                <div className="space-y-1.5">
                    <Label>Month *</Label>
                    <Input value={form.data.month} onChange={(e) => form.setData('month', e.target.value)} placeholder="November 2025" required />
                </div>
                <div className="space-y-1.5">
                    <Label>Status *</Label>
                    <select
                        className="w-full h-10 px-3 border border-input rounded-md text-sm bg-background"
                        value={form.data.status}
                        onChange={(e) => form.setData('status', e.target.value)}
                    >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <Label>Location</Label>
                    <Input value={form.data.location} onChange={(e) => form.setData('location', e.target.value)} placeholder="Nairobi, Kenya" />
                </div>
                <div className="space-y-1.5">
                    <Label>Order</Label>
                    <Input type="number" value={form.data.order} onChange={(e) => form.setData('order', Number(e.target.value))} />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label>Card Summary (highlight) *</Label>
                <textarea className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background resize-none" value={form.data.highlight} onChange={(e) => form.setData('highlight', e.target.value)} placeholder="Short summary shown on the card..." rows={2} required />
            </div>

            <div className="space-y-1.5">
                <Label>Full Description</Label>
                <textarea className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background resize-none" value={form.data.description ?? ''} onChange={(e) => form.setData('description', e.target.value)} placeholder="Detailed description for the detail page..." rows={4} />
            </div>

            <div className="space-y-1.5">
                <Label>Key Highlights</Label>
                <div className="flex gap-2">
                    <Input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }} placeholder="Add a highlight point..." />
                    <Button type="button" variant="outline" onClick={addHighlight}>Add</Button>
                </div>
                <div className="space-y-1 mt-2">
                    {form.data.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 bg-secondary px-3 py-2 rounded text-sm">
                            <span className="flex-1">{h}</span>
                            <button type="button" onClick={() => removeHighlight(i)} className="text-muted-foreground hover:text-destructive">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <MediaPicker label="Image" value={form.data.image ?? ''} onChange={(v) => form.setData('image', v)} />

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="current" checked={form.data.is_current_phase} onChange={(e) => form.setData('is_current_phase', e.target.checked)} className="w-4 h-4 accent-accent" />
                    <Label htmlFor="current">Current Phase</Label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="active" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} className="w-4 h-4 accent-accent" />
                    <Label htmlFor="active">Active</Label>
                </div>
            </div>

            <Button type="submit" className="bg-accent hover:bg-accent-hover text-white w-full" disabled={form.processing}>
                {form.processing ? 'Saving...' : label}
            </Button>
        </form>
    );
}

export default function ProjectUpdatesIndex({ updates }: { updates: ProjectUpdate[] }) {
    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState<ProjectUpdate | null>(null);

    const addForm = useForm<typeof emptyForm>({ ...emptyForm });
    const editForm = useForm<typeof emptyForm>({ ...emptyForm });

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/cms/project-updates', { onSuccess: () => { setShowAdd(false); addForm.reset(); } });
    };

    const openEdit = (u: ProjectUpdate) => {
        setEditing(u);
        editForm.setData({
            title: u.title, month: u.month, location: u.location, image: u.image ?? '',
            status: u.status, highlight: u.highlight, description: u.description ?? '',
            highlights: u.highlights ?? [], is_current_phase: u.is_current_phase,
            order: u.order, is_active: u.is_active,
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        editForm.put(`/cms/project-updates/${editing.id}`, { onSuccess: () => setEditing(null) });
    };

    const statusColor = (status: string) =>
        status === 'Ground Breaking' ? 'bg-orange-600'
        : status === 'Pre-Construction' ? 'bg-amber-600'
        : status === 'Completed' ? 'bg-green-600'
        : 'bg-secondary text-foreground';

    return (
        <>
            <Head title="Project Updates" />
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CalendarDays className="w-7 h-7 text-accent" />
                        <div>
                            <h1 className="text-2xl font-bold">Project Updates</h1>
                            <p className="text-sm text-muted-foreground">Manage construction timeline updates</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowAdd(true)} className="bg-accent hover:bg-accent-hover text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Update
                    </Button>
                </div>

                {showAdd && (
                    <Card className="border-accent/30">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Add Project Update</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowAdd(false)}><X className="w-4 h-4" /></Button>
                        </CardHeader>
                        <CardContent><UpdateForm form={addForm} onSubmit={submitAdd} label="Add Update" /></CardContent>
                    </Card>
                )}

                <div className="space-y-4">
                    {updates.map((update) => (
                        <Card key={update.id} className={`border-border/50 ${!update.is_active ? 'opacity-60' : ''}`}>
                            <CardContent className="p-5">
                                {editing?.id === update.id ? (
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-semibold">Editing update</h3>
                                            <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="w-4 h-4" /></Button>
                                        </div>
                                        <UpdateForm form={editForm} onSubmit={submitEdit} label="Save Changes" />
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-4">
                                        {update.image && (
                                            <img src={update.image} alt={update.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <Badge className={`${statusColor(update.status)} text-white text-xs`}>{update.status}</Badge>
                                                <span className="text-sm text-muted-foreground">{update.month}</span>
                                                {update.is_current_phase && <Badge className="bg-green-600 text-white text-xs animate-pulse">CURRENT</Badge>}
                                                {!update.is_active && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                                            </div>
                                            <h3 className="font-semibold truncate">{update.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{update.highlight}</p>
                                            {update.highlights?.length > 0 && (
                                                <p className="text-xs text-muted-foreground mt-1">{update.highlights.length} key highlights</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button variant="outline" size="sm" onClick={() => openEdit(update)}>
                                                <Pencil className="w-3 h-3 mr-1" /> Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Delete this update?')) {
                                                        router.delete(`/cms/project-updates/${update.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {updates.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No project updates yet. Click "Add Update" to get started.
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
