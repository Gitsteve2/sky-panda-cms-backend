import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Category { id: number; name: string; slug: string; color: string; description?: string; posts_count: number }

export default function BlogCategories({ categories }: { categories: Category[] }) {
    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    const addForm = useForm({ name: '', slug: '', color: '#3B82F6', description: '' });
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
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild><Link href="/cms/blog"><ArrowLeft className="h-4 w-4" /></Link></Button>
                        <h1 className="text-2xl font-bold">Blog Categories</h1>
                    </div>
                    <Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-2" />Add Category</Button>
                </div>

                {showAdd && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>New Category</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitAdd} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label>Name *</Label>
                                        <Input value={addForm.data.name} onChange={(e) => addForm.setData('name', e.target.value)} required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Color</Label>
                                        <Input type="color" value={addForm.data.color} onChange={(e) => addForm.setData('color', e.target.value)} className="h-10" />
                                    </div>
                                </div>
                                <Button type="submit" disabled={addForm.processing}>Add Category</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {editing && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit: {editing.name}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitEdit} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label>Name *</Label>
                                        <Input value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Color</Label>
                                        <Input type="color" value={editForm.data.color} onChange={(e) => editForm.setData('color', e.target.value)} className="h-10" />
                                    </div>
                                </div>
                                <Button type="submit" disabled={editForm.processing}>Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="p-0">
                        {categories.length === 0 && <div className="py-12 text-center text-muted-foreground">No categories yet.</div>}
                        <div className="divide-y">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex items-center gap-4 px-6 py-4">
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                    <div className="flex-1">
                                        <span className="font-medium">{cat.name}</span>
                                        <span className="text-sm text-muted-foreground ml-2">({cat.posts_count} posts)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="sm" onClick={() => deleteCategory(cat)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
