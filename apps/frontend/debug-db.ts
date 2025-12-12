
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv(file: string) {
    if (fs.existsSync(file)) {
        console.log('Loading env from:', file);
        const content = fs.readFileSync(file, 'utf8');
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"]|['"]$/g, '');
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    }
}

loadEnv(path.resolve(process.cwd(), '.env.local'));
loadEnv(path.resolve(process.cwd(), '.env'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('URL defined:', !!supabaseUrl);
console.log('Key defined:', !!supabaseAnonKey);
console.log('URL value prefix:', supabaseUrl.substring(0, 15) + '...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugProducts() {
    console.log('Checking for base_price column...');
    const { error: priceError } = await supabase.from('products').select('base_price').limit(1);
    if (priceError) console.error('base_price column check failed:', priceError.message);
    else console.log('base_price column exists.');

    console.log('Checking for price in translations...');
    const { error: transPriceError } = await supabase.from('product_translations').select('price').limit(1);
    if (transPriceError) console.error('Translations price column check failed:', transPriceError.message);
    else console.log('Translations price column exists.');

    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories (
                name_vi,
                name_en,
                name_ko,
                slug
            ),
            translations:product_translations (
                locale,
                name,
                short_description,
                long_description
            ),
            media:product_media (
                url,
                alt_text_vi,
                alt_text_en,
                alt_text_ko,
                sort_order
            )
        `)
        .eq('status', 'published')
        .limit(1);

    if (error) {
        console.error('Complex Query Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('Complex Query Success. Rows:', data?.length);
        if (data && data.length > 0) console.log(JSON.stringify(data[0], null, 2));
    }
}

debugProducts();
