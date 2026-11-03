import { useEffect, useMemo, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { toast } from 'sonner';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: number;
}

const TOOLBAR = [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['blockquote', 'link', 'image'],
    [{ color: [] }, { background: [] }],
    ['clean'],
];

function getCsrf() {
    return decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '');
}

export function RichEditor({ value, onChange, placeholder, minHeight = 260 }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const onChangeRef = useRef(onChange);
    const [uploadingImage, setUploadingImage] = useState(false);

    onChangeRef.current = onChange;

    const stats = useMemo(() => {
        const plain = (value || '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        const words = plain ? plain.split(' ').length : 0;
        const chars = plain.length;
        const minutes = Math.max(1, Math.ceil(words / 200));
        return { words, chars, readTime: words > 0 ? `${minutes} min read` : '0 min read' };
    }, [value]);

    useEffect(() => {
        if (!editorRef.current || quillRef.current) return;

        const quill = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: placeholder ?? 'Write your article content...',
            modules: {
                toolbar: {
                    container: TOOLBAR,
                    handlers: {
                        image: () => {
                            imageInputRef.current?.click();
                        },
                    },
                },
            },
        });

        quillRef.current = quill;

        if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
        }

        quill.on('text-change', () => {
            const html = editorRef.current?.querySelector('.ql-editor')?.innerHTML ?? '';
            onChangeRef.current(html === '<p><br></p>' ? '' : html);
        });

        return () => {
            quill.off('text-change');
            quillRef.current = null;
        };
    }, []);

    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;
        const currentHtml = editorRef.current?.querySelector('.ql-editor')?.innerHTML ?? '';
        const normalizedCurrent = currentHtml === '<p><br></p>' ? '' : currentHtml;
        if (normalizedCurrent !== (value ?? '')) {
            const selection = quill.getSelection();
            quill.clipboard.dangerouslyPasteHTML(value ?? '');
            if (selection) {
                try {
                    quill.setSelection(selection.index, selection.length);
                } catch {
                    // ignore selection restore errors
                }
            }
        }
    }, [value]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !quillRef.current) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image size must not exceed 10MB.');
            return;
        }

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('collection', 'blog');

        try {
            const res = await fetch('/cms/media', {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrf(),
                },
            });

            if (res.ok) {
                const media = await res.json();
                const quill = quillRef.current;
                const range = quill.getSelection(true);
                const index = range ? range.index : quill.getLength();
                quill.insertEmbed(index, 'image', media.url, 'user');
                quill.setSelection(index + 1, 0);
                toast.success('Image inserted into article.');
            } else {
                toast.error('Failed to upload inline image.');
            }
        } catch {
            toast.error('Error uploading inline image.');
        } finally {
            setUploadingImage(false);
            if (imageInputRef.current) imageInputRef.current.value = '';
        }
    };

    return (
        <div ref={containerRef} className="rich-editor-wrapper rounded-lg border border-input overflow-hidden bg-background">
            <div ref={editorRef} style={{ minHeight }} />
            <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageUpload}
            />
            <div className="flex items-center justify-between px-3.5 py-2 border-t border-border/60 bg-muted/25 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-3">
                    <span>
                        <strong className="font-semibold text-foreground">{stats.words}</strong> word{stats.words !== 1 ? 's' : ''}
                    </span>
                    <span>·</span>
                    <span>
                        <strong className="font-semibold text-foreground">{stats.chars}</strong> characters
                    </span>
                    <span>·</span>
                    <span>Est. {stats.readTime}</span>
                </div>
                {uploadingImage && (
                    <span className="text-primary font-semibold animate-pulse">Uploading inline image...</span>
                )}
            </div>
        </div>
    );
}
