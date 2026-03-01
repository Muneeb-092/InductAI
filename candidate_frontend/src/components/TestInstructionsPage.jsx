import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ProgressIndicator } from "./ProgressIndicator";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { SystemCheckDialog } from "./SystemCheckDialog";
import {
  Camera,
  Mic,
  Eye,
  Brain,
  Clock,
  FileQuestion,
  Target,
  RotateCcw,
  AlertTriangle,
  Shield,
  ChevronLeft,
  HelpCircle,
  CheckCircle2,
  XCircle,
  MonitorPlay,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function TestInstructionsPage({ onGoBack, onStartTest }) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [systemCheckOpen, setSystemCheckOpen] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const handleStartTest = () => {
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
          toast.success("Starting test now...");
          onStartTest();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGoBack = () => {
    toast.info("Returning to candidate information...");
    onGoBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-cyan-50/30">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Progress Section */}
        <div className="max-w-3xl mx-auto mb-8">
          <ProgressIndicator currentStep={2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Message */}
            <Card className="p-8 bg-white shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center flex-shrink-0">
                  <FileQuestion className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Before You Begin the Test
                  </h2>
                  <p className="text-gray-600">
                    Please read the following instructions carefully. You must agree to all terms before continuing.
                  </p>
                </div>
              </div>

              {/* Test Overview */}
              <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-xl p-6 border border-purple-100 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Test Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <FileQuestion className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Test Type</p>
                      <p className="font-medium text-gray-900">Multiple Choice Questions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Total Questions</p>
                      <p className="font-medium text-gray-900">20 Questions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-medium text-gray-900">25 Minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Passing Score</p>
                      <p className="font-medium text-gray-900">60%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 col-span-2">
                    <RotateCcw className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Number of Attempts</p>
                      <p className="font-medium text-gray-900">1 Attempt Only</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monitoring Instructions */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  AI Monitoring & Security
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Camera className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Your <span className="font-medium">camera must remain ON</span> throughout the test for identity verification.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mic className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Your <span className="font-medium">microphone must remain ON</span> to detect unusual activity.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Brain className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      The system uses <span className="font-medium">AI-based cheating detection</span> to ensure fairness and integrity.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Background noise, phone usage, or switching tabs</span> will be automatically flagged.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MonitorPlay className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Your <span className="font-medium">video and audio will be recorded</span> for verification purposes only.
                    </p>
                  </div>
                </div>
              </div>

              {/* Test Rules */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Test Rules
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      You <span className="font-medium">cannot pause or restart</span> the test once it begins.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Avoid <span className="font-medium">refreshing or closing the tab</span> during the test.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Every question is mandatory</span> and must be answered.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Click <span className="font-medium">"Submit Test"</span> only after completing all questions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy and Consent */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Privacy & Consent
                </h3>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  By proceeding, you consent to video and audio monitoring during the assessment. 
                  Your data will be used solely for evaluation purposes in compliance with InductAI's{" "}
                  <a href="#" className="text-purple-600 hover:underline font-medium">
                    Privacy Policy
                  </a>
                  . All recordings are encrypted and stored securely.
                </p>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked)}
                    className="mt-1"
                  />
                  <label
                    htmlFor="consent"
                    className="text-sm text-gray-900 cursor-pointer leading-relaxed"
                  >
                    I have read and agree to the above instructions and privacy policy. I understand that 
                    I will be monitored during the test and any violation will result in disqualification.
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleGoBack}
                  disabled={countdown !== null}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
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
                  onClick={handleStartTest}
                  disabled={!agreedToTerms || countdown !== null}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {countdown !== null ? (
                    <>Starting in {countdown}...</>
                  ) : (
                    <>
                      Start Test
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Help Link */}
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-gray-600 hover:text-purple-600 inline-flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" />
                  Need help? Contact support
                </a>
              </div>
            </Card>
          </div>

          {/* Right Sidebar - Visual Section */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              {/* AI Monitoring Illustration */}
              <Card className="p-6 bg-white shadow-lg">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-400/10 rounded-xl blur-2xl" />
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop"
                    alt="AI Monitoring"
                    className="relative w-full h-48 object-cover rounded-lg mb-4"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Proctoring</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our advanced AI ensures a fair and secure testing environment for all candidates.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-700">Real-time monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-700">Automated flagging</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-700">Secure data handling</span>
                  </div>
                </div>
              </Card>

              {/* Tips Card */}
              <Card className="p-6 bg-gradient-to-br from-cyan-50 to-purple-50 border-cyan-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Ensure good lighting on your face</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Find a quiet environment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Keep your ID document ready</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Close all other browser tabs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Use a stable internet connection</span>
                  </li>
                </ul>
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
