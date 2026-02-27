import { useState, useEffect } from "react";

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // common mobile breakpoint
    };

    checkMobile(); // initial check
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return !!isMobile;
}

export default useMobile;