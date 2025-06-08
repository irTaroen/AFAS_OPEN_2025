
import * as React from "react"

type Breakpoint = "mobile" | "tablet" | "laptop" | "desktop";

export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState<Breakpoint>("desktop");

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCurrentBreakpoint("mobile");
      } else if (width < 1024) {
        setCurrentBreakpoint("tablet");
      } else if (width < 1280) {
        setCurrentBreakpoint("laptop");
      } else {
        setCurrentBreakpoint("desktop");
      }
    };

    // Initial check
    checkBreakpoint();

    // Add resize listener
    window.addEventListener("resize", checkBreakpoint);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return {
    currentBreakpoint,
    isMobile: currentBreakpoint === "mobile",
    isTablet: currentBreakpoint === "tablet",
    isLaptop: currentBreakpoint === "laptop",
    isDesktop: currentBreakpoint === "desktop"
  };
}
