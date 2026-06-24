import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UnitType {
    id: number; type: string; size?: string; bedrooms: number; bathrooms: number;
    price_label?: string; price_value: number; all_cash_price?: number;
    booking_fee?: number; monthly_rent_label?: string; yield_range?: string;
    total_units: number; available_units: number; featured_image?: string;
    gallery: string[]; features: string[]; order: number; is_active: boolean;
}
interface Amenity { id: number; name: string; icon?: string; image?: string; description?: string; order: number; is_active: boolean }

const emptyUnit = {
    type: '', size: '', bedrooms: 0, bathrooms: 1,
    price_label: '', price_value: 0, all_cash_price: 0, booking_fee: 0,
    monthly_rent_label: '', monthly_rent_value: 0, yield_range: '',
    total_units: 0, available_units: 0, featured_image: '',
    gallery: [] as string[], features: [] as string[], order: 0, is_active: true,
};

export default function InvestmentIndex({ unitTypes, amenities }: { unitTypes: UnitType[]; amenities: Amenity[] }) {
    const [tab, setTab] = useState<'units' | 'amenities'>('units');
    const [showAddUnit, setShowAddUnit] = useState(false);
    const [editingUnit, setEditingUnit] = useState<UnitType | null>(null);
    const [showAddAmenity, setShowAddAmenity] = useState(false);
    const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);

    const addUnitForm = useForm({ ...emptyUnit });
    const editUnitForm = useForm({ ...emptyUnit });
    const addAmenityForm = useForm({ name: '', icon: '', image: '', description: '', order: 0, is_active: true });
    const editAmenityForm = useForm({ name: '', icon: '', image: '', description: '', order: 0, is_active: true });

    const openEditUnit = (u: UnitType) => {
        setEditingUnit(u);
        editUnitForm.setData({
            type: u.type, size: u.size ?? '', bedrooms: u.bedrooms, bathrooms: u.bathrooms,
            price_label: u.price_label ?? '', price_value: u.price_value, all_cash_price: u.all_cash_price ?? 0,
            booking_fee: u.booking_fee ?? 0, monthly_rent_label: u.monthly_rent_label ?? '',
            monthly_rent_value: 0, yield_range: u.yield_range ?? '',
            total_units: u.total_units, available_units: u.available_units, featured_image: u.featured_image ?? '',
            gallery: u.gallery, features: u.features, order: u.order, is_active: u.is_active,
        });
    };

    const openEditAmenity = (a: Amenity) => {
        setEditingAmenity(a);
        editAmenityForm.setData({ name: a.name, icon: a.icon ?? '', image: a.image ?? '', description: a.description ?? '', order: a.order, is_active: a.is_active });
    };

    const UnitForm = ({ form, onSubmit, label }: { form: typeof addUnitForm; onSubmit: (e: React.FormEvent) => void; label: string }) => (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1"><Label>Type *</Label><Input value={form.data.type} onChange={(e) => form.setData('type', e.target.value)} placeholder="Studio" required /></div>
                <div className="space-y-1"><Label>Size</Label><Input value={form.data.size} onChange={(e) => form.setData('size', e.target.value)} placeholder="23 sqm" /></div>
                <div className="space-y-1"><Label>Price Label</Label><Input value={form.data.price_label} onChange={(e) => form.setData('price_label', e.target.value)} placeholder="KES 2.9M" /></div>
                <div className="space-y-1"><Label>Price Value (KES)</Label><Input type="number" value={form.data.price_value} onChange={(e) => form.setData('price_value', parseInt(e.target.value))} /></div>
                <div className="space-y-1"><Label>All Cash Price</Label><Input type="number" value={form.data.all_cash_price} onChange={(e) => form.setData('all_cash_price', parseInt(e.target.value))} /></div>
                <div className="space-y-1"><Label>Yield Range</Label><Input value={form.data.yield_range} onChange={(e) => form.setData('yield_range', e.target.value)} placeholder="7.9 - 9%" /></div>
                <div className="space-y-1"><Label>Total Units</Label><Input type="number" value={form.data.total_units} onChange={(e) => form.setData('total_units', parseInt(e.target.value))} /></div>
                <div className="space-y-1"><Label>Available Units</Label><Input type="number" value={form.data.available_units} onChange={(e) => form.setData('available_units', parseInt(e.target.value))} /></div>
                <div className="space-y-1"><Label>Featured Image</Label><Input value={form.data.featured_image} onChange={(e) => form.setData('featured_image', e.target.value)} placeholder="/studio.jpg" /></div>
            </div>
            <div className="space-y-1">
                <Label>Features (one per line)</Label>
                <textarea
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.data.features.join('\n')}
                    onChange={(e) => form.setData('features', e.target.value.split('\n').filter(Boolean))}
                    placeholder="Balcony&#10;Fitted Kitchen&#10;Bathroom"
                />
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
            <Head title="Investment" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Investment</h1>
                    <Button onClick={() => tab === 'units' ? setShowAddUnit(true) : setShowAddAmenity(true)}>
                        <Plus className="h-4 w-4 mr-2" />Add {tab === 'units' ? 'Unit Type' : 'Amenity'}
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-border">
                    {(['units', 'amenities'] as const).map((t) => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                            {t} ({t === 'units' ? unitTypes.length : amenities.length})
                        </button>
                    ))}
                </div>

                {/* Units Tab */}
                {tab === 'units' && (
                    <div className="space-y-4">
                        {showAddUnit && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>New Unit Type</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => setShowAddUnit(false)}><X className="h-4 w-4" /></Button>
                                </CardHeader>
                                <CardContent>
                                    <UnitForm form={addUnitForm} onSubmit={(e) => { e.preventDefault(); addUnitForm.post('/cms/investment/units', { onSuccess: () => { setShowAddUnit(false); addUnitForm.reset(); } }); }} label="Add Unit Type" />
                                </CardContent>
                            </Card>
                        )}
                        {editingUnit && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Edit: {editingUnit.type}</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => setEditingUnit(null)}><X className="h-4 w-4" /></Button>
                                </CardHeader>
                                <CardContent>
                                    <UnitForm form={editUnitForm} onSubmit={(e) => { e.preventDefault(); editUnitForm.put(`/cms/investment/units/${editingUnit.id}`, { onSuccess: () => setEditingUnit(null) }); }} label="Save Changes" />
                                </CardContent>
                            </Card>
                        )}
                        <div className="grid gap-4 md:grid-cols-2">
                            {unitTypes.map((u) => (
                                <Card key={u.id} className={!u.is_active ? 'opacity-60' : ''}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-bold text-lg">{u.type}</h3>
                                                {u.size && <p className="text-sm text-muted-foreground">{u.size}</p>}
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => openEditUnit(u)}><Pencil className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/investment/units/${u.id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div><span className="text-muted-foreground">Price:</span> <strong>{u.price_label}</strong></div>
                                            <div><span className="text-muted-foreground">Yield:</span> <strong>{u.yield_range}</strong></div>
                                            <div><span className="text-muted-foreground">Total:</span> {u.total_units} units</div>
                                            <div><span className="text-muted-foreground">Available:</span> {u.available_units}</div>
                                        </div>
                                        {u.features.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {u.features.map((f) => <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>)}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Amenities Tab */}
                {tab === 'amenities' && (
                    <div className="space-y-4">
                        {showAddAmenity && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>New Amenity</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => setShowAddAmenity(false)}><X className="h-4 w-4" /></Button>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => { e.preventDefault(); addAmenityForm.post('/cms/investment/amenities', { onSuccess: () => { setShowAddAmenity(false); addAmenityForm.reset(); } }); }} className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1"><Label>Name *</Label><Input value={addAmenityForm.data.name} onChange={(e) => addAmenityForm.setData('name', e.target.value)} required /></div>
                                            <div className="space-y-1"><Label>Icon (Lucide name)</Label><Input value={addAmenityForm.data.icon} onChange={(e) => addAmenityForm.setData('icon', e.target.value)} placeholder="Shield" /></div>
                                            <div className="space-y-1"><Label>Image URL</Label><Input value={addAmenityForm.data.image} onChange={(e) => addAmenityForm.setData('image', e.target.value)} placeholder="/image.jpg" /></div>
                                        </div>
                                        <Button type="submit" disabled={addAmenityForm.processing}>Add Amenity</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                        {editingAmenity && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Edit: {editingAmenity.name}</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => setEditingAmenity(null)}><X className="h-4 w-4" /></Button>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => { e.preventDefault(); editAmenityForm.put(`/cms/investment/amenities/${editingAmenity.id}`, { onSuccess: () => setEditingAmenity(null) }); }} className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1"><Label>Name *</Label><Input value={editAmenityForm.data.name} onChange={(e) => editAmenityForm.setData('name', e.target.value)} required /></div>
                                            <div className="space-y-1"><Label>Icon</Label><Input value={editAmenityForm.data.icon} onChange={(e) => editAmenityForm.setData('icon', e.target.value)} /></div>
                                            <div className="space-y-1"><Label>Image URL</Label><Input value={editAmenityForm.data.image} onChange={(e) => editAmenityForm.setData('image', e.target.value)} /></div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" checked={editAmenityForm.data.is_active} onChange={(e) => editAmenityForm.setData('is_active', e.target.checked)} />
                                            <Label>Active</Label>
                                        </div>
                                        <Button type="submit" disabled={editAmenityForm.processing}>Save</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {amenities.map((a) => (
                                <Card key={a.id} className={!a.is_active ? 'opacity-60' : ''}>
                                    <CardContent className="p-4 flex items-center gap-3">
                                        {a.image && <img src={a.image} alt={a.name} className="w-12 h-12 rounded object-cover shrink-0" />}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium">{a.name}</div>
                                            {a.icon && <div className="text-xs text-muted-foreground">Icon: {a.icon}</div>}
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <Button variant="ghost" size="sm" onClick={() => openEditAmenity(a)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/investment/amenities/${a.id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
