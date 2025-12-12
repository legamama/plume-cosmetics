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

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // Fix type signature to Promise
) {
    const params = await context.params;

    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    try {
        const supabase = getSupabaseClient();
        const { id } = params;

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

        // 2. Get Asset Metadata to find Storage Path
        // We select both old and new columns to handle migration period if needed, 
        // but since we are migrating, we expect storage_path. 
        // Ideally we should handle if 'storage_path' is missing (old record).
        const { data: asset, error: fetchError } = await supabase
            .from('media_assets')
            .select('storage_path, bunny_path')
            .eq('id', id)
            .single();

        if (fetchError || !asset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404, headers });
        }

        // Determine path: use storage_path if available, else try bunny_path (migration safety)
        const pathToDelete = asset.storage_path || asset.bunny_path;

        if (!pathToDelete) {
            // Just delete the DB record if no file path found (maybe already gone)
            console.warn('No storage path found for asset', id);
        } else {
            // 3. Delete from Supabase Storage
            // Even if it was a Bunny Path (e.g. /foo.jpg), Supabase Storage might handle it 
            // if we migrated files to the same paths. If files are still in Bunny, we can't delete them from here without Bunny keys.
            // Assumption: We only delete files from Supabase Storage now. 
            // If the file is physically in Bunny, we can't delete it. We just delete the DB record.

            const { error: storageError } = await supabase.storage
                .from('media')
                .remove([pathToDelete]);

            if (storageError) {
                console.error('Supabase Storage Delete Error:', storageError);
                // We might validly fail if file doesn't exist. We continue to delete DB record.
            }
        }

        // 4. Delete from Supabase DB
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
