import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    CheckSquare,
    Clock,
    Download,
    ExternalLink,
    Eye,
    EyeOff,
    FilePlus,
    FileText,
    Filter,
    HelpCircle,
    Image as ImageIcon,
    LayoutGrid,
    List,
    Pencil,
    Search,
    Sparkles,
    Star,
    Tag,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageHeader } from '@/components/page-header';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { ConfirmDialog } from '@/components/confirm-dialog';
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

export default function BlogIndex({ posts, categories }: { posts: Post[]; categories: Category[] }) {
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
                if (statusFilter === 'published' && !post.is_published) return false;
                if (statusFilter === 'draft' && post.is_published) return false;
                if (statusFilter === 'featured' && !post.is_featured) return false;

                if (categoryFilter !== 'all') {
                    if (categoryFilter === 'uncategorized') {
                        if (post.blog_category_id) return false;
                    } else if (String(post.blog_category_id) !== categoryFilter) {
                        return false;
                    }
                }

                if (query) {
                    const authorName = (post.author_name || post.author?.name || '').toLowerCase();
                    const catName = (post.category?.name || '').toLowerCase();
                    const matches =
                        post.title.toLowerCase().includes(query) ||
                        post.slug.toLowerCase().includes(query) ||
                        (post.excerpt || '').toLowerCase().includes(query) ||
                        authorName.includes(query) ||
                        catName.includes(query);
                    if (!matches) return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'title') {
                    return a.title.localeCompare(b.title);
                }
                if (sortBy === 'oldest') {
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                }
                if (sortBy === 'published_at') {
                    const dateA = new Date(a.published_at || a.created_at).getTime();
                    const dateB = new Date(b.published_at || b.created_at).getTime();
                    return dateB - dateA;
                }
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
    }, [posts, search, statusFilter, categoryFilter, sortBy]);

    const allFilteredSelected =
        filteredPosts.length > 0 && filteredPosts.every((p) => selectedIds.includes(p.id));

    const toggleSelectAll = () => {
        if (allFilteredSelected) {
            setSelectedIds((prev) => prev.filter((id) => !filteredPosts.some((p) => p.id === id)));
        } else {
            const newIds = new Set([...selectedIds, ...filteredPosts.map((p) => p.id)]);
            setSelectedIds(Array.from(newIds));
        }
    };

    const toggleSelectOne = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const handleTogglePublish = (post: Post) => {
        if (!canEdit) return;
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
        if (!canEdit) return;
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
        if (selectedIds.length === 0) return;
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

    const getAuthorName = (post: Post) => post.author_name || post.author?.name || 'Panda Towers Team';
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
            <div className="space-y-6 animate-in fade-in-50 duration-200">
                <PageHeader
                    icon={BookOpen}
                    title="Blog & Articles"
                    description="Create, edit, publish, and manage articles displayed on the Panda Towers website."
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="outline" size="sm" asChild className="h-9 hover:bg-muted/50">
                                <a href="/cms/blog/guide-pdf" download="Panda-Towers-Blog-Admin-Guide.pdf">
                                    <Download className="h-4 w-4 mr-1.5 text-primary" />
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
                            <Button variant="outline" size="sm" asChild className="h-9 hover:bg-muted/50">
                                <Link href="/blog" target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-1.5" />
                                    Live Website Blog
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="h-9 hover:bg-muted/50">
                                <Link href="/cms/blog-categories">
                                    <Tag className="h-4 w-4 mr-1.5" />
                                    Categories ({categories.length})
                                </Link>
                            </Button>
                            {canCreate && (
                                <Button asChild size="sm" className="h-9 shadow-green hover:scale-[1.02] transition-transform">
                                    <Link href="/cms/blog/create">
                                        <FilePlus className="h-4 w-4 mr-1.5" />
                                        New Article
                                    </Link>
                                </Button>
                            )}
                        </div>
                    }
                />

                {/* Summary Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        type="button"
                        onClick={() => setStatusFilter('all')}
                        className={`text-left rounded-xl border p-4 transition-all ${
                            statusFilter === 'all'
                                ? 'border-primary bg-primary/5 shadow-xs'
                                : 'border-border/60 bg-card hover:border-primary/40'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Articles</span>
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <BookOpen className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-foreground mt-2">{stats.total}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">All articles in CMS</div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('published')}
                        className={`text-left rounded-xl border p-4 transition-all ${
                            statusFilter === 'published'
                                ? 'border-emerald-500 bg-emerald-500/5 shadow-xs'
                                : 'border-border/60 bg-card hover:border-emerald-500/40'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Published</span>
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Eye className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-foreground mt-2">{stats.published}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Visible on website</div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('draft')}
                        className={`text-left rounded-xl border p-4 transition-all ${
                            statusFilter === 'draft'
                                ? 'border-amber-500 bg-amber-500/5 shadow-xs'
                                : 'border-border/60 bg-card hover:border-amber-500/40'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Drafts</span>
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <EyeOff className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-foreground mt-2">{stats.drafts}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Unpublished drafts</div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('featured')}
                        className={`text-left rounded-xl border p-4 transition-all ${
                            statusFilter === 'featured'
                                ? 'border-copper bg-copper/5 shadow-xs'
                                : 'border-border/60 bg-card hover:border-copper/40'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Featured</span>
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                                <Star className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-foreground mt-2">{stats.featured}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Pinned spotlight posts</div>
                    </button>
                </div>

                {/* Search, Filter & View Controls */}
                {posts.length > 0 && (
                    <div className="rounded-xl border border-border/60 bg-card p-4 shadow-xs space-y-3">
                        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                            {/* Search Input */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by title, excerpt, author, or category..."
                                    className="pl-9 pr-8 h-9 text-sm"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Filters & View Mode */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="h-9 w-[170px] text-xs">
                                        <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="uncategorized">Uncategorized</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                                    <SelectTrigger className="h-9 w-[155px] text-xs">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest Created</SelectItem>
                                        <SelectItem value="published_at">Published Date</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="title">Title (A–Z)</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/30">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('table')}
                                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                                            viewMode === 'table'
                                                ? 'bg-background text-foreground shadow-2xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                        title="Table View"
                                    >
                                        <List className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Table</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('grid')}
                                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                                            viewMode === 'grid'
                                                ? 'bg-background text-foreground shadow-2xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                        title="Grid View"
                                    >
                                        <LayoutGrid className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Cards</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filter Summary */}
                        {(search || statusFilter !== 'all' || categoryFilter !== 'all') && (
                            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                                <div className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
                                    <span>
                                        Showing <strong className="text-foreground">{filteredPosts.length}</strong> of {posts.length} articles
                                    </span>
                                    {statusFilter !== 'all' && (
                                        <Badge variant="secondary" className="text-[11px] capitalize">
                                            Status: {statusFilter}
                                        </Badge>
                                    )}
                                    {categoryFilter !== 'all' && (
                                        <Badge variant="secondary" className="text-[11px]">
                                            Category: {categories.find((c) => String(c.id) === categoryFilter)?.name ?? 'Uncategorized'}
                                        </Badge>
                                    )}
                                </div>
                                <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={clearFilters}>
                                    Reset Filters
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Bulk Action Bar */}
                {selectedIds.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 animate-in slide-in-from-top-2 duration-150">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <CheckSquare className="h-4 w-4 text-primary" />
                            <span>
                                {selectedIds.length} article{selectedIds.length !== 1 ? 's' : ''} selected
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {canEdit && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-xs bg-background"
                                        disabled={isDeleting}
                                        onClick={() => handleBulkAction('publish')}
                                    >
                                        <Eye className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                                        Publish Selected
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-xs bg-background"
                                        disabled={isDeleting}
                                        onClick={() => handleBulkAction('unpublish')}
                                    >
                                        <EyeOff className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
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
                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
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
                                        <FilePlus className="h-4 w-4 mr-2" />
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
                    <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/30">
                                        <th className="w-10 px-4 py-3.5 text-left">
                                            <input
                                                type="checkbox"
                                                checked={allFilteredSelected}
                                                onChange={toggleSelectAll}
                                                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                                                aria-label="Select all articles"
                                            />
                                        </th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Article
                                        </th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                                            Category
                                        </th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                                            Author
                                        </th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                                            Date
                                        </th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredPosts.map((post) => {
                                        const authorName = getAuthorName(post);
                                        const isSelected = selectedIds.includes(post.id);
                                        return (
                                            <tr
                                                key={post.id}
                                                className={`hover:bg-muted/20 transition-colors group ${isSelected ? 'bg-primary/5' : ''}`}
                                            >
                                                <td className="px-4 py-4 align-middle">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleSelectOne(post.id)}
                                                        className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                                                        aria-label={`Select ${post.title}`}
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3.5 max-w-md">
                                                        {post.featured_image ? (
                                                            <img
                                                                src={post.featured_image}
                                                                alt={post.title}
                                                                className="w-14 h-11 rounded-lg object-cover shrink-0 border border-border/60 bg-muted"
                                                                onError={(e) => {
                                                                    (e.currentTarget as HTMLImageElement).src = '/exterior.jpg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-14 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                                                <ImageIcon className="h-4.5 w-4.5 text-primary/70" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-bold text-sm text-foreground flex items-center gap-2">
                                                                <Link
                                                                    href={`/cms/blog/${post.id}/edit`}
                                                                    className="truncate hover:text-primary transition-colors"
                                                                >
                                                                    {post.title}
                                                                </Link>
                                                                {post.is_featured && (
                                                                    <Badge
                                                                        className="text-[10px] uppercase font-extrabold tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 shrink-0"
                                                                        variant="outline"
                                                                    >
                                                                        <Star className="h-2.5 w-2.5 mr-1 fill-amber-500 text-amber-500" />
                                                                        Featured
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {post.excerpt && (
                                                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                                    {post.excerpt}
                                                                </p>
                                                            )}
                                                            <div className="text-[11px] text-muted-foreground/80 mt-0.5 flex items-center gap-2 font-mono">
                                                                <span className="truncate max-w-[180px]">/{post.slug}</span>
                                                                {post.read_time && (
                                                                    <>
                                                                        <span>·</span>
                                                                        <span className="font-sans">{post.read_time}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden md:table-cell">
                                                    {post.category ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs font-semibold"
                                                            style={{
                                                                borderColor: `${post.category.color}40`,
                                                                color: post.category.color,
                                                                backgroundColor: `${post.category.color}10`,
                                                            }}
                                                        >
                                                            {post.category.name}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground/60">Uncategorized</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 hidden lg:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                                                            {getInitials(authorName)}
                                                        </div>
                                                        <span className="text-xs font-medium text-foreground/90 truncate max-w-[130px]">
                                                            {authorName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden sm:table-cell">
                                                    <div className="text-xs text-foreground/90 font-medium">
                                                        {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {post.is_published ? 'Published' : 'Created'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        type="button"
                                                        disabled={!canEdit || togglingId === post.id}
                                                        onClick={() => handleTogglePublish(post)}
                                                        title={
                                                            canEdit
                                                                ? post.is_published
                                                                    ? 'Click to unpublish (move to draft)'
                                                                    : 'Click to publish on website'
                                                                : undefined
                                                        }
                                                        className={canEdit ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
                                                    >
                                                        <StatusBadge status={post.is_published ? 'published' : 'draft'} />
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
                                                                disabled={togglingId === post.id}
                                                                onClick={() => handleToggleFeatured(post)}
                                                                title={post.is_featured ? 'Remove from featured' : 'Mark as featured'}
                                                            >
                                                                <Star className={`h-4 w-4 ${post.is_featured ? 'fill-amber-500' : ''}`} />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                            asChild
                                                            title="Preview article on website"
                                                        >
                                                            <Link href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
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
                                                                <Link href={`/cms/blog/${post.id}/edit`}>
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        )}
                                                        {canDelete && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                                onClick={() => setDeleteTarget(post)}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredPosts.map((post) => {
                            const authorName = getAuthorName(post);
                            return (
                                <div
                                    key={post.id}
                                    className="group rounded-xl border border-border/60 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="relative h-44 bg-muted overflow-hidden border-b border-border/40">
                                            {post.featured_image ? (
                                                <img
                                                    src={post.featured_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src = '/exterior.jpg';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-muted-foreground">
                                                    <BookOpen className="h-8 w-8 text-primary/40 mb-1" />
                                                    <span className="text-xs">No cover image</span>
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                                <StatusBadge status={post.is_published ? 'published' : 'draft'} />
                                                {post.is_featured && (
                                                    <Badge className="bg-amber-500 text-white border-none text-[10px] font-bold">
                                                        <Star className="h-2.5 w-2.5 mr-1 fill-white" />
                                                        Featured
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-3">
                                            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                                                {post.category ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[11px] font-semibold"
                                                        style={{
                                                            borderColor: `${post.category.color}40`,
                                                            color: post.category.color,
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
                                                    {post.read_time || '5 min read'}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                                <Link href={`/cms/blog/${post.id}/edit`}>{post.title}</Link>
                                            </h3>

                                            {post.excerpt && (
                                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="px-5 py-3.5 border-t border-border/50 bg-muted/15 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                                                {getInitials(authorName)}
                                            </div>
                                            <div className="truncate">
                                                <div className="text-xs font-medium text-foreground truncate">{authorName}</div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            {canEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-xs"
                                                    onClick={() => handleTogglePublish(post)}
                                                >
                                                    {post.is_published ? 'Unpublish' : 'Publish'}
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-7 w-7" asChild title="Preview">
                                                <Link href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </Link>
                                            </Button>
                                            {canEdit && (
                                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild title="Edit">
                                                    <Link href={`/cms/blog/${post.id}/edit`}>
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {canDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                    onClick={() => setDeleteTarget(post)}
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
                                setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
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
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Administrator Guide: Managing Blog Articles
                        </DialogTitle>
                        <DialogDescription>
                            Step-by-step instructions for creating, uploading images, publishing, editing, and deleting website articles.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2 text-sm">
                        <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-1.5">
                            <h4 className="font-bold text-foreground flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">1</span>
                                Creating a New Article
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                Click the green <strong>"New Article"</strong> button in the top-right corner. Enter the <strong>Title</strong> (the URL slug and reading time are generated automatically), choose or type an <strong>Author</strong>, select a <strong>Category</strong>, write a short <strong>Excerpt</strong> summary, and compose the full article in the <strong>Content Body</strong> editor.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-1.5">
                            <h4 className="font-bold text-foreground flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">2</span>
                                Uploading & Selecting Images
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                Under <strong>Featured Cover Image</strong>, drag and drop an image file (JPG, PNG, WebP, or GIF up to 10MB) or click <strong>"Upload File"</strong>. You can also click <strong>"Browse Library"</strong> to reuse previously uploaded images. To insert images inside the article body, click the <strong>Image icon</strong> in the content editor toolbar.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-1.5">
                            <h4 className="font-bold text-foreground flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">3</span>
                                Publishing & Unpublishing Articles
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                Toggle <strong>"Publish on website"</strong> ON to make the article immediately live on the Panda Towers Blogs page, or leave it OFF to save as a <strong>Draft</strong>. From the Blog dashboard table, you can also click any article's <strong>Published / Draft</strong> status badge to toggle its live status in one click. Toggle <strong>"Featured article"</strong> (or click the star icon) to pin the article at the top of the blog page.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-1.5">
                            <h4 className="font-bold text-foreground flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">4</span>
                                Editing & Previewing Articles
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                Click an article's title or the <strong>Pencil (Edit)</strong> icon to update its content, image, category, or SEO metadata. Click <strong>"Preview Article"</strong> inside the editor (or the external link icon in the table) to view how the article looks on the Panda Towers website.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-1.5">
                            <h4 className="font-bold text-foreground flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">5</span>
                                Deleting Articles Safely
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                Click the red <strong>Trash (Delete)</strong> icon next to an article and confirm the prompt. If you want to hide an article temporarily without losing its content, simply <strong>Unpublish</strong> it instead of deleting it.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <Button variant="outline" asChild>
                            <a href="/cms/blog/guide-pdf" download="Panda-Towers-Blog-Admin-Guide.pdf">
                                <Download className="h-4 w-4 mr-1.5 text-primary" />
                                Download PDF Guide
                            </a>
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setGuideOpen(false)}>
                                Close Guide
                            </Button>
                            {canCreate && (
                                <Button asChild onClick={() => setGuideOpen(false)}>
                                    <Link href="/cms/blog/create">
                                        <FilePlus className="h-4 w-4 mr-1.5" />
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
