

interface HomePageFormProps {
    slots: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

export function HomePageForm({ slots, onChange }: HomePageFormProps) {

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
                            value={slots['hero.title'] || ''}
                            onChange={(e) => onChange('hero.title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <textarea
                            value={slots['hero.subtitle'] || ''}
                            onChange={(e) => onChange('hero.subtitle', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Label</label>
                            <input
                                type="text"
                                value={slots['hero.ctaLabel'] || ''}
                                onChange={(e) => onChange('hero.ctaLabel', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                            <input
                                type="text"
                                value={slots['hero.ctaLink'] || ''}
                                onChange={(e) => onChange('hero.ctaLink', e.target.value)}
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
                        value={slots['marquee'] || ''}
                        onChange={(e) => onChange('marquee', e.target.value)}
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
                            value={slots['bestSellers.title'] || ''}
                            onChange={(e) => onChange('bestSellers.title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <input
                            type="text"
                            value={slots['bestSellers.subtitle'] || ''}
                            onChange={(e) => onChange('bestSellers.subtitle', e.target.value)}
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
                            value={slots['brandStory.heading'] || ''}
                            onChange={(e) => onChange('brandStory.heading', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                        <textarea
                            value={slots['brandStory.body'] || ''}
                            onChange={(e) => onChange('brandStory.body', e.target.value)}
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
                            value={slots['ctaBanner.heading'] || ''}
                            onChange={(e) => onChange('ctaBanner.heading', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
                        <input
                            type="text"
                            value={slots['ctaBanner.subheading'] || ''}
                            onChange={(e) => onChange('ctaBanner.subheading', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Button Label</label>
                            <input
                                type="text"
                                value={slots['ctaBanner.button_label'] || ''}
                                onChange={(e) => onChange('ctaBanner.button_label', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
                            <input
                                type="text"
                                value={slots['ctaBanner.button_url'] || ''}
                                onChange={(e) => onChange('ctaBanner.button_url', e.target.value)}
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
