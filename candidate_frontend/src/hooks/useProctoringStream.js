import { useEffect, useRef } from "react";

// NEW: Added sessionId as a parameter
export const useProctoringStream = (videoRef, isMonitoringActive, sessionId, onAnalysisResult) => {
  const canvasRef = useRef(document.createElement("canvas"));
  
  const callbackRef = useRef(onAnalysisResult);
  useEffect(() => {
    callbackRef.current = onAnalysisResult;
  }, [onAnalysisResult]);

  useEffect(() => {
    // NEW: Don't start capturing if we don't have a dynamic session ID yet!
    if (!isMonitoringActive || !videoRef.current || !sessionId) return;

    console.log(`✅ Camera active! Capturing for Session #${sessionId}...`);

    const captureAndSendFrame = async () => {
      const video = videoRef.current;
      
      if (!video || video.videoWidth === 0) return;

      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Image = canvas.toDataURL("image/jpeg", 0.5);

      try {
        const response = await fetch("http://localhost:8000/analyze", { // Update URL to match your routes if needed
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            image: base64Image, 
            timestamp: Date.now(), 
            sessionId: sessionId // NEW: Using the dynamic ID!
          })
        });

        const data = await response.json();
        if (callbackRef.current) callbackRef.current(data);

      } catch (error) {
        console.error("❌ Fetch Error:", error.message);
      }
    };

    const intervalId = setInterval(captureAndSendFrame, 2000);
    return () => clearInterval(intervalId);
    
    // Add sessionId to dependency array
  }, [videoRef, isMonitoringActive, sessionId]); 
};