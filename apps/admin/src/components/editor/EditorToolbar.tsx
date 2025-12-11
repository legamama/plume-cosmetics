// TipTap Editor Toolbar

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { MediaLibraryModal } from '../media/MediaLibraryModal';

interface EditorToolbarProps {
    editor: Editor | null;
}

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
        p-2 rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isActive
                    ? 'bg-plume-rose text-plume-coral-dark'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }
      `}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-6 bg-border mx-1" />;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');


    if (!editor) return null;

    const handleSetLink = () => {
        if (linkUrl) {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: linkUrl, target: '_blank' })
                .run();
        } else {
            editor.chain().focus().unsetLink().run();
        }
        setLinkUrl('');
        setIsLinkModalOpen(false);
    };

    const handleInsertImage = (asset: any) => {
        if (asset.bunny_cdn_url) {
            editor.chain().focus().setImage({
                src: asset.bunny_cdn_url,
                alt: asset.alt_text || ''
            }).run();
        }
        setIsImageModalOpen(false);
    };

    const openLinkModal = () => {
        const previousUrl = editor.getAttributes('link').href || '';
        setLinkUrl(previousUrl);
        setIsLinkModalOpen(true);
    };

    return (
        <>
            <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-surface-hover rounded-t-lg">
                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo"
                >
                    <Undo size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo"
                >
                    <Redo size={18} />
                </ToolbarButton>

                <Divider />

                {/* Text formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <Bold size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <Italic size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Underline"
                >
                    <UnderlineIcon size={18} />
                </ToolbarButton>

                <Divider />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 size={18} />
                </ToolbarButton>

                <Divider />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <ListOrdered size={18} />
                </ToolbarButton>

                <Divider />

                {/* Text alignment */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="Align Left"
                >
                    <AlignLeft size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="Align Center"
                >
                    <AlignCenter size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="Align Right"
                >
                    <AlignRight size={18} />
                </ToolbarButton>

                <Divider />

                {/* Link and Image */}
                <ToolbarButton
                    onClick={openLinkModal}
                    isActive={editor.isActive('link')}
                    title="Insert Link"
                >
                    <LinkIcon size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => setIsImageModalOpen(true)}
                    title="Insert Image"
                >
                    <ImageIcon size={18} />
                </ToolbarButton>
            </div>

            {/* Link Modal */}
            <Modal
                isOpen={isLinkModalOpen}
                onClose={() => setIsLinkModalOpen(false)}
                title="Insert Link"
                size="sm"
            >
                <div className="p-6 space-y-4">
                    <Input
                        label="URL"
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setIsLinkModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSetLink}>
                            {linkUrl ? 'Apply Link' : 'Remove Link'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Image Modal */}
            <MediaLibraryModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                onSelect={handleInsertImage}
            />
        </>
    );
}
