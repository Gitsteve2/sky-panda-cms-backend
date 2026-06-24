import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Testimonial {
    id: number;
    name: string;
    role?: string;
    location?: string;
    avatar?: string;
    testimonial: string;
    rating: number;
    investment_amount?: string;
    monthly_income?: string;
    years_investing: number;
    order: number;
    is_active: boolean;
}

interface Stat { id: number; icon?: string; value: string; label: string; description?: string }

const emptyForm = {
    name: '', role: '', location: '', avatar: '',
    testimonial: '', rating: 5,
    investment_amount: '', monthly_income: '', years_investing: 1, order: 0,
};

export default function TestimonialsIndex({ testimonials, stats }: { testimonials: Testimonial[]; stats: Stat[] }) {
    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);

    const addForm = useForm({ ...emptyForm, is_active: true });
    const editForm = useForm({ ...emptyForm, is_active: true });

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/cms/testimonials', { onSuccess: () => { setShowAdd(false); addForm.reset(); } });
    };

    const openEdit = (t: Testimonial) => {
        setEditing(t);
        editForm.setData({
            name: t.name, role: t.role ?? '', location: t.location ?? '', avatar: t.avatar ?? '',
            testimonial: t.testimonial, rating: t.rating,
            investment_amount: t.investment_amount ?? '', monthly_income: t.monthly_income ?? '',
            years_investing: t.years_investing, order: t.order, is_active: t.is_active,
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        editForm.put(`/cms/testimonials/${editing.id}`, { onSuccess: () => setEditing(null) });
    };

    const TestimonialForm = ({ form, onSubmit, label }: { form: typeof addForm; onSubmit: (e: React.FormEvent) => void; label: string }) => (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Name *</Label><Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} required /></div>
                <div className="space-y-1"><Label>Role</Label><Input value={form.data.role} onChange={(e) => form.setData('role', e.target.value)} placeholder="Property Investor" /></div>
                <div className="space-y-1"><Label>Location</Label><Input value={form.data.location} onChange={(e) => form.setData('location', e.target.value)} placeholder="Nairobi, Kenya" /></div>
                <div className="space-y-1"><Label>Avatar URL</Label><Input value={form.data.avatar} onChange={(e) => form.setData('avatar', e.target.value)} placeholder="/photo.jpg" /></div>
                <div className="space-y-1"><Label>Investment Amount</Label><Input value={form.data.investment_amount} onChange={(e) => form.setData('investment_amount', e.target.value)} placeholder="KES 8.5M" /></div>
                <div className="space-y-1"><Label>Monthly Income</Label><Input value={form.data.monthly_income} onChange={(e) => form.setData('monthly_income', e.target.value)} placeholder="KES 68,000" /></div>
                <div className="space-y-1"><Label>Years Investing</Label><Input type="number" min={0} value={form.data.years_investing} onChange={(e) => form.setData('years_investing', parseInt(e.target.value))} /></div>
                <div className="space-y-1">
                    <Label>Rating (1-5)</Label>
                    <Input type="number" min={1} max={5} value={form.data.rating} onChange={(e) => form.setData('rating', parseInt(e.target.value))} />
                </div>
            </div>
            <div className="space-y-1">
                <Label>Testimonial *</Label>
                <textarea className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.data.testimonial} onChange={(e) => form.setData('testimonial', e.target.value)} required />
            </div>
            <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                <Label>Active</Label>
            </div>
            <Button type="submit" disabled={form.processing}>{form.processing ? 'Saving...' : label}</Button>
        </form>
    );

    return (
        <>
            <Head title="Testimonials" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Testimonials</h1>
                        <p className="text-sm text-muted-foreground mt-1">{testimonials.length} investor testimonials</p>
                    </div>
                    <Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-2" />Add Testimonial</Button>
                </div>

                {/* Stats summary */}
                {stats.length > 0 && (
                    <div className="flex gap-4">
                        {stats.map((s) => (
                            <div key={s.id} className="rounded-lg border border-border p-3 text-center min-w-[100px]">
                                <div className="text-2xl font-bold">{s.value}</div>
                                <div className="text-xs text-muted-foreground">{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {showAdd && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>New Testimonial</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent><TestimonialForm form={addForm} onSubmit={submitAdd} label="Add Testimonial" /></CardContent>
                    </Card>
                )}

                {editing && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit: {editing.name}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent><TestimonialForm form={editForm} onSubmit={submitEdit} label="Save Changes" /></CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((t) => (
                        <Card key={t.id} className={!t.is_active ? 'opacity-60' : ''}>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-semibold">{t.name}</div>
                                        {t.role && <div className="text-xs text-muted-foreground">{t.role}</div>}
                                        {t.location && <div className="text-xs text-muted-foreground">{t.location}</div>}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/testimonials/${t.id}`); }}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">{[...Array(t.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}</div>
                                <p className="text-sm text-muted-foreground line-clamp-3">"{t.testimonial}"</p>
                                {(t.investment_amount || t.monthly_income) && (
                                    <div className="flex gap-3 text-xs">
                                        {t.investment_amount && <span><span className="text-muted-foreground">Invested:</span> <strong>{t.investment_amount}</strong></span>}
                                        {t.monthly_income && <span><span className="text-muted-foreground">Monthly:</span> <strong>{t.monthly_income}</strong></span>}
                                    </div>
                                )}
                                {!t.is_active && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
