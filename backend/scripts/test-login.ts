
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env vars from .env (in CWD)
dotenv.config();

const email = 'admin@plume.vn';
const password = 'PlumeAdmin2024!';

async function testLogin() {
    const { supabase } = await import('../lib/supabaseClient');

    console.log(`Testing login for ${email}...`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('❌ Login failed:', error.message);
        process.exit(1);
    }

    console.log('✅ Login successful!');
    console.log('User ID:', data.user.id);
    console.log('Role Claim:', data.user.user_metadata.role);
}

testLogin();
