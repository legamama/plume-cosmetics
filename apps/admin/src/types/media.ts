export type MediaType = 'image' | 'video';

export interface MediaFolder {
    id: string;
    name: string;
    parent_id: string | null;
    created_at: string;
}

export interface MediaAsset {
    id: string;
    filename: string;
    mime_type: string;
    size_bytes: number | null;
    width: number | null;
    height: number | null;
    storage_path: string;
    public_url: string;
    folder_id: string | null;
    alt_text: string | null;
    credits: string | null;
    uploaded_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface MediaUploadResponse {
    asset: MediaAsset;
}

export interface StorageBucketUsage {
    name: string;
    size_bytes: number;
}

export interface StorageUsage {
    total_bytes: number;
    limit_bytes: number;
    buckets: StorageBucketUsage[];
}
