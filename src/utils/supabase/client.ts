import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rosmnjsoaiyvdawvnzgl.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_zcEK6rK2kH9k-qPUay-6hg_oLYvNaAa';

export const supabase = createClient(supabaseUrl, supabaseKey);
