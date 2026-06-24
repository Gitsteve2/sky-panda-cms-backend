import { Head, router, useForm } from '@inertiajs/react';
import { Image, Pencil, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface MediaItem {
    id: number; name: string; file_name: string; mime_type?: string;
    url: string; size: number; alt_text?: string; caption?: string;
    collection: string; created_at: string;
}

interface PaginatedMedia {
    data: MediaItem[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function MediaIndex({ media, collection }: { media: PaginatedMedia; collection: string }) {
    const [uploading, setUploading] = useState(false);
    const [editing, setEditing] = useState<MediaItem | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const editForm = useForm({ alt_text: '', caption: '', name: '' });

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('collection', collection === 'all' ? 'general' : collection);
        try {
            const res = await fetch('/cms/media', {
                method: 'POST',
                body: formData,
                headers: { 'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '') },
            });
            if (res.ok) router.reload();
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const openEdit = (item: MediaItem) => {
        setEditing(item);
        editForm.setData({ alt_text: item.alt_text ?? '', caption: item.caption ?? '', name: item.name });
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    };

    return (
        <>
            <Head title="Media Library" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Media Library</h1>
                        <p className="text-sm text-muted-foreground mt-1">{media.total} files</p>
                    </div>
                    <div>
                        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
                        <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
                            <Upload className="h-4 w-4 mr-2" />
                            {uploading ? 'Uploading...' : 'Upload File'}
                        </Button>
                    </div>
                </div>

                {editing && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                <img src={editing.url} alt={editing.name} className="w-24 h-24 rounded object-cover shrink-0" />
                                <form onSubmit={(e) => { e.preventDefault(); editForm.put(`/cms/media/${editing.id}`, { onSuccess: () => setEditing(null) }); }} className="flex-1 space-y-3">
                                    <div className="space-y-1"><Label>Name</Label><Input value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} /></div>
                                    <div className="space-y-1"><Label>Alt Text</Label><Input value={editForm.data.alt_text} onChange={(e) => editForm.setData('alt_text', e.target.value)} /></div>
                                    <div className="flex gap-2">
                                        <Button type="submit" size="sm" disabled={editForm.processing}>Save</Button>
                                        <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
                                    </div>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {media.data.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border py-20 text-center">
                        <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No media files yet. Click "Upload File" to add your first file.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                        {media.data.map((item) => (
                            <div key={item.id} className="group relative rounded-lg overflow-hidden border border-border bg-muted/20">
                                {item.mime_type?.startsWith('image/') ? (
                                    <img src={item.url} alt={item.alt_text ?? item.name} className="w-full aspect-square object-cover" />
                                ) : (
                                    <div className="w-full aspect-square flex items-center justify-center bg-muted">
                                        <Image className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="sm" variant="secondary" onClick={() => openEdit(item)}><Pencil className="h-3 w-3" /></Button>
                                    <Button size="sm" variant="destructive" onClick={() => { if (confirm('Delete?')) router.delete(`/cms/media/${item.id}`); }}><Trash2 className="h-3 w-3" /></Button>
                                </div>
                                <div className="p-2">
                                    <div className="text-xs font-medium truncate">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{formatSize(item.size)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
