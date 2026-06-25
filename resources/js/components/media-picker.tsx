import { useEffect, useRef, useState } from 'react';
import { Check, FileImage, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MediaItem {
    id: number;
    name: string;
    url: string;
    mime_type?: string;
    size: number;
}

interface Props {
    value: string;
    onChange: (url: string) => void;
    accept?: 'image' | 'video' | 'any';
    label?: string;
    placeholder?: string;
}

function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

function getCsrf() {
    return decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '');
}

export function MediaPicker({ value, onChange, accept = 'image', label, placeholder }: Props) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<'library' | 'upload'>('library');
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState(value);
    const fileRef = useRef<HTMLInputElement>(null);

    const mimeFilter = accept === 'image' ? 'image/' : accept === 'video' ? 'video/' : '';
    const acceptAttr = accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : 'image/*,video/*';

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        fetch('/cms/media?per_page=100', { headers: { Accept: 'application/json', 'X-Media-Picker': '1', 'X-Requested-With': 'XMLHttpRequest' } })
            .then((r) => r.json())
            .then((data) => {
                const items: MediaItem[] = data?.data?.data ?? data?.data ?? [];
                setMedia(mimeFilter ? items.filter((m) => m.mime_type?.startsWith(mimeFilter)) : items);
            })
            .catch(() => setMedia([]))
            .finally(() => setLoading(false));
    }, [open]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const form = new FormData();
        form.append('file', file);
        form.append('collection', 'general');
        try {
            const res = await fetch('/cms/media', {
                method: 'POST',
                body: form,
                headers: { 'X-XSRF-TOKEN': getCsrf() },
            });
            if (res.ok) {
                const saved: MediaItem = await res.json();
                setMedia((prev) => [saved, ...prev]);
                setSelected(saved.url);
                setTab('library');
            }
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const confirm = () => {
        onChange(selected);
        setOpen(false);
    };

    const clear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    return (
        <div className="space-y-2">
            {label && <p className="text-sm font-medium leading-none">{label}</p>}

            <div className="flex gap-2">
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder ?? (accept === 'video' ? '/video.mp4 or /image.jpg' : '/images/photo.jpg')}
                    className="flex-1 text-sm font-mono"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => { setSelected(value); setOpen(true); }}>
                    <FileImage className="h-4 w-4 mr-1.5" />
                    {value ? 'Change' : 'Choose'}
                </Button>
                {value && (
                    <Button type="button" variant="ghost" size="sm" onClick={clear}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {value && accept !== 'video' && (
                <div className="relative w-full max-w-xs rounded-lg overflow-hidden border border-border bg-muted">
                    {value.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                        <video src={value} className="w-full max-h-32 object-cover" muted />
                    ) : (
                        <img src={value} alt="preview" className="w-full max-h-32 object-cover" />
                    )}
                </div>
            )}

            {value && accept === 'video' && (
                <p className="text-xs text-muted-foreground font-mono truncate">{value}</p>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                        <DialogTitle>Choose Media</DialogTitle>
                    </DialogHeader>

                    {/* Tabs */}
                    <div className="flex gap-0 border-b border-border shrink-0">
                        <button
                            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'library' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setTab('library')}
                        >
                            Media Library
                        </button>
                        <button
                            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setTab('upload')}
                        >
                            Upload New
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {tab === 'upload' && (
                            <div className="space-y-4">
                                <div
                                    className="rounded-xl border-2 border-dashed border-border py-16 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                                    onClick={() => fileRef.current?.click()}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="font-medium text-sm">Click to upload a file</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {accept === 'image' ? 'Images (PNG, JPG, GIF, WebP)' : accept === 'video' ? 'Videos (MP4, WebM)' : 'Images and Videos'}
                                    </p>
                                    {uploading && <p className="text-sm text-primary mt-3 font-medium">Uploading...</p>}
                                </div>
                                <input ref={fileRef} type="file" accept={acceptAttr} className="hidden" onChange={handleUpload} />
                            </div>
                        )}

                        {tab === 'library' && (
                            <div className="space-y-4">
                                {loading && (
                                    <div className="py-16 text-center text-sm text-muted-foreground">Loading media...</div>
                                )}

                                {!loading && media.length === 0 && (
                                    <div className="py-16 text-center">
                                        <FileImage className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground">No media uploaded yet.</p>
                                        <Button variant="outline" size="sm" className="mt-3" onClick={() => setTab('upload')}>
                                            Upload your first file
                                        </Button>
                                    </div>
                                )}

                                {!loading && media.length > 0 && (
                                    <div className="grid grid-cols-4 gap-3">
                                        {media.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => setSelected(item.url)}
                                                className={`relative group rounded-lg overflow-hidden border-2 transition-all ${selected === item.url ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'}`}
                                            >
                                                {item.mime_type?.startsWith('video/') ? (
                                                    <video src={item.url} className="w-full aspect-square object-cover" muted />
                                                ) : (
                                                    <img src={item.url} alt={item.name} className="w-full aspect-square object-cover" />
                                                )}
                                                {selected === item.url && (
                                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                                                            <Check className="h-4 w-4 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-xs text-white truncate">{item.name}</p>
                                                    <p className="text-xs text-white/70">{formatSize(item.size)}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0 bg-muted/30">
                        {selected ? (
                            <p className="text-sm text-muted-foreground truncate max-w-xs">{selected}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">No file selected</p>
                        )}
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={confirm} disabled={!selected}>
                                <Check className="h-4 w-4 mr-2" />Use This
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
