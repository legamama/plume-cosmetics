// FAQ Section Editor

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { RichTextEditor } from '../../editor/RichTextEditor';
import type { FAQConfig, FAQItem } from '../../../types';

interface FAQEditorProps {
    config: FAQConfig;
    onChange: (config: FAQConfig) => void;
}

export function FAQEditor({ config, onChange }: FAQEditorProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const updateConfig = (updates: Partial<FAQConfig>) => {
        onChange({ ...config, ...updates });
    };

    const addItem = () => {
        const newItem: FAQItem = {
            id: `faq-${Date.now()}`,
            question: '',
            answer: '',
        };
        updateConfig({ items: [...config.items, newItem] });
        setExpandedId(newItem.id);
    };

    const removeItem = (id: string) => {
        updateConfig({ items: config.items.filter(item => item.id !== id) });
        if (expandedId === id) {
            setExpandedId(null);
        }
    };

    const updateItem = (id: string, updates: Partial<FAQItem>) => {
        updateConfig({
            items: config.items.map(item =>
                item.id === id ? { ...item, ...updates } : item
            ),
        });
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...config.items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        updateConfig({ items: newItems });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-plume-rose/30 rounded-lg p-4 text-sm text-text-secondary">
                <strong>FAQ Section:</strong> Add frequently asked questions with rich text answers.
                Questions will display in an accordion format on the frontend.
            </div>

            <Input
                label="Section Title"
                value={config.title}
                onChange={(e) => updateConfig({ title: e.target.value })}
                placeholder="Frequently Asked Questions"
            />

            <Input
                label="Subtitle (optional)"
                value={config.subtitle || ''}
                onChange={(e) => updateConfig({ subtitle: e.target.value })}
                placeholder="Find answers to common questions"
            />

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-text-primary">
                        Questions ({config.items.length})
                    </h4>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        leftIcon={<Plus size={16} />}
                        onClick={addItem}
                    >
                        Add Question
                    </Button>
                </div>

                {config.items.length === 0 ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <p className="text-text-muted">No questions added yet</p>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={addItem}
                            className="mt-2"
                        >
                            Add your first question
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {config.items.map((item, index) => (
                            <div
                                key={item.id}
                                className="border border-border rounded-lg overflow-hidden"
                            >
                                {/* Question Header */}
                                <div
                                    className="flex items-center gap-3 p-4 bg-surface-hover cursor-pointer"
                                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                >
                                    <div className="flex flex-col gap-1">
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); moveItem(index, 'up'); }}
                                            disabled={index === 0}
                                            className="p-0.5 hover:bg-surface rounded disabled:opacity-30"
                                        >
                                            <ChevronUp size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); moveItem(index, 'down'); }}
                                            disabled={index === config.items.length - 1}
                                            className="p-0.5 hover:bg-surface rounded disabled:opacity-30"
                                        >
                                            <ChevronDown size={14} />
                                        </button>
                                    </div>

                                    <div className="flex-1">
                                        <div className="font-medium text-text-primary">
                                            {item.question || '(Untitled question)'}
                                        </div>
                                        <div className="text-xs text-text-muted">
                                            Question #{index + 1}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    {expandedId === item.id ? (
                                        <ChevronUp size={20} className="text-text-muted" />
                                    ) : (
                                        <ChevronDown size={20} className="text-text-muted" />
                                    )}
                                </div>

                                {/* Question Content */}
                                {expandedId === item.id && (
                                    <div className="p-4 border-t border-border space-y-4">
                                        <Input
                                            label="Question"
                                            value={item.question}
                                            onChange={(e) => updateItem(item.id, { question: e.target.value })}
                                            placeholder="Enter the question..."
                                        />
                                        <RichTextEditor
                                            label="Answer"
                                            value={item.answer}
                                            onChange={(html) => updateItem(item.id, { answer: html })}
                                            placeholder="Enter the answer..."
                                            minHeight="120px"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
