import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

// Service role key bypasses Row Level Security — this client must never
// be sent to, or reused by, the frontend.
export const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { persistSession: false },
});
