// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://waaerkrmusslnwedgszj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYWVya3JtdXNzbG53ZWRnc3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MjQ1MTQsImV4cCI6MjA1NDMwMDUxNH0.vWMhaxrS1KHd8qrlH4O_u7Vu1RFU04TxDo1rjGCmfuU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);