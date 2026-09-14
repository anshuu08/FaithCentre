import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ [Supabase Warning]: Missing Supabase URL or Key in environment variables.');
}

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

export const checkSupabaseConnection = async () => {
  if (!supabase) {
    return { connected: false, error: 'Supabase client not initialized' };
  }
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('id')
      .limit(1);

    if (error) {
      return { connected: true, tableExists: false, error: error.message, code: error.code };
    }
    return { connected: true, tableExists: true };
  } catch (err) {
    return { connected: false, error: err.message };
  }
};
