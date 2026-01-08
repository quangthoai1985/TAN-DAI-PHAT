import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null;

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

// We can keep the getSupabase for runtime strict checks if needed,
// but for now, exporting 'supabase' directly is safest for build tools.
// The dummy values prevent build crash, but we must ensure envs are present at runtime.
