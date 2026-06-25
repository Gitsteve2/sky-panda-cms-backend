import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

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
    ['blockquote', 'link'],
    [{ color: [] }, { background: [] }],
    ['clean'],
];

export function RichEditor({ value, onChange, placeholder, minHeight = 260 }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        if (!editorRef.current || quillRef.current) return;

        const quill = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: placeholder ?? 'Write something...',
            modules: { toolbar: TOOLBAR },
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
        if (currentHtml !== value) {
            quill.clipboard.dangerouslyPasteHTML(value ?? '');
        }
    }, [value]);

    return (
        <div ref={containerRef} className="rich-editor-wrapper rounded-md border border-input overflow-hidden">
            <div ref={editorRef} style={{ minHeight }} />
        </div>
    );
}
