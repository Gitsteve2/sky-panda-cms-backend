import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, Tag, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Category { id: number; name: string; slug: string; color: string; description?: string; posts_count: number }

export default function BlogCategories({ categories }: { categories: Category[] }) {
    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    const addForm = useForm({ name: '', slug: '', color: '#16a34a', description: '' });
    const editForm = useForm({ name: '', slug: '', color: '', description: '' });

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/cms/blog-categories', { onSuccess: () => { setShowAdd(false); addForm.reset(); } });
    };

    const openEdit = (cat: Category) => {
        setEditing(cat);
        editForm.setData({ name: cat.name, slug: cat.slug, color: cat.color, description: cat.description ?? '' });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        editForm.put(`/cms/blog-categories/${editing.id}`, { onSuccess: () => setEditing(null) });
    };

    const deleteCategory = (cat: Category) => {
        if (!confirm(`Delete category "${cat.name}"?`)) return;
        router.delete(`/cms/blog-categories/${cat.id}`);
    };

    return (
        <>
            <Head title="Blog Categories" />
            <div className="space-y-8 max-w-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/cms/blog">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Blog Categories</h1>
                            <p className="text-muted-foreground mt-1">{categories.length} categories</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowAdd(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
                </div>

                {showAdd && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">New Category</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitAdd} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>Name *</Label>
                                        <Input value={addForm.data.name} onChange={(e) => addForm.setData('name', e.target.value)} placeholder="Investment Tips" required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Color</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" value={addForm.data.color} onChange={(e) => addForm.setData('color', e.target.value)} className="h-10 w-14 p-1 cursor-pointer" />
                                            <Input value={addForm.data.color} onChange={(e) => addForm.setData('color', e.target.value)} placeholder="#16a34a" className="flex-1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={addForm.processing}>Add Category</Button>
                                    <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {editing && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">Edit: {editing.name}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitEdit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>Name *</Label>
                                        <Input value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Color</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" value={editForm.data.color} onChange={(e) => editForm.setData('color', e.target.value)} className="h-10 w-14 p-1 cursor-pointer" />
                                            <Input value={editForm.data.color} onChange={(e) => editForm.setData('color', e.target.value)} className="flex-1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={editForm.processing}>Save Changes</Button>
                                    <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="rounded-xl border border-border overflow-hidden bg-card">
                    {categories.length === 0 ? (
                        <div className="py-16 text-center">
                            <Tag className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">No categories yet. Add one to get started.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                                    <div className="w-4 h-4 rounded-full shrink-0 ring-2 ring-white ring-offset-1" style={{ backgroundColor: cat.color }} />
                                    <div className="flex-1 min-w-0">
                                        <span className="font-medium text-sm">{cat.name}</span>
                                        <span className="text-xs text-muted-foreground ml-2">{cat.posts_count} post{cat.posts_count !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground font-mono">/{cat.slug}</div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => deleteCategory(cat)}>
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
