import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { TestTimer } from "./TestTimer";
import { MonitoringPanel } from "./MonitoringPanel";
import { QuestionOverview } from "./QuestionOverview";
import { QuestionCard } from "./QuestionCard";
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

  const [questions, setQuestions] = useState([]); // ✅ REAL DATA
  const [loading, setLoading] = useState(true);

  const { sessionId } = useParams(); 
  const navigate = useNavigate();

  // =========================
  // 🔥 FETCH QUESTIONS FROM API
  // =========================
// 1. Fetch Questions Hook
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/getMCQs/${sessionId}/mcq`
        );

        const data = await res.json();
        
        // Sort data by questionNumber to ensure chronological order
        const sortedData = data.sort((a, b) => a.questionNumber - b.questionNumber);

        setQuestions(sortedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching MCQ questions:", err);
        toast.error("Failed to load questions");
        setLoading(false); // Ensure loading stops on error
      }
    };

    fetchQuestions();
  }, [sessionId]);

  // 2. Tab Switching Warning Hook
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
console.log("QUESTIONS STATE:", questions);
console.log("CURRENT INDEX:", currentQuestionIndex);
  // =========================
  // LOADING STATE (NO UI CHANGE)
  // =========================
  if (loading || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading questions...
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  

  const handleAnswerSelect = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer,
    });
    toast.success("Answer saved", { duration: 1000 });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
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
    const unanswered = questions.length - answeredCount;

    if (unanswered > 0) {
      toast.warning(`You have ${unanswered} unanswered question(s)`);
    }

    setShowSubmitDialog(true);
  };

  const confirmSubmit = async () => {
    try {
      // 1. Transform the answers state into the array format expected by the backend
      const formattedAnswers = Object.entries(answers).map(([qId, selectedOpt]) => ({
        questionId: parseInt(qId), // Ensure it's a number for Prisma
        selectedOpt: selectedOpt,
      }));

      // 2. Call the API
      // Make sure this URL matches your actual backend route setup
      const res = await fetch(`http://localhost:5000/api/session/${sessionId}/mcq/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit test");
      }

      // 3. Success handling
      toast.success("Test submitted successfully!");
      setShowSubmitDialog(false);
      navigate(`/interview-instructions/${sessionId}`); 
      
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error(err.message || "Failed to submit the test. Please try again.");
    }
  };

  const handleTimeUp = () => {
    toast.error("Time's up! Submitting your test automatically...");
    setShowSubmitDialog(false); // Close dialog if it's open
    
    // 💡 Pro-Tip: Call confirmSubmit directly here instead of handleSubmitTest. 
    // Otherwise, it just opens the "Are you sure?" dialog when time is already up!
    setTimeout(() => {
      confirmSubmit();
    }, 2000);
  };

  const questionStatuses = questions.map((q) => ({
    id: q.id,
    answered: !!answers[q.id],
    markedForReview: markedForReview.has(q.id),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-cyan-50/20">

      {/* Header (UNCHANGED UI) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">

          <div className="flex items-center justify-between">

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

            <TestTimer initialMinutes={25} onTimeUp={handleTimeUp} />

            <div className="text-right">
              <p className="text-sm text-gray-600">Test Progress</p>
              <p className="font-semibold text-gray-900">
                {/* ✅ NECESSARY CHANGE: Use API's explicit questionNumber */}
                Question {currentQuestion.questionNumber} of {questions.length}
              </p>
            </div>

          </div>

          <div className="mt-3">
            <Progress value={progress} className="h-2" />
          </div>

        </div>
      </header>

      {/* Main Content (UNCHANGED UI) */}
      <main className="container mx-auto px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

          <div className="lg:col-span-3 space-y-6">

            <QuestionCard
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id] || null}
              onAnswerSelect={handleAnswerSelect}
              // ✅ NECESSARY CHANGE: Pass API's questionNumber down to the component
              questionNumber={currentQuestion.questionNumber}
              totalQuestions={questions.length}
            />

            {/* Navigation Controls (UNCHANGED UI) */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="mark-review"
                    checked={markedForReview.has(currentQuestion.id)}
                    onCheckedChange={toggleMarkForReview}
                  />
                  <label htmlFor="mark-review" className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
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
                      className="min-w-[120px] bg-gradient-to-r from-purple-600 to-cyan-400 text-white"
                    >
                      Submit Test
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="min-w-[120px] bg-gradient-to-r from-purple-600 to-cyan-400 text-white"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}

                </div>

              </div>
            </div>

          </div>

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

      {/* Dialog (UNCHANGED) */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your test?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>
              Confirm Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}