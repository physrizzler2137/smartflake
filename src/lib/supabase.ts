import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wmmbswlajfwahiaadtxc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xFVcgTS2Gb0750W2WQjENA_4ufhJaJF';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
