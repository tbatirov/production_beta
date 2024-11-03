import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { logger } from '../logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test connection and log session state
supabase.auth.onAuthStateChange((event, session) => {
  logger.info('Auth state changed:', { 
    event, 
    isAuthenticated: !!session?.user,
    userId: session?.user?.id 
  });
});