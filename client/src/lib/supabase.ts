import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bagwndxmhslkgyyorgqn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZ3duZHhtaHNsa2d5eW9yZ3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NDc5NzIsImV4cCI6MjA1NzEyMzk3Mn0.6myoVEeLoN1ny_oHKJY5ri3tOupCaEXbcCU9tgMPEF0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);