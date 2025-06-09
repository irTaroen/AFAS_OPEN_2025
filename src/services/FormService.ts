import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
}

interface SubmissionResult {
  success: boolean;
  error?: PostgrestError | Error;
}

export const saveContactFormData = async (formData: FormData): Promise<SubmissionResult> => {
  try {
    console.log("Saving form data to session storage:", formData);
    // Store form data in session storage for later use
    sessionStorage.setItem("userEmail", formData.email);
    sessionStorage.setItem("formData", JSON.stringify(formData));

    return { success: true };
  } catch (error) {
    console.error("Error saving form data:", error);
    return { success: false, error: error as Error };
  }
};

export const updateFormDataWithResult = async (email: string, result: string): Promise<SubmissionResult> => {
  try {
    console.log("Updating form data with result for email:", email);
    console.log("Result:", result);

    // Get the stored form data
    const formDataString = sessionStorage.getItem("formData");
    console.log("Retrieved form data from session storage:", formDataString);

    if (!formDataString) {
      throw new Error("No form data found");
    }

    const formData = JSON.parse(formDataString) as FormData;
    console.log("Parsed form data:", formData);

    // Create the record to insert with correct column names
    const record = {
      Voornaam: formData.firstName,
      Achternaam: formData.lastName,
      "E-mailadres": formData.email,
      Telefoonnummer: formData.phoneNumber,
      Bedrijfsnaam: formData.companyName,
      Resultaat: result,
    };
    console.log("Attempting to insert record into Supabase:", record);

    // Insert the complete record into Supabase
    const { data, error } = await supabase.from("participants").insert([record]).select();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    console.log("Successfully inserted data:", data);

    // Clear the session storage after successful submission
    sessionStorage.removeItem("formData");
    sessionStorage.removeItem("userEmail");

    return { success: true };
  } catch (error) {
    console.error("Error updating form data with result:", error);
    return { success: false, error: error as PostgrestError | Error };
  }
};
