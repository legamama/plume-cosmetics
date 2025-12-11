// Custom Content Section Editor

import { RichTextEditor } from '../../editor/RichTextEditor';
import type { CustomContentConfig } from '../../../types';

interface CustomContentEditorProps {
    config: CustomContentConfig;
    onChange: (config: CustomContentConfig) => void;
}

export function CustomContentEditor({ config, onChange }: CustomContentEditorProps) {
    return (
        <div className="p-6 space-y-6">
            <div className="bg-plume-rose/30 rounded-lg p-4 text-sm text-text-secondary">
                <strong>Custom Content:</strong> Create fully custom content using the rich text editor.
                Use this for unique sections that don't fit other templates.
            </div>

            <RichTextEditor
                label="Content"
                value={config.html_content}
                onChange={(html) => onChange({ html_content: html })}
                placeholder="Create your custom content..."
                minHeight="400px"
            />
        </div>
    );
}
