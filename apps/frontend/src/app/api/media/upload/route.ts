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

const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const BUNNY_STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME;
const BUNNY_PULL_ZONE_URL = process.env.BUNNY_PULL_ZONE_URL;

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

        // 3. Upload to Bunny Storage
        if (!BUNNY_STORAGE_API_KEY || !BUNNY_STORAGE_ZONE_NAME || !BUNNY_PULL_ZONE_URL) {
            console.error('Missing Bunny credentials');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500, headers });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Generate unique filename to prevent collisions
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const storagePath = `/${uniqueFilename}`;

        // Bunny Storage API URL
        const storageHostname = process.env.BUNNY_STORAGE_HOSTNAME || 'storage.bunnycdn.com';
        const uploadUrl = `https://${storageHostname}/${BUNNY_STORAGE_ZONE_NAME}${storagePath}`;

        const bunnyResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'AccessKey': BUNNY_STORAGE_API_KEY,
                'Content-Type': 'application/octet-stream',
            },
            body: buffer,
        });

        if (!bunnyResponse.ok) {
            const errorText = await bunnyResponse.text();
            console.error('Bunny Upload Error:', bunnyResponse.status, bunnyResponse.statusText, errorText);
            console.error('Upload URL was:', uploadUrl);
            return NextResponse.json({
                error: 'Failed to upload to storage provider',
                details: `${bunnyResponse.status}: ${errorText}`
            }, { status: 502, headers });
        }

        // 4. Save Metadata to Supabase
        const cdnUrl = `${BUNNY_PULL_ZONE_URL}${storagePath}`;
        const mimeType = file.type || 'application/octet-stream';

        const { data: asset, error: dbError } = await supabase
            .from('media_assets')
            .insert({
                filename: uniqueFilename,
                mime_type: mimeType,
                size_bytes: file.size,
                bunny_path: storagePath,
                bunny_cdn_url: cdnUrl,
                folder_id: folderId || null,
                alt_text: altText || null,
                uploaded_by: user.id
            })
            .select()
            .single();

        if (dbError) {
            console.error('Supabase DB Error:', dbError);
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
