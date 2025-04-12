
import { createClient } from '@supabase/supabase-js';

// Use environment variables or direct values as provided
const supabaseUrl = 'https://klcqyxsbkhvticfzrcfv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsY3F5eHNia2h2dGljZnpyY2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0OTE0MTMsImV4cCI6MjA2MDA2NzQxM30._aSHidhj2WbIbFdKW6FSum8toDmSOD-4LvaXD8GOAiU';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
