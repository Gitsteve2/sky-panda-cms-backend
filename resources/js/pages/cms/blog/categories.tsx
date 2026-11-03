import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, Tag, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePermission } from '@/hooks/use-permission';

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
    description?: string;
    posts_count: number;
}

export default function BlogCategories({
    categories,
}: {
    categories: Category[];
}) {
    const { can } = usePermission();
    const canCreate = can('blog.create');
    const canEdit = can('blog.edit');
    const canDelete = can('blog.delete');

    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const addForm = useForm({
        name: '',
        slug: '',
        color: '#16a34a',
        description: '',
    });
    const editForm = useForm({
        name: '',
        slug: '',
        color: '#16a34a',
        description: '',
    });

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/cms/blog-categories', {
            onSuccess: () => {
                setShowAdd(false);
                addForm.reset();
            },
        });
    };

    const openEdit = (cat: Category) => {
        setShowAdd(false);
        setEditing(cat);
        editForm.setData({
            name: cat.name,
            slug: cat.slug,
            color: cat.color || '#16a34a',
            description: cat.description ?? '',
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editing) {
            return;
        }

        editForm.put(`/cms/blog-categories/${editing.id}`, {
            onSuccess: () => setEditing(null),
        });
    };

    return (
        <>
            <Head title="Blog Categories" />
            <div className="max-w-4xl animate-in space-y-6 duration-200 fade-in-50">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-9 w-9 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground"
                        >
                            <Link href="/cms/blog">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Blog Categories
                            </h1>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {categories.length} categor
                                {categories.length !== 1 ? 'ies' : 'y'}{' '}
                                configured for organizing articles
                            </p>
                        </div>
                    </div>
                    {canCreate && !showAdd && !editing && (
                        <Button
                            onClick={() => setShowAdd(true)}
                            className="shadow-green transition-transform hover:scale-[1.02]"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    )}
                </div>

                {showAdd && (
                    <Card className="animate-in overflow-hidden border-border/50 shadow-xs duration-200 slide-in-from-top-2">
                        <CardHeader className="flex flex-row items-start justify-between border-b border-border/50 bg-muted/20 pb-4">
                            <div>
                                <CardTitle className="text-base font-bold text-foreground">
                                    New Category
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Create a new category to organize and filter
                                    blog articles on the website.
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowAdd(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={submitAdd} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-semibold">
                                            Category Name{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            value={addForm.data.name}
                                            onChange={(e) =>
                                                addForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. Investment Strategy"
                                            required
                                            className="h-10"
                                        />
                                        <InputError
                                            message={addForm.errors.name}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-semibold">
                                            Color Tag
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                value={addForm.data.color}
                                                onChange={(e) =>
                                                    addForm.setData(
                                                        'color',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-input p-1"
                                            />
                                            <Input
                                                value={addForm.data.color}
                                                onChange={(e) =>
                                                    addForm.setData(
                                                        'color',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="#16a34a"
                                                className="h-10 flex-1 font-mono text-xs"
                                            />
                                        </div>
                                        <InputError
                                            message={addForm.errors.color}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold">
                                        Description (Optional)
                                    </Label>
                                    <Input
                                        value={addForm.data.description}
                                        onChange={(e) =>
                                            addForm.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Short description of articles in this category..."
                                        className="h-10"
                                    />
                                </div>
                                <div className="mt-4 flex items-center gap-2 border-t border-border/40 pt-2">
                                    <Button
                                        type="submit"
                                        disabled={addForm.processing}
                                    >
                                        {addForm.processing
                                            ? 'Adding...'
                                            : 'Add Category'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowAdd(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {editing && (
                    <Card className="animate-in overflow-hidden border-border/50 shadow-xs duration-200 slide-in-from-top-2">
                        <CardHeader className="flex flex-row items-start justify-between border-b border-border/50 bg-muted/20 pb-4">
                            <div>
                                <CardTitle className="text-base font-bold text-foreground">
                                    Edit Category: {editing.name}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Modify the category label, color badge, or
                                    description.
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => setEditing(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={submitEdit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-semibold">
                                            Category Name{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            value={editForm.data.name}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            className="h-10"
                                        />
                                        <InputError
                                            message={editForm.errors.name}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-semibold">
                                            Color Tag
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                value={editForm.data.color}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'color',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-input p-1"
                                            />
                                            <Input
                                                value={editForm.data.color}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'color',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-10 flex-1 font-mono text-xs"
                                            />
                                        </div>
                                        <InputError
                                            message={editForm.errors.color}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold">
                                        Description (Optional)
                                    </Label>
                                    <Input
                                        value={editForm.data.description}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Short description of articles in this category..."
                                        className="h-10"
                                    />
                                </div>
                                <div className="mt-4 flex items-center gap-2 border-t border-border/40 pt-2">
                                    <Button
                                        type="submit"
                                        disabled={editForm.processing}
                                    >
                                        {editForm.processing
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditing(null)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-xs">
                    {categories.length === 0 ? (
                        <div className="py-20 text-center">
                            <Tag className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                            <p className="text-sm font-semibold text-muted-foreground">
                                No categories yet
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground/80">
                                Add categories to classify your blog articles.
                            </p>
                            {canCreate && (
                                <Button
                                    onClick={() => setShowAdd(true)}
                                    className="mt-4"
                                    variant="outline"
                                >
                                    Add Category
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/20"
                                >
                                    <div
                                        className="h-4 w-4 shrink-0 rounded-full border border-border ring-4 ring-background"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-sm font-bold text-foreground">
                                                {cat.name}
                                            </span>
                                            <span className="rounded border border-border/40 bg-muted/60 px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
                                                {cat.posts_count} article
                                                {cat.posts_count !== 1
                                                    ? 's'
                                                    : ''}
                                            </span>
                                        </div>
                                        {cat.description && (
                                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                {cat.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="hidden rounded border border-border/30 bg-muted/40 px-2 py-1 font-mono text-xs text-muted-foreground sm:block">
                                        /{cat.slug}
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1">
                                        {canEdit && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                onClick={() => openEdit(cat)}
                                                title="Edit category"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {canDelete && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                onClick={() =>
                                                    setDeleteTarget(cat)
                                                }
                                                title="Delete category"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
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
                description={`Are you sure you want to delete the category "${deleteTarget?.name}"? ${
                    deleteTarget?.posts_count
                        ? `The ${deleteTarget.posts_count} article(s) in this category will NOT be deleted, but will become Uncategorized.`
                        : 'No articles are currently assigned to this category.'
                }`}
                confirmText="Delete Category"
                variant="destructive"
                isLoading={isDeleting}
                onConfirm={() => {
                    if (deleteTarget) {
                        setIsDeleting(true);
                        router.delete(
                            `/cms/blog-categories/${deleteTarget.id}`,
                            {
                                preserveScroll: true,
                                onSuccess: () => setDeleteTarget(null),
                                onFinish: () => setIsDeleting(false),
                            },
                        );
                    }
                }}
            />
        </>
    );
}
