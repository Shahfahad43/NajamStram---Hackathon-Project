import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sabpbgcbfsaynpwgmgyk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYnBiZ2NiZnNheW5wd2dtZ3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NzUyNjcsImV4cCI6MjA4NDE1MTI2N30.5H7HRfJXy363f_RSRvzlmOOLYcfpmO06s6cNEO_RiqE';

export const supabase = createClient(supabaseUrl, supabaseKey);