import { Head, router, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface FaqItem { id: number; question: string; answer: string; order: number; is_active: boolean }
interface FaqCategory { id: number; name: string; slug: string; items: FaqItem[] }

export default function FaqIndex({ categories }: { categories: FaqCategory[] }) {
    const [showAddCat, setShowAddCat] = useState(false);
    const [showAddItem, setShowAddItem] = useState(false);
    const [editingItem, setEditingItem] = useState<FaqItem & { category_id?: number } | null>(null);
    const [editingCat, setEditingCat] = useState<FaqCategory | null>(null);

    const catForm = useForm({ name: '', description: '' });
    const editCatForm = useForm({ name: '', description: '' });
    const itemForm = useForm({ faq_category_id: '', question: '', answer: '', order: 0 });
    const editItemForm = useForm({ faq_category_id: '', question: '', answer: '', order: 0, is_active: true });

    const submitCat = (e: React.FormEvent) => {
        e.preventDefault();
        catForm.post('/cms/faq/categories', { onSuccess: () => { setShowAddCat(false); catForm.reset(); } });
    };

    const submitEditCat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCat) return;
        editCatForm.put(`/cms/faq/categories/${editingCat.id}`, { onSuccess: () => setEditingCat(null) });
    };

    const submitItem = (e: React.FormEvent) => {
        e.preventDefault();
        itemForm.post('/cms/faq/items', { onSuccess: () => { setShowAddItem(false); itemForm.reset(); } });
    };

    const submitEditItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        editItemForm.put(`/cms/faq/items/${editingItem.id}`, { onSuccess: () => setEditingItem(null) });
    };

    const openEditItem = (item: FaqItem, catId: number) => {
        setEditingItem({ ...item, category_id: catId });
        editItemForm.setData({
            faq_category_id: catId.toString(),
            question: item.question,
            answer: item.answer,
            order: item.order,
            is_active: item.is_active,
        });
    };

    const openEditCat = (cat: FaqCategory) => {
        setEditingCat(cat);
        editCatForm.setData({ name: cat.name, description: '' });
    };

    return (
        <>
            <Head title="FAQ" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">FAQ</h1>
                        <p className="text-sm text-muted-foreground mt-1">{categories.length} categories · {categories.reduce((n, c) => n + c.items.length, 0)} questions</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowAddCat(true)}><Plus className="h-4 w-4 mr-2" />Category</Button>
                        <Button onClick={() => setShowAddItem(true)}><Plus className="h-4 w-4 mr-2" />Question</Button>
                    </div>
                </div>

                {/* Add Category */}
                {showAddCat && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>New FAQ Category</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowAddCat(false)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitCat} className="flex gap-3">
                                <Input value={catForm.data.name} onChange={(e) => catForm.setData('name', e.target.value)} placeholder="Category name" required className="flex-1" />
                                <Button type="submit" disabled={catForm.processing}>Add</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Add Item */}
                {showAddItem && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>New FAQ Question</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowAddItem(false)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitItem} className="space-y-3">
                                <div className="space-y-1">
                                    <Label>Category</Label>
                                    <Select value={itemForm.data.faq_category_id} onValueChange={(v) => itemForm.setData('faq_category_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Question *</Label>
                                    <Input value={itemForm.data.question} onChange={(e) => itemForm.setData('question', e.target.value)} required />
                                </div>
                                <div className="space-y-1">
                                    <Label>Answer *</Label>
                                    <textarea className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={itemForm.data.answer} onChange={(e) => itemForm.setData('answer', e.target.value)} required />
                                </div>
                                <Button type="submit" disabled={itemForm.processing}>Add Question</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Edit Category */}
                {editingCat && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit Category</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setEditingCat(null)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitEditCat} className="flex gap-3">
                                <Input value={editCatForm.data.name} onChange={(e) => editCatForm.setData('name', e.target.value)} required className="flex-1" />
                                <Button type="submit" disabled={editCatForm.processing}>Save</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Edit Item */}
                {editingItem && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit Question</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitEditItem} className="space-y-3">
                                <div className="space-y-1">
                                    <Label>Category</Label>
                                    <Select value={editItemForm.data.faq_category_id} onValueChange={(v) => editItemForm.setData('faq_category_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Question *</Label>
                                    <Input value={editItemForm.data.question} onChange={(e) => editItemForm.setData('question', e.target.value)} required />
                                </div>
                                <div className="space-y-1">
                                    <Label>Answer *</Label>
                                    <textarea className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={editItemForm.data.answer} onChange={(e) => editItemForm.setData('answer', e.target.value)} required />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={editItemForm.data.is_active} onChange={(e) => editItemForm.setData('is_active', e.target.checked)} />
                                    <Label>Active</Label>
                                </div>
                                <Button type="submit" disabled={editItemForm.processing}>Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Categories & Items */}
                {categories.map((cat) => (
                    <Card key={cat.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">{cat.name} <span className="text-muted-foreground font-normal text-sm">({cat.items.length})</span></CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openEditCat(cat)}><Pencil className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="sm" onClick={() => { if (confirm(`Delete category "${cat.name}"?`)) router.delete(`/cms/faq/categories/${cat.id}`); }}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                            {cat.items.length === 0 && <p className="text-sm text-muted-foreground">No questions in this category.</p>}
                            {cat.items.map((item) => (
                                <div key={item.id} className="rounded-md border border-border p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{item.question}</div>
                                            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.answer}</div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button variant="ghost" size="sm" onClick={() => openEditItem(item, cat.id)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete this question?')) router.delete(`/cms/faq/items/${item.id}`); }}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
