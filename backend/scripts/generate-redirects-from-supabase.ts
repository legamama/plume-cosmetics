import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// Do NOT statically import from lib/redirects.js here because it initializes Supabase client immediately
// and environment variables might not be loaded yet.

// Load environment variables first
dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateRedirects() {
    console.log('🚀 Starting Netlify redirects generation...');

    // Validate essential env vars before importing logic
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY. Ensure it is set in .env or environment.');
        process.exit(1);
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.SUPABASE_URL) {
        console.error('❌ Missing SUPABASE_URL. Ensure NEXT_PUBLIC_SUPABASE_URL is set.');
        process.exit(1);
    }

    try {
        // Dynamic import ensures env vars are loaded before Supabase client initializes
        console.log('📦 Importing backend helpers...');
        const { getActiveRedirects } = await import('../lib/redirects.js');

        console.log('Fetching active redirects from Supabase...');
        const redirects = await getActiveRedirects();
        console.log(`✅ Found ${redirects.length} active redirects.`);

        // Format for Netlify _redirects file
        let content = '# Netlify Redirects generated from Supabase\n';
        content += `# Generated at: ${new Date().toISOString()}\n\n`;

        if (redirects.length === 0) {
            content += '# No active redirects found.\n';
        } else {
            redirects.forEach(rule => {
                const status = rule.status_code || 301;
                // Simple redirect: /from /to 301
                content += `${rule.from_path}  ${rule.to_url}  ${status}\n`;
            });
        }

        // Determine output path: apps/frontend/public/_redirects
        const outputDir = path.resolve(__dirname, '../../apps/frontend/public');
        const outputPath = path.join(outputDir, '_redirects');

        // Check if directory exists
        try {
            await fs.access(outputDir);
        } catch (e) {
            console.warn(`Warning: Output directory ${outputDir} does not exist. Creating active directory...`);
            await fs.mkdir(outputDir, { recursive: true });
        }

        console.log(`Writing redirects to: ${outputPath}`);
        await fs.writeFile(outputPath, content, 'utf-8');

        console.log('✅ Redirects generated successfully!');

    } catch (error) {
        console.error('❌ Error generating redirects:', error);
        process.exit(1);
    }
}

generateRedirects();
