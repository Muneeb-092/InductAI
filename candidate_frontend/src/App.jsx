import { useState } from "react";
import { CandidateLandingPage } from "./components/CandidateLandingPage";
import { TestInstructionsPage } from "./components/TestInstructionsPage";
import { MCQTestPage } from "./components/MCQTestPage";
import { AIInterviewInstructionsPage } from "./components/AIInterviewInstructionsPage";
import { AIInterviewPage } from "./components/AIInterviewPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  // NEW: State to hold the dynamic session ID across the entire app
  const [sessionId, setSessionId] = useState(null);
  
  // Note: You might want to change this back to "landing" when you are done testing!
  const [currentPage, setCurrentPage] = useState("landing"); 

  // NEW: Accept the sessionId from the Landing Page when they fill out the form
  const handleProceedToTest = (newSessionId) => {
    setSessionId(newSessionId);
    setCurrentPage("instructions");
  };

  const handleGoBack = () => {
    setCurrentPage("landing");
  };

  const handleStartTest = () => {
    setCurrentPage("test");
  };

  const handleSubmitTest = () => {
    setCurrentPage("interview-instructions");
  };

  const handleStartInterview = () => {
    setCurrentPage("interview");
  };

  const handleCompleteInterview = () => {
    // Optional: Clear the session ID when they finish everything
    setSessionId(null);
    setCurrentPage("landing");
  };

  return (
    <>
      <Toaster position="top-center" />

      {currentPage === "landing" && (
        <CandidateLandingPage
          onProceedToTest={handleProceedToTest}
        />
      )}

      {currentPage === "instructions" && (
        <TestInstructionsPage
          onGoBack={handleGoBack}
          onStartTest={handleStartTest}
        />
      )}

      {currentPage === "test" && (
        <MCQTestPage onSubmitTest={handleSubmitTest} />
      )}

      {currentPage === "interview-instructions" && (
        <AIInterviewInstructionsPage
          onStartInterview={handleStartInterview}
        />
      )}

      {currentPage === "interview" && (
        <AIInterviewPage 
          sessionId={sessionId} // NEW: Pass the saved ID directly into the interview page!
          onCompleteInterview={handleCompleteInterview} 
        />
      )}
    </>
  );
}