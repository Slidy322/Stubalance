import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// In production, these should come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://knxxnukmvfbjjfzydaqe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueHhudWttdmZiampmenlkYXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjI1MTEsImV4cCI6MjA5MDAzODUxMX0.x1OLCgUKkWx1gEQUtbf-OshVz_Nd-Wz3-3uV1MxShL8';

// Check if Supabase is properly configured
const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  supabaseUrl.startsWith('http');

// Only create client if properly configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isAuthEnabled = isSupabaseConfigured;