interface AboutPageFormProps {
    slots: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

export function AboutPageForm({ slots, onChange }: AboutPageFormProps) {
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
                            value={slots['mission.heading'] || ''}
                            onChange={(e) => onChange('mission.heading', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <input
                            type="text"
                            value={slots['mission.subtitle'] || ''}
                            onChange={(e) => onChange('mission.subtitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                        <textarea
                            value={slots['mission.body'] || ''}
                            onChange={(e) => onChange('mission.body', e.target.value)}
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
                            value={slots['origin.heading'] || ''}
                            onChange={(e) => onChange('origin.heading', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <input
                            type="text"
                            value={slots['origin.subtitle'] || ''}
                            onChange={(e) => onChange('origin.subtitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                        <textarea
                            value={slots['origin.body'] || ''}
                            onChange={(e) => onChange('origin.body', e.target.value)}
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
                    </div>
                </div>
            </div>
        </div>
    );
}
