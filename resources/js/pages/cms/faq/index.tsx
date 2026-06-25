import { Head, router, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronUp, HelpCircle, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        editItemForm.setData({ faq_category_id: catId.toString(), question: item.question, answer: item.answer, order: item.order, is_active: item.is_active });
    };

    const openEditCat = (cat: FaqCategory) => {
        setEditingCat(cat);
        editCatForm.setData({ name: cat.name, description: '' });
    };

    const totalQuestions = categories.reduce((n, c) => n + c.items.length, 0);

    return (
        <>
            <Head title="FAQ" />
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">FAQ</h1>
                        <p className="text-muted-foreground mt-1">{categories.length} categories · {totalQuestions} questions</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => { setShowAddCat(true); setShowAddItem(false); }}>
                            <Plus className="h-4 w-4 mr-2" />Category
                        </Button>
                        <Button onClick={() => { setShowAddItem(true); setShowAddCat(false); }}>
                            <Plus className="h-4 w-4 mr-2" />Question
                        </Button>
                    </div>
                </div>

                {showAddCat && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">New FAQ Category</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowAddCat(false)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitCat} className="flex gap-3">
                                <Input value={catForm.data.name} onChange={(e) => catForm.setData('name', e.target.value)} placeholder="Category name" required className="flex-1" />
                                <Button type="submit" disabled={catForm.processing}>Add Category</Button>
                                <Button type="button" variant="ghost" onClick={() => setShowAddCat(false)}>Cancel</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {showAddItem && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">New FAQ Question</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowAddItem(false)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitItem} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label>Category</Label>
                                    <Select value={itemForm.data.faq_category_id} onValueChange={(v) => itemForm.setData('faq_category_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Question *</Label>
                                    <Input value={itemForm.data.question} onChange={(e) => itemForm.setData('question', e.target.value)} required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Answer *</Label>
                                    <textarea className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" value={itemForm.data.answer} onChange={(e) => itemForm.setData('answer', e.target.value)} required />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={itemForm.processing}>Add Question</Button>
                                    <Button type="button" variant="ghost" onClick={() => setShowAddItem(false)}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {editingCat && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">Edit Category</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setEditingCat(null)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitEditCat} className="flex gap-3">
                                <Input value={editCatForm.data.name} onChange={(e) => editCatForm.setData('name', e.target.value)} required className="flex-1" />
                                <Button type="submit" disabled={editCatForm.processing}>Save</Button>
                                <Button type="button" variant="ghost" onClick={() => setEditingCat(null)}>Cancel</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {editingItem && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">Edit Question</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitEditItem} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label>Category</Label>
                                    <Select value={editItemForm.data.faq_category_id} onValueChange={(v) => editItemForm.setData('faq_category_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Question *</Label>
                                    <Input value={editItemForm.data.question} onChange={(e) => editItemForm.setData('question', e.target.value)} required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Answer *</Label>
                                    <textarea className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" value={editItemForm.data.answer} onChange={(e) => editItemForm.setData('answer', e.target.value)} required />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="is_active_edit" checked={editItemForm.data.is_active} onChange={(e) => editItemForm.setData('is_active', e.target.checked)} className="rounded" />
                                    <Label htmlFor="is_active_edit">Active (visible on website)</Label>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={editItemForm.processing}>Save Changes</Button>
                                    <Button type="button" variant="ghost" onClick={() => setEditingItem(null)}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {categories.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border py-20 text-center">
                        <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">No FAQ categories yet. Add a category to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {categories.map((cat) => (
                            <Card key={cat.id} className="overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <HelpCircle className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">{cat.name}</h3>
                                            <p className="text-xs text-muted-foreground">{cat.items.length} question{cat.items.length !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => openEditCat(cat)}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="sm" onClick={() => { if (confirm(`Delete category "${cat.name}"?`)) router.delete(`/cms/faq/categories/${cat.id}`); }}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-0">
                                    {cat.items.length === 0 ? (
                                        <p className="text-sm text-muted-foreground px-6 py-4">No questions in this category.</p>
                                    ) : (
                                        <div className="divide-y divide-border">
                                            {cat.items.map((item) => (
                                                <div key={item.id} className="px-6 py-4 hover:bg-muted/20 transition-colors">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium text-sm">{item.question}</p>
                                                                {!item.is_active && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{item.answer}</p>
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
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
