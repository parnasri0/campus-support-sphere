import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nmxqxnkhksagaakamzuu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5teHF4bmtoa3NhZ2Fha2FtenV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTM5OTcsImV4cCI6MjA4OTA4OTk5N30.KITRwp5QhUVeJ_xZKyyMGInqnqU4zUxJ0NF8tgX-sgU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
