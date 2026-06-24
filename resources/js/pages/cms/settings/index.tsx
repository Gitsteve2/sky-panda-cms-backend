import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Setting { id: number; key: string; value?: string; type: string; group: string; label: string }
interface HeroSlide { id: number; badge_text?: string; heading: string; heading_highlight?: string; subheading?: string; cta_text?: string; cta_url?: string; background_type: string; background_src?: string; is_active: boolean; order: number }
interface SocialLink { id: number; platform: string; label: string; url: string; icon?: string; order: number; is_active: boolean }
interface Stat { id: number; group: string; value: string; label: string; description?: string; icon?: string; order: number; is_active: boolean }
interface CoreValue { id: number; title: string; description: string; icon?: string; icon_color: string; order: number; is_active: boolean }
interface TrackRecord { id: number; title: string; description?: string; icon?: string; image?: string; order: number; is_active: boolean }

type SettingsGroup = Record<string, Setting[]>;
type StatsGroup = Record<string, Stat[]>;

export default function SettingsIndex({
    settings, heroSlides, socialLinks, stats, coreValues, trackRecords,
}: {
    settings: SettingsGroup; heroSlides: HeroSlide[];
    socialLinks: SocialLink[]; stats: StatsGroup;
    coreValues: CoreValue[]; trackRecords: TrackRecord[];
}) {
    const [tab, setTab] = useState<'general' | 'hero' | 'social' | 'stats' | 'about'>('general');
    const [editingHero, setEditingHero] = useState<HeroSlide | null>(null);
    const [showAddHero, setShowAddHero] = useState(false);
    const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
    const [showAddSocial, setShowAddSocial] = useState(false);
    const [editingStat, setEditingStat] = useState<Stat | null>(null);
    const [showAddStat, setShowAddStat] = useState(false);
    const [editingValue, setEditingValue] = useState<CoreValue | null>(null);
    const [showAddValue, setShowAddValue] = useState(false);
    const [editingTrack, setEditingTrack] = useState<TrackRecord | null>(null);
    const [showAddTrack, setShowAddTrack] = useState(false);

    // Settings form - track all setting values
    const allSettings = Object.values(settings).flat();
    const [settingValues, setSettingValues] = useState<Record<string, string>>(
        Object.fromEntries(allSettings.map((s) => [s.key, s.value ?? '']))
    );

    const saveSettings = () => {
        router.post('/cms/settings', {
            settings: Object.entries(settingValues).map(([key, value]) => ({ key, value })),
        });
    };

    const heroForm = useForm({ badge_text: '', heading: '', heading_highlight: '', subheading: '', cta_text: '', cta_url: '', cta_target: '_blank', background_type: 'video', background_src: '', background_poster: '', overlay_color: '', order: 1, is_active: true });
    const socialForm = useForm({ platform: '', label: '', url: '', icon: '', order: 0, is_active: true });
    const statForm = useForm({ group: 'general', icon: '', value: '', label: '', description: '', order: 0, is_active: true });
    const valueForm = useForm({ title: '', description: '', icon: '', icon_color: '#15803d', order: 0, is_active: true });
    const trackForm = useForm({ title: '', description: '', icon: '', image: '', order: 0, is_active: true });

    const openEditHero = (h: HeroSlide) => {
        setEditingHero(h);
        heroForm.setData({ badge_text: h.badge_text ?? '', heading: h.heading, heading_highlight: h.heading_highlight ?? '', subheading: h.subheading ?? '', cta_text: h.cta_text ?? '', cta_url: h.cta_url ?? '', cta_target: '_blank', background_type: h.background_type, background_src: h.background_src ?? '', background_poster: '', overlay_color: '', order: h.order, is_active: h.is_active });
    };

    const tabs = [
        { key: 'general', label: 'General & Branding' },
        { key: 'hero', label: 'Hero Slides' },
        { key: 'social', label: 'Social Links' },
        { key: 'stats', label: 'Stats' },
        { key: 'about', label: 'About (Values & Track)' },
    ] as const;

    return (
        <>
            <Head title="Site Settings" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Site Settings</h1>
                    {tab === 'general' && (
                        <Button onClick={saveSettings}><Save className="h-4 w-4 mr-2" />Save Settings</Button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-border overflow-x-auto">
                    {tabs.map((t) => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* General Settings */}
                {tab === 'general' && (
                    <div className="space-y-6">
                        {Object.entries(settings).map(([group, groupSettings]) => (
                            <Card key={group}>
                                <CardHeader><CardTitle className="capitalize">{group}</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {groupSettings.map((s) => (
                                        <div key={s.key} className="space-y-1">
                                            <Label>{s.label}</Label>
                                            {s.type === 'color' ? (
                                                <div className="flex items-center gap-3">
                                                    <Input type="color" value={settingValues[s.key] ?? '#000000'} onChange={(e) => setSettingValues((prev) => ({ ...prev, [s.key]: e.target.value }))} className="h-10 w-20" />
                                                    <Input value={settingValues[s.key] ?? ''} onChange={(e) => setSettingValues((prev) => ({ ...prev, [s.key]: e.target.value }))} className="flex-1" />
                                                </div>
                                            ) : s.type === 'image' ? (
                                                <div className="flex items-center gap-3">
                                                    {settingValues[s.key] && <img src={settingValues[s.key]} alt={s.label} className="h-10 rounded border object-contain" />}
                                                    <Input value={settingValues[s.key] ?? ''} onChange={(e) => setSettingValues((prev) => ({ ...prev, [s.key]: e.target.value }))} placeholder="/path-to-image.png" className="flex-1" />
                                                </div>
                                            ) : (
                                                <Input value={settingValues[s.key] ?? ''} onChange={(e) => setSettingValues((prev) => ({ ...prev, [s.key]: e.target.value }))} />
                                            )}
                                            <p className="text-xs text-muted-foreground font-mono">{s.key}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Hero Slides */}
                {tab === 'hero' && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={() => setShowAddHero(true)}><Plus className="h-4 w-4 mr-2" />Add Slide</Button>
                        </div>
                        {(showAddHero || editingHero) && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>{editingHero ? 'Edit Slide' : 'New Slide'}</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => { setShowAddHero(false); setEditingHero(null); }}><X className="h-4 w-4" /></Button>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (editingHero) heroForm.put(`/cms/settings/hero/${editingHero.id}`, { onSuccess: () => setEditingHero(null) });
                                        else heroForm.post('/cms/settings/hero', { onSuccess: () => setShowAddHero(false) });
                                    }} className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1"><Label>Badge Text</Label><Input value={heroForm.data.badge_text} onChange={(e) => heroForm.setData('badge_text', e.target.value)} /></div>
                                            <div className="space-y-1"><Label>Heading *</Label><Input value={heroForm.data.heading} onChange={(e) => heroForm.setData('heading', e.target.value)} required /></div>
                                            <div className="space-y-1"><Label>Heading Highlight</Label><Input value={heroForm.data.heading_highlight} onChange={(e) => heroForm.setData('heading_highlight', e.target.value)} placeholder="colored part of heading" /></div>
                                            <div className="space-y-1"><Label>CTA Text</Label><Input value={heroForm.data.cta_text} onChange={(e) => heroForm.setData('cta_text', e.target.value)} /></div>
                                            <div className="space-y-1"><Label>CTA URL</Label><Input value={heroForm.data.cta_url} onChange={(e) => heroForm.setData('cta_url', e.target.value)} /></div>
                                            <div className="space-y-1"><Label>Background (video/image path)</Label><Input value={heroForm.data.background_src} onChange={(e) => heroForm.setData('background_src', e.target.value)} placeholder="/video.mp4 or /image.jpg" /></div>
                                        </div>
                                        <div className="space-y-1"><Label>Subheading</Label><textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={heroForm.data.subheading} onChange={(e) => heroForm.setData('subheading', e.target.value)} /></div>
                                        <div className="flex items-center gap-2"><input type="checkbox" checked={heroForm.data.is_active} onChange={(e) => heroForm.setData('is_active', e.target.checked)} /><Label>Active</Label></div>
                                        <Button type="submit" disabled={heroForm.processing}>{heroForm.processing ? 'Saving...' : (editingHero ? 'Save Changes' : 'Add Slide')}</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                        <div className="space-y-3">
                            {heroSlides.map((slide) => (
                                <Card key={slide.id} className={!slide.is_active ? 'opacity-60' : ''}>
                                    <CardContent className="p-4 flex items-start justify-between gap-3">
                                        <div>
                                            <div className="font-medium">{slide.heading} <span className="text-primary">{slide.heading_highlight}</span></div>
                                            {slide.badge_text && <Badge variant="outline" className="text-xs mt-1">{slide.badge_text}</Badge>}
                                            <div className="text-xs text-muted-foreground mt-1">{slide.background_type}: {slide.background_src}</div>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <Button variant="ghost" size="sm" onClick={() => openEditHero(slide)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/settings/hero/${slide.id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Social Links */}
                {tab === 'social' && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={() => setShowAddSocial(true)}><Plus className="h-4 w-4 mr-2" />Add Link</Button>
                        </div>
                        {(showAddSocial || editingSocial) && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>{editingSocial ? 'Edit Link' : 'New Social Link'}</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => { setShowAddSocial(false); setEditingSocial(null); }}><X className="h-4 w-4" /></Button>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (editingSocial) socialForm.put(`/cms/settings/social/${editingSocial.id}`, { onSuccess: () => setEditingSocial(null) });
                                        else socialForm.post('/cms/settings/social', { onSuccess: () => setShowAddSocial(false) });
                                    }} className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1"><Label>Platform *</Label><Input value={socialForm.data.platform} onChange={(e) => socialForm.setData('platform', e.target.value)} placeholder="facebook" required /></div>
                                            <div className="space-y-1"><Label>Label *</Label><Input value={socialForm.data.label} onChange={(e) => socialForm.setData('label', e.target.value)} placeholder="Facebook" required /></div>
                                            <div className="col-span-2 space-y-1"><Label>URL *</Label><Input value={socialForm.data.url} onChange={(e) => socialForm.setData('url', e.target.value)} placeholder="https://..." required /></div>
                                            <div className="space-y-1"><Label>Icon name</Label><Input value={socialForm.data.icon} onChange={(e) => socialForm.setData('icon', e.target.value)} placeholder="Facebook" /></div>
                                        </div>
                                        <Button type="submit" disabled={socialForm.processing}>{editingSocial ? 'Save' : 'Add'}</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                        <Card>
                            <CardContent className="p-0 divide-y">
                                {socialLinks.map((link) => (
                                    <div key={link.id} className="flex items-center gap-3 px-4 py-3">
                                        <div className="flex-1">
                                            <div className="font-medium">{link.label}</div>
                                            <div className="text-xs text-muted-foreground truncate">{link.url}</div>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <Button variant="ghost" size="sm" onClick={() => { setEditingSocial(link); socialForm.setData({ platform: link.platform, label: link.label, url: link.url, icon: link.icon ?? '', order: link.order, is_active: link.is_active }); }}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/settings/social/${link.id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Stats */}
                {tab === 'stats' && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={() => setShowAddStat(true)}><Plus className="h-4 w-4 mr-2" />Add Stat</Button>
                        </div>
                        {(showAddStat || editingStat) && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>{editingStat ? 'Edit Stat' : 'New Stat'}</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => { setShowAddStat(false); setEditingStat(null); }}><X className="h-4 w-4" /></Button>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (editingStat) statForm.put(`/cms/settings/stats/${editingStat.id}`, { onSuccess: () => setEditingStat(null) });
                                        else statForm.post('/cms/settings/stats', { onSuccess: () => setShowAddStat(false) });
                                    }} className="space-y-3">
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="space-y-1"><Label>Group</Label><Input value={statForm.data.group} onChange={(e) => statForm.setData('group', e.target.value)} placeholder="testimonials" /></div>
                                            <div className="space-y-1"><Label>Value *</Label><Input value={statForm.data.value} onChange={(e) => statForm.setData('value', e.target.value)} placeholder="150+" required /></div>
                                            <div className="space-y-1"><Label>Label *</Label><Input value={statForm.data.label} onChange={(e) => statForm.setData('label', e.target.value)} placeholder="Happy Investors" required /></div>
                                            <div className="space-y-1"><Label>Description</Label><Input value={statForm.data.description} onChange={(e) => statForm.setData('description', e.target.value)} placeholder="Satisfied property owners" /></div>
                                            <div className="space-y-1"><Label>Icon</Label><Input value={statForm.data.icon} onChange={(e) => statForm.setData('icon', e.target.value)} placeholder="Users" /></div>
                                        </div>
                                        <Button type="submit" disabled={statForm.processing}>{editingStat ? 'Save' : 'Add'}</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                        {Object.entries(stats).map(([group, groupStats]) => (
                            <div key={group}>
                                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">{group}</h3>
                                <div className="grid gap-3 md:grid-cols-3">
                                    {groupStats.map((stat) => (
                                        <Card key={stat.id} className={!stat.is_active ? 'opacity-60' : ''}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="text-2xl font-bold">{stat.value}</div>
                                                        <div className="text-sm font-medium">{stat.label}</div>
                                                        {stat.description && <div className="text-xs text-muted-foreground">{stat.description}</div>}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button variant="ghost" size="sm" onClick={() => { setEditingStat(stat); statForm.setData({ group: stat.group, icon: stat.icon ?? '', value: stat.value, label: stat.label, description: stat.description ?? '', order: stat.order, is_active: stat.is_active }); }}><Pencil className="h-4 w-4" /></Button>
                                                        <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/settings/stats/${stat.id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* About: Core Values + Track Records */}
                {tab === 'about' && (
                    <div className="space-y-8">
                        {/* Core Values */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Core Values</h2>
                                <Button size="sm" onClick={() => setShowAddValue(true)}><Plus className="h-4 w-4 mr-2" />Add</Button>
                            </div>
                            {showAddValue && (
                                <Card className="mb-4">
                                    <CardContent className="p-4">
                                        <form onSubmit={(e) => { e.preventDefault(); valueForm.post('/cms/settings/core-values', { onSuccess: () => { setShowAddValue(false); valueForm.reset(); } }); }} className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1"><Label>Title *</Label><Input value={valueForm.data.title} onChange={(e) => valueForm.setData('title', e.target.value)} required /></div>
                                                <div className="space-y-1"><Label>Icon</Label><Input value={valueForm.data.icon} onChange={(e) => valueForm.setData('icon', e.target.value)} placeholder="Shield" /></div>
                                                <div className="col-span-2 space-y-1"><Label>Description *</Label><textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={valueForm.data.description} onChange={(e) => valueForm.setData('description', e.target.value)} required /></div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button type="submit" size="sm" disabled={valueForm.processing}>Add</Button>
                                                <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddValue(false)}><X className="h-4 w-4" /></Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                {coreValues.map((v) => (
                                    <Card key={v.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div><div className="font-medium">{v.title}</div><div className="text-xs text-muted-foreground mt-1">{v.description}</div></div>
                                                <div className="flex gap-1 shrink-0">
                                                    <Button variant="ghost" size="sm" onClick={() => router.delete(`/cms/settings/core-values/${v.id}`)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Track Records */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Track Record</h2>
                                <Button size="sm" onClick={() => setShowAddTrack(true)}><Plus className="h-4 w-4 mr-2" />Add</Button>
                            </div>
                            {showAddTrack && (
                                <Card className="mb-4">
                                    <CardContent className="p-4">
                                        <form onSubmit={(e) => { e.preventDefault(); trackForm.post('/cms/settings/track-records', { onSuccess: () => { setShowAddTrack(false); trackForm.reset(); } }); }} className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1"><Label>Title *</Label><Input value={trackForm.data.title} onChange={(e) => trackForm.setData('title', e.target.value)} required /></div>
                                                <div className="space-y-1"><Label>Icon</Label><Input value={trackForm.data.icon} onChange={(e) => trackForm.setData('icon', e.target.value)} placeholder="Building2" /></div>
                                                <div className="space-y-1"><Label>Image URL</Label><Input value={trackForm.data.image} onChange={(e) => trackForm.setData('image', e.target.value)} placeholder="/embakasi.jpg" /></div>
                                                <div className="space-y-1"><Label>Description</Label><Input value={trackForm.data.description} onChange={(e) => trackForm.setData('description', e.target.value)} /></div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button type="submit" size="sm" disabled={trackForm.processing}>Add</Button>
                                                <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddTrack(false)}><X className="h-4 w-4" /></Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                            <div className="grid gap-3 md:grid-cols-2">
                                {trackRecords.map((t) => (
                                    <Card key={t.id}>
                                        <CardContent className="p-4 flex gap-3">
                                            {t.image && <img src={t.image} alt={t.title} className="w-16 h-16 rounded object-cover shrink-0" />}
                                            <div className="flex-1">
                                                <div className="font-medium">{t.title}</div>
                                                {t.description && <div className="text-xs text-muted-foreground">{t.description}</div>}
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => router.delete(`/cms/settings/track-records/${t.id}`)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
