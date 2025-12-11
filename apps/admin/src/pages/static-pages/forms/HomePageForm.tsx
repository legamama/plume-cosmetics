import { useState } from 'react';

interface HomePageFormProps {
    content: any;
    onChange: (content: any) => void;
    locale: string;
}

export function HomePageForm({ content, onChange, locale }: HomePageFormProps) {
    const handleChange = (section: string, field: string, value: any) => {
        const newContent = { ...content };
        if (!newContent[section]) newContent[section] = {};
        newContent[section][field] = value;
        onChange(newContent);
    };

    // Helper for nested updates
    const handleNestedChange = (section: string, subSection: string, field: string, value: any) => {
        const newContent = { ...content };
        if (!newContent[section]) newContent[section] = {};
        if (!newContent[section][subSection]) newContent[section][subSection] = {};
        newContent[section][subSection][field] = value;
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Label</label>
                            <input
                                type="text"
                                value={content?.hero?.ctaLabel || ''}
                                onChange={(e) => handleChange('hero', 'ctaLabel', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                            <input
                                type="text"
                                value={content?.hero?.ctaLink || ''}
                                onChange={(e) => handleChange('hero', 'ctaLink', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Marquee Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Marquee Text</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Running Text</label>
                    <input
                        type="text"
                        value={content?.marquee || ''} // Marquee is top-level string in page.tsx usually, but we can store it in content object
                        onChange={(e) => {
                            const newContent = { ...content, marquee: e.target.value };
                            onChange(newContent);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            {/* Best Sellers Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Best Sellers</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={content?.bestSellers?.title || ''}
                            onChange={(e) => handleChange('bestSellers', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <input
                            type="text"
                            value={content?.bestSellers?.subtitle || ''}
                            onChange={(e) => handleChange('bestSellers', 'subtitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>
            </div>


            {/* Brand Story */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Brand Story</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                        <input
                            type="text"
                            value={content?.brandStory?.heading || ''}
                            onChange={(e) => handleChange('brandStory', 'heading', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                        <textarea
                            value={content?.brandStory?.body || ''}
                            onChange={(e) => handleChange('brandStory', 'body', e.target.value)}
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
                            <input
                                type="text"
                                value={content?.ctaBanner?.button_url || ''}
                                onChange={(e) => handleChange('ctaBanner', 'button_url', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Note: Other sections like FAQ, Testimonials can be added similarly if needed */}
            <div className="text-sm text-gray-500 italic">
                Note: FAQ and Testimonials defaults are currently hardcoded or pending field definitions.
            </div>
        </div>
    );
}
