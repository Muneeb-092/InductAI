import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Video,
  Camera,
  Mic,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Users,
  MonitorUp,
  Clock,
  Sparkles,
  Volume2,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

// Mock interview questions
const interviewQuestions = [
  "Tell me about yourself and your professional background.",
  "What motivated you to apply for this position?",
  "Describe a challenging technical problem you've solved recently.",
  "How do you handle tight deadlines and pressure?",
  "Where do you see yourself in five years?",
  "Tell me about a time you worked in a team to achieve a goal.",
  "What are your greatest strengths and weaknesses?",
  "Why should we hire you for this role?",
];

export function AIInterviewPage({ onCompleteInterview }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [aiText, setAiText] = useState("");
  const [interviewTimer, setInterviewTimer] = useState(0);
  const [warnings, setWarnings] = useState([]);
  
  // Monitoring status
  const [monitoringStatus, setMonitoringStatus] = useState({
    camera: true,
    faceDetected: true,
    singlePerson: true,
    tabSwitch: false,
    eyeTracking: true,
  });

  // Interview timer
  useEffect(() => {
    const interval = setInterval(() => {
      setInterviewTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Simulate AI asking question
  useEffect(() => {
    const askQuestion = () => {
      setIsAISpeaking(true);
      const question = interviewQuestions[currentQuestionIndex];
      
      // Typing effect
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex <= question.length) {
          setAiText(question.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsAISpeaking(false);
          }, 2000);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    };

    const timeout = setTimeout(askQuestion, 1000);
    return () => clearTimeout(timeout);
  }, [currentQuestionIndex]);

  // Tab switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setMonitoringStatus((prev) => ({ ...prev, tabSwitch: true }));
        setWarnings((prev) => [...prev, `Tab switch detected at ${formatTime(interviewTimer)}`]);
        toast.error("⚠️ Tab switching detected! This has been recorded.", {
          duration: 4000,
        });
        
        // Reset warning after 3 seconds
        setTimeout(() => {
          setMonitoringStatus((prev) => ({ ...prev, tabSwitch: false }));
        }, 3000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [interviewTimer]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAiText("");
    } else {
      toast.success("Interview completed! Thank you for your time.");
      if (onCompleteInterview) {
        setTimeout(() => {
          onCompleteInterview();
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Top Status Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-cyan-400 px-6 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-red-500"
              />
              <span className="text-white font-medium text-sm">Interview in Progress</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatTime(interviewTimer)}</span>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/40">
              Question {currentQuestionIndex + 1}/{interviewQuestions.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Candidate Camera Panel - Main Focus (SWAPPED) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Candidate Video Panel - Now Main */}
            <Card className="bg-white border-gray-200 overflow-hidden shadow-lg">
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-50">
                {/* Candidate Camera Area */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-cyan-50">
                  <div className="text-center">
                    <Camera className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Your Camera Feed</p>
                    <p className="text-xs text-gray-400 mt-1">Camera is active and recording</p>
                  </div>
                </div>

                {/* Your Camera Label */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-purple-600 to-cyan-400 text-white border-none">
                    <Camera className="w-3 h-3 mr-1" />
                    You
                  </Badge>
                </div>

                {/* Live Recording Indicator */}
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="bg-red-600">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-2 h-2 rounded-full bg-white mr-1"
                    />
                    Recording
                  </Badge>
                </div>

                {/* AI Interviewer Preview (Picture-in-Picture) - Now Small */}
                <div className="absolute bottom-4 right-4">
                  <Card className="w-48 h-36 bg-white border-gray-300 overflow-hidden shadow-xl">
                    <div className="relative w-full h-full bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center">
                      <AnimatePresence>
                        {isAISpeaking ? (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center gap-2"
                          >
                            {/* AI Speaking Animation - Smaller */}
                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                  "0 0 15px rgba(255, 255, 255, 0.5)",
                                  "0 0 25px rgba(255, 255, 255, 0.8)",
                                  "0 0 15px rgba(255, 255, 255, 0.5)",
                                ],
                              }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                            >
                              <Sparkles className="w-8 h-8 text-white" />
                            </motion.div>

                            {/* Sound Wave Animation - Smaller */}
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{
                                    height: ["10px", "20px", "10px"],
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 0.8,
                                    delay: i * 0.1,
                                  }}
                                  className="w-0.5 bg-white rounded-full"
                                />
                              ))}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50"
                          >
                            <Sparkles className="w-8 h-8 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-white/90 text-purple-700 text-xs border-none">
                          AI Interviewer
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center gap-1 text-xs text-white bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded">
                          <Volume2 className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* AI Question Display */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-cyan-50 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-purple-700 mb-2">AI is asking:</h3>
                    <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm select-none">
                      <p className="text-lg text-gray-900 leading-relaxed" style={{ userSelect: 'none' }}>
                        {aiText || "Preparing question..."}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      💡 Take your time to think and answer clearly
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Interview Controls */}
            <Card className="bg-white border-gray-200 p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Camera</p>
                      <p className="text-sm text-gray-900 font-medium">ON</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Microphone</p>
                      <p className="text-sm text-gray-900 font-medium">ON</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center shadow-md">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time Elapsed</p>
                      <p className="text-sm text-gray-900 font-medium">{formatTime(interviewTimer)}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleNextQuestion}
                  disabled={isAISpeaking}
                  className="bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 disabled:opacity-50 shadow-md"
                >
                  {currentQuestionIndex === interviewQuestions.length - 1 ? "Complete Interview" : "Next Question"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Sidebar - Monitoring Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Cheating Detection Status */}
            <Card className="bg-white border-gray-200 p-4 shadow-lg">
              <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                Monitoring Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Camera</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-500 text-white border-none">
                    ON
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Face Detected</span>
                  </div>
                  {monitoringStatus.faceDetected ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Single Person</span>
                  </div>
                  {monitoringStatus.singlePerson ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MonitorUp className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Tab Switch</span>
                  </div>
                  {monitoringStatus.tabSwitch ? (
                    <Badge variant="destructive" className="text-xs">
                      Detected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-green-500 text-white text-xs border-none">
                      Clear
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Eye Movement</span>
                  </div>
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-cyan-400 text-white text-xs border-none">
                    Tracking
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Warning Panel */}
            <Card className="bg-yellow-50 border-yellow-300 p-4 shadow-lg">
              <h3 className="text-yellow-800 font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Warnings
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-yellow-800">
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Do not switch tabs</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-yellow-800">
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Multiple faces will end interview</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-yellow-800">
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Looking away repeatedly is monitored</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-yellow-800">
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Phone use will be detected</span>
                </div>
              </div>
            </Card>

            {/* Detection Log */}
            {warnings.length > 0 && (
              <Card className="bg-red-50 border-red-300 p-4 shadow-lg">
                <h3 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Detection Log
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {warnings.map((warning, index) => (
                    <div key={index} className="text-xs text-red-800 bg-red-100 p-2 rounded border border-red-200">
                      {warning}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* System Info */}
            <Card className="bg-white border-gray-200 p-4 shadow-lg">
              <h3 className="text-gray-900 font-semibold mb-3 text-sm">System Status</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>AI is analyzing responses</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Recording in progress</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Facial analysis active</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
