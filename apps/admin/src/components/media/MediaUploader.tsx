import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone'; // You might need to install this: npm install react-dropzone
import { useMedia } from '../../hooks/useMedia';
import { useToast } from '../../context/ToastContext';

interface MediaUploaderProps {
    onUploadComplete?: (asset: any) => void;
    compact?: boolean;
}

export function MediaUploader({ onUploadComplete, compact = false }: MediaUploaderProps) {
    const { uploadMedia, isUploading, error } = useMedia();
    const toast = useToast();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        let successCount = 0;
        let errorCount = 0;

        // Upload files sequentially for now
        for (const file of acceptedFiles) {
            try {
                const asset = await uploadMedia(file);
                if (asset) {
                    successCount++;
                    if (onUploadComplete) {
                        onUploadComplete(asset);
                    }
                }
            } catch (err) {
                errorCount++;
            }
        }

        // Show toast notification
        if (successCount > 0 && errorCount === 0) {
            toast.success(`${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully!`);
        } else if (successCount > 0 && errorCount > 0) {
            toast.info(`${successCount} uploaded, ${errorCount} failed`);
        } else if (errorCount > 0) {
            toast.error(`Upload failed for ${errorCount} file${errorCount > 1 ? 's' : ''}`);
        }
    }, [uploadMedia, onUploadComplete, toast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
            'video/*': ['.mp4', '.webm']
        },
        disabled: isUploading
    });

    if (compact) {
        return (
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
                    ${isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300 bg-gray-50/30'}
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <input {...getInputProps()} />
                <div className="flex items-center justify-center gap-3 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                        <path d="M12 12v9" />
                        <path d="m16 16-4-4-4 4" />
                    </svg>
                    {isUploading ? (
                        <span className="text-sm font-medium">Uploading...</span>
                    ) : isDragActive ? (
                        <span className="text-sm font-medium text-blue-600">Drop files here...</span>
                    ) : (
                        <span className="text-sm">Drop files here or <span className="text-blue-600 font-medium">browse</span></span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></svg>

                    {isUploading ? (
                        <p className="font-medium">Uploading...</p>
                    ) : isDragActive ? (
                        <p className="font-medium text-blue-600">Drop files here...</p>
                    ) : (
                        <>
                            <p className="font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 10MB)</p>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded">
                    Upload Error: {error}
                </div>
            )}
        </div>
    );
}

