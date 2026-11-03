import { Head, router, useForm } from '@inertiajs/react';
import { HelpCircle, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    order: number;
    is_active: boolean;
}
interface FaqCategory {
    id: number;
    name: string;
    slug: string;
    items: FaqItem[];
}

export default function FaqIndex({
    categories,
}: {
    categories: FaqCategory[];
}) {
    const [showAddCat, setShowAddCat] = useState(false);
    const [showAddItem, setShowAddItem] = useState(false);
    const [editingItem, setEditingItem] = useState<
        (FaqItem & { category_id?: number }) | null
    >(null);
    const [editingCat, setEditingCat] = useState<FaqCategory | null>(null);
    const [deleteItemTarget, setDeleteItemTarget] = useState<FaqItem | null>(
        null,
    );
    const [deleteCatTarget, setDeleteCatTarget] = useState<FaqCategory | null>(
        null,
    );

    const catForm = useForm({ name: '', description: '' });
    const editCatForm = useForm({ name: '', description: '' });
    const itemForm = useForm({
        faq_category_id: '',
        question: '',
        answer: '',
        order: 0,
    });
    const editItemForm = useForm({
        faq_category_id: '',
        question: '',
        answer: '',
        order: 0,
        is_active: true,
    });

    const submitCat = (e: React.FormEvent) => {
        e.preventDefault();
        catForm.post('/cms/faq/categories', {
            onSuccess: () => {
                setShowAddCat(false);
                catForm.reset();
            },
        });
    };

    const submitEditCat = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingCat) {
            return;
        }

        editCatForm.put(`/cms/faq/categories/${editingCat.id}`, {
            onSuccess: () => setEditingCat(null),
        });
    };

    const submitItem = (e: React.FormEvent) => {
        e.preventDefault();
        itemForm.post('/cms/faq/items', {
            onSuccess: () => {
                setShowAddItem(false);
                itemForm.reset();
            },
        });
    };

    const submitEditItem = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingItem) {
            return;
        }

        editItemForm.put(`/cms/faq/items/${editingItem.id}`, {
            onSuccess: () => setEditingItem(null),
        });
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

    const totalQuestions = categories.reduce((n, c) => n + c.items.length, 0);

    return (
        <>
            <Head title="FAQ" />
            <div className="animate-in space-y-6 duration-200 fade-in-50">
                <PageHeader
                    title="FAQ"
                    description={`${categories.length} categories · ${totalQuestions} questions total`}
                    action={
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="hover:bg-muted/50"
                                onClick={() => {
                                    setShowAddCat(true);
                                    setShowAddItem(false);
                                    setEditingItem(null);
                                    setEditingCat(null);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Category
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowAddItem(true);
                                    setShowAddCat(false);
                                    setEditingItem(null);
                                    setEditingCat(null);
                                }}
                                className="shadow-green transition-transform hover:scale-[1.02]"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Question
                            </Button>
                        </div>
                    }
                />

                {showAddCat && (
                    <Card className="animate-in overflow-hidden border-border/50 shadow-xs duration-200 slide-in-from-top-2">
                        <CardHeader className="flex flex-row items-start justify-between border-b border-border/50 bg-muted/20 pb-4">
                            <div>
                                <CardTitle className="text-base font-bold text-foreground">
                                    New FAQ Category
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Create a classification for your FAQ
                                    questions.
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowAddCat(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form
                                onSubmit={submitCat}
                                className="flex flex-col gap-3 sm:flex-row"
                            >
                                <Input
                                    value={catForm.data.name}
                                    onChange={(e) =>
                                        catForm.setData('name', e.target.value)
                                    }
                                    placeholder="Category name (e.g. Payments, General)"
                                    required
                                    className="h-10 flex-1"
                                />
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="submit"
                                        disabled={catForm.processing}
                                    >
                                        Add Category
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowAddCat(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {showAddItem && (
                    <Card className="animate-in overflow-hidden border-border/50 shadow-xs duration-200 slide-in-from-top-2">
                        <CardHeader className="flex flex-row items-start justify-between border-b border-border/50 bg-muted/20 pb-4">
                            <div>
                                <CardTitle className="text-base font-bold text-foreground">
                                    New FAQ Question
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Add a new question and answer to the FAQ
                                    list.
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowAddItem(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={submitItem} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold">
                                        Category
                                    </Label>
                                    <Select
                                        value={itemForm.data.faq_category_id}
                                        onValueChange={(v) =>
                                            itemForm.setData(
                                                'faq_category_id',
                                                v,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem
                                                    key={cat.id}
                                                    value={cat.id.toString()}
                                                >
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold">
                                        Question *
                                    </Label>
                                    <Input
                                        value={itemForm.data.question}
                                        onChange={(e) =>
                                            itemForm.setData(
                                                'question',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold">
                                        Answer *
                                    </Label>
                                    <textarea
                                        className="min-h-[110px] w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden"
                                        value={itemForm.data.answer}
                                        onChange={(e) =>
                                            itemForm.setData(
                                                'answer',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        placeholder="Provide clear answers to users..."
                                    />
                                </div>
                                <div className="flex items-center gap-2 border-t border-border/40 pt-2">
                                    <Button
                                        type="submit"
                                        disabled={itemForm.processing}
                                    >
                                        Add Question
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowAddItem(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {editingCat && (
                    <Card className="animate-in overflow-hidden border-border/50 shadow-xs duration-200 slide-in-from-top-2">
                        <CardHeader className="flex flex-row items-start justify-between border-b border-border/50 bg-muted/20 pb-4">
                            <div>
                                <CardTitle className="text-base font-bold text-foreground">
                                    Edit Category
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Modify the name of this category.
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => setEditingCat(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form
                                onSubmit={submitEditCat}
                                className="flex flex-col gap-3 sm:flex-row"
                            >
                                <Input
                                    value={editCatForm.data.name}
                                    onChange={(e) =>
                                        editCatForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    className="h-10 flex-1"
                                />
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="submit"
                                        disabled={editCatForm.processing}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditingCat(null)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {editingItem && (
                    <Card className="animate-in overflow-hidden border-border/50 shadow-xs duration-200 slide-in-from-top-2">
                        <CardHeader className="flex flex-row items-start justify-between border-b border-border/50 bg-muted/20 pb-4">
                            <div>
                                <CardTitle className="text-base font-bold text-foreground">
                                    Edit Question
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Update your question or change its category
                                    categorization.
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => setEditingItem(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form
                                onSubmit={submitEditItem}
                                className="space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold">
                                        Category
                                    </Label>
                                    <Select
                                        value={
                                            editItemForm.data.faq_category_id
                                        }
                                        onValueChange={(v) =>
                                            editItemForm.setData(
                                                'faq_category_id',
                                                v,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem
                                                    key={cat.id}
                                                    value={cat.id.toString()}
                                                >
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold">
                                        Question *
                                    </Label>
                                    <Input
                                        value={editItemForm.data.question}
                                        onChange={(e) =>
                                            editItemForm.setData(
                                                'question',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold">
                                        Answer *
                                    </Label>
                                    <textarea
                                        className="min-h-[110px] w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden"
                                        value={editItemForm.data.answer}
                                        onChange={(e) =>
                                            editItemForm.setData(
                                                'answer',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <label className="group flex cursor-pointer items-center gap-3 py-1">
                                    <div
                                        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${editItemForm.data.is_active ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                    >
                                        <div
                                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${editItemForm.data.is_active ? 'translate-x-5' : 'translate-x-1'}`}
                                        />
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={editItemForm.data.is_active}
                                        onChange={(e) =>
                                            editItemForm.setData(
                                                'is_active',
                                                e.target.checked,
                                            )
                                        }
                                        className="sr-only"
                                    />
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                                            Active Status
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Visible on the website FAQ section.
                                        </div>
                                    </div>
                                </label>
                                <div className="flex items-center gap-2 border-t border-border/40 pt-2">
                                    <Button
                                        type="submit"
                                        disabled={editItemForm.processing}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditingItem(null)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {categories.length === 0 ? (
                    <EmptyState
                        icon={HelpCircle}
                        title="No FAQ Categories yet"
                        description="FAQ questions must belong to categories. Create a category to start adding questions."
                        action={
                            <Button onClick={() => setShowAddCat(true)}>
                                Create FAQ Category
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        {categories.map((cat) => (
                            <Card
                                key={cat.id}
                                className="overflow-hidden border-border/50 shadow-xs"
                            >
                                <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                                            <HelpCircle className="h-4.5 w-4.5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-foreground">
                                                {cat.name}
                                            </h3>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {cat.items.length} question
                                                {cat.items.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-80 transition-opacity hover:opacity-100">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                            onClick={() => openEditCat(cat)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                            onClick={() =>
                                                setDeleteCatTarget(cat)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-0">
                                    {cat.items.length === 0 ? (
                                        <div className="px-6 py-8 text-center text-xs text-muted-foreground/80">
                                            No questions in this category yet.
                                            Click "Question" at the top to add
                                            one.
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border/50">
                                            {cat.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="group px-6 py-4 transition-colors hover:bg-muted/10"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-semibold text-foreground">
                                                                    {
                                                                        item.question
                                                                    }
                                                                </p>
                                                                {!item.is_active && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="border-border/40 bg-muted/65 text-[10px] font-semibold tracking-wider text-muted-foreground/80 uppercase"
                                                                    >
                                                                        Hidden
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                                                                {item.answer}
                                                            </p>
                                                        </div>
                                                        <div className="flex shrink-0 items-center gap-1 opacity-80 transition-opacity group-hover:opacity-100">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                                onClick={() =>
                                                                    openEditItem(
                                                                        item,
                                                                        cat.id,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                                onClick={() =>
                                                                    setDeleteItemTarget(
                                                                        item,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
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

            <ConfirmDialog
                open={!!deleteCatTarget}
                onOpenChange={(open) => !open && setDeleteCatTarget(null)}
                title="Delete FAQ category?"
                description={`Are you sure you want to delete the category "${deleteCatTarget?.name}"? All ${deleteCatTarget?.items.length || 0} questions within this category will be deleted permanently.`}
                confirmText="Delete Category"
                variant="destructive"
                onConfirm={() => {
                    if (deleteCatTarget) {
                        router.delete(
                            `/cms/faq/categories/${deleteCatTarget.id}`,
                        );
                        setDeleteCatTarget(null);
                    }
                }}
            />

            <ConfirmDialog
                open={!!deleteItemTarget}
                onOpenChange={(open) => !open && setDeleteItemTarget(null)}
                title="Delete FAQ question?"
                description={`Are you sure you want to delete this FAQ question? This action cannot be undone.`}
                confirmText="Delete Question"
                variant="destructive"
                onConfirm={() => {
                    if (deleteItemTarget) {
                        router.delete(`/cms/faq/items/${deleteItemTarget.id}`);
                        setDeleteItemTarget(null);
                    }
                }}
            />
        </>
    );
}
