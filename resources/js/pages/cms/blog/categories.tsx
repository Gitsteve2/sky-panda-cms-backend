import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, Tag, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { ConfirmDialog } from '@/components/confirm-dialog';

interface Category { id: number; name: string; slug: string; color: string; description?: string; posts_count: number }

export default function BlogCategories({ categories }: { categories: Category[] }) {
    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

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

    return (
        <>
            <Head title="Blog Categories" />
            <div className="space-y-6 max-w-3xl animate-in fade-in-50 duration-200">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground">
                        <Link href="/cms/blog">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Blog Categories</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{categories.length} categories available</p>
                    </div>
                    {!showAdd && !editing && (
                        <Button onClick={() => setShowAdd(true)} className="shadow-green hover:scale-[1.02] transition-transform">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    )}
                </div>

                {showAdd && (
                    <Card className="border-border/50 shadow-xs overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <CardHeader className="flex flex-row items-start justify-between pb-4 bg-muted/20 border-b border-border/50">
                            <div>
                                <CardTitle className="text-base font-bold text-foreground">New Category</CardTitle>
                                <CardDescription className="text-xs">Create a new category category to organize posts.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setShowAdd(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={submitAdd} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="font-semibold text-sm">Name <span className="text-destructive">*</span></Label>
                                        <Input value={addForm.data.name} onChange={(e) => addForm.setData('name', e.target.value)} placeholder="Investment Tips" required className="h-10" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="font-semibold text-sm">Color Tag</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" value={addForm.data.color} onChange={(e) => addForm.setData('color', e.target.value)} className="h-10 w-14 p-1 cursor-pointer shrink-0 border border-input rounded-lg" />
                                            <Input value={addForm.data.color} onChange={(e) => addForm.setData('color', e.target.value)} placeholder="#16a34a" className="flex-1 h-10 font-mono text-xs" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-border/40 mt-4">
                                    <Button type="submit" disabled={addForm.processing}>Add Category</Button>
                                    <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {editing && (
                    <Card className="border-border/50 shadow-xs overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <CardHeader className="flex flex-row items-start justify-between pb-4 bg-muted/20 border-b border-border/50">
                            <div>
                                <CardTitle className="text-base font-bold text-foreground">Edit Category: {editing.name}</CardTitle>
                                <CardDescription className="text-xs">Modify the label, color tag or URL path slug.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setEditing(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={submitEdit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="font-semibold text-sm">Name <span className="text-destructive">*</span></Label>
                                        <Input value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} required className="h-10" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="font-semibold text-sm">Color Tag</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" value={editForm.data.color} onChange={(e) => editForm.setData('color', e.target.value)} className="h-10 w-14 p-1 cursor-pointer shrink-0 border border-input rounded-lg" />
                                            <Input value={editForm.data.color} onChange={(e) => editForm.setData('color', e.target.value)} className="flex-1 h-10 font-mono text-xs" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-border/40 mt-4">
                                    <Button type="submit" disabled={editForm.processing}>Save Changes</Button>
                                    <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-xs">
                    {categories.length === 0 ? (
                        <div className="py-20 text-center">
                            <Tag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground font-semibold">No categories yet</p>
                            <p className="text-xs text-muted-foreground/80 mt-1">Add categories to classify your blog articles.</p>
                            <Button onClick={() => setShowAdd(true)} className="mt-4" variant="outline">
                                Add Category
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/20 transition-colors group">
                                    <div className="w-4 h-4 rounded-full shrink-0 ring-4 ring-background border border-border" style={{ backgroundColor: cat.color }} />
                                    <div className="flex-1 min-w-0">
                                        <span className="font-bold text-sm text-foreground">{cat.name}</span>
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted/60 border border-border/40 px-2 py-0.5 rounded ml-2.5">
                                            {cat.posts_count} post{cat.posts_count !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground font-mono bg-muted/40 px-2 py-1 rounded border border-border/30 hidden sm:block">
                                        /{cat.slug}
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(cat)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(cat)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Delete category?"
                description={`Are you sure you want to delete the category "${deleteTarget?.name}"? Blog posts using this category will be updated to have no category.`}
                confirmText="Delete"
                variant="destructive"
                onConfirm={() => {
                    if (deleteTarget) {
                        router.delete(`/cms/blog-categories/${deleteTarget.id}`);
                        setDeleteTarget(null);
                    }
                }}
            />
        </>
    );
}
