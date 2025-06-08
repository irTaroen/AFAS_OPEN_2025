import React, { useState, useEffect } from "react";
import QuoteCard from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { dilemmas } from "@/data/dilemmaData";
import { useBreakpoint } from "@/hooks/use-breakpoint";

type ProfileScore = {
  "Excel-ex": number;
  "Dashboard Dater": number;
  "BI-hunter": number;
};

const QuotesPage = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [responses, setResponses] = useState<{[key: number]: boolean}>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [profileScores, setProfileScores] = useState<ProfileScore>({
    "Excel-ex": 0,
    "Dashboard Dater": 0,
    "BI-hunter": 0
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  
  // Check if all dilemmas are completed
  useEffect(() => {
    if (currentQuoteIndex >= dilemmas.length && !isCompleted) {
      setIsCompleted(true);
      toast({
        title: "Alle profielen bekeken!",
        description: "Je hebt alle profielen beantwoord.",
      });
    }
  }, [currentQuoteIndex, isCompleted, toast]);

  const handleSwipe = (direction: "left" | "right") => {
    // Record response (right = relates, left = doesn't relate)
    const relatesTo = direction === "right";
    const currentDilemma = dilemmas[currentQuoteIndex];
    
    setResponses(prev => ({
      ...prev,
      [currentDilemma.id]: relatesTo
    }));
    
    // Update profile scores based on response
    if (direction === "right") {
      // If swiped right (like), increment score for the matching profile
      setProfileScores(prev => ({
        ...prev,
        [currentDilemma.likeProfile]: prev[currentDilemma.likeProfile as keyof ProfileScore] + 1
      }));
      
      setShowMatch(true);
      
      // Hide match animation after 2 seconds and proceed to next dilemma
      setTimeout(() => {
        setShowMatch(false);
        moveToNextQuote();
      }, 2000);
    } else {
      // If swiped left (dislike), increment scores for dislike profiles
      const updatedScores = {...profileScores};
      currentDilemma.dislikeProfiles.forEach(profile => {
        updatedScores[profile] += 0.5; // Half point for disliking options that match these profiles
      });
      setProfileScores(updatedScores);
      
      // Immediately move to next dilemma
      moveToNextQuote();
    }
  };

  const moveToNextQuote = () => {
    if (currentQuoteIndex < dilemmas.length - 1) {
      setCurrentQuoteIndex(currentQuoteIndex + 1);
    } else {
      // Finished all dilemmas
      setIsCompleted(true);
    }
  };

  const handleShowResults = () => {
    // Calculate which profile has the highest score
    const scores = Object.entries(profileScores);
    scores.sort((a, b) => b[1] - a[1]); // Sort by score in descending order
    const topProfile = scores[0][0];
    
    // Try to get email from form submission (this could be stored in sessionStorage when the form is submitted)
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
      // Keep it for the results page
      sessionStorage.setItem('userEmail', userEmail);
    }
    
    // Navigate to results page with the top profile
    navigate(`/results/${topProfile}`);
  };

  const handleStartOver = () => {
    setCurrentQuoteIndex(0);
    setResponses({});
    setIsCompleted(false);
    setProfileScores({
      "Excel-ex": 0,
      "Dashboard Dater": 0,
      "BI-hunter": 0
    });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const currentDilemma = dilemmas[currentQuoteIndex];
  
  // Function to get BI profile names based on ID
  const getProfileName = (id: number): string => {
    switch (id) {
      case 1: return "Fiona Forecast";
      case 2: return "Emma Excel";
      case 3: return "Boris BI";
      case 4: return "Vera Visual";
      case 5: return "Pieter Puzzel";
      case 6: return "Json Derulo";
      case 7: return "Tamara Timeline";
      default: return `Profiel ${id}`;
    }
  };

  return (
    <div className="min-h-screen py-4 md:py-6 px-4 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container mx-auto max-w-md">
        {/* Page header with app logo */}
        <div className="flex justify-center items-center gap-2 mb-4 md:mb-6">
          <Heart className="h-5 w-5 md:h-6 md:w-6 text-red-action animate-heart-beat" />
          <h1 className="text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-red-gradient-start to-red-gradient-end bg-clip-text text-transparent">
            All you need is BI
          </h1>
        </div>

        {!isCompleted ? (
          <div className="animate-slide-in">
            <div className="mb-3 md:mb-4 text-center text-xs md:text-sm font-medium text-gray-500">
              {getProfileName(currentQuoteIndex + 1)} - {currentQuoteIndex + 1}/{dilemmas.length}
            </div>
            
            <QuoteCard 
              quote={currentDilemma} 
              onSwipe={handleSwipe} 
            />
            
            <div className="text-center mt-3 md:mt-4 text-xs md:text-sm text-gray-500">
              <span className="font-medium">Hint:</span> Swipe rechts als de stelling bij je past, links als niet
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6 p-4 md:p-6 bg-white rounded-lg shadow-md animate-slide-in">
            <h2 className="text-lg md:text-xl font-semibold text-center">It's a Match!</h2>
            <p className="text-center text-gray-600 text-sm md:text-base">We hebben de perfecte match voor jou gevonden!</p>
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleShowResults}
                className="w-full bg-gradient-to-r from-red-gradient-start to-red-gradient-end hover:opacity-90 transition-opacity"
              >
                Bekijk Resultaat
              </Button>
              <Button 
                variant="outline" 
                onClick={handleStartOver}
                className="w-full"
              >
                Begin Opnieuw
              </Button>
            </div>
          </div>
        )}

        {/* Match Animation Overlay */}
        {showMatch && (
          <div className="fixed inset-0 bg-gradient-to-r from-red-gradient-start to-red-gradient-end bg-opacity-90 flex items-center justify-center z-50 animate-fade-in">
            <div className="text-center p-6">
              <Heart className="h-16 w-16 md:h-20 md:w-20 text-white mx-auto mb-3 md:mb-4 animate-heart-beat" />
              <div className="text-2xl md:text-4xl font-bold text-white mb-2">It's a Match!</div>
              <div className="text-lg md:text-xl text-white">{currentDilemma.text}</div>
            </div>
          </div>
        )}
        
        {/* Centered home button at bottom */}
        <div className="text-center mt-6 md:mt-8 pb-4 md:pb-6">
          <Button 
            onClick={handleBackToHome}
            size={isMobile ? "default" : "lg"}
            className="bg-gradient-to-r from-red-gradient-start to-red-gradient-end hover:opacity-90 transition-opacity"
          >
            Terug naar Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuotesPage;
