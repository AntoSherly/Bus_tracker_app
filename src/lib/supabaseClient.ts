import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://buvqqydhceiynyrhlaof.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dnFxeWRoY2VpeW55cmhsYW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNDcyNjMsImV4cCI6MjA1NzcyMzI2M30.Sd_8mjhu1uWkWnB17mqkMKCrEDw-2OLQnBs7Q9Pm1AI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
