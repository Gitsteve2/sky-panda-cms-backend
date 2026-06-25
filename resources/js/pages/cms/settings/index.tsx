import { Head, router, useForm } from '@inertiajs/react';
import { Calculator, Globe, Image, Layers, MapPin, Pencil, Plus, Save, Share2, Star, Trash2, X } from 'lucide-react';
import { MediaPicker } from '@/components/media-picker';
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

export default function SettingsIndex({ settings, heroSlides, socialLinks, stats, coreValues, trackRecords }: {
    settings: SettingsGroup; heroSlides: HeroSlide[];
    socialLinks: SocialLink[]; stats: StatsGroup;
    coreValues: CoreValue[]; trackRecords: TrackRecord[];
}) {
    const [tab, setTab] = useState<'general' | 'hero' | 'social' | 'stats' | 'about' | 'calculator' | 'location'>('general');
    const [editingHero, setEditingHero] = useState<HeroSlide | null>(null);
    const [showAddHero, setShowAddHero] = useState(false);
    const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
    const [showAddSocial, setShowAddSocial] = useState(false);
    const [editingStat, setEditingStat] = useState<Stat | null>(null);
    const [showAddStat, setShowAddStat] = useState(false);
    const [showAddValue, setShowAddValue] = useState(false);
    const [showAddTrack, setShowAddTrack] = useState(false);

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
        { key: 'general', label: 'General', icon: Globe },
        { key: 'hero', label: 'Hero Slides', icon: Image },
        { key: 'social', label: 'Social Links', icon: Share2 },
        { key: 'stats', label: 'Stats', icon: Star },
        { key: 'about', label: 'About', icon: Layers },
        { key: 'calculator', label: 'Calculator', icon: Calculator },
        { key: 'location', label: 'Location', icon: MapPin },
    ] as const;

    return (
        <>
            <Head title="Site Settings" />
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
                        <p className="text-muted-foreground mt-1">Configure site-wide content and branding.</p>
                    </div>
                    {(['general', 'calculator', 'location'] as const).includes(tab as 'general' | 'calculator' | 'location') && (
                        <Button onClick={saveSettings}>
                            <Save className="h-4 w-4 mr-2" />Save Settings
                        </Button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-border overflow-x-auto">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                        >
                            <t.icon className="h-4 w-4" />
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* General Settings */}
                {tab === 'general' && (
                    <div className="space-y-6 max-w-3xl">
                        {Object.entries(settings).map(([group, groupSettings]) => (
                            <Card key={group} className="overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-border pb-4">
                                    <CardTitle className="capitalize text-base">{group}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-5 space-y-5">
                                    {groupSettings.map((s) => (
                                        <div key={s.key} className="space-y-1.5">
                                            <Label>{s.label}</Label>
                                            {s.type === 'color' ? (
                                                <div className="flex items-center gap-3">
                                                    <Input type="color" value={settingValues[s.key] ?? '#000000'} onChange={(e) => setSettingValues((prev) => ({ ...prev, [s.key]: e.target.value }))} className="h-10 w-14 p-1 cursor-pointer" />
                                                    <Input value={settingValues[s.key] ?? ''} onChange={(e) => setSettingValues((prev) => ({ ...prev, [s.key]: e.target.value }))} className="flex-1" />
                                                </div>
                                            ) : s.type === 'image' ? (
                                                <MediaPicker
                                                    value={settingValues[s.key] ?? ''}
                                                    onChange={(url) => setSettingValues((prev) => ({ ...prev, [s.key]: url }))}
                                                    accept="image"
                                                    placeholder="/images/logo.png"
                                                />
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
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <Button onClick={() => { setShowAddHero(true); setEditingHero(null); }}>
                                <Plus className="h-4 w-4 mr-2" />Add Slide
                            </Button>
                        </div>

                        {(showAddHero || editingHero) && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-4">
                                    <CardTitle className="text-base">{editingHero ? 'Edit Slide' : 'New Hero Slide'}</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => { setShowAddHero(false); setEditingHero(null); }}><X className="h-4 w-4" /></Button>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (editingHero) heroForm.put(`/cms/settings/hero/${editingHero.id}`, { onSuccess: () => setEditingHero(null) });
                                        else heroForm.post('/cms/settings/hero', { onSuccess: () => setShowAddHero(false) });
                                    }} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5"><Label>Badge Text</Label><Input value={heroForm.data.badge_text} onChange={(e) => heroForm.setData('badge_text', e.target.value)} placeholder="New Launch" /></div>
                                            <div className="space-y-1.5"><Label>Heading *</Label><Input value={heroForm.data.heading} onChange={(e) => heroForm.setData('heading', e.target.value)} required /></div>
                                            <div className="space-y-1.5"><Label>Heading Highlight</Label><Input value={heroForm.data.heading_highlight} onChange={(e) => heroForm.setData('heading_highlight', e.target.value)} placeholder="colored portion" /></div>
                                            <div className="space-y-1.5"><Label>CTA Text</Label><Input value={heroForm.data.cta_text} onChange={(e) => heroForm.setData('cta_text', e.target.value)} placeholder="Learn More" /></div>
                                            <div className="space-y-1.5"><Label>CTA URL</Label><Input value={heroForm.data.cta_url} onChange={(e) => heroForm.setData('cta_url', e.target.value)} placeholder="#investment" /></div>
                                            <div className="space-y-1.5 col-span-2">
                                                <MediaPicker
                                                    label="Background (video or image)"
                                                    value={heroForm.data.background_src}
                                                    onChange={(url) => heroForm.setData('background_src', url)}
                                                    accept="any"
                                                    placeholder="/videos/hero.mp4 or /images/hero.jpg"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Subheading</Label>
                                            <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.data.subheading} onChange={(e) => heroForm.setData('subheading', e.target.value)} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="hero_active" checked={heroForm.data.is_active} onChange={(e) => heroForm.setData('is_active', e.target.checked)} className="rounded" />
                                            <Label htmlFor="hero_active">Active</Label>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="submit" disabled={heroForm.processing}>{heroForm.processing ? 'Saving...' : editingHero ? 'Save Changes' : 'Add Slide'}</Button>
                                            <Button type="button" variant="ghost" onClick={() => { setShowAddHero(false); setEditingHero(null); }}>Cancel</Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        <div className="space-y-3">
                            {heroSlides.length === 0 && (
                                <div className="rounded-xl border border-dashed border-border py-16 text-center">
                                    <Image className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">No hero slides yet.</p>
                                </div>
                            )}
                            {heroSlides.map((slide) => (
                                <div key={slide.id} className={`rounded-xl border border-border bg-card p-5 flex items-start justify-between gap-4 ${!slide.is_active ? 'opacity-60' : ''}`}>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm">
                                            {slide.heading} {slide.heading_highlight && <span className="text-primary">{slide.heading_highlight}</span>}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            {slide.badge_text && <Badge variant="outline" className="text-xs">{slide.badge_text}</Badge>}
                                            {!slide.is_active && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                                            <span className="text-xs text-muted-foreground font-mono">{slide.background_type}: {slide.background_src}</span>
                                        </div>
                                        {slide.subheading && <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{slide.subheading}</p>}
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <Button variant="ghost" size="sm" onClick={() => openEditHero(slide)}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete this slide?')) router.delete(`/cms/settings/hero/${slide.id}`); }}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Social Links */}
                {tab === 'social' && (
                    <div className="space-y-6 max-w-2xl">
                        <div className="flex justify-end">
                            <Button onClick={() => { setShowAddSocial(true); setEditingSocial(null); }}>
                                <Plus className="h-4 w-4 mr-2" />Add Link
                            </Button>
                        </div>

                        {(showAddSocial || editingSocial) && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-4">
                                    <CardTitle className="text-base">{editingSocial ? 'Edit Social Link' : 'New Social Link'}</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => { setShowAddSocial(false); setEditingSocial(null); }}><X className="h-4 w-4" /></Button>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (editingSocial) socialForm.put(`/cms/settings/social/${editingSocial.id}`, { onSuccess: () => setEditingSocial(null) });
                                        else socialForm.post('/cms/settings/social', { onSuccess: () => setShowAddSocial(false) });
                                    }} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5"><Label>Platform *</Label><Input value={socialForm.data.platform} onChange={(e) => socialForm.setData('platform', e.target.value)} placeholder="facebook" required /></div>
                                            <div className="space-y-1.5"><Label>Label *</Label><Input value={socialForm.data.label} onChange={(e) => socialForm.setData('label', e.target.value)} placeholder="Facebook" required /></div>
                                            <div className="col-span-2 space-y-1.5"><Label>URL *</Label><Input value={socialForm.data.url} onChange={(e) => socialForm.setData('url', e.target.value)} placeholder="https://facebook.com/..." required /></div>
                                            <div className="space-y-1.5"><Label>Icon name</Label><Input value={socialForm.data.icon} onChange={(e) => socialForm.setData('icon', e.target.value)} placeholder="Facebook" /></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="submit" disabled={socialForm.processing}>{editingSocial ? 'Save Changes' : 'Add Link'}</Button>
                                            <Button type="button" variant="ghost" onClick={() => { setShowAddSocial(false); setEditingSocial(null); }}>Cancel</Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        <div className="rounded-xl border border-border overflow-hidden bg-card">
                            {socialLinks.length === 0 ? (
                                <div className="py-16 text-center">
                                    <Share2 className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">No social links yet.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {socialLinks.map((link) => (
                                        <div key={link.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <Share2 className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm">{link.label}</div>
                                                <div className="text-xs text-muted-foreground truncate">{link.url}</div>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button variant="ghost" size="sm" onClick={() => { setEditingSocial(link); socialForm.setData({ platform: link.platform, label: link.label, url: link.url, icon: link.icon ?? '', order: link.order, is_active: link.is_active }); }}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/settings/social/${link.id}`); }}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats */}
                {tab === 'stats' && (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <Button onClick={() => { setShowAddStat(true); setEditingStat(null); }}>
                                <Plus className="h-4 w-4 mr-2" />Add Stat
                            </Button>
                        </div>

                        {(showAddStat || editingStat) && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-4">
                                    <CardTitle className="text-base">{editingStat ? 'Edit Stat' : 'New Stat'}</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => { setShowAddStat(false); setEditingStat(null); }}><X className="h-4 w-4" /></Button>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (editingStat) statForm.put(`/cms/settings/stats/${editingStat.id}`, { onSuccess: () => setEditingStat(null) });
                                        else statForm.post('/cms/settings/stats', { onSuccess: () => setShowAddStat(false) });
                                    }} className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-1.5"><Label>Group</Label><Input value={statForm.data.group} onChange={(e) => statForm.setData('group', e.target.value)} placeholder="general" /></div>
                                            <div className="space-y-1.5"><Label>Value *</Label><Input value={statForm.data.value} onChange={(e) => statForm.setData('value', e.target.value)} placeholder="150+" required /></div>
                                            <div className="space-y-1.5"><Label>Label *</Label><Input value={statForm.data.label} onChange={(e) => statForm.setData('label', e.target.value)} placeholder="Happy Investors" required /></div>
                                            <div className="space-y-1.5"><Label>Description</Label><Input value={statForm.data.description} onChange={(e) => statForm.setData('description', e.target.value)} /></div>
                                            <div className="space-y-1.5"><Label>Icon</Label><Input value={statForm.data.icon} onChange={(e) => statForm.setData('icon', e.target.value)} placeholder="Users" /></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="submit" disabled={statForm.processing}>{editingStat ? 'Save Changes' : 'Add Stat'}</Button>
                                            <Button type="button" variant="ghost" onClick={() => { setShowAddStat(false); setEditingStat(null); }}>Cancel</Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {Object.entries(stats).map(([group, groupStats]) => (
                            <div key={group}>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{group}</h3>
                                <div className="grid gap-3 md:grid-cols-3">
                                    {groupStats.map((stat) => (
                                        <div key={stat.id} className={`rounded-xl border border-border bg-card p-5 ${!stat.is_active ? 'opacity-60' : ''}`}>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                                                    <div className="text-sm font-medium mt-0.5">{stat.label}</div>
                                                    {stat.description && <div className="text-xs text-muted-foreground mt-1">{stat.description}</div>}
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => { setEditingStat(stat); statForm.setData({ group: stat.group, icon: stat.icon ?? '', value: stat.value, label: stat.label, description: stat.description ?? '', order: stat.order, is_active: stat.is_active }); }}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/settings/stats/${stat.id}`); }}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* About */}
                {tab === 'about' && (
                    <div className="space-y-10">
                        {/* Core Values */}
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-lg font-semibold">Core Values</h2>
                                    <p className="text-sm text-muted-foreground">{coreValues.length} values</p>
                                </div>
                                <Button size="sm" onClick={() => setShowAddValue(true)}>
                                    <Plus className="h-4 w-4 mr-2" />Add Value
                                </Button>
                            </div>
                            {showAddValue && (
                                <Card className="mb-5">
                                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                                        <CardTitle className="text-base">New Core Value</CardTitle>
                                        <Button variant="ghost" size="sm" onClick={() => setShowAddValue(false)}><X className="h-4 w-4" /></Button>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={(e) => { e.preventDefault(); valueForm.post('/cms/settings/core-values', { onSuccess: () => { setShowAddValue(false); valueForm.reset(); } }); }} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5"><Label>Title *</Label><Input value={valueForm.data.title} onChange={(e) => valueForm.setData('title', e.target.value)} required /></div>
                                                <div className="space-y-1.5"><Label>Icon (Lucide name)</Label><Input value={valueForm.data.icon} onChange={(e) => valueForm.setData('icon', e.target.value)} placeholder="Shield" /></div>
                                                <div className="col-span-2 space-y-1.5"><Label>Description *</Label><textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" value={valueForm.data.description} onChange={(e) => valueForm.setData('description', e.target.value)} required /></div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button type="submit" size="sm" disabled={valueForm.processing}>Add Value</Button>
                                                <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddValue(false)}>Cancel</Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                {coreValues.map((v) => (
                                    <div key={v.id} className="rounded-xl border border-border bg-card p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-sm">{v.title}</div>
                                                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{v.description}</div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="shrink-0 -mt-1 -mr-1" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/settings/core-values/${v.id}`); }}>
                                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Track Records */}
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-lg font-semibold">Track Record</h2>
                                    <p className="text-sm text-muted-foreground">{trackRecords.length} entries</p>
                                </div>
                                <Button size="sm" onClick={() => setShowAddTrack(true)}>
                                    <Plus className="h-4 w-4 mr-2" />Add Entry
                                </Button>
                            </div>
                            {showAddTrack && (
                                <Card className="mb-5">
                                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                                        <CardTitle className="text-base">New Track Record</CardTitle>
                                        <Button variant="ghost" size="sm" onClick={() => setShowAddTrack(false)}><X className="h-4 w-4" /></Button>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={(e) => { e.preventDefault(); trackForm.post('/cms/settings/track-records', { onSuccess: () => { setShowAddTrack(false); trackForm.reset(); } }); }} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5"><Label>Title *</Label><Input value={trackForm.data.title} onChange={(e) => trackForm.setData('title', e.target.value)} required /></div>
                                                <div className="space-y-1.5"><Label>Icon</Label><Input value={trackForm.data.icon} onChange={(e) => trackForm.setData('icon', e.target.value)} placeholder="Building2" /></div>
                                                <div className="space-y-1.5"><Label>Description</Label><Input value={trackForm.data.description} onChange={(e) => trackForm.setData('description', e.target.value)} /></div>
                                            </div>
                                            <MediaPicker label="Project Image" value={trackForm.data.image} onChange={(url) => trackForm.setData('image', url)} accept="image" placeholder="/images/project.jpg" />
                                            <div className="flex gap-2">
                                                <Button type="submit" size="sm" disabled={trackForm.processing}>Add Entry</Button>
                                                <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddTrack(false)}>Cancel</Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                            <div className="grid gap-3 md:grid-cols-2">
                                {trackRecords.map((t) => (
                                    <div key={t.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                                        {t.image ? (
                                            <img src={t.image} alt={t.title} className="w-16 h-16 rounded-lg object-cover shrink-0 border border-border" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <Layers className="h-6 w-6 text-primary" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm">{t.title}</div>
                                            {t.description && <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>}
                                        </div>
                                        <Button variant="ghost" size="sm" className="shrink-0" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/settings/track-records/${t.id}`); }}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Calculator */}
                {tab === 'calculator' && (
                    <div className="space-y-6 max-w-2xl">
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border pb-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Calculator className="h-4 w-4 text-primary" />ROI Calculator Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-5">
                                <div className="space-y-1.5">
                                    <Label>Section Heading</Label>
                                    <Input value={settingValues['calculator_heading'] ?? 'Investment Calculator'} onChange={(e) => setSettingValues((p) => ({ ...p, calculator_heading: e.target.value }))} placeholder="Investment Calculator" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Section Subheading</Label>
                                    <Input value={settingValues['calculator_subheading'] ?? ''} onChange={(e) => setSettingValues((p) => ({ ...p, calculator_subheading: e.target.value }))} placeholder="Estimate your potential passive income" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border pb-4">
                                <CardTitle className="text-base">Default Values</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-5">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>Default Unit Price (KES)</Label>
                                        <Input type="number" value={settingValues['calculator_default_price'] ?? '3950000'} onChange={(e) => setSettingValues((p) => ({ ...p, calculator_default_price: e.target.value }))} placeholder="3950000" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Default Down Payment %</Label>
                                        <Input type="number" min={0} max={100} value={settingValues['calculator_default_dp'] ?? '30'} onChange={(e) => setSettingValues((p) => ({ ...p, calculator_default_dp: e.target.value }))} placeholder="30" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Default Yield % /year</Label>
                                        <Input type="number" step="0.1" min={0} value={settingValues['calculator_default_yield'] ?? '9'} onChange={(e) => setSettingValues((p) => ({ ...p, calculator_default_yield: e.target.value }))} placeholder="9" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Down Payment Options (comma-separated %)</Label>
                                    <Input value={settingValues['calculator_dp_options'] ?? '30,50,100'} onChange={(e) => setSettingValues((p) => ({ ...p, calculator_dp_options: e.target.value }))} placeholder="30,50,100" />
                                    <p className="text-xs text-muted-foreground">e.g. 30,50,100 — shown as 30%, 50%, 100% (Cash)</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border pb-4">
                                <CardTitle className="text-base">CTA Buttons</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>Primary Button Text</Label>
                                        <Input value={settingValues['calculator_cta_text'] ?? 'See our Brochure'} onChange={(e) => setSettingValues((p) => ({ ...p, calculator_cta_text: e.target.value }))} placeholder="See our Brochure" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Primary Button URL</Label>
                                        <Input value={settingValues['calculator_cta_url'] ?? ''} onChange={(e) => setSettingValues((p) => ({ ...p, calculator_cta_url: e.target.value }))} placeholder="https://bit.ly/..." />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>WhatsApp Number (digits only)</Label>
                                    <Input value={settingValues['calculator_whatsapp'] ?? ''} onChange={(e) => setSettingValues((p) => ({ ...p, calculator_whatsapp: e.target.value }))} placeholder="254739695307" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Disclaimer / footnote text</Label>
                                    <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" value={settingValues['calculator_disclaimer'] ?? ''} onChange={(e) => setSettingValues((p) => ({ ...p, calculator_disclaimer: e.target.value }))} placeholder="* These are estimates based on current market conditions. Actual returns may vary." />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Location / Map */}
                {tab === 'location' && (
                    <div className="space-y-6 max-w-2xl">
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border pb-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />Location Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-5">
                                <div className="space-y-1.5">
                                    <Label>Section Heading</Label>
                                    <Input value={settingValues['location_heading'] ?? 'Location'} onChange={(e) => setSettingValues((p) => ({ ...p, location_heading: e.target.value }))} placeholder="Location" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Address</Label>
                                    <Input value={settingValues['location_address'] ?? ''} onChange={(e) => setSettingValues((p) => ({ ...p, location_address: e.target.value }))} placeholder="Kinoo, Waiyaki Way, Nairobi" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Short Description</Label>
                                    <Input value={settingValues['location_description'] ?? ''} onChange={(e) => setSettingValues((p) => ({ ...p, location_description: e.target.value }))} placeholder="Strategic location along Waiyaki Way" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border pb-4">
                                <CardTitle className="text-base">Map Embed</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-5">
                                <div className="space-y-1.5">
                                    <Label>Google Maps Embed URL</Label>
                                    <Input value={settingValues['location_embed_url'] ?? ''} onChange={(e) => setSettingValues((p) => ({ ...p, location_embed_url: e.target.value }))} placeholder="https://maps.google.com/maps?q=...&output=embed" />
                                    <p className="text-xs text-muted-foreground">Go to Google Maps → Share → Embed a map → copy the <code className="bg-muted px-1 rounded">src</code> URL from the iframe code.</p>
                                </div>
                                <MediaPicker
                                    label="Static Map Image (fallback if no embed URL)"
                                    value={settingValues['location_map_image'] ?? ''}
                                    onChange={(url) => setSettingValues((p) => ({ ...p, location_map_image: url }))}
                                    accept="image"
                                    placeholder="/sky-map.png"
                                />
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border pb-4">
                                <CardTitle className="text-base">Proximity Highlights</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-3">
                                <p className="text-xs text-muted-foreground">One highlight per line, in the format: <code className="bg-muted px-1 rounded">value|label</code></p>
                                <textarea
                                    className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={settingValues['location_highlights'] ?? '10 km|from ABC Place\n20 mins|to ABC Place\n25 mins|to Lavington\n30 mins|to Gigiri'}
                                    onChange={(e) => setSettingValues((p) => ({ ...p, location_highlights: e.target.value }))}
                                    placeholder={'10 km|from ABC Place\n20 mins|to ABC Place'}
                                />
                                <p className="text-xs text-muted-foreground">Preview: these are displayed as a grid of distance/time cards on the map section of the About page.</p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}
