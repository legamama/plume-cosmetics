import { useState } from 'react';
import { MediaLibraryModal } from '../media/MediaLibraryModal';

interface ImagePickerProps {
    label?: string;
    value?: string;
    onChange: (url: string) => void;
    error?: string;
}

export function ImagePicker({ label, value, onChange, error }: ImagePickerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

            <div className="flex items-start gap-4">
                {/* Preview Area */}
                <div
                    className="relative w-32 h-32 bg-gray-100 rounded-lg border overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setIsModalOpen(true)}
                >
                    {value ? (
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={value || ''}
                            readOnly
                            className="flex-1 px-3 py-2 border rounded-md text-sm text-gray-500 bg-gray-50 focus:outline-none cursor-not-allowed"
                            placeholder="No image selected"
                        />
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Select Image
                        </button>
                    </div>

                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                            Remove Image
                        </button>
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
            </div>

            <MediaLibraryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={(asset) => onChange(asset.bunny_cdn_url)}
            />
        </div>
    );
}
