import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckIcon, XIcon, Heart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar } from "@/components/ui/avatar";
import { Dilemma } from "@/data/dilemmaData";
import { useBreakpoint } from "@/hooks/use-breakpoint";

interface QuoteCardProps {
  quote: Dilemma;
  onSwipe: (direction: "left" | "right") => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onSwipe }) => {
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();

  // Touch and mouse event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setOffsetX(currentX - startX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    setOffsetX(currentX - startX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    completeSwipe();
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    completeSwipe();
  };

  const completeSwipe = () => {
    setIsDragging(false);

    // Determine swipe direction based on offset distance
    if (Math.abs(offsetX) > 100) {
      const direction = offsetX > 0 ? "right" : "left";
      setSwipeDirection(direction);

      // Trigger parent callback after animation completes
      setTimeout(() => {
        onSwipe(direction);
        setSwipeDirection(null);
        setOffsetX(0);
      }, 300);
    } else {
      // Reset if not swiped far enough
      setOffsetX(0);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setOffsetX(0);
    }
  };

  const handleSwipeRight = () => {
    setSwipeDirection("right");
    setTimeout(() => {
      onSwipe("right");
      setSwipeDirection(null);
    }, 300);
  };

  const handleSwipeLeft = () => {
    setSwipeDirection("left");
    setTimeout(() => {
      onSwipe("left");
      setSwipeDirection(null);
    }, 300);
  };

  // Funny BI profile names based on ID
  const getProfileName = (id: number): string => {
    switch (id) {
      case 1:
        return "Fiona Forecast";
      case 2:
        return "Emma Excel";
      case 3:
        return "Boris BI";
      case 4:
        return "Vera Visual";
      case 5:
        return "Pieter Puzzel";
      case 6:
        return "Json Derulo";
      case 7:
        return "Tamara Timeline";
      default:
        return `Profiel ${id}`;
    }
  };

  // Get profile image based on ID
  const getProfileImage = (id: number): string => {
    const baseUrl = import.meta.env.BASE_URL;
    switch (id) {
      case 1:
        return `${baseUrl}lovable-uploads/1a5dc097-3e95-4078-8458-46a26559d3ae.png`; // Fiona Forecast
      case 2:
        return `${baseUrl}lovable-uploads/20ce845e-3385-46c0-8596-467de9f54d97.png`; // Emma Excel
      case 3:
        return `${baseUrl}lovable-uploads/2f692c53-58cb-44dc-80e6-48c742aa212d.png`; // Boris BI
      case 4:
        return `${baseUrl}lovable-uploads/f491d2a4-6bf1-4ea4-8ba3-dea4f412a170.png`; // Vera Visual
      case 5:
        return `${baseUrl}lovable-uploads/e9d0459f-5a64-4f20-af94-558196ba3d27.png`; // Pieter Puzzel
      case 6:
        return `${baseUrl}lovable-uploads/6158f863-04fd-42fd-8b9c-04ca84f5c068.png`; // Json Derulo
      case 7:
        return `${baseUrl}lovable-uploads/a0bbdbe2-370d-4943-99b8-490f5c180f90.png`; // Tamara Timeline
      default:
        return `https://picsum.photos/seed/${id + 100}/500/700`; // Random images for others
    }
  };

  // Determine the aspect ratio based on screen size
  const cardAspectRatio = isMobile ? 4 / 5 : isTablet ? 3 / 4 : 3 / 4;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Card
        className={cn(
          "overflow-hidden shadow-xl cursor-grab active:cursor-grabbing transition-transform",
          swipeDirection === "right" && "animate-card-swipe-right",
          swipeDirection === "left" && "animate-card-swipe-left"
        )}
        style={{
          transform: isDragging ? `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)` : undefined,
          opacity: isDragging ? 1 - Math.min(Math.abs(offsetX) / 500, 0.5) : 1,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dilemma Content */}
        <AspectRatio ratio={cardAspectRatio} className="bg-muted">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
          <img src={getProfileImage(quote.id)} alt={`${getProfileName(quote.id)} Profile`} className="object-cover w-full h-full" />

          {/* Dilemma Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white z-20">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-1">
                <Avatar className="h-6 w-6 md:h-8 md:w-8">
                  <img src={`${import.meta.env.BASE_URL}lovable-uploads/f51f019d-4117-4be7-85e2-e57ec4bb6d39.png`} alt="" />
                </Avatar>
              </div>
              <h3 className="text-lg md:text-xl font-bold">{getProfileName(quote.id)}</h3>
            </div>

            <div className="mt-2 md:mt-3 text-base md:text-lg font-medium">"{quote.text}"</div>
          </div>
        </AspectRatio>
      </Card>

      {/* Swipe buttons - responsive sizing */}
      <div className="flex justify-center mt-6 md:mt-8 space-x-4">
        <button onClick={() => handleSwipeLeft()} className="p-2 md:p-3 rounded-full bg-white text-red-action shadow-lg border border-gray-200 hover:scale-110 transition-transform" aria-label="Nee">
          <XIcon size={isMobile ? 24 : 28} />
        </button>

        <button onClick={() => handleSwipeRight()} className="p-2 md:p-3 rounded-full bg-white text-green-action shadow-lg border border-gray-200 hover:scale-110 transition-transform" aria-label="Ja">
          <Heart size={isMobile ? 24 : 28} className="text-red-action animate-heart-beat" />
        </button>
      </div>

      {/* Swipe indicators (visible when dragging) */}
      {isDragging && offsetX !== 0 && (
        <div
          className={cn("absolute top-1/3 -translate-y-1/2 rounded-full p-2 md:p-3 z-20", offsetX > 0 ? "right-4 bg-green-action" : "left-4 bg-red-action", "transition-opacity")}
          style={{ opacity: Math.min(Math.abs(offsetX) / 100, 1) }}
        >
          {offsetX > 0 ? <Heart size={isMobile ? 20 : 24} color="white" /> : <XIcon size={isMobile ? 20 : 24} color="white" />}
        </div>
      )}
    </div>
  );
};

export default QuoteCard;
