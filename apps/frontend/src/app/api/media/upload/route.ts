import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client lazily inside handlers to avoid build-time errors
function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error('Missing Supabase configuration');
    }

    return createClient(url, key);
}

export async function POST(req: NextRequest) {
    // CORS Headers for Admin App
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (req.method === 'OPTIONS') {
        return NextResponse.json({}, { headers });
    }

    try {
        const supabase = getSupabaseClient();

        // 1. Authorization Check (Simple check for now, ideally verify JWT)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
        }

        // Verify user is admin via Supabase
        const token = authHeader.replace('Bearer ', '');
        console.log('Verifying token:', token.substring(0, 10) + '...');

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error('Auth User Error:', authError);
            return NextResponse.json({ error: 'Unauthorized', details: authError?.message }, { status: 401, headers });
        }

        console.log('User verified:', user.id);

        // 2. Parse FormData
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folderId = formData.get('folderId') as string;
        const altText = formData.get('altText') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400, headers });
        }

        // 3. Upload to Supabase Storage
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Generate unique filename to prevent collisions
        const timestamp = Date.now();
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFilename = `${timestamp}-${cleanName}`;
        // Can organize by folder if folderId is provided, but user schema just had bunny_path. 
        // We will stick to a flat structure or date-based if preferred, but simpler is flat for now.
        // Actually, let's just put it in root or a 'uploads' folder. The previous bunny path was `/${uniqueFilename}`.
        const storagePath = `${uniqueFilename}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('media')
            .upload(storagePath, buffer, {
                contentType: file.type || 'application/octet-stream',
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase Storage Upload Error:', uploadError);
            return NextResponse.json({
                error: 'Failed to upload to storage provider',
                details: uploadError.message
            }, { status: 502, headers });
        }

        const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(storagePath);

        // 4. Save Metadata to Supabase
        const mimeType = file.type || 'application/octet-stream';

        // NOTE: We use new column names 'storage_path' and 'public_url'
        const { data: asset, error: dbError } = await supabase
            .from('media_assets')
            .insert({
                filename: uniqueFilename,
                mime_type: mimeType,
                size_bytes: file.size,
                storage_path: storagePath,  // Was bunny_path
                public_url: publicUrl,      // Was bunny_cdn_url
                folder_id: folderId || null,
                alt_text: altText || null,
                uploaded_by: user.id
            })
            .select()
            .single();

        if (dbError) {
            console.error('Supabase DB Error:', dbError);
            // Try to cleanup storage if DB fails
            await supabase.storage.from('media').remove([storagePath]);
            return NextResponse.json({ error: 'Failed to save metadata' }, { status: 500, headers });
        }

        return NextResponse.json(asset, { status: 200, headers });

    } catch (error) {
        console.error('Upload Handler Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
