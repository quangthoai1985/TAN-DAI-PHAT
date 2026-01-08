import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env vars
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const url = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const key = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key || url.includes('your_supabase_url')) {
    console.error('❌ Configuration still looks invalid (placeholder keys detected)');
    process.exit(1);
}

const supabase = createClient(url, key);

async function check() {
    console.log(`Connecting to ${url}...`);
    try {
        // Try to list buckets - this usually works even if empty
        const { data: buckets, error } = await supabase.storage.listBuckets();
        if (error) {
            // If auth fails, it might be RLS or invalid key, but connection is "working" in terms of reaching server
            console.log('⚠️ Connection reached server but returned error:', error.message);
            if (error.message.includes('Invalid API Key')) {
                console.error('❌ Invalid API Key');
            }
        } else {
            console.log('✅ Connection Successful!');
            console.log('Buckets found:', buckets.length);
            buckets.forEach(b => console.log(` - ${b.name} (${b.public ? 'Public' : 'Private'})`));
        }

        // Check if products table exists
        const { error: tableError } = await supabase.from('products').select('count', { count: 'exact', head: true });
        if (tableError) {
            console.log('ℹ️ Products table check:', tableError.message);
            if (tableError.code === '42P01') {
                console.log('   (Table "products" does not exist yet - This is expected)');
            }
        } else {
            console.log('✅ Table "products" exists');
        }

    } catch (e) {
        console.error('❌ Unexpected error:', e.message);
    }
}

check();
