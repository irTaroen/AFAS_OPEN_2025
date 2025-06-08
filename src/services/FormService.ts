interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  profileResult?: string;
}

export const saveContactFormData = async (formData: ContactFormData) => {
  try {
    // Store in localStorage
    localStorage.setItem("userFormData", JSON.stringify(formData));
    localStorage.setItem("userEmail", formData.email);

    return { success: true, data: formData };
  } catch (error) {
    console.error("Error saving form data:", error);
    return { success: false, error };
  }
};

export const updateFormDataWithResult = async (email: string, profileResult: string) => {
  try {
    // Update localStorage
    const storedData = localStorage.getItem("userFormData");
    if (storedData) {
      const formData = JSON.parse(storedData);
      formData.profileResult = profileResult;
      localStorage.setItem("userFormData", JSON.stringify(formData));
    }

    return { success: true, data: { profileResult } };
  } catch (error) {
    console.error("Error updating form data with result:", error);
    return { success: false, error };
  }
};
