import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    CheckSquare,
    Clock,
    Download,
    ExternalLink,
    Eye,
    EyeOff,
    FilePlus,
    Filter,
    HelpCircle,
    Image as ImageIcon,
    LayoutGrid,
    List,
    Pencil,
    Search,
    Star,
    Tag,
    Trash2,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { usePermission } from '@/hooks/use-permission';

interface Category {
    id: number;
    name: string;
    slug?: string;
    color: string;
    posts_count?: number;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    featured_image?: string | null;
    is_published: boolean;
    is_featured: boolean;
    read_time?: string | null;
    author_name?: string | null;
    published_at?: string | null;
    created_at: string;
    blog_category_id?: number | null;
    category?: Category | null;
    author?: { id: number; name: string } | null;
}

type StatusFilter = 'all' | 'published' | 'draft' | 'featured';
type SortOption = 'newest' | 'oldest' | 'title' | 'published_at';

export default function BlogIndex({
    posts,
    categories,
}: {
    posts: Post[];
    categories: Category[];
}) {
    const { can } = usePermission();
    const canCreate = can('blog.create');
    const canEdit = can('blog.edit');
    const canDelete = can('blog.delete');

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [guideOpen, setGuideOpen] = useState(false);

    const stats = useMemo(() => {
        const total = posts.length;
        const published = posts.filter((p) => p.is_published).length;
        const drafts = total - published;
        const featured = posts.filter((p) => p.is_featured).length;

        return { total, published, drafts, featured };
    }, [posts]);

    const filteredPosts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return posts
            .filter((post) => {
                if (statusFilter === 'published' && !post.is_published) {
                    return false;
                }

                if (statusFilter === 'draft' && post.is_published) {
                    return false;
                }

                if (statusFilter === 'featured' && !post.is_featured) {
                    return false;
                }

                if (categoryFilter !== 'all') {
                    if (categoryFilter === 'uncategorized') {
                        if (post.blog_category_id) {
                            return false;
                        }
                    } else if (
                        String(post.blog_category_id) !== categoryFilter
                    ) {
                        return false;
                    }
                }

                if (query) {
                    const authorName = (
                        post.author_name ||
                        post.author?.name ||
                        ''
                    ).toLowerCase();
                    const catName = (post.category?.name || '').toLowerCase();
                    const matches =
                        post.title.toLowerCase().includes(query) ||
                        post.slug.toLowerCase().includes(query) ||
                        (post.excerpt || '').toLowerCase().includes(query) ||
                        authorName.includes(query) ||
                        catName.includes(query);

                    if (!matches) {
                        return false;
                    }
                }

                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'title') {
                    return a.title.localeCompare(b.title);
                }

                if (sortBy === 'oldest') {
                    return (
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                    );
                }

                if (sortBy === 'published_at') {
                    const dateA = new Date(
                        a.published_at || a.created_at,
                    ).getTime();
                    const dateB = new Date(
                        b.published_at || b.created_at,
                    ).getTime();

                    return dateB - dateA;
                }

                return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                );
            });
    }, [posts, search, statusFilter, categoryFilter, sortBy]);

    const allFilteredSelected =
        filteredPosts.length > 0 &&
        filteredPosts.every((p) => selectedIds.includes(p.id));

    const toggleSelectAll = () => {
        if (allFilteredSelected) {
            setSelectedIds((prev) =>
                prev.filter((id) => !filteredPosts.some((p) => p.id === id)),
            );
        } else {
            const newIds = new Set([
                ...selectedIds,
                ...filteredPosts.map((p) => p.id),
            ]);
            setSelectedIds(Array.from(newIds));
        }
    };

    const toggleSelectOne = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const handleTogglePublish = (post: Post) => {
        if (!canEdit) {
            return;
        }

        setTogglingId(post.id);
        router.patch(
            `/cms/blog/${post.id}/toggle-publish`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setTogglingId(null),
            },
        );
    };

    const handleToggleFeatured = (post: Post) => {
        if (!canEdit) {
            return;
        }

        setTogglingId(post.id);
        router.patch(
            `/cms/blog/${post.id}/toggle-featured`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setTogglingId(null),
            },
        );
    };

    const handleBulkAction = (action: 'publish' | 'unpublish' | 'delete') => {
        if (selectedIds.length === 0) {
            return;
        }

        setIsDeleting(true);
        router.post(
            '/cms/blog/bulk-action',
            { ids: selectedIds, action },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setBulkDeleteOpen(false);
                },
                onFinish: () => setIsDeleting(false),
            },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setCategoryFilter('all');
        setSortBy('newest');
    };

    const getAuthorName = (post: Post) =>
        post.author_name || post.author?.name || 'Panda Towers Team';
    const getInitials = (name: string) =>
        name
            .split(' ')
            .filter(Boolean)
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

    return (
        <>
            <Head title="Blog & Articles Management" />
            <div className="animate-in space-y-6 duration-200 fade-in-50">
                <PageHeader
                    icon={BookOpen}
                    title="Blog & Articles"
                    description="Create, edit, publish, and manage articles displayed on the Panda Towers website."
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-9 hover:bg-muted/50"
                            >
                                <a
                                    href="/cms/blog/guide-pdf"
                                    download="Panda-Towers-Blog-Admin-Guide.pdf"
                                >
                                    <Download className="mr-1.5 h-4 w-4 text-primary" />
                                    Admin Guide (PDF)
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 hover:bg-muted/50"
                                onClick={() => setGuideOpen(true)}
                                title="Quick View Guide"
                            >
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-9 hover:bg-muted/50"
                            >
                                <Link
                                    href="/blog"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="mr-1.5 h-4 w-4" />
                                    Live Website Blog
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-9 hover:bg-muted/50"
                            >
                                <Link href="/cms/blog-categories">
                                    <Tag className="mr-1.5 h-4 w-4" />
                                    Categories ({categories.length})
                                </Link>
                            </Button>
                            {canCreate && (
                                <Button
                                    asChild
                                    size="sm"
                                    className="shadow-green h-9 transition-transform hover:scale-[1.02]"
                                >
                                    <Link href="/cms/blog/create">
                                        <FilePlus className="mr-1.5 h-4 w-4" />
                                        New Article
                                    </Link>
                                </Button>
                            )}
                        </div>
                    }
                />

                {/* Summary Stat Cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <button
                        type="button"
                        onClick={() => setStatusFilter('all')}
                        className={`rounded-xl border p-4 text-left transition-all ${
                            statusFilter === 'all'
                                ? 'border-primary bg-primary/5 shadow-xs'
                                : 'border-border/60 bg-card hover:border-primary/40'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Total Articles
                            </span>
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <BookOpen className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-foreground">
                            {stats.total}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                            All articles in CMS
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('published')}
                        className={`rounded-xl border p-4 text-left transition-all ${
                            statusFilter === 'published'
                                ? 'border-emerald-500 bg-emerald-500/5 shadow-xs'
                                : 'border-border/60 bg-card hover:border-emerald-500/40'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Published
                            </span>
                            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                                <Eye className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-foreground">
                            {stats.published}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                            Visible on website
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('draft')}
                        className={`rounded-xl border p-4 text-left transition-all ${
                            statusFilter === 'draft'
                                ? 'border-amber-500 bg-amber-500/5 shadow-xs'
                                : 'border-border/60 bg-card hover:border-amber-500/40'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Drafts
                            </span>
                            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                                <EyeOff className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-foreground">
                            {stats.drafts}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                            Unpublished drafts
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('featured')}
                        className={`rounded-xl border p-4 text-left transition-all ${
                            statusFilter === 'featured'
                                ? 'border-copper bg-copper/5 shadow-xs'
                                : 'border-border/60 bg-card hover:border-copper/40'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Featured
                            </span>
                            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
                                <Star className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-foreground">
                            {stats.featured}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                            Pinned spotlight posts
                        </div>
                    </button>
                </div>

                {/* Search, Filter & View Controls */}
                {posts.length > 0 && (
                    <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4 shadow-xs">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            {/* Search Input */}
                            <div className="relative max-w-md flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by title, excerpt, author, or category..."
                                    className="h-9 pr-8 pl-9 text-sm"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Filters & View Mode */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Select
                                    value={categoryFilter}
                                    onValueChange={setCategoryFilter}
                                >
                                    <SelectTrigger className="h-9 w-[170px] text-xs">
                                        <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Categories
                                        </SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem
                                                key={cat.id}
                                                value={String(cat.id)}
                                            >
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="uncategorized">
                                            Uncategorized
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={sortBy}
                                    onValueChange={(v) =>
                                        setSortBy(v as SortOption)
                                    }
                                >
                                    <SelectTrigger className="h-9 w-[155px] text-xs">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">
                                            Newest Created
                                        </SelectItem>
                                        <SelectItem value="published_at">
                                            Published Date
                                        </SelectItem>
                                        <SelectItem value="oldest">
                                            Oldest First
                                        </SelectItem>
                                        <SelectItem value="title">
                                            Title (A–Z)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="inline-flex rounded-lg border border-border bg-muted/30 p-0.5">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('table')}
                                        className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                            viewMode === 'table'
                                                ? 'bg-background text-foreground shadow-2xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                        title="Table View"
                                    >
                                        <List className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">
                                            Table
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('grid')}
                                        className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                            viewMode === 'grid'
                                                ? 'bg-background text-foreground shadow-2xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                        title="Grid View"
                                    >
                                        <LayoutGrid className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">
                                            Cards
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filter Summary */}
                        {(search ||
                            statusFilter !== 'all' ||
                            categoryFilter !== 'all') && (
                            <div className="flex items-center justify-between border-t border-border/40 pt-2 text-xs">
                                <div className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
                                    <span>
                                        Showing{' '}
                                        <strong className="text-foreground">
                                            {filteredPosts.length}
                                        </strong>{' '}
                                        of {posts.length} articles
                                    </span>
                                    {statusFilter !== 'all' && (
                                        <Badge
                                            variant="secondary"
                                            className="text-[11px] capitalize"
                                        >
                                            Status: {statusFilter}
                                        </Badge>
                                    )}
                                    {categoryFilter !== 'all' && (
                                        <Badge
                                            variant="secondary"
                                            className="text-[11px]"
                                        >
                                            Category:{' '}
                                            {categories.find(
                                                (c) =>
                                                    String(c.id) ===
                                                    categoryFilter,
                                            )?.name ?? 'Uncategorized'}
                                        </Badge>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={clearFilters}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Bulk Action Bar */}
                {selectedIds.length > 0 && (
                    <div className="flex animate-in flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 duration-150 slide-in-from-top-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <CheckSquare className="h-4 w-4 text-primary" />
                            <span>
                                {selectedIds.length} article
                                {selectedIds.length !== 1 ? 's' : ''} selected
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {canEdit && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 bg-background text-xs"
                                        disabled={isDeleting}
                                        onClick={() =>
                                            handleBulkAction('publish')
                                        }
                                    >
                                        <Eye className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                                        Publish Selected
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 bg-background text-xs"
                                        disabled={isDeleting}
                                        onClick={() =>
                                            handleBulkAction('unpublish')
                                        }
                                    >
                                        <EyeOff className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
                                        Move to Drafts
                                    </Button>
                                </>
                            )}
                            {canDelete && (
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 text-xs"
                                    disabled={isDeleting}
                                    onClick={() => setBulkDeleteOpen(true)}
                                >
                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                    Delete Selected
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-xs"
                                onClick={() => setSelectedIds([])}
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                )}

                {/* Empty States or Content */}
                {posts.length === 0 ? (
                    <EmptyState
                        icon={BookOpen}
                        title="No blog articles yet"
                        description="Write and publish articles, investment guides, and project news for the Panda Towers website."
                        action={
                            canCreate ? (
                                <Button asChild className="shadow-green">
                                    <Link href="/cms/blog/create">
                                        <FilePlus className="mr-2 h-4 w-4" />
                                        Write Your First Article
                                    </Link>
                                </Button>
                            ) : undefined
                        }
                    />
                ) : filteredPosts.length === 0 ? (
                    <EmptyState
                        icon={Search}
                        title="No matching articles found"
                        description="No articles match your current search or filter settings."
                        action={
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Search & Filters
                            </Button>
                        }
                    />
                ) : viewMode === 'table' ? (
                    <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/30">
                                        <th className="w-10 px-4 py-3.5 text-left">
                                            <input
                                                type="checkbox"
                                                checked={allFilteredSelected}
                                                onChange={toggleSelectAll}
                                                className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
                                                aria-label="Select all articles"
                                            />
                                        </th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Article
                                        </th>
                                        <th className="hidden px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase md:table-cell">
                                            Category
                                        </th>
                                        <th className="hidden px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase lg:table-cell">
                                            Author
                                        </th>
                                        <th className="hidden px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:table-cell">
                                            Date
                                        </th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredPosts.map((post) => {
                                        const authorName = getAuthorName(post);
                                        const isSelected = selectedIds.includes(
                                            post.id,
                                        );

                                        return (
                                            <tr
                                                key={post.id}
                                                className={`group transition-colors hover:bg-muted/20 ${isSelected ? 'bg-primary/5' : ''}`}
                                            >
                                                <td className="px-4 py-4 align-middle">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            toggleSelectOne(
                                                                post.id,
                                                            )
                                                        }
                                                        className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
                                                        aria-label={`Select ${post.title}`}
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex max-w-md items-center gap-3.5">
                                                        {post.featured_image ? (
                                                            <img
                                                                src={
                                                                    post.featured_image
                                                                }
                                                                alt={post.title}
                                                                className="h-11 w-14 shrink-0 rounded-lg border border-border/60 bg-muted object-cover"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    (
                                                                        e.currentTarget as HTMLImageElement
                                                                    ).src =
                                                                        '/exterior.jpg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                                                                <ImageIcon className="h-4.5 w-4.5 text-primary/70" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                                                <Link
                                                                    href={`/cms/blog/${post.id}/edit`}
                                                                    className="truncate transition-colors hover:text-primary"
                                                                >
                                                                    {post.title}
                                                                </Link>
                                                                {post.is_featured && (
                                                                    <Badge
                                                                        className="shrink-0 border-amber-500/25 bg-amber-500/10 text-[10px] font-extrabold tracking-wider text-amber-600 uppercase dark:text-amber-400"
                                                                        variant="outline"
                                                                    >
                                                                        <Star className="mr-1 h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                                                                        Featured
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {post.excerpt && (
                                                                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                                                    {
                                                                        post.excerpt
                                                                    }
                                                                </p>
                                                            )}
                                                            <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground/80">
                                                                <span className="max-w-[180px] truncate">
                                                                    /{post.slug}
                                                                </span>
                                                                {post.read_time && (
                                                                    <>
                                                                        <span>
                                                                            ·
                                                                        </span>
                                                                        <span className="font-sans">
                                                                            {
                                                                                post.read_time
                                                                            }
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden px-4 py-4 md:table-cell">
                                                    {post.category ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs font-semibold"
                                                            style={{
                                                                borderColor: `${post.category.color}40`,
                                                                color: post
                                                                    .category
                                                                    .color,
                                                                backgroundColor: `${post.category.color}10`,
                                                            }}
                                                        >
                                                            {post.category.name}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground/60">
                                                            Uncategorized
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="hidden px-4 py-4 lg:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                                                            {getInitials(
                                                                authorName,
                                                            )}
                                                        </div>
                                                        <span className="max-w-[130px] truncate text-xs font-medium text-foreground/90">
                                                            {authorName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="hidden px-4 py-4 sm:table-cell">
                                                    <div className="text-xs font-medium text-foreground/90">
                                                        {new Date(
                                                            post.published_at ||
                                                                post.created_at,
                                                        ).toLocaleDateString(
                                                            'en-US',
                                                            {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {post.is_published
                                                            ? 'Published'
                                                            : 'Created'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            !canEdit ||
                                                            togglingId ===
                                                                post.id
                                                        }
                                                        onClick={() =>
                                                            handleTogglePublish(
                                                                post,
                                                            )
                                                        }
                                                        title={
                                                            canEdit
                                                                ? post.is_published
                                                                    ? 'Click to unpublish (move to draft)'
                                                                    : 'Click to publish on website'
                                                                : undefined
                                                        }
                                                        className={
                                                            canEdit
                                                                ? 'cursor-pointer transition-opacity hover:opacity-80'
                                                                : ''
                                                        }
                                                    >
                                                        <StatusBadge
                                                            status={
                                                                post.is_published
                                                                    ? 'published'
                                                                    : 'draft'
                                                            }
                                                        />
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {canEdit && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={`h-8 w-8 ${
                                                                    post.is_featured
                                                                        ? 'text-amber-500 hover:text-amber-600'
                                                                        : 'text-muted-foreground hover:text-amber-500'
                                                                }`}
                                                                disabled={
                                                                    togglingId ===
                                                                    post.id
                                                                }
                                                                onClick={() =>
                                                                    handleToggleFeatured(
                                                                        post,
                                                                    )
                                                                }
                                                                title={
                                                                    post.is_featured
                                                                        ? 'Remove from featured'
                                                                        : 'Mark as featured'
                                                                }
                                                            >
                                                                <Star
                                                                    className={`h-4 w-4 ${post.is_featured ? 'fill-amber-500' : ''}`}
                                                                />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                            asChild
                                                            title="Preview article on website"
                                                        >
                                                            <Link
                                                                href={`/blog/${post.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        {canEdit && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                                asChild
                                                                title="Edit article"
                                                            >
                                                                <Link
                                                                    href={`/cms/blog/${post.id}/edit`}
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        )}
                                                        {canDelete && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                                onClick={() =>
                                                                    setDeleteTarget(
                                                                        post,
                                                                    )
                                                                }
                                                                title="Delete article"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Grid / Card View */
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPosts.map((post) => {
                            const authorName = getAuthorName(post);

                            return (
                                <div
                                    key={post.id}
                                    className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs transition-all hover:shadow-md"
                                >
                                    <div>
                                        <div className="relative h-44 overflow-hidden border-b border-border/40 bg-muted">
                                            {post.featured_image ? (
                                                <img
                                                    src={post.featured_image}
                                                    alt={post.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        (
                                                            e.currentTarget as HTMLImageElement
                                                        ).src = '/exterior.jpg';
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center bg-primary/5 text-muted-foreground">
                                                    <BookOpen className="mb-1 h-8 w-8 text-primary/40" />
                                                    <span className="text-xs">
                                                        No cover image
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                                <StatusBadge
                                                    status={
                                                        post.is_published
                                                            ? 'published'
                                                            : 'draft'
                                                    }
                                                />
                                                {post.is_featured && (
                                                    <Badge className="border-none bg-amber-500 text-[10px] font-bold text-white">
                                                        <Star className="mr-1 h-2.5 w-2.5 fill-white" />
                                                        Featured
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3 p-5">
                                            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                                                {post.category ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[11px] font-semibold"
                                                        style={{
                                                            borderColor: `${post.category.color}40`,
                                                            color: post.category
                                                                .color,
                                                            backgroundColor: `${post.category.color}10`,
                                                        }}
                                                    >
                                                        {post.category.name}
                                                    </Badge>
                                                ) : (
                                                    <span>Uncategorized</span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {post.read_time ||
                                                        '5 min read'}
                                                </span>
                                            </div>

                                            <h3 className="line-clamp-2 text-base font-bold text-foreground transition-colors group-hover:text-primary">
                                                <Link
                                                    href={`/cms/blog/${post.id}/edit`}
                                                >
                                                    {post.title}
                                                </Link>
                                            </h3>

                                            {post.excerpt && (
                                                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 border-t border-border/50 bg-muted/15 px-5 py-3.5">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                                                {getInitials(authorName)}
                                            </div>
                                            <div className="truncate">
                                                <div className="truncate text-xs font-medium text-foreground">
                                                    {authorName}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {new Date(
                                                        post.published_at ||
                                                            post.created_at,
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-1">
                                            {canEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-xs"
                                                    onClick={() =>
                                                        handleTogglePublish(
                                                            post,
                                                        )
                                                    }
                                                >
                                                    {post.is_published
                                                        ? 'Unpublish'
                                                        : 'Publish'}
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                asChild
                                                title="Preview"
                                            >
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </Link>
                                            </Button>
                                            {canEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    asChild
                                                    title="Edit"
                                                >
                                                    <Link
                                                        href={`/cms/blog/${post.id}/edit`}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {canDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                    onClick={() =>
                                                        setDeleteTarget(post)
                                                    }
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Single Article Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Delete article permanently?"
                description={
                    deleteTarget?.is_published
                        ? `Warning: "${deleteTarget?.title}" is currently PUBLISHED and live on the Panda Towers website. Deleting it will immediately remove it from the website. This action cannot be undone.`
                        : `Are you sure you want to permanently delete the draft "${deleteTarget?.title}"? This action cannot be undone.`
                }
                confirmText="Delete Article"
                variant="destructive"
                isLoading={isDeleting}
                onConfirm={() => {
                    if (deleteTarget) {
                        setIsDeleting(true);
                        router.delete(`/cms/blog/${deleteTarget.id}`, {
                            preserveScroll: true,
                            onSuccess: () => {
                                setSelectedIds((prev) =>
                                    prev.filter((id) => id !== deleteTarget.id),
                                );
                                setDeleteTarget(null);
                            },
                            onFinish: () => setIsDeleting(false),
                        });
                    }
                }}
            />

            {/* Bulk Delete Confirmation */}
            <ConfirmDialog
                open={bulkDeleteOpen}
                onOpenChange={setBulkDeleteOpen}
                title={`Delete ${selectedIds.length} selected article(s)?`}
                description={`Are you sure you want to permanently delete ${selectedIds.length} selected article(s)? Any published articles in this selection will be immediately removed from the live website.`}
                confirmText={`Delete ${selectedIds.length} Article(s)`}
                variant="destructive"
                isLoading={isDeleting}
                onConfirm={() => handleBulkAction('delete')}
            />

            {/* Step-by-Step Administrator User Guide Modal */}
            <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
                <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Administrator Guide: Managing Blog Articles
                        </DialogTitle>
                        <DialogDescription>
                            Step-by-step instructions for creating, uploading
                            images, publishing, editing, and deleting website
                            articles.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2 text-sm">
                        <div className="space-y-1.5 rounded-xl border border-border bg-muted/20 p-4">
                            <h4 className="flex items-center gap-2 font-bold text-foreground">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                    1
                                </span>
                                Creating a New Article
                            </h4>
                            <p className="pl-8 text-xs leading-relaxed text-muted-foreground">
                                Click the green <strong>"New Article"</strong>{' '}
                                button in the top-right corner. Enter the{' '}
                                <strong>Title</strong> (the URL slug and reading
                                time are generated automatically), choose or
                                type an <strong>Author</strong>, select a{' '}
                                <strong>Category</strong>, write a short{' '}
                                <strong>Excerpt</strong> summary, and compose
                                the full article in the{' '}
                                <strong>Content Body</strong> editor.
                            </p>
                        </div>

                        <div className="space-y-1.5 rounded-xl border border-border bg-muted/20 p-4">
                            <h4 className="flex items-center gap-2 font-bold text-foreground">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                    2
                                </span>
                                Uploading & Selecting Images
                            </h4>
                            <p className="pl-8 text-xs leading-relaxed text-muted-foreground">
                                Under <strong>Featured Cover Image</strong>,
                                drag and drop an image file (JPG, PNG, WebP, or
                                GIF up to 10MB) or click{' '}
                                <strong>"Upload File"</strong>. You can also
                                click <strong>"Browse Library"</strong> to reuse
                                previously uploaded images. To insert images
                                inside the article body, click the{' '}
                                <strong>Image icon</strong> in the content
                                editor toolbar.
                            </p>
                        </div>

                        <div className="space-y-1.5 rounded-xl border border-border bg-muted/20 p-4">
                            <h4 className="flex items-center gap-2 font-bold text-foreground">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                    3
                                </span>
                                Publishing & Unpublishing Articles
                            </h4>
                            <p className="pl-8 text-xs leading-relaxed text-muted-foreground">
                                Toggle <strong>"Publish on website"</strong> ON
                                to make the article immediately live on the
                                Panda Towers Blogs page, or leave it OFF to save
                                as a <strong>Draft</strong>. From the Blog
                                dashboard table, you can also click any
                                article's <strong>Published / Draft</strong>{' '}
                                status badge to toggle its live status in one
                                click. Toggle{' '}
                                <strong>"Featured article"</strong> (or click
                                the star icon) to pin the article at the top of
                                the blog page.
                            </p>
                        </div>

                        <div className="space-y-1.5 rounded-xl border border-border bg-muted/20 p-4">
                            <h4 className="flex items-center gap-2 font-bold text-foreground">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                    4
                                </span>
                                Editing & Previewing Articles
                            </h4>
                            <p className="pl-8 text-xs leading-relaxed text-muted-foreground">
                                Click an article's title or the{' '}
                                <strong>Pencil (Edit)</strong> icon to update
                                its content, image, category, or SEO metadata.
                                Click <strong>"Preview Article"</strong> inside
                                the editor (or the external link icon in the
                                table) to view how the article looks on the
                                Panda Towers website.
                            </p>
                        </div>

                        <div className="space-y-1.5 rounded-xl border border-border bg-muted/20 p-4">
                            <h4 className="flex items-center gap-2 font-bold text-foreground">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                    5
                                </span>
                                Deleting Articles Safely
                            </h4>
                            <p className="pl-8 text-xs leading-relaxed text-muted-foreground">
                                Click the red <strong>Trash (Delete)</strong>{' '}
                                icon next to an article and confirm the prompt.
                                If you want to hide an article temporarily
                                without losing its content, simply{' '}
                                <strong>Unpublish</strong> it instead of
                                deleting it.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <Button variant="outline" asChild>
                            <a
                                href="/cms/blog/guide-pdf"
                                download="Panda-Towers-Blog-Admin-Guide.pdf"
                            >
                                <Download className="mr-1.5 h-4 w-4 text-primary" />
                                Download PDF Guide
                            </a>
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setGuideOpen(false)}
                            >
                                Close Guide
                            </Button>
                            {canCreate && (
                                <Button
                                    asChild
                                    onClick={() => setGuideOpen(false)}
                                >
                                    <Link href="/cms/blog/create">
                                        <FilePlus className="mr-1.5 h-4 w-4" />
                                        Create Article Now
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
