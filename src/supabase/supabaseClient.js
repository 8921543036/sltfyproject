import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isPlaceholder = (val) => !val || val.includes('your-project-id') || val.includes('your-anon-key') || val.includes('placeholder');

if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
    console.warn("⚠️ Supabase credentials are missing or still using placeholders! Please update your .env file.");
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
