import { createClient } from '@supabase/supabase-js';

// Fallback credentials for the provided environment
const FALLBACK_URL = 'https://ffzqgdxznsrbuhqbtmaw.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmenFnZHh6bnNyYnVocWJ0bWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTQxMzEsImV4cCI6MjA4MDI3MDEzMX0.9cXG7oOyVaQB4a7msH5nibeOA-zeG5DG23knTb-qMrs';

// Safely retrieve environment variables or use fallback
const getEnv = (key: string, fallback: string) => {
  // Use optional chaining to safely access import.meta.env
  // This prevents crashes if import.meta or import.meta.env is undefined
  // @ts-ignore
  const value = import.meta?.env?.[key];
  return value || fallback;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL', FALLBACK_URL);
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', FALLBACK_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase Environment Variables.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);