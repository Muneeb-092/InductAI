import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ProgressIndicator } from "./ProgressIndicator";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { SystemCheckDialog } from "./SystemCheckDialog";
import {
  Camera,
  Mic,
  Brain,
  Eye,
  Clock,
  MessageSquare,
  Target,
  Lightbulb,
  Shield,
  CheckCircle2,
  Video,
  UserCheck,
  TrendingUp,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function AIInterviewInstructionsPage({
  onStartInterview,
  onGoBack,
}) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [systemCheckOpen, setSystemCheckOpen] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const handleStartInterview = () => {
    if (!agreedToTerms) {
      toast.error("Please agree to the instructions and privacy policy");
      return;
    }

    // Start countdown
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          toast.success("Starting AI interview now...");
          onStartInterview();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-cyan-50/30">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Progress Section */}
        <div className="max-w-3xl mx-auto mb-8">
          <ProgressIndicator currentStep={3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Message */}
            <Card className="p-8 bg-white shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Welcome to the AI Interview Stage
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Congratulations on qualifying the MCQ Test! You are now entering the AI interview
                    round. Please review the instructions below carefully before beginning.
                  </p>
                </div>
              </div>

              {/* Interview Overview */}
              <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-xl p-6 border border-purple-100 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Interview Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Estimated Duration</p>
                      <p className="font-medium text-gray-900">15–20 Minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Total Questions</p>
                      <p className="font-medium text-gray-900">8–10 Questions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:col-span-2">
                    <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Question Types</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          Technical Questions
                        </Badge>
                        <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
                          Scenario-Based
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          Soft Skills
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:col-span-2">
                    <Video className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Format</p>
                      <p className="font-medium text-gray-900">
                        AI voice + video questions (recorded interview)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation Criteria */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Evaluation Criteria
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Technical Knowledge</h4>
                        <p className="text-sm text-gray-600">
                          Accuracy and clarity of responses
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-cyan-50 to-white border-cyan-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Soft Skills</h4>
                        <p className="text-sm text-gray-600">
                          Communication, confidence, body language
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Problem Solving</h4>
                        <p className="text-sm text-gray-600">
                          Logical reasoning and scenario handling
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-cyan-50 to-white border-cyan-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                        <UserCheck className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Behavior & Integrity</h4>
                        <p className="text-sm text-gray-600">
                          Monitored for fairness and authenticity
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Monitoring Instructions */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  AI Monitoring & Requirements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Camera className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Your <span className="font-medium">camera must remain ON</span> throughout the
                      interview for identity verification and facial expression analysis.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mic className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Your <span className="font-medium">microphone must remain ON</span> for voice
                      clarity and tone analysis.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Brain className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      The system will{" "}
                      <span className="font-medium">analyze your expressions, gestures, and voice</span>{" "}
                      using advanced AI technology.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      AI cheating detection will monitor{" "}
                      <span className="font-medium">tab switching, phone use, or additional people</span>{" "}
                      in the frame.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Please sit in a{" "}
                      <span className="font-medium">well-lit area with a neutral background</span> for
                      optimal video quality.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className="mb-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-cyan-600" />
                  Tips for a Great Interview
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Maintain eye contact by looking at the camera</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Speak clearly and at a moderate pace</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Minimize background noise and distractions</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Be confident, concise, and authentic in your responses</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Take a moment to think before answering complex questions</span>
                  </li>
                </ul>
              </div>

              {/* Privacy & Consent */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Privacy & Consent
                </h3>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Your interview video and audio will be securely recorded and used only for AI
                  evaluation and recruiter reporting purposes. All data is encrypted and stored
                  securely in compliance with InductAI's{" "}
                  <a href="#" className="text-purple-600 hover:underline font-medium">
                    Privacy Policy
                  </a>
                  . By continuing, you agree to these terms.
                </p>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="interview-consent"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked)}
                    className="mt-1"
                  />
                  <label
                    htmlFor="interview-consent"
                    className="text-sm text-gray-900 cursor-pointer leading-relaxed"
                  >
                    I have read and agree to the above instructions and privacy terms. I understand that
                    I will be monitored and recorded during the interview for evaluation purposes.
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                {onGoBack && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onGoBack}
                    disabled={countdown !== null}
                  >
                    Back to Dashboard
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSystemCheckOpen(true)}
                  className="flex-1"
                  disabled={countdown !== null}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  System Check
                </Button>
                <Button
                  onClick={handleStartInterview}
                  disabled={!agreedToTerms || countdown !== null}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {countdown !== null ? (
                    <>Starting in {countdown}...</>
                  ) : (
                    <>
                      Start Interview
                      <Video className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Sidebar - Visual Section */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              {/* Interview Illustration */}
              <Card className="p-6 bg-white shadow-lg">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-400/10 rounded-xl blur-2xl" />
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
                    alt="AI Interview"
                    className="relative w-full h-48 object-cover rounded-lg mb-4"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Interview</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our advanced AI evaluates your responses in real-time, providing fair and unbiased
                  assessment.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-700">Real-time analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-700">Facial expression tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-700">Voice tone analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-700">Gesture recognition</span>
                  </div>
                </div>
              </Card>

              {/* Sample Question Preview */}
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-cyan-50 border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Sample Question Preview
                </h3>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <p className="text-sm text-gray-800 leading-relaxed">
                    "Tell me about a challenging technical problem you solved recently. What was your
                    approach?"
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  You'll have 2-3 minutes to answer each question. Take your time and provide detailed
                  responses.
                </p>
              </Card>

              {/* Ready Checklist */}
              <Card className="p-6 bg-white">
                <h3 className="font-semibold text-gray-900 mb-3">Before You Start</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">Good lighting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">Quiet environment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">Stable internet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">Professional attire</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <SystemCheckDialog open={systemCheckOpen} onOpenChange={setSystemCheckOpen} />
    </div>
  );
}
