import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { TestTimer } from "./TestTimer";
import { MonitoringPanel } from "./MonitoringPanel";
import { QuestionOverview } from "./QuestionOverview";
import { QuestionCard } from "./QuestionCard";
import { mockQuestions } from "../data/questions";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Eye,
  Send,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function MCQTestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [monitoringStatus] = useState({
    camera: true,
    microphone: true,
    aiDetection: true,
  });
  const { sessionId } = useParams(); 
  const navigate = useNavigate();
  const currentQuestion = mockQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === mockQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

  // Warning for tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error("Warning: Switching tabs is not allowed during the test!", {
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleAnswerSelect = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer,
    });
    toast.success("Answer saved", { duration: 1000 });
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  const toggleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentQuestion.id)) {
      newMarked.delete(currentQuestion.id);
      toast.info("Removed from review");
    } else {
      newMarked.add(currentQuestion.id);
      toast.info("Marked for review");
    }
    setMarkedForReview(newMarked);
  };

  const handleSubmitTest = () => {
    const answeredCount = Object.keys(answers).length;
    const unanswered = mockQuestions.length - answeredCount;
    
    if (unanswered > 0) {
      toast.warning(`You have ${unanswered} unanswered question(s)`);
    }
    
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    // 1. (Optional) Make an API call here to save their final answers to the database!
    
    toast.success("Test submitted successfully!");
    
    // 2. REPLACED: Navigate to the interview instructions with their session ID
    navigate(`/interview-instructions/${sessionId}`); 
  };

  const handleTimeUp = () => {
    toast.error("Time's up! Submitting your test automatically...");
    setTimeout(() => {
      onSubmitTest();
    }, 2000);
  };

  const questionStatuses = mockQuestions.map((q) => ({
    id: q.id,
    answered: !!answers[q.id],
    markedForReview: markedForReview.has(q.id),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-cyan-50/20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center">
                <span className="text-white font-bold">IA</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">InductAI</h1>
                <div className="flex items-center gap-1 text-xs text-purple-600">
                  <Eye className="w-3 h-3" />
                  <span>AI-Proctored Test</span>
                </div>
              </div>
            </div>

            {/* Timer */}
            <TestTimer initialMinutes={25} onTimeUp={handleTimeUp} />

            {/* Progress */}
            <div className="text-right">
              <p className="text-sm text-gray-600">Test Progress</p>
              <p className="font-semibold text-gray-900">
                Question {currentQuestionIndex + 1} of {mockQuestions.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Question Area */}
          <div className="lg:col-span-3 space-y-6">
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id] || null}
              onAnswerSelect={handleAnswerSelect}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={mockQuestions.length}
            />

            {/* Navigation Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="mark-review"
                    checked={markedForReview.has(currentQuestion.id)}
                    onCheckedChange={toggleMarkForReview}
                  />
                  <label
                    htmlFor="mark-review"
                    className="text-sm text-gray-700 cursor-pointer flex items-center gap-2"
                  >
                    <Bookmark className="w-4 h-4" />
                    Mark for Review
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentQuestionIndex === 0}
                    className="min-w-[120px]"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  {isLastQuestion ? (
                    <Button
                      onClick={handleSubmitTest}
                      className="min-w-[120px] bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500"
                    >
                      Submit Test
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="min-w-[120px] bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <MonitoringPanel status={monitoringStatus} />
            <QuestionOverview
              questions={questionStatuses}
              currentQuestion={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
            />
          </div>
        </div>
      </main>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your test? You have answered{" "}
              <span className="font-semibold">{Object.keys(answers).length}</span> out of{" "}
              <span className="font-semibold">{mockQuestions.length}</span> questions.
              {Object.keys(answers).length < mockQuestions.length && (
                <span className="block mt-2 text-orange-600">
                  You still have {mockQuestions.length - Object.keys(answers).length} unanswered
                  question(s).
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSubmit}
              className="bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500"
            >
              Confirm Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
