import { Head, router, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronUp, ExternalLink, Link2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NavItem { id: number; label: string; path: string; type: string; target: string; order: number; is_active: boolean; children?: NavItem[] }

const emptyForm = { label: '', path: '', type: 'internal', target: '_self', order: 0, is_active: true, show_in_mobile: true, parent_id: '' };

export default function NavigationIndex({ items }: { items: NavItem[] }) {
    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState<NavItem | null>(null);

    const addForm = useForm({ ...emptyForm });
    const editForm = useForm({ ...emptyForm });

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/cms/navigation', { onSuccess: () => { setShowAdd(false); addForm.reset(); } });
    };

    const openEdit = (item: NavItem) => {
        setEditing(item);
        editForm.setData({ label: item.label, path: item.path, type: item.type, target: item.target, order: item.order, is_active: item.is_active, show_in_mobile: true, parent_id: '' });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        editForm.put(`/cms/navigation/${editing.id}`, { onSuccess: () => setEditing(null) });
    };

    const sorted = [...items].sort((a, b) => a.order - b.order);

    const moveItem = (item: NavItem, dir: 'up' | 'down') => {
        const idx = sorted.findIndex((i) => i.id === item.id);
        const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= sorted.length) return;
        const newItems = sorted.map((i, n) => {
            if (n === idx) return { id: i.id, order: sorted[swapIdx].order };
            if (n === swapIdx) return { id: i.id, order: sorted[idx].order };
            return { id: i.id, order: i.order };
        });
        router.post('/cms/navigation/reorder', { items: newItems });
    };

    const NavForm = ({ form, onSubmit, label, onCancel }: { form: typeof addForm; onSubmit: (e: React.FormEvent) => void; label: string; onCancel: () => void }) => (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label>Label *</Label>
                    <Input value={form.data.label} onChange={(e) => form.setData('label', e.target.value)} placeholder="Home" required />
                </div>
                <div className="space-y-1.5">
                    <Label>Path / URL *</Label>
                    <Input value={form.data.path} onChange={(e) => form.setData('path', e.target.value)} placeholder="/" required />
                </div>
                <div className="space-y-1.5">
                    <Label>Link Type</Label>
                    <Select value={form.data.type} onValueChange={(v) => form.setData('type', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="internal">Internal Link</SelectItem>
                            <SelectItem value="external">External Link</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Target</Label>
                    <Select value={form.data.target} onValueChange={(v) => form.setData('target', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_self">Same Window</SelectItem>
                            <SelectItem value="_blank">New Tab</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Order</Label>
                    <Input type="number" value={form.data.order} onChange={(e) => form.setData('order', parseInt(e.target.value))} />
                </div>
            </div>
            <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} className="rounded" />
                    <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.data.show_in_mobile} onChange={(e) => form.setData('show_in_mobile', e.target.checked)} className="rounded" />
                    <span className="text-sm">Show in Mobile</span>
                </label>
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={form.processing}>{form.processing ? 'Saving...' : label}</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );

    return (
        <>
            <Head title="Navigation" />
            <div className="space-y-8 max-w-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Navigation</h1>
                        <p className="text-muted-foreground mt-1">Manage the website navigation menu order and links.</p>
                    </div>
                    <Button onClick={() => { setShowAdd(true); setEditing(null); }}>
                        <Plus className="h-4 w-4 mr-2" />Add Item
                    </Button>
                </div>

                {showAdd && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">New Navigation Item</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <NavForm form={addForm} onSubmit={submitAdd} label="Add Item" onCancel={() => setShowAdd(false)} />
                        </CardContent>
                    </Card>
                )}

                {editing && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">Edit: {editing.label}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <NavForm form={editForm} onSubmit={submitEdit} label="Save Changes" onCancel={() => setEditing(null)} />
                        </CardContent>
                    </Card>
                )}

                <div className="rounded-xl border border-border overflow-hidden bg-card">
                    {sorted.length === 0 ? (
                        <div className="py-16 text-center">
                            <Link2 className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">No navigation items yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {sorted.map((item, idx) => (
                                <div key={item.id} className="flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors">
                                    <div className="flex flex-col gap-0.5">
                                        <button
                                            className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors"
                                            onClick={() => moveItem(item, 'up')}
                                            disabled={idx === 0}
                                        >
                                            <ChevronUp className="h-3 w-3" />
                                        </button>
                                        <button
                                            className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors"
                                            onClick={() => moveItem(item, 'down')}
                                            disabled={idx === sorted.length - 1}
                                        >
                                            <ChevronDown className="h-3 w-3" />
                                        </button>
                                    </div>

                                    <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-xs font-mono text-muted-foreground shrink-0">
                                        {idx + 1}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{item.label}</span>
                                            {!item.is_active && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                                            {item.type === 'external' && <Badge variant="outline" className="text-xs gap-1"><ExternalLink className="h-2.5 w-2.5" />External</Badge>}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{item.path}</div>
                                    </div>

                                    <div className="flex gap-1 shrink-0">
                                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/navigation/${item.id}`); }}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
