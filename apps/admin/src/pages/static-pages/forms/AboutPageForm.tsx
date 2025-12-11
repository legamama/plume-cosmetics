import { useState } from 'react';

interface AboutPageFormProps {
    content: any;
    onChange: (content: any) => void;
    locale: string;
}

export function AboutPageForm({ content, onChange, locale }: AboutPageFormProps) {
    const handleChange = (section: string, field: string, value: any) => {
        const newContent = { ...content };
        if (!newContent[section]) newContent[section] = {};
        newContent[section][field] = value;
        onChange(newContent);
    };

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Hero Section</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={content?.hero?.title || ''}
                            onChange={(e) => handleChange('hero', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <textarea
                            value={content?.hero?.subtitle || ''}
                            onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Mission Section</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                        <input
                            type="text"
                            value={content?.mission?.heading || ''}
                            onChange={(e) => handleChange('mission', 'heading', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <input
                            type="text"
                            value={content?.mission?.subtitle || ''}
                            onChange={(e) => handleChange('mission', 'subtitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                        <textarea
                            value={content?.mission?.body || ''}
                            onChange={(e) => handleChange('mission', 'body', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Origin Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Origin Section</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                        <input
                            type="text"
                            value={content?.origin?.heading || ''}
                            onChange={(e) => handleChange('origin', 'heading', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <input
                            type="text"
                            value={content?.origin?.subtitle || ''}
                            onChange={(e) => handleChange('origin', 'subtitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                        <textarea
                            value={content?.origin?.body || ''}
                            onChange={(e) => handleChange('origin', 'body', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-medium mb-4">CTA Banner</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                        <input
                            type="text"
                            value={content?.ctaBanner?.heading || ''}
                            onChange={(e) => handleChange('ctaBanner', 'heading', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
                        <input
                            type="text"
                            value={content?.ctaBanner?.subheading || ''}
                            onChange={(e) => handleChange('ctaBanner', 'subheading', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Button Label</label>
                            <input
                                type="text"
                                value={content?.ctaBanner?.button_label || ''}
                                onChange={(e) => handleChange('ctaBanner', 'button_label', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
