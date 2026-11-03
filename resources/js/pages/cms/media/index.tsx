import { Head, router, useForm } from '@inertiajs/react';
import { FileImage, Pencil, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MediaItem {
    id: number;
    name: string;
    file_name: string;
    mime_type?: string;
    url: string;
    size: number;
    alt_text?: string;
    caption?: string;
    collection: string;
    created_at: string;
}

interface PaginatedMedia {
    data: MediaItem[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function MediaIndex({
    media,
    collection,
}: {
    media: PaginatedMedia;
    collection: string;
}) {
    const [uploading, setUploading] = useState(false);
    const [editing, setEditing] = useState<MediaItem | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const editForm = useForm({ alt_text: '', caption: '', name: '' });

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) {
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append(
            'collection',
            collection === 'all' ? 'general' : collection,
        );

        try {
            const res = await fetch('/cms/media', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(
                        document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '',
                    ),
                },
            });

            if (res.ok) {
                router.reload();
            }
        } finally {
            setUploading(false);

            if (fileRef.current) {
                fileRef.current.value = '';
            }
        }
    };

    const openEdit = (item: MediaItem) => {
        setEditing(item);
        editForm.setData({
            alt_text: item.alt_text ?? '',
            caption: item.caption ?? '',
            name: item.name,
        });
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) {
            return bytes + ' B';
        }

        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' KB';
        }

        return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    };

    return (
        <>
            <Head title="Media Library" />
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Media Library
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {media.total} file{media.total !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleUpload}
                        />
                        <Button
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {uploading ? 'Uploading...' : 'Upload File'}
                        </Button>
                    </div>
                </div>

                {editing && (
                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-start gap-5">
                                <img
                                    src={editing.url}
                                    alt={editing.name}
                                    className="h-28 w-28 shrink-0 rounded-xl border border-border object-cover"
                                />
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        editForm.put(
                                            `/cms/media/${editing.id}`,
                                            {
                                                onSuccess: () =>
                                                    setEditing(null),
                                            },
                                        );
                                    }}
                                    className="flex-1 space-y-3"
                                >
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label>Name</Label>
                                            <Input
                                                value={editForm.data.name}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Alt Text</Label>
                                            <Input
                                                value={editForm.data.alt_text}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'alt_text',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={editForm.processing}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setEditing(null)}
                                        >
                                            <X className="mr-1 h-4 w-4" />
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {media.data.length === 0 ? (
                    <div
                        className="cursor-pointer rounded-xl border-2 border-dashed border-border py-24 text-center transition-all hover:border-primary hover:bg-primary/5"
                        onClick={() => fileRef.current?.click()}
                    >
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                            <FileImage className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">
                            No media files yet
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Click to upload your first image or video
                        </p>
                        <Button
                            className="mt-4"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                fileRef.current?.click();
                            }}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Choose File
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {media.data.map((item) => (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden rounded-xl border border-border bg-muted/20 transition-all hover:shadow-md"
                            >
                                {item.mime_type?.startsWith('image/') ? (
                                    <img
                                        src={item.url}
                                        alt={item.alt_text ?? item.name}
                                        className="aspect-square w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex aspect-square w-full items-center justify-center bg-muted">
                                        <FileImage className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 w-8 rounded-full p-0"
                                        onClick={() => openEdit(item)}
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 w-8 rounded-full p-0"
                                        onClick={() => {
                                            if (confirm('Delete this file?')) {
                                                router.delete(
                                                    `/cms/media/${item.id}`,
                                                );
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                                <div className="p-2.5">
                                    <div className="truncate text-xs font-medium">
                                        {item.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {formatSize(item.size)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {media.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        <span className="text-sm text-muted-foreground">
                            Page {media.current_page} of {media.last_page}
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}
