import { useState } from "react";
import { CandidateLandingPage } from "./components/CandidateLandingPage";
import { TestInstructionsPage } from "./components/TestInstructionsPage";
import { MCQTestPage } from "./components/MCQTestPage";
import { AIInterviewInstructionsPage } from "./components/AIInterviewInstructionsPage";
import { AIInterviewPage } from "./components/AIInterviewPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState("interview-instructions"); 

  const handleProceedToTest = () => {
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
        <AIInterviewPage onCompleteInterview={handleCompleteInterview} />
      )}
    </>
  );
}