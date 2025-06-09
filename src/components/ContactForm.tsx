import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { saveContactFormData } from "@/services/FormService";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
}

const ContactForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [validFields, setValidFields] = useState<Record<keyof FormData, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    companyName: false,
  });

  const validateField = (name: keyof FormData, value: string): string | null => {
    switch (name) {
      case "firstName":
        return value.trim().length >= 2 ? null : "Voornaam moet minimaal 2 tekens bevatten";
      case "lastName":
        return value.trim().length >= 2 ? null : "Achternaam moet minimaal 2 tekens bevatten";
      case "email":
        return /\S+@\S+\.\S+/.test(value) ? null : "Ongeldig e-mailadres";
      case "phoneNumber":
        return /^\d{10}$/.test(value) ? null : "Telefoonnummer moet exact 10 cijfers bevatten";
      case "companyName":
        return value.trim().length >= 2 ? null : "Bedrijfsnaam moet minimaal 2 tekens bevatten";
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    const newValidFields = { ...validFields };

    Object.entries(formData).forEach(([key, value]) => {
      const fieldName = key as keyof FormData;
      const error = validateField(fieldName, value);

      if (error) {
        newErrors[fieldName] = error;
        newValidFields[fieldName] = false;
      } else {
        newValidFields[fieldName] = true;
      }
    });

    setErrors(newErrors);
    setValidFields(newValidFields);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;

    // For phone number, only allow digits
    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: digitsOnly,
      }));

      // Validate the field and update validFields state
      const error = validateField(fieldName, digitsOnly);
      setValidFields((prev) => ({
        ...prev,
        [fieldName]: error === null,
      }));

      if (error) {
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validate the field and update validFields state
      const error = validateField(fieldName, value);
      setValidFields((prev) => ({
        ...prev,
        [fieldName]: error === null,
      }));

      if (error) {
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  // Function to generate and download CSV
  const generateCSV = (data: FormData) => {
    // Create CSV header and row
    const headers = ["Voornaam", "Achternaam", "Email", "Telefoonnummer", "Bedrijfsnaam"];
    const row = [data.firstName, data.lastName, data.email, data.phoneNumber, data.companyName];

    // Format current date and time for filename
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");

    // Create CSV content
    const csvContent = [headers.join(","), row.join(",")].join("\n");

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `contact-form-${dateStr}-${timeStr}.csv`);
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await saveContactFormData(formData);

      if (!result.success) {
        // Check for specific error types
        const error = result.error as any;
        if (error?.code === "23505") {
          // Unique violation
          toast({
            title: "E-mailadres al in gebruik",
            description: "Dit e-mailadres is al geregistreerd.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Gegevens Opgeslagen",
        description: "Je gegevens zijn succesvol opgeslagen.",
        variant: "default",
      });

      // Redirect to quotes page immediately after successful submission
      navigate("/quotes");
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Verwerking Mislukt",
        description: "Er is een fout opgetreden bij het opslaan van je gegevens. Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg animate-slide-in">
      <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-red-gradient-start to-red-gradient-end bg-clip-text text-transparent">Jouw profiel</h1>

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
        <div className="space-y-2 relative">
          <Label htmlFor="firstName">Voornaam</Label>
          <div className="relative">
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Vul uw voornaam in"
              className={errors.firstName ? "border-red-500 pr-10" : "pr-10"}
              autoComplete="given-name"
            />
            {validFields.firstName && <CheckCircle className="h-4 w-4 absolute right-3 top-3 text-green-action" />}
          </div>
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
        </div>

        <div className="space-y-2 relative">
          <Label htmlFor="lastName">Achternaam</Label>
          <div className="relative">
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Vul uw achternaam in"
              className={errors.lastName ? "border-red-500 pr-10" : "pr-10"}
              autoComplete="family-name"
            />
            {validFields.lastName && <CheckCircle className="h-4 w-4 absolute right-3 top-3 text-green-action" />}
          </div>
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
        </div>

        <div className="space-y-2 relative">
          <Label htmlFor="email">E-mailadres</Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Vul uw e-mailadres in"
              className={errors.email ? "border-red-500 pr-10" : "pr-10"}
              autoComplete="email"
            />
            {validFields.email && <CheckCircle className="h-4 w-4 absolute right-3 top-3 text-green-action" />}
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2 relative">
          <Label htmlFor="phoneNumber">Telefoonnummer</Label>
          <div className="relative">
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Vul uw telefoonnummer in (10 cijfers)"
              maxLength={10}
              className={errors.phoneNumber ? "border-red-500 pr-10" : "pr-10"}
              autoComplete="tel"
            />
            {validFields.phoneNumber && <CheckCircle className="h-4 w-4 absolute right-3 top-3 text-green-action" />}
          </div>
          {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
        </div>

        <div className="space-y-2 relative">
          <Label htmlFor="companyName">Bedrijfsnaam</Label>
          <div className="relative">
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Vul uw bedrijfsnaam in"
              className={errors.companyName ? "border-red-500 pr-10" : "pr-10"}
              autoComplete="organization"
            />
            {validFields.companyName && <CheckCircle className="h-4 w-4 absolute right-3 top-3 text-green-action" />}
          </div>
          {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-red-gradient-start to-red-gradient-end hover:opacity-90 transition-opacity">
          {isSubmitting ? "Bezig met verwerken..." : "Doorgaan"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
