import { Head, router, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, X } from 'lucide-react';
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

    const NavForm = ({ form, onSubmit, label }: { form: typeof addForm; onSubmit: (e: React.FormEvent) => void; label: string }) => (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Label *</Label><Input value={form.data.label} onChange={(e) => form.setData('label', e.target.value)} placeholder="Home" required /></div>
                <div className="space-y-1"><Label>Path/URL *</Label><Input value={form.data.path} onChange={(e) => form.setData('path', e.target.value)} placeholder="/" required /></div>
                <div className="space-y-1">
                    <Label>Type</Label>
                    <Select value={form.data.type} onValueChange={(v) => form.setData('type', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="internal">Internal Link</SelectItem>
                            <SelectItem value="external">External Link</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label>Target</Label>
                    <Select value={form.data.target} onValueChange={(v) => form.setData('target', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_self">Same Window</SelectItem>
                            <SelectItem value="_blank">New Tab</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1"><Label>Order</Label><Input type="number" value={form.data.order} onChange={(e) => form.setData('order', parseInt(e.target.value))} /></div>
            </div>
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} /><span className="text-sm">Active</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.data.show_in_mobile} onChange={(e) => form.setData('show_in_mobile', e.target.checked)} /><span className="text-sm">Show in Mobile</span></label>
            </div>
            <Button type="submit" disabled={form.processing}>{form.processing ? 'Saving...' : label}</Button>
        </form>
    );

    return (
        <>
            <Head title="Navigation" />
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Navigation</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage the website navigation menu.</p>
                    </div>
                    <Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-2" />Add Item</Button>
                </div>

                {showAdd && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>New Nav Item</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent><NavForm form={addForm} onSubmit={submitAdd} label="Add Item" /></CardContent>
                    </Card>
                )}

                {editing && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit: {editing.label}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent><NavForm form={editForm} onSubmit={submitEdit} label="Save Changes" /></CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {sorted.map((item, idx) => (
                                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                                    <div className="flex flex-col gap-0.5">
                                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => moveItem(item, 'up')} disabled={idx === 0}><ChevronUp className="h-3 w-3" /></Button>
                                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => moveItem(item, 'down')} disabled={idx === sorted.length - 1}><ChevronDown className="h-3 w-3" /></Button>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{item.label}</span>
                                            {!item.is_active && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                                            {item.type === 'external' && <Badge variant="outline" className="text-xs">External</Badge>}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{item.path}</div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/navigation/${item.id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
