import { useEffect, useRef } from "react";

export const useProctoringStream = (videoRef, isMonitoringActive, onAnalysisResult) => {
  const canvasRef = useRef(document.createElement("canvas"));
  
  // 🛡️ THE FIX: Store the callback in a ref so it doesn't trigger constant re-renders
  const callbackRef = useRef(onAnalysisResult);
  useEffect(() => {
    callbackRef.current = onAnalysisResult;
  }, [onAnalysisResult]);

  useEffect(() => {
    console.log("🔍 Hook Check -> Camera Active:", isMonitoringActive);

    if (!isMonitoringActive || !videoRef.current) return;

    console.log("✅ Loop initialized! Waiting 2 seconds for first frame...");

    const captureAndSendFrame = async () => {
      const video = videoRef.current;
      
      // If video isn't fully painted yet, skip this tick
      if (!video || video.videoWidth === 0) {
        console.log("⏳ Video warming up...");
        return;
      }

      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Image = canvas.toDataURL("image/jpeg", 0.5);
      console.log("🚀 Sending frame to Node...");

      try {
        const response = await fetch("http://localhost:5000/api/analyze-frame", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            image: base64Image, 
            timestamp: Date.now(), 
            sessionId: 4 
          })
        });

        const data = await response.json();
        console.log("✅ Node replied:", data);
        
        // Pass data back to the UI
        if (callbackRef.current) callbackRef.current(data);

      } catch (error) {
        console.error("❌ Fetch Error (Is Node running?):", error.message);
      }
    };

    // Run every 2 seconds
    const intervalId = setInterval(captureAndSendFrame, 2000);

    // Cleanup
    return () => clearInterval(intervalId);
    
    // 🛡️ THE FIX: We removed onAnalysisResult from this dependency array!
  }, [videoRef, isMonitoringActive]); 
};