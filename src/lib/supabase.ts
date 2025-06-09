import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bhobtiwsujuxumlmcesn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJob2J0aXdzdWp1eHVtbG1jZXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODM4NjAsImV4cCI6MjA2NTA1OTg2MH0.DJanjvNtY1HryhWFGkY-OSvE9W8mB-HGG3SY6qrkHug";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection and table access
export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    const { data, error } = await supabase.from("participants").select("*").limit(1);

    if (error) {
      console.error("Supabase connection test error:", error);
      return false;
    }

    console.log("Supabase connection successful. Sample data:", data);
    return true;
  } catch (error) {
    console.error("Supabase connection test failed:", error);
    return false;
  }
};
