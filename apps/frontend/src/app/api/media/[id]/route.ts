import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const BUNNY_STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME;

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    try {
        const { id } = await params;

        // 1. Auth Check
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
        }
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
        }

        // 2. Get Asset Metadata to find Bunny Path
        const { data: asset, error: fetchError } = await supabase
            .from('media_assets')
            .select('bunny_path')
            .eq('id', id)
            .single();

        if (fetchError || !asset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404, headers });
        }

        // 3. Delete from Bunny Storage
        if (!BUNNY_STORAGE_API_KEY || !BUNNY_STORAGE_ZONE_NAME) {
            console.error('Missing Bunny credentials');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500, headers });
        }

        const deleteUrl = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE_NAME}${asset.bunny_path}`;

        const bunnyResponse = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'AccessKey': BUNNY_STORAGE_API_KEY,
            },
        });

        if (!bunnyResponse.ok && bunnyResponse.status !== 404) {
            // If 404, file might already be gone, so we proceed to clean DB
            const errorText = await bunnyResponse.text();
            console.error('Bunny Delete Error:', errorText);
            return NextResponse.json({ error: 'Failed to delete from storage provider' }, { status: 502, headers });
        }

        // 4. Delete from Supabase
        const { error: deleteError } = await supabase
            .from('media_assets')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return NextResponse.json({ error: 'Failed to delete metadata' }, { status: 500, headers });
        }

        return NextResponse.json({ success: true }, { status: 200, headers });

    } catch (error) {
        console.error('Delete Handler Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
