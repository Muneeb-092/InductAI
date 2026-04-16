import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CandidateLandingPage } from "./components/CandidateLandingPage";
import { TestInstructionsPage } from "./components/TestInstructionsPage";
import { MCQTestPage } from "./components/MCQTestPage";
import { AIInterviewInstructionsPage } from "./components/AIInterviewInstructionsPage";
import { AIInterviewPage } from "./components/AIInterviewPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      
      <Routes>
        {/* 1. Entry Point: The recruiter's link brings them here */}
        <Route path="/apply/:jobId" element={<CandidateLandingPage />} />

        {/* 2. Instructions: Requires the newly created Session ID */}
        <Route path="/instructions/:sessionId" element={<TestInstructionsPage />} />

        {/* 3. The MCQ Test */}
        <Route path="/test/:sessionId" element={<MCQTestPage />} />

        {/* 4. Interview Prep */}
        <Route path="/interview-instructions/:sessionId" element={<AIInterviewInstructionsPage />} />

        {/* 5. The Video Interview */}
        <Route path="/interview/:sessionId" element={<AIInterviewPage />} />

        {/* 6. Success/Completion Page (Optional but recommended!) */}
        <Route path="/success" element={
          <div className="flex h-screen items-center justify-center flex-col text-center p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete!</h1>
            <p className="text-gray-500">Thank you for completing the evaluation. You may now close this tab.</p>
          </div>
        } />

        {/* Fallback route: If they go to localhost:3000 without a valid link */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
        <Route path="/" element={
          <div className="flex h-screen items-center justify-center text-gray-500 p-8 text-center">
            Welcome to InductAI. Please use the specific application link provided by your recruiter to begin.
          </div>
        } />
      </Routes>
    </Router>
  );
}