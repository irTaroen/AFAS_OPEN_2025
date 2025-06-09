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
    // Get the stored form data
    const formDataString = sessionStorage.getItem("formData");
    if (!formDataString) {
      throw new Error("No form data found");
    }

    const formData = JSON.parse(formDataString) as FormData;

    // Insert the complete record into Supabase
    const { error } = await supabase.from("participants").insert([
      {
        voornaam: formData.firstName,
        achternaam: formData.lastName,
        emailadres: formData.email,
        telefoonnummer: formData.phoneNumber,
        bedrijfsnaam: formData.companyName,
        resultaat: result,
      },
    ]);

    if (error) throw error;

    // Clear the session storage after successful submission
    sessionStorage.removeItem("formData");
    sessionStorage.removeItem("userEmail");

    return { success: true };
  } catch (error) {
    console.error("Error updating form data with result:", error);
    return { success: false, error: error as PostgrestError | Error };
  }
};
