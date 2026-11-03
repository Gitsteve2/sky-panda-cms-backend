import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Check, FileImage, FolderOpen, ImagePlus, Loader2, Search, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MediaItem {
    id: number;
    name: string;
    url: string;
    mime_type?: string;
    size: number;
    collection?: string;
    alt_text?: string;
}

interface Props {
    value: string;
    onChange: (url: string) => void;
    accept?: 'image' | 'video' | 'any';
    label?: string;
    placeholder?: string;
    collection?: string;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function formatSize(bytes: number) {
    if (!bytes || bytes < 1024) return (bytes || 0) + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

function getCsrf() {
    return decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '');
}

export function MediaPicker({ value, onChange, accept = 'image', label, placeholder, collection = 'general' }: Props) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<'library' | 'upload'>('library');
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selected, setSelected] = useState(value);
    const [imgError, setImgError] = useState(false);

    const fileRef = useRef<HTMLInputElement>(null);
    const directFileRef = useRef<HTMLInputElement>(null);

    const mimeFilter = accept === 'image' ? 'image/' : accept === 'video' ? 'video/' : '';
    const acceptAttr =
        accept === 'image'
            ? 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'
            : accept === 'video'
              ? 'video/mp4,video/webm,video/quicktime'
              : 'image/*,video/*';

    useEffect(() => {
        setImgError(false);
    }, [value]);

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        setUploadError(null);
        fetch('/cms/media?per_page=150', {
            headers: {
                Accept: 'application/json',
                'X-Media-Picker': '1',
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
            .then((r) => r.json())
            .then((data) => {
                const items: MediaItem[] = data?.data?.data ?? data?.data ?? [];
                setMedia(mimeFilter ? items.filter((m) => m.mime_type?.startsWith(mimeFilter)) : items);
            })
            .catch(() => setMedia([]))
            .finally(() => setLoading(false));
    }, [open, mimeFilter]);

    const filteredMedia = useMemo(() => {
        if (!searchQuery.trim()) return media;
        const q = searchQuery.toLowerCase();
        return media.filter(
            (item) =>
                item.name?.toLowerCase().includes(q) ||
                item.url?.toLowerCase().includes(q) ||
                item.collection?.toLowerCase().includes(q),
        );
    }, [media, searchQuery]);

    const validateFile = (file: File): string | null => {
        if (file.size > MAX_FILE_SIZE_BYTES) {
            return `File "${file.name}" (${formatSize(file.size)}) exceeds the 10MB maximum size limit.`;
        }
        if (accept === 'image' && !file.type.startsWith('image/')) {
            return 'Please select a valid image file (JPG, PNG, WebP, GIF, or SVG).';
        }
        if (accept === 'video' && !file.type.startsWith('video/')) {
            return 'Please select a valid video file (MP4, WebM, or MOV).';
        }
        return null;
    };

    const uploadFile = async (file: File, applyDirectly: boolean) => {
        const validationMessage = validateFile(file);
        if (validationMessage) {
            setUploadError(validationMessage);
            toast.error(validationMessage);
            return;
        }

        setUploadError(null);
        setUploading(true);
        const form = new FormData();
        form.append('file', file);
        form.append('collection', collection);

        try {
            const res = await fetch('/cms/media', {
                method: 'POST',
                body: form,
                headers: {
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrf(),
                },
            });

            if (res.ok) {
                const saved: MediaItem = await res.json();
                setMedia((prev) => [saved, ...prev]);
                setSelected(saved.url);
                if (applyDirectly) {
                    onChange(saved.url);
                    setOpen(false);
                } else {
                    setTab('library');
                }
                toast.success(`Uploaded "${saved.name}" successfully.`);
            } else {
                const errData = await res.json().catch(() => null);
                const message = errData?.message || 'Failed to upload file. Please check permissions or file format.';
                setUploadError(message);
                toast.error(message);
            }
        } catch {
            const message = 'Network error while uploading file.';
            setUploadError(message);
            toast.error(message);
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
            if (directFileRef.current) directFileRef.current.value = '';
        }
    };

    const handleUploadInput = (e: React.ChangeEvent<HTMLInputElement>, applyDirectly: boolean) => {
        const file = e.target.files?.[0];
        if (!file) return;
        uploadFile(file, applyDirectly);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, applyDirectly: boolean) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        uploadFile(file, applyDirectly);
    };

    const confirm = () => {
        onChange(selected);
        setOpen(false);
    };

    const clear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setSelected('');
    };

    return (
        <div className="space-y-2.5">
            {label && <p className="text-sm font-semibold leading-none text-foreground">{label}</p>}

            {/* Preview or Quick Upload Box */}
            {accept !== 'video' && (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => handleDrop(e, true)}
                    className={`relative rounded-xl overflow-hidden border transition-all ${
                        isDragging
                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                            : value
                              ? 'border-border bg-muted/30'
                              : 'border-dashed border-border/80 bg-muted/15 hover:border-primary/50 hover:bg-muted/30'
                    }`}
                >
                    {value ? (
                        <div className="relative group">
                            {value.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                <video src={value} className="w-full h-44 object-cover" muted />
                            ) : !imgError ? (
                                <img
                                    src={value}
                                    alt="Cover preview"
                                    className="w-full h-44 object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="w-full h-44 flex flex-col items-center justify-center bg-muted/50 text-muted-foreground p-4 text-center">
                                    <FileImage className="h-8 w-8 mb-2 opacity-50" />
                                    <span className="text-xs font-medium">Image preview unavailable</span>
                                    <span className="text-[11px] font-mono opacity-75 truncate max-w-full mt-0.5">{value}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 text-xs font-semibold shadow-sm"
                                    onClick={() => directFileRef.current?.click()}
                                    disabled={uploading}
                                >
                                    {uploading ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 mr-1.5" />}
                                    Upload New
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 text-xs font-semibold shadow-sm"
                                    onClick={() => {
                                        setSelected(value);
                                        setOpen(true);
                                    }}
                                >
                                    <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
                                    Library
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 w-8 p-0 shadow-sm"
                                    onClick={clear}
                                    title="Remove image"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="py-7 px-4 text-center cursor-pointer"
                            onClick={() => directFileRef.current?.click()}
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2.5 border border-primary/20">
                                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                            </div>
                            <p className="text-xs font-semibold text-foreground">
                                {uploading ? 'Uploading image...' : 'Click to upload or drag & drop'}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                JPG, PNG, WebP or GIF (max 10MB)
                            </p>
                            <div className="mt-3 flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => directFileRef.current?.click()}
                                    disabled={uploading}
                                >
                                    <Upload className="h-3 w-3 mr-1.5" />
                                    Upload File
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => {
                                        setSelected(value);
                                        setOpen(true);
                                    }}
                                >
                                    <FolderOpen className="h-3 w-3 mr-1.5" />
                                    Browse Library
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Direct file input */}
            <input
                ref={directFileRef}
                type="file"
                accept={acceptAttr}
                className="hidden"
                onChange={(e) => handleUploadInput(e, true)}
            />

            {/* URL Input + Library Trigger */}
            <div className="flex gap-1.5">
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder ?? (accept === 'video' ? '/video.mp4 or /image.jpg' : '/storage/media/... or https://...')}
                    className="flex-1 h-9 text-xs font-mono"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-2.5 text-xs shrink-0"
                    onClick={() => {
                        setSelected(value);
                        setOpen(true);
                    }}
                >
                    <FileImage className="h-3.5 w-3.5 mr-1.5" />
                    {value ? 'Change' : 'Choose'}
                </Button>
                {value && (
                    <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0 shrink-0 text-muted-foreground hover:text-destructive" onClick={clear} title="Clear">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {uploadError && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{uploadError}</span>
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                        <DialogTitle>Media Library</DialogTitle>
                    </DialogHeader>

                    {/* Tabs & Search */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 border-b border-border shrink-0 bg-muted/15">
                        <div className="flex gap-0">
                            <button
                                type="button"
                                className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'library' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setTab('library')}
                            >
                                Media Library ({media.length})
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setTab('upload')}
                            >
                                Upload New
                            </button>
                        </div>

                        {tab === 'library' && media.length > 0 && (
                            <div className="relative py-2 sm:w-60">
                                <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search media files..."
                                    className="h-8 pl-8 text-xs"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {tab === 'upload' && (
                            <div className="space-y-4">
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => handleDrop(e, false)}
                                    className={`rounded-xl border-2 border-dashed py-16 text-center cursor-pointer transition-all ${
                                        isDragging
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary hover:bg-primary/5'
                                    }`}
                                    onClick={() => fileRef.current?.click()}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                        {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                                    </div>
                                    <p className="font-semibold text-sm">
                                        {uploading ? 'Uploading your file...' : 'Click to select or drag & drop a file'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {accept === 'image'
                                            ? 'Supported formats: PNG, JPG, JPEG, WebP, GIF, SVG (Max 10MB)'
                                            : accept === 'video'
                                              ? 'Supported formats: MP4, WebM, MOV (Max 10MB)'
                                              : 'Images and Videos (Max 10MB)'}
                                    </p>
                                </div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept={acceptAttr}
                                    className="hidden"
                                    onChange={(e) => handleUploadInput(e, false)}
                                />
                            </div>
                        )}

                        {tab === 'library' && (
                            <div className="space-y-4">
                                {loading && (
                                    <div className="py-16 flex flex-col items-center justify-center text-sm text-muted-foreground gap-2">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        <span>Loading media library...</span>
                                    </div>
                                )}

                                {!loading && filteredMedia.length === 0 && (
                                    <div className="py-16 text-center">
                                        <FileImage className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-sm font-medium text-foreground">
                                            {searchQuery ? 'No matching media files found' : 'No media uploaded yet'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {searchQuery ? 'Try a different search term or upload a new file.' : 'Upload an image from your computer to get started.'}
                                        </p>
                                        <Button variant="outline" size="sm" className="mt-4" onClick={() => setTab('upload')}>
                                            <Upload className="h-3.5 w-3.5 mr-1.5" />
                                            Upload New File
                                        </Button>
                                    </div>
                                )}

                                {!loading && filteredMedia.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {filteredMedia.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => setSelected(item.url)}
                                                onDoubleClick={() => {
                                                    onChange(item.url);
                                                    setOpen(false);
                                                }}
                                                className={`relative group rounded-lg overflow-hidden border-2 text-left transition-all ${
                                                    selected === item.url
                                                        ? 'border-primary ring-2 ring-primary/30'
                                                        : 'border-border hover:border-primary/50'
                                                }`}
                                            >
                                                {item.mime_type?.startsWith('video/') ? (
                                                    <video src={item.url} className="w-full aspect-square object-cover" muted />
                                                ) : (
                                                    <img src={item.url} alt={item.name} className="w-full aspect-square object-cover bg-muted" />
                                                )}
                                                {selected === item.url && (
                                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow">
                                                            <Check className="h-4 w-4 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-xs text-white font-medium truncate">{item.name}</p>
                                                    <p className="text-[10px] text-white/75">{formatSize(item.size)}</p>
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
                            <p className="text-xs font-mono text-muted-foreground truncate max-w-xs">{selected}</p>
                        ) : (
                            <p className="text-xs text-muted-foreground">Select a file above or upload a new image</p>
                        )}
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={confirm} disabled={!selected}>
                                <Check className="h-4 w-4 mr-2" />
                                Use Selected Image
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
