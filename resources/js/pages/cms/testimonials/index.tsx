import { Head, router, useForm } from '@inertiajs/react';
import { MessageSquare, Pencil, Plus, Star, Trash2, X } from 'lucide-react';
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

const emptyForm = { name: '', role: '', location: '', avatar: '', testimonial: '', rating: 5, investment_amount: '', monthly_income: '', years_investing: 1, order: 0 };

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
        editForm.setData({ name: t.name, role: t.role ?? '', location: t.location ?? '', avatar: t.avatar ?? '', testimonial: t.testimonial, rating: t.rating, investment_amount: t.investment_amount ?? '', monthly_income: t.monthly_income ?? '', years_investing: t.years_investing, order: t.order, is_active: t.is_active });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        editForm.put(`/cms/testimonials/${editing.id}`, { onSuccess: () => setEditing(null) });
    };

    const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

    const TestimonialForm = ({ form, onSubmit, label }: { form: typeof addForm; onSubmit: (e: React.FormEvent) => void; label: string }) => (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Name *</Label><Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Jane Doe" required /></div>
                <div className="space-y-1.5"><Label>Role</Label><Input value={form.data.role} onChange={(e) => form.setData('role', e.target.value)} placeholder="Property Investor" /></div>
                <div className="space-y-1.5"><Label>Location</Label><Input value={form.data.location} onChange={(e) => form.setData('location', e.target.value)} placeholder="Nairobi, Kenya" /></div>
                <div className="space-y-1.5"><Label>Avatar URL</Label><Input value={form.data.avatar} onChange={(e) => form.setData('avatar', e.target.value)} placeholder="https://..." /></div>
                <div className="space-y-1.5"><Label>Investment Amount</Label><Input value={form.data.investment_amount} onChange={(e) => form.setData('investment_amount', e.target.value)} placeholder="KES 8.5M" /></div>
                <div className="space-y-1.5"><Label>Monthly Income</Label><Input value={form.data.monthly_income} onChange={(e) => form.setData('monthly_income', e.target.value)} placeholder="KES 68,000" /></div>
                <div className="space-y-1.5"><Label>Years Investing</Label><Input type="number" min={0} value={form.data.years_investing} onChange={(e) => form.setData('years_investing', parseInt(e.target.value))} /></div>
                <div className="space-y-1.5"><Label>Rating (1–5)</Label><Input type="number" min={1} max={5} value={form.data.rating} onChange={(e) => form.setData('rating', parseInt(e.target.value))} /></div>
            </div>
            <div className="space-y-1.5">
                <Label>Testimonial *</Label>
                <textarea className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" value={form.data.testimonial} onChange={(e) => form.setData('testimonial', e.target.value)} required />
            </div>
            <div className="flex items-center gap-2">
                <input type="checkbox" id="t_active" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} className="rounded" />
                <Label htmlFor="t_active">Active (visible on website)</Label>
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={form.processing}>{form.processing ? 'Saving...' : label}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowAdd(false); setEditing(null); }}>Cancel</Button>
            </div>
        </form>
    );

    return (
        <>
            <Head title="Testimonials" />
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
                        <p className="text-muted-foreground mt-1">{testimonials.length} investor testimonials</p>
                    </div>
                    <Button onClick={() => { setShowAdd(true); setEditing(null); }}>
                        <Plus className="h-4 w-4 mr-2" />Add Testimonial
                    </Button>
                </div>

                {/* Stats summary */}
                {stats.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {stats.map((s) => (
                            <div key={s.id} className="rounded-xl border border-border bg-card p-4 text-center">
                                <div className="text-2xl font-bold text-primary">{s.value}</div>
                                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {showAdd && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">New Testimonial</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <TestimonialForm form={addForm} onSubmit={submitAdd} label="Add Testimonial" />
                        </CardContent>
                    </Card>
                )}

                {editing && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base">Edit: {editing.name}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <TestimonialForm form={editForm} onSubmit={submitEdit} label="Save Changes" />
                        </CardContent>
                    </Card>
                )}

                {testimonials.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border py-20 text-center">
                        <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">No testimonials yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((t) => (
                            <Card key={t.id} className={`overflow-hidden ${!t.is_active ? 'opacity-60' : ''}`}>
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            {t.avatar ? (
                                                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-border" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                                    {getInitials(t.name)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-sm">{t.name}</div>
                                                {t.role && <div className="text-xs text-muted-foreground">{t.role}</div>}
                                                {t.location && <div className="text-xs text-muted-foreground">{t.location}</div>}
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => openEdit(t)}><Pencil className="h-3.5 w-3.5" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/testimonials/${t.id}`); }}>
                                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                                        ))}
                                    </div>

                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">"{t.testimonial}"</p>

                                    {(t.investment_amount || t.monthly_income) && (
                                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
                                            {t.investment_amount && (
                                                <div>
                                                    <div className="text-xs text-muted-foreground">Invested</div>
                                                    <div className="text-sm font-semibold">{t.investment_amount}</div>
                                                </div>
                                            )}
                                            {t.monthly_income && (
                                                <div>
                                                    <div className="text-xs text-muted-foreground">Monthly income</div>
                                                    <div className="text-sm font-semibold">{t.monthly_income}</div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {!t.is_active && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
