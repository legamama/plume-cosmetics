// TipTap Rich Text Editor Component

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorToolbar } from './EditorToolbar';
import { useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    minHeight?: string;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Start writing...',
    label,
    error,
    minHeight = '200px',
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-plume-coral hover:text-plume-coral-dark underline',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Update editor content when value changes externally
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-text-primary">
                    {label}
                </label>
            )}
            <div
                className={`
          border rounded-lg bg-surface overflow-hidden
          ${error ? 'border-red-300' : 'border-border'}
          focus-within:ring-2 focus-within:ring-offset-0
          ${error ? 'focus-within:ring-red-500/20' : 'focus-within:ring-plume-coral/20'}
          ${error ? 'focus-within:border-red-500' : 'focus-within:border-plume-coral'}
        `}
            >
                <EditorToolbar editor={editor} />
                <EditorContent
                    editor={editor}
                    className="tiptap-editor prose prose-sm max-w-none p-4"
                    style={{ minHeight }}
                />
            </div>
            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}
