import { Head, router, useForm } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    CheckSquare,
    Clock,
    Eye,
    EyeOff,
    Globe,
    Image as ImageIcon,
    LayoutGrid,
    List,
    Mail,
    MapPin,
    MessageSquare,
    Pencil,
    Phone,
    Plus,
    Search,
    ShieldCheck,
    Star,
    Trash2,
    X,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { MediaPicker } from '@/components/media-picker';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { usePermission } from '@/hooks/use-permission';

export interface Testimonial {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
    role?: string | null;
    location?: string | null;
    avatar?: string | null;
    testimonial: string;
    photos?: string[] | null;
    rating: number;
    investment_amount?: string | null;
    monthly_income?: string | null;
    years_investing?: number | null;
    order: number;
    status?: 'pending' | 'approved' | 'rejected';
    is_active: boolean;
    source?: 'website' | 'cms' | string;
    approved_at?: string | null;
    created_at?: string;
}

interface Stat {
    id: number;
    icon?: string;
    value: string;
    label: string;
    description?: string;
}

type StatusFilter =
    | 'all'
    | 'pending'
    | 'published'
    | 'approved_unpublished'
    | 'rejected';

type SortOption =
    | 'default'
    | 'newest'
    | 'oldest'
    | 'rating_high'
    | 'rating_low'
    | 'order';

const RATING_STEPS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

const emptyForm = {
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    location: '',
    avatar: '',
    testimonial: '',
    photos: ['', '', ''] as string[],
    rating: 5,
    investment_amount: '',
    monthly_income: '',
    years_investing: 1,
    order: 0,
    status: 'approved' as 'pending' | 'approved' | 'rejected',
    is_active: true,
};

function formatRelativeTime(dateStr?: string | null): string {
    if (!dateStr) {
        return 'Recently';
    }

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
        return 'Recently';
    }

    const diffSeconds = Math.max(
        0,
        Math.floor((Date.now() - date.getTime()) / 1000),
    );

    if (diffSeconds < 60) {
        return 'Just now';
    }

    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffMinutes < 60) {
        return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }

    const diffDays = Math.floor(diffHours / 24);

    if (diffDays < 30) {
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }

    const diffMonths = Math.floor(diffDays / 30);

    if (diffMonths < 12) {
        return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    }

    const diffYears = Math.floor(diffDays / 365);

    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
}

function StarRatingDisplay({
    rating,
    size = 'sm',
}: {
    rating: number;
    size?: 'sm' | 'md';
}) {
    const dim = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const fill = Math.min(1, Math.max(0, rating - (star - 1)));

                return (
                    <span key={star} className={`relative inline-block ${dim}`}>
                        <Star
                            className={`${dim} text-muted-foreground/30`}
                            aria-hidden="true"
                        />
                        {fill > 0 && (
                            <span
                                className="absolute top-0 left-0 overflow-hidden"
                                style={{ width: `${fill * 100}%` }}
                            >
                                <Star
                                    className={`${dim} fill-amber-400 text-amber-400`}
                                    aria-hidden="true"
                                />
                            </span>
                        )}
                    </span>
                );
            })}
            <span className="ml-1 text-xs font-semibold text-foreground/80">
                {Number(rating).toFixed(1)}
            </span>
        </div>
    );
}

export default function TestimonialsIndex({
    testimonials,
    stats,
}: {
    testimonials: Testimonial[];
    stats: Stat[];
}) {
    const { can } = usePermission();
    const canCreate = can('testimonials.create');
    const canEdit = can('testimonials.edit');
    const canDelete = can('testimonials.delete');

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [ratingFilter, setRatingFilter] = useState<string>('all');
    const [sourceFilter, setSourceFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [viewing, setViewing] = useState<Testimonial | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);

    const addForm = useForm({ ...emptyForm });
    const editForm = useForm({ ...emptyForm });

    const counts = useMemo(() => {
        const total = testimonials.length;
        const pending = testimonials.filter(
            (t) => (t.status ?? 'approved') === 'pending',
        ).length;
        const published = testimonials.filter(
            (t) => (t.status ?? 'approved') === 'approved' && t.is_active,
        ).length;
        const approvedUnpublished = testimonials.filter(
            (t) => (t.status ?? 'approved') === 'approved' && !t.is_active,
        ).length;
        const rejected = testimonials.filter(
            (t) => t.status === 'rejected',
        ).length;

        return {
            total,
            pending,
            published,
            approvedUnpublished,
            rejected,
        };
    }, [testimonials]);

    const filteredTestimonials = useMemo(() => {
        const query = search.trim().toLowerCase();

        return testimonials
            .filter((t) => {
                const status = t.status ?? 'approved';

                if (statusFilter === 'pending' && status !== 'pending') {
                    return false;
                }

                if (
                    statusFilter === 'published' &&
                    !(status === 'approved' && t.is_active)
                ) {
                    return false;
                }

                if (
                    statusFilter === 'approved_unpublished' &&
                    !(status === 'approved' && !t.is_active)
                ) {
                    return false;
                }

                if (statusFilter === 'rejected' && status !== 'rejected') {
                    return false;
                }

                if (ratingFilter !== 'all') {
                    if (ratingFilter === '4.5_up') {
                        if (t.rating < 4.5) {
                            return false;
                        }
                    } else if (ratingFilter === '4_up') {
                        if (t.rating < 4) {
                            return false;
                        }
                    } else if (ratingFilter === '3.5_below') {
                        if (t.rating > 3.5) {
                            return false;
                        }
                    }
                }

                if (sourceFilter !== 'all') {
                    const src = t.source ?? 'cms';

                    if (src !== sourceFilter) {
                        return false;
                    }
                }

                if (query) {
                    const matches =
                        t.name.toLowerCase().includes(query) ||
                        (t.email ?? '').toLowerCase().includes(query) ||
                        (t.phone ?? '').toLowerCase().includes(query) ||
                        (t.company ?? '').toLowerCase().includes(query) ||
                        (t.role ?? '').toLowerCase().includes(query) ||
                        (t.location ?? '').toLowerCase().includes(query) ||
                        t.testimonial.toLowerCase().includes(query);

                    if (!matches) {
                        return false;
                    }
                }

                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'newest') {
                    return (
                        new Date(b.created_at ?? 0).getTime() -
                        new Date(a.created_at ?? 0).getTime()
                    );
                }

                if (sortBy === 'oldest') {
                    return (
                        new Date(a.created_at ?? 0).getTime() -
                        new Date(b.created_at ?? 0).getTime()
                    );
                }

                if (sortBy === 'rating_high') {
                    return b.rating - a.rating;
                }

                if (sortBy === 'rating_low') {
                    return a.rating - b.rating;
                }

                if (sortBy === 'order') {
                    return a.order - b.order;
                }

                return 0;
            });
    }, [
        testimonials,
        search,
        statusFilter,
        ratingFilter,
        sourceFilter,
        sortBy,
    ]);

    const allFilteredSelected =
        filteredTestimonials.length > 0 &&
        filteredTestimonials.every((t) => selectedIds.includes(t.id));

    const toggleSelectAll = () => {
        if (allFilteredSelected) {
            setSelectedIds((prev) =>
                prev.filter(
                    (id) => !filteredTestimonials.some((t) => t.id === id),
                ),
            );
        } else {
            const merged = new Set([
                ...selectedIds,
                ...filteredTestimonials.map((t) => t.id),
            ]);
            setSelectedIds(Array.from(merged));
        }
    };

    const toggleSelectOne = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setRatingFilter('all');
        setSourceFilter('all');
        setSortBy('default');
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/cms/testimonials', {
            preserveScroll: true,
            onSuccess: () => {
                setShowAdd(false);
                addForm.reset();
            },
        });
    };

    const openEdit = (t: Testimonial) => {
        setViewing(null);
        setShowAdd(false);
        setEditing(t);
        const existingPhotos = Array.isArray(t.photos) ? t.photos : [];
        editForm.setData({
            name: t.name,
            email: t.email ?? '',
            phone: t.phone ?? '',
            company: t.company ?? '',
            role: t.role ?? '',
            location: t.location ?? '',
            avatar: t.avatar ?? '',
            testimonial: t.testimonial,
            photos: [
                existingPhotos[0] ?? '',
                existingPhotos[1] ?? '',
                existingPhotos[2] ?? '',
            ],
            rating: Number(t.rating) || 5,
            investment_amount: t.investment_amount ?? '',
            monthly_income: t.monthly_income ?? '',
            years_investing: t.years_investing ?? 1,
            order: t.order,
            status: t.status ?? 'approved',
            is_active: t.is_active,
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editing) {
            return;
        }

        editForm.put(`/cms/testimonials/${editing.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditing(null),
        });
    };

    const handleApprove = (t: Testimonial, publish = true) => {
        if (!canEdit) {
            return;
        }

        setProcessingId(t.id);
        router.patch(
            `/cms/testimonials/${t.id}/approve`,
            { publish },
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessingId(null);
                    setViewing(null);
                },
            },
        );
    };

    const handleReject = (t: Testimonial) => {
        if (!canEdit) {
            return;
        }

        setProcessingId(t.id);
        router.patch(
            `/cms/testimonials/${t.id}/reject`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessingId(null);
                    setViewing(null);
                },
            },
        );
    };

    const handleTogglePublish = (t: Testimonial) => {
        if (!canEdit) {
            return;
        }

        setProcessingId(t.id);
        router.patch(
            `/cms/testimonials/${t.id}/toggle-publish`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessingId(null);
                    setViewing(null);
                },
            },
        );
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) {
            return;
        }

        setProcessingId(deleteTarget.id);
        router.delete(`/cms/testimonials/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setProcessingId(null);
                setDeleteTarget(null);
                setViewing(null);
            },
        });
    };

    const handleBulkAction = (
        action: 'approve' | 'publish' | 'unpublish' | 'reject' | 'delete',
    ) => {
        if (selectedIds.length === 0) {
            return;
        }

        setIsBulkProcessing(true);
        router.post(
            '/cms/testimonials/bulk-action',
            { ids: selectedIds, action },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setBulkDeleteOpen(false);
                },
                onFinish: () => setIsBulkProcessing(false),
            },
        );
    };

    const getInitials = (name: string) =>
        name
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) {
            return '—';
        }

        const d = new Date(dateStr);

        if (Number.isNaN(d.getTime())) {
            return '—';
        }

        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const renderStatusBadges = (t: Testimonial) => {
        const status = t.status ?? 'approved';

        if (status === 'pending') {
            return (
                <Badge
                    variant="outline"
                    className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                >
                    <Clock className="mr-1 h-3 w-3" />
                    Pending Review
                </Badge>
            );
        }

        if (status === 'rejected') {
            return (
                <Badge
                    variant="outline"
                    className="border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
                >
                    <XCircle className="mr-1 h-3 w-3" />
                    Rejected
                </Badge>
            );
        }

        return (
            <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                    variant="outline"
                    className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                >
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Approved
                </Badge>
                {t.is_active ? (
                    <Badge
                        variant="outline"
                        className="border-primary/40 bg-primary/10 text-primary"
                    >
                        <Globe className="mr-1 h-3 w-3" />
                        Published
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="text-xs">
                        <EyeOff className="mr-1 h-3 w-3" />
                        Unpublished
                    </Badge>
                )}
            </div>
        );
    };

    const renderTestimonialForm = ({
        form,
        onSubmit,
        label,
    }: {
        form: typeof addForm;
        onSubmit: (e: React.FormEvent) => void;
        label: string;
    }) => (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label>Full Name *</Label>
                    <Input
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="Jane Doe"
                        required
                    />
                    {form.errors.name && (
                        <p className="text-xs text-destructive">
                            {form.errors.name}
                        </p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label>Email Address</Label>
                    <Input
                        type="email"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        placeholder="jane@example.com"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label>Phone Number (Optional)</Label>
                    <Input
                        value={form.data.phone}
                        onChange={(e) => form.setData('phone', e.target.value)}
                        placeholder="+254 712 345 678"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label>Company / Organization (Optional)</Label>
                    <Input
                        value={form.data.company}
                        onChange={(e) =>
                            form.setData('company', e.target.value)
                        }
                        placeholder="Apex Wealth Advisory"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label>Role / Relationship (Optional)</Label>
                    <Input
                        value={form.data.role}
                        onChange={(e) => form.setData('role', e.target.value)}
                        placeholder="Site Visitor / Investor / Partner"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label>Location (Optional)</Label>
                    <Input
                        value={form.data.location}
                        onChange={(e) =>
                            form.setData('location', e.target.value)
                        }
                        placeholder="Nairobi, Kenya"
                    />
                </div>

                {/* Star Rating with 0.5 increments */}
                <div className="space-y-1.5 sm:col-span-2">
                    <Label>
                        Rating (supports 0.5 increments e.g. 3.5, 4.5, 5.0) *
                    </Label>
                    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                        <StarRatingDisplay
                            rating={form.data.rating}
                            size="md"
                        />
                        <div className="ml-auto flex flex-wrap gap-1">
                            {RATING_STEPS.map((step) => (
                                <button
                                    key={step}
                                    type="button"
                                    onClick={() => form.setData('rating', step)}
                                    className={`rounded-md border px-2 py-1 text-xs font-semibold transition-colors ${
                                        Number(form.data.rating) === step
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-background hover:bg-muted'
                                    }`}
                                >
                                    {step.toFixed(1)}★
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                    <MediaPicker
                        label="Profile Avatar Photo (Optional)"
                        value={form.data.avatar}
                        onChange={(url) => form.setData('avatar', url)}
                        accept="image"
                        placeholder="https://..."
                    />
                </div>

                {/* Up to 3 Feedback Photos */}
                <div className="space-y-2 sm:col-span-2">
                    <Label>Attached Feedback Photos (Up to 3 Photos)</Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {[0, 1, 2].map((idx) => (
                            <MediaPicker
                                key={idx}
                                label={`Photo ${idx + 1}`}
                                value={form.data.photos[idx] ?? ''}
                                onChange={(url) => {
                                    const next = [...form.data.photos];
                                    next[idx] = url;
                                    form.setData('photos', next);
                                }}
                                accept="image"
                                placeholder="/storage/feedback/..."
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Investment Amount (Optional)</Label>
                    <Input
                        value={form.data.investment_amount}
                        onChange={(e) =>
                            form.setData('investment_amount', e.target.value)
                        }
                        placeholder="Ksh 2.5M"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label>Monthly Income (Optional)</Label>
                    <Input
                        value={form.data.monthly_income}
                        onChange={(e) =>
                            form.setData('monthly_income', e.target.value)
                        }
                        placeholder="Ksh 20,000"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label>Moderation Status</Label>
                    <Select
                        value={form.data.status}
                        onValueChange={(
                            val: 'pending' | 'approved' | 'rejected',
                        ) => {
                            form.setData((prev) => ({
                                ...prev,
                                status: val,
                                is_active:
                                    val === 'approved' ? prev.is_active : false,
                            }));
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="pending">
                                Pending Review
                            </SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Display Order</Label>
                    <Input
                        type="number"
                        value={form.data.order}
                        onChange={(e) =>
                            form.setData(
                                'order',
                                parseInt(e.target.value, 10) || 0,
                            )
                        }
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label>Feedback / Review Message *</Label>
                <textarea
                    className="min-h-[110px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                    value={form.data.testimonial}
                    onChange={(e) =>
                        form.setData('testimonial', e.target.value)
                    }
                    placeholder="Write the feedback or review..."
                    required
                />
                {form.errors.testimonial && (
                    <p className="text-xs text-destructive">
                        {form.errors.testimonial}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                <input
                    type="checkbox"
                    id="t_active"
                    checked={
                        form.data.status === 'approved' && form.data.is_active
                    }
                    disabled={form.data.status !== 'approved'}
                    onChange={(e) =>
                        form.setData('is_active', e.target.checked)
                    }
                    className="h-4 w-4 rounded"
                />
                <div className="space-y-0.5">
                    <Label htmlFor="t_active" className="cursor-pointer">
                        Publish on Website Homepage
                    </Label>
                    <p className="text-xs text-muted-foreground">
                        Only approved and published reviews are publicly
                        displayed on the homepage.
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? 'Saving...' : label}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                        setShowAdd(false);
                        setEditing(null);
                    }}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );

    return (
        <>
            <Head title="Feedback & Testimonials" />
            <div className="animate-in space-y-6 duration-200 fade-in-50">
                <PageHeader
                    icon={Star}
                    title="Feedback & Testimonials"
                    description="Review public feedback submissions, approve or reject reviews, and manage published testimonials on the website homepage."
                    badge={
                        counts.pending > 0
                            ? {
                                  label: `${counts.pending} Pending Review`,
                                  variant: 'warning',
                              }
                            : undefined
                    }
                    actions={
                        canCreate && (
                            <Button
                                size="sm"
                                className="h-9 shadow-xs"
                                onClick={() => {
                                    setShowAdd(true);
                                    setEditing(null);
                                }}
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                Add Feedback
                            </Button>
                        )
                    }
                />

                {/* Moderation Status Summary Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
                                Total Feedback
                            </span>
                            <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-foreground">
                            {counts.total}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                            All entries
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('pending')}
                        className={`rounded-xl border p-4 text-left transition-all ${
                            statusFilter === 'pending'
                                ? 'border-amber-500 bg-amber-500/5 shadow-xs'
                                : 'border-border/60 bg-card hover:border-amber-500/40'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Pending Review
                            </span>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-foreground">
                            {counts.pending}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                            Awaiting approval
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
                                Published Live
                            </span>
                            <Globe className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-foreground">
                            {counts.published}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                            Visible on homepage
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('approved_unpublished')}
                        className={`rounded-xl border p-4 text-left transition-all ${
                            statusFilter === 'approved_unpublished'
                                ? 'border-blue-500 bg-blue-500/5 shadow-xs'
                                : 'border-border/60 bg-card hover:border-blue-500/40'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Unpublished
                            </span>
                            <EyeOff className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-foreground">
                            {counts.approvedUnpublished}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                            Approved but hidden
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('rejected')}
                        className={`rounded-xl border p-4 text-left transition-all ${
                            statusFilter === 'rejected'
                                ? 'border-red-500 bg-red-500/5 shadow-xs'
                                : 'border-border/60 bg-card hover:border-red-500/40'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Rejected
                            </span>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-foreground">
                            {counts.rejected}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                            Declined submissions
                        </div>
                    </button>
                </div>

                {/* Add Form */}
                {showAdd && (
                    <Card className="border-primary/30 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">
                                Add New Feedback / Testimonial
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAdd(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {renderTestimonialForm({
                                form: addForm,
                                onSubmit: submitAdd,
                                label: 'Save Feedback',
                            })}
                        </CardContent>
                    </Card>
                )}

                {/* Edit Form */}
                {editing && (
                    <Card className="border-primary/30 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">
                                Edit Feedback: {editing.name}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditing(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {renderTestimonialForm({
                                form: editForm,
                                onSubmit: submitEdit,
                                label: 'Save Changes',
                            })}
                        </CardContent>
                    </Card>
                )}

                {/* Search, Filter & View Controls */}
                <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, phone, company, role, location, or message..."
                            className="pl-9"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Select
                            value={ratingFilter}
                            onValueChange={setRatingFilter}
                        >
                            <SelectTrigger className="h-9 w-[145px]">
                                <SelectValue placeholder="Rating" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Ratings</SelectItem>
                                <SelectItem value="4.5_up">
                                    4.5★ & Above
                                </SelectItem>
                                <SelectItem value="4_up">
                                    4.0★ & Above
                                </SelectItem>
                                <SelectItem value="3.5_below">
                                    3.5★ & Below
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={sourceFilter}
                            onValueChange={setSourceFilter}
                        >
                            <SelectTrigger className="h-9 w-[150px]">
                                <SelectValue placeholder="Source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sources</SelectItem>
                                <SelectItem value="website">
                                    Website Submissions
                                </SelectItem>
                                <SelectItem value="cms">CMS Added</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={sortBy}
                            onValueChange={(v) => setSortBy(v as SortOption)}
                        >
                            <SelectTrigger className="h-9 w-[155px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">
                                    Pending First
                                </SelectItem>
                                <SelectItem value="newest">
                                    Newest First
                                </SelectItem>
                                <SelectItem value="oldest">
                                    Oldest First
                                </SelectItem>
                                <SelectItem value="rating_high">
                                    Highest Rating
                                </SelectItem>
                                <SelectItem value="rating_low">
                                    Lowest Rating
                                </SelectItem>
                                <SelectItem value="order">
                                    Display Order
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex items-center rounded-lg border border-border p-0.5">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`rounded-md p-1.5 transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                                title="Grid View"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`rounded-md p-1.5 transition-colors ${
                                    viewMode === 'table'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                                title="Table View"
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        {(search !== '' ||
                            statusFilter !== 'all' ||
                            ratingFilter !== 'all' ||
                            sourceFilter !== 'all' ||
                            sortBy !== 'default') && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="h-9 text-xs"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Bulk Action Bar */}
                {selectedIds.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <CheckSquare className="h-4 w-4 text-primary" />
                            <span>{selectedIds.length} selected</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setSelectedIds([])}
                            >
                                Clear
                            </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {canEdit && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
                                        disabled={isBulkProcessing}
                                        onClick={() =>
                                            handleBulkAction('publish')
                                        }
                                    >
                                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                        Approve & Publish
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8"
                                        disabled={isBulkProcessing}
                                        onClick={() =>
                                            handleBulkAction('approve')
                                        }
                                    >
                                        <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                                        Approve Only
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8"
                                        disabled={isBulkProcessing}
                                        onClick={() =>
                                            handleBulkAction('unpublish')
                                        }
                                    >
                                        <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                                        Unpublish
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 border-amber-500/40 text-amber-600 hover:bg-amber-500/10"
                                        disabled={isBulkProcessing}
                                        onClick={() =>
                                            handleBulkAction('reject')
                                        }
                                    >
                                        <XCircle className="mr-1.5 h-3.5 w-3.5" />
                                        Reject
                                    </Button>
                                </>
                            )}
                            {canDelete && (
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8"
                                    disabled={isBulkProcessing}
                                    onClick={() => setBulkDeleteOpen(true)}
                                >
                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Testimonials List / Grid */}
                {filteredTestimonials.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border py-16 text-center">
                        <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                            No feedback or testimonials match your filter
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Try clearing your search filters or add a new
                            feedback entry.
                        </p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredTestimonials.map((t) => {
                            const status = t.status ?? 'approved';
                            const isSelected = selectedIds.includes(t.id);
                            const photos = Array.isArray(t.photos)
                                ? t.photos.filter(Boolean)
                                : [];

                            return (
                                <Card
                                    key={t.id}
                                    className={`overflow-hidden transition-all ${
                                        isSelected
                                            ? 'ring-2 ring-primary'
                                            : status === 'pending'
                                              ? 'border-amber-500/40 bg-amber-500/[0.02]'
                                              : ''
                                    }`}
                                >
                                    <CardContent className="flex h-full flex-col justify-between space-y-4 p-5">
                                        <div className="space-y-3.5">
                                            {/* Header row */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-start gap-2.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            toggleSelectOne(
                                                                t.id,
                                                            )
                                                        }
                                                        className="mt-2 h-4 w-4 rounded"
                                                        aria-label={`Select ${t.name}`}
                                                    />
                                                    {t.avatar ? (
                                                        <img
                                                            src={t.avatar}
                                                            alt={t.name}
                                                            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-border"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                            {getInitials(
                                                                t.name,
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="truncate text-sm font-semibold">
                                                            {t.name}
                                                        </div>
                                                        {t.company && (
                                                            <div className="flex items-center gap-1 truncate text-xs font-medium text-primary">
                                                                <Building2 className="h-3 w-3 shrink-0" />
                                                                <span className="truncate">
                                                                    {t.company}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {(t.role ||
                                                            t.location) && (
                                                            <div className="truncate text-xs text-muted-foreground">
                                                                {[
                                                                    t.role,
                                                                    t.location,
                                                                ]
                                                                    .filter(
                                                                        Boolean,
                                                                    )
                                                                    .join(
                                                                        ' · ',
                                                                    )}
                                                            </div>
                                                        )}
                                                        {(t.email ||
                                                            t.phone) && (
                                                            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                                                {t.email && (
                                                                    <span className="inline-flex items-center gap-1 truncate">
                                                                        <Mail className="h-3 w-3 shrink-0" />
                                                                        {
                                                                            t.email
                                                                        }
                                                                    </span>
                                                                )}
                                                                {t.phone && (
                                                                    <span className="inline-flex items-center gap-1">
                                                                        <Phone className="h-3 w-3 shrink-0" />
                                                                        {
                                                                            t.phone
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-0.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() =>
                                                            setViewing(t)
                                                        }
                                                        title="View Full Feedback"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                    {canEdit && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() =>
                                                                openEdit(t)
                                                            }
                                                            title="Edit"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                    {canDelete && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() =>
                                                                setDeleteTarget(
                                                                    t,
                                                                )
                                                            }
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Rating & Relative Time */}
                                            <div className="flex items-center justify-between">
                                                <StarRatingDisplay
                                                    rating={t.rating}
                                                />
                                                <span
                                                    className="text-[11px] text-muted-foreground"
                                                    title={formatDate(
                                                        t.created_at,
                                                    )}
                                                >
                                                    {formatRelativeTime(
                                                        t.created_at,
                                                    )}
                                                </span>
                                            </div>

                                            {/* Testimonial Quote */}
                                            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground italic">
                                                "{t.testimonial}"
                                            </p>

                                            {/* Attached Photos Thumbnails */}
                                            {photos.length > 0 && (
                                                <div className="flex items-center gap-2 pt-1">
                                                    {photos
                                                        .slice(0, 3)
                                                        .map((photo, idx) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() =>
                                                                    setViewing(
                                                                        t,
                                                                    )
                                                                }
                                                                className="h-12 w-12 overflow-hidden rounded-lg border border-border transition-transform hover:scale-105"
                                                            >
                                                                <img
                                                                    src={photo}
                                                                    alt={`Feedback attachment ${idx + 1}`}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </button>
                                                        ))}
                                                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                                        <ImageIcon className="h-3 w-3" />
                                                        {photos.length}{' '}
                                                        {photos.length === 1
                                                            ? 'photo'
                                                            : 'photos'}
                                                    </span>
                                                </div>
                                            )}

                                            {(t.investment_amount ||
                                                t.monthly_income) && (
                                                <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5 text-xs">
                                                    {t.investment_amount && (
                                                        <div>
                                                            <div className="text-muted-foreground">
                                                                Invested
                                                            </div>
                                                            <div className="font-semibold">
                                                                {
                                                                    t.investment_amount
                                                                }
                                                            </div>
                                                        </div>
                                                    )}
                                                    {t.monthly_income && (
                                                        <div>
                                                            <div className="text-muted-foreground">
                                                                Monthly Income
                                                            </div>
                                                            <div className="font-semibold">
                                                                {
                                                                    t.monthly_income
                                                                }
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer Status & Quick Moderation Actions */}
                                        <div className="space-y-3 border-t border-border/60 pt-3">
                                            <div className="flex items-center justify-between gap-2">
                                                {renderStatusBadges(t)}
                                            </div>

                                            {canEdit && (
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {status !== 'approved' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 flex-1 border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
                                                            disabled={
                                                                processingId ===
                                                                t.id
                                                            }
                                                            onClick={() =>
                                                                handleApprove(
                                                                    t,
                                                                    true,
                                                                )
                                                            }
                                                        >
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Approve & Publish
                                                        </Button>
                                                    )}

                                                    {status === 'approved' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 flex-1 text-xs"
                                                            disabled={
                                                                processingId ===
                                                                t.id
                                                            }
                                                            onClick={() =>
                                                                handleTogglePublish(
                                                                    t,
                                                                )
                                                            }
                                                        >
                                                            {t.is_active ? (
                                                                <>
                                                                    <EyeOff className="mr-1 h-3 w-3" />
                                                                    Unpublish
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Globe className="mr-1 h-3 w-3" />
                                                                    Publish
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}

                                                    {status !== 'rejected' && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-7 px-2.5 text-xs text-amber-600 hover:bg-amber-500/10 hover:text-amber-700"
                                                            disabled={
                                                                processingId ===
                                                                t.id
                                                            }
                                                            onClick={() =>
                                                                handleReject(t)
                                                            }
                                                        >
                                                            <XCircle className="mr-1 h-3 w-3" />
                                                            Reject
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    /* Table View */
                    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    <tr>
                                        <th className="w-10 px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={allFilteredSelected}
                                                onChange={toggleSelectAll}
                                                className="h-4 w-4 rounded"
                                                aria-label="Select all"
                                            />
                                        </th>
                                        <th className="px-4 py-3">Submitter</th>
                                        <th className="px-4 py-3">Feedback</th>
                                        <th className="px-4 py-3">Rating</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Submitted</th>
                                        <th className="px-4 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredTestimonials.map((t) => {
                                        const status = t.status ?? 'approved';
                                        const isSelected = selectedIds.includes(
                                            t.id,
                                        );

                                        return (
                                            <tr
                                                key={t.id}
                                                className={`transition-colors hover:bg-muted/30 ${
                                                    isSelected
                                                        ? 'bg-primary/5'
                                                        : ''
                                                }`}
                                            >
                                                <td className="px-4 py-3.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            toggleSelectOne(
                                                                t.id,
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded"
                                                    />
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="font-semibold text-foreground">
                                                        {t.name}
                                                    </div>
                                                    {t.email && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {t.email}
                                                        </div>
                                                    )}
                                                    {t.phone && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {t.phone}
                                                        </div>
                                                    )}
                                                    {t.company && (
                                                        <div className="text-xs font-medium text-primary">
                                                            {t.company}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="max-w-md px-4 py-3.5">
                                                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground italic">
                                                        "{t.testimonial}"
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <StarRatingDisplay
                                                        rating={t.rating}
                                                    />
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    {renderStatusBadges(t)}
                                                </td>
                                                <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                                    <div>
                                                        {formatRelativeTime(
                                                            t.created_at,
                                                        )}
                                                    </div>
                                                    <div className="text-[11px]">
                                                        {formatDate(
                                                            t.created_at,
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {canEdit &&
                                                            status !==
                                                                'approved' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 border-emerald-500/40 px-2 text-xs text-emerald-600"
                                                                    onClick={() =>
                                                                        handleApprove(
                                                                            t,
                                                                            true,
                                                                        )
                                                                    }
                                                                >
                                                                    Approve
                                                                </Button>
                                                            )}
                                                        {canEdit &&
                                                            status ===
                                                                'approved' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 px-2 text-xs"
                                                                    onClick={() =>
                                                                        handleTogglePublish(
                                                                            t,
                                                                        )
                                                                    }
                                                                >
                                                                    {t.is_active
                                                                        ? 'Unpublish'
                                                                        : 'Publish'}
                                                                </Button>
                                                            )}
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-7 w-7 p-0"
                                                            onClick={() =>
                                                                setViewing(t)
                                                            }
                                                            title="View"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                        {canEdit && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-7 w-7 p-0"
                                                                onClick={() =>
                                                                    openEdit(t)
                                                                }
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </Button>
                                                        )}
                                                        {canDelete && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-7 w-7 p-0"
                                                                onClick={() =>
                                                                    setDeleteTarget(
                                                                        t,
                                                                    )
                                                                }
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
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
                )}

                {/* Stats Summary Section (if configured) */}
                {stats.length > 0 && (
                    <div className="space-y-3 pt-4">
                        <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                            Testimonial Section Highlights
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {stats.map((s) => (
                                <div
                                    key={s.id}
                                    className="rounded-xl border border-border bg-card p-4 text-center"
                                >
                                    <div className="text-2xl font-bold text-primary">
                                        {s.value}
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* View Feedback Details Modal */}
            <Dialog
                open={viewing !== null}
                onOpenChange={(open) => !open && setViewing(null)}
            >
                <DialogContent className="sm:max-w-lg">
                    {viewing && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center justify-between gap-2 pr-6">
                                    <span>{viewing.name}</span>
                                    {renderStatusBadges(viewing)}
                                </DialogTitle>
                                <DialogDescription asChild>
                                    <div className="space-y-1 pt-1 text-xs text-muted-foreground">
                                        {viewing.company && (
                                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                                                <Building2 className="h-3.5 w-3.5 text-primary" />
                                                <span>{viewing.company}</span>
                                            </div>
                                        )}
                                        {(viewing.role || viewing.location) && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <span>
                                                    {[
                                                        viewing.role,
                                                        viewing.location,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(' · ')}
                                                </span>
                                            </div>
                                        )}
                                        {(viewing.email || viewing.phone) && (
                                            <div className="flex flex-wrap items-center gap-3 pt-0.5">
                                                {viewing.email && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        {viewing.email}
                                                    </span>
                                                )}
                                                {viewing.phone && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <Phone className="h-3.5 w-3.5" />
                                                        {viewing.phone}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-2">
                                <div className="flex items-center justify-between">
                                    <StarRatingDisplay
                                        rating={viewing.rating}
                                        size="md"
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        {formatRelativeTime(viewing.created_at)}{' '}
                                        ({formatDate(viewing.created_at)})
                                    </span>
                                </div>

                                <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed italic">
                                    "{viewing.testimonial}"
                                </div>

                                {Array.isArray(viewing.photos) &&
                                    viewing.photos.filter(Boolean).length >
                                        0 && (
                                        <div className="space-y-2">
                                            <div className="text-xs font-semibold text-muted-foreground">
                                                Attached Photos
                                            </div>
                                            <div className="grid grid-cols-3 gap-2.5">
                                                {viewing.photos
                                                    .filter(Boolean)
                                                    .map((photo, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={photo}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block aspect-square overflow-hidden rounded-xl border border-border"
                                                        >
                                                            <img
                                                                src={photo}
                                                                alt={`Feedback photo ${idx + 1}`}
                                                                className="h-full w-full object-cover transition-transform hover:scale-105"
                                                            />
                                                        </a>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                {(viewing.investment_amount ||
                                    viewing.monthly_income) && (
                                    <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/60 p-3 text-xs">
                                        {viewing.investment_amount && (
                                            <div>
                                                <div className="text-muted-foreground">
                                                    Investment Amount
                                                </div>
                                                <div className="font-semibold">
                                                    {viewing.investment_amount}
                                                </div>
                                            </div>
                                        )}
                                        {viewing.monthly_income && (
                                            <div>
                                                <div className="text-muted-foreground">
                                                    Monthly Income
                                                </div>
                                                <div className="font-semibold">
                                                    {viewing.monthly_income}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {canEdit &&
                                            (viewing.status ?? 'approved') !==
                                                'approved' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleApprove(
                                                            viewing,
                                                            true,
                                                        )
                                                    }
                                                >
                                                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                                                    Approve & Publish
                                                </Button>
                                            )}
                                        {canEdit &&
                                            (viewing.status ?? 'approved') ===
                                                'approved' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleTogglePublish(
                                                            viewing,
                                                        )
                                                    }
                                                >
                                                    {viewing.is_active ? (
                                                        <>
                                                            <EyeOff className="mr-1.5 h-4 w-4" />
                                                            Unpublish
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Globe className="mr-1.5 h-4 w-4" />
                                                            Publish
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        {canEdit &&
                                            viewing.status !== 'rejected' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-amber-600"
                                                    onClick={() =>
                                                        handleReject(viewing)
                                                    }
                                                >
                                                    <XCircle className="mr-1.5 h-4 w-4" />
                                                    Reject
                                                </Button>
                                            )}
                                    </div>
                                    <div className="flex gap-2">
                                        {canEdit && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    openEdit(viewing)
                                                }
                                            >
                                                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                                Edit
                                            </Button>
                                        )}
                                        {canDelete && (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    setDeleteTarget(viewing)
                                                }
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Single Delete Confirmation */}
            <ConfirmDialog
                open={deleteTarget !== null}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Delete Feedback Entry"
                description={`Are you sure you want to permanently delete the feedback from "${deleteTarget?.name ?? ''}"? This action cannot be undone.`}
                confirmText="Delete Permanently"
                variant="destructive"
                isLoading={processingId === deleteTarget?.id}
                onConfirm={handleDeleteConfirm}
            />

            {/* Bulk Delete Confirmation */}
            <ConfirmDialog
                open={bulkDeleteOpen}
                onOpenChange={setBulkDeleteOpen}
                title="Delete Selected Feedback"
                description={`Are you sure you want to permanently delete ${selectedIds.length} selected feedback item(s)? This action cannot be undone.`}
                confirmText="Delete All Selected"
                variant="destructive"
                isLoading={isBulkProcessing}
                onConfirm={() => handleBulkAction('delete')}
            />
        </>
    );
}
