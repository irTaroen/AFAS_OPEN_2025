import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bhobtiwsujuxumlmcesn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJob2J0aXdzdWp1eHVtbG1jZXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODM4NjAsImV4cCI6MjA2NTA1OTg2MH0.DJanjvNtY1HryhWFGkY-OSvE9W8mB-HGG3SY6qrkHug";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
