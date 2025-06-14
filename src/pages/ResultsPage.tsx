import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { profiles } from "@/data/dilemmaData";
import { Card } from "@/components/ui/card";
import { Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateFormDataWithResult } from "@/services/FormService";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { testSupabaseConnection } from "@/lib/supabase";

const ResultsPage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState(profiles.find((p) => p.id === profileId));
  const { isMobile } = useBreakpoint();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saveResult = async () => {
      // If invalid profile ID, redirect to quotes
      if (!profile) {
        navigate("/quotes");
        toast({
          title: "Profiel niet gevonden",
          description: "We konden het opgegeven profiel niet vinden.",
          variant: "destructive",
        });
        return;
      }

      // Test Supabase connection first
      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        toast({
          title: "Verbindingsfout",
          description: "Er kon geen verbinding worden gemaakt met de database. Je resultaat wordt lokaal opgeslagen.",
          variant: "destructive",
        });
        return;
      }

      // Try to get the email from sessionStorage
      const email = sessionStorage.getItem("userEmail");
      if (!email) {
        toast({
          title: "Geen gebruikersgegevens",
          description: "We konden je gebruikersgegevens niet vinden. Probeer het formulier opnieuw in te vullen.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsSubmitting(true);
      try {
        // Store the profile result with the form data
        const result = await updateFormDataWithResult(email, profile.title);
        if (!result.success) {
          throw result.error;
        }

        // toast({
        //   title: "Resultaat Opgeslagen",
        //   description: "Je resultaat is succesvol opgeslagen.",
        // });
      } catch (error) {
        console.error("Failed to save profile result:", error);
        toast({
          title: "Fout bij Opslaan",
          description: "Er is een fout opgetreden bij het opslaan van je resultaat. Je kunt het later opnieuw proberen.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    saveResult();
  }, [profile, navigate, toast]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Mijn BI Profiel: ${profile?.title}`,
          text: `Volgens de BI-match test ben ik ${profile?.title}! ${profile?.description}`,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Share failed", error));
    } else {
      // Fallback for browsers that don't support navigator.share
      toast({
        title: "Delen niet ondersteund",
        description: "Je browser ondersteunt delen niet. Kopieer de URL om handmatig te delen.",
      });
    }
  };

  if (!profile) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen py-4 md:py-6 px-4 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container max-w-sm md:max-w-md mx-auto">
        {/* Page header with app logo */}
        <div className="flex justify-center items-center gap-2 mb-4 md:mb-6">
          <Heart className="h-5 w-5 md:h-6 md:w-6 text-red-action animate-heart-beat" />
          <h1 className="text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-red-gradient-start to-red-gradient-end bg-clip-text text-transparent">Jouw BI Profiel</h1>
        </div>

        <Card className="p-4 md:p-6 shadow-lg animate-slide-in mb-6">
          <div className="flex justify-center mb-3 md:mb-4">
            <div className="rounded-full bg-gradient-to-r from-red-gradient-start to-red-gradient-end p-4 md:p-6">
              <Heart className="h-8 w-8 md:h-10 md:w-10 text-white animate-heart-beat" />
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-center mb-3 md:mb-4 bg-gradient-to-r from-red-gradient-start to-red-gradient-end bg-clip-text text-transparent">{profile.title}</h2>

          <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base text-center">{profile.description}</p>

          <div className="bg-gray-100 p-3 md:p-4 rounded-md mb-4 md:mb-6">
            <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">👉 Tip van ons:</h3>
            <p className="italic text-gray-700 text-sm md:text-base">{profile.tip}</p>
          </div>

          <Button onClick={handleShare} variant="outline" className="w-full flex items-center justify-center gap-2" size={isMobile ? "default" : "lg"} disabled={isSubmitting}>
            <Share2 size={isMobile ? 16 : 18} />
            Deel Mijn Profiel
          </Button>
        </Card>

        <div className="text-center pb-4 md:pb-6">
          <Button
            onClick={() => navigate("/")}
            size={isMobile ? "default" : "lg"}
            className="bg-gradient-to-r from-red-gradient-start to-red-gradient-end hover:opacity-90 transition-opacity"
            disabled={isSubmitting}
          >
            Terug naar Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
