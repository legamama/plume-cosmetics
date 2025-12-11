
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env vars from ../.env
dotenv.config({ path: resolve(__dirname, '../.env') });

async function createAdminUser() {
    const { getAdminClient } = await import('../lib/supabaseClient');
    const email = process.argv[2] || 'admin@plume.vn';
    const password = process.argv[3] || 'PlumeAdmin2024!'; // strong default

    console.log(`Creating/Updating admin user: ${email}...`);

    try {
        const supabase = getAdminClient();

        // 1. Check if user exists
        /* Note: listUsers is an admin API method */
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) throw listError;

        const existingUser = users.find(u => u.email === email);
        let userId = existingUser?.id;

        if (existingUser) {
            console.log('User already exists, updating role...');
            // Update metadata
            const { error: updateError } = await supabase.auth.admin.updateUserById(
                existingUser.id,
                {
                    user_metadata: { role: 'admin' },
                    app_metadata: { role: 'admin' }
                }
            );
            if (updateError) throw updateError;
            console.log('✅ User role updated to admin');

        } else {
            console.log('User does not exist, creating...');
            const { data, error: createError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { role: 'admin' },
                app_metadata: { role: 'admin' }
            });

            if (createError) throw createError;
            userId = data.user?.id;
            console.log('✅ Admin user created successfully');
            console.log(`Credentials:\nEmail: ${email}\nPassword: ${password}`);
        }

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
