import { useProctoringStream } from "../hooks/useProctoringStream";
import { useState, useEffect, useRef } from "react";
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
import { toast } from "sonner";

export function AIInterviewPage({ onCompleteInterview }) {
  // --- STATE MANAGEMENT ---
  const [sessionId, setSessionId] = useState(null); 
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [aiText, setAiText] = useState("");
  const [interviewTimer, setInterviewTimer] = useState(0);
  const [warnings, setWarnings] = useState([]);
  // Speech to Text State
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [saving, setSaving] = useState(false);

  // Proctoring Refs & State
  const videoRef = useRef(null);
  const [monitoringStatus, setMonitoringStatus] = useState({
    camera: false, 
    mic: false,
    faceDetected: true,
    singlePerson: true,
    tabSwitch: false,
    eyeTracking: true,
  });

  // --- SPEECH RECOGNITION SETUP ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += text;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + " " + finalTranscript);
      }
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    window.recognition = recognition;
  }, []);

  // --- TEXT TO SPEECH ---
  const speak = (text) => {
    const voices = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    // choose a better voice
    utterance.voice = voices.find(v => v.name.includes("Google")) || voices[2];
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // --- PROCTORING HANDLER ---
  const handleProctoringResult = (result) => {
    setMonitoringStatus(prev => ({
      ...prev,
      faceDetected: result.faceDetected,
      singlePerson: result.singlePerson,
      eyeTracking: !result.isLookingAway 
    }));

    if (result.warning) {
      setWarnings(prev => [...prev, `[${formatTime(interviewTimer)}] ${result.warning}`]);
      toast.error(`⚠️ ${result.warning}`);
    }
  };

  // Initialize the frame-sampling hook
  useProctoringStream(videoRef, monitoringStatus.camera, sessionId, handleProctoringResult);

  // --- CAMERA SETUP ---
  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      if (!videoRef.current) return;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        console.log("📹 Stream captured successfully!");

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
              .then(() => {
                console.log("▶️ Video playing smoothly");
                setMonitoringStatus(prev => ({ ...prev, camera: true, mic: true }));
              })
              .catch(e => console.error("Play error:", e));
          };
        }
      } catch (err) {
        console.error("❌ Camera access failed:", err);
        toast.error("Camera access failed. Check permissions.");
      }
    };

    const timer = setTimeout(startCamera, 500);

    return () => {
      clearTimeout(timer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); 

  // --- START NEW DYNAMIC SESSION ---
  useEffect(() => {
    const startNewSession = async () => {
      try {
        const currentCandidateId = 1; 
        const currentJobId = 4;

        const res = await fetch("http://localhost:5000/api/start-session", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidateId: currentCandidateId,
            jobId: currentJobId
          })
        });

        const data = await res.json();
        
        if (data.sessionId) {
          setSessionId(data.sessionId);
          console.log(`🚀 Started new dynamic session: #${data.sessionId}`);
        } else {
          console.error("Failed to start session:", data.error);
        }
      } catch (err) {
        console.error("Error starting session:", err);
      }
    };
    
    startNewSession();
  }, []);

  // --- INTERVIEW TIMER ---
  useEffect(() => {
    const interval = setInterval(() => {
      setInterviewTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- FETCH QUESTIONS ---
  useEffect(() => {
    if (!sessionId) return; 

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/interview/${sessionId}/questions`);
        const data = await res.json();
        setInterviewQuestions(data.data); // Kept as objects for question.id access
      } catch (err) {
        console.error(err);
      }
    };

    fetchQuestions();
  }, [sessionId]); 

  // --- SIMULATE AI ASKING QUESTION ---
  useEffect(() => {
    if (interviewQuestions.length === 0) return;

    const askQuestion = () => {
      setIsAISpeaking(true);
      
      const questionObj = interviewQuestions[currentQuestionIndex];
      const question = questionObj?.text;
      if (!question) return;
      
      speak(question);
      let charIndex = 0;

      const typingInterval = setInterval(() => {
        if (charIndex <= question.length) {
          setAiText(question.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsAISpeaking(false);
            setTranscript("");

            // Start recording candidate answer
            if (window.recognition) {
              window.recognition.start();
            }
          }, 2000);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    };

    const timeout = setTimeout(askQuestion, 1000);
    return () => clearTimeout(timeout);
  }, [currentQuestionIndex, interviewQuestions]);

  // --- TAB SWITCHING DETECTION ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setMonitoringStatus((prev) => ({ ...prev, tabSwitch: true }));
        setWarnings((prev) => [...prev, `Tab switch detected at ${formatTime(interviewTimer)}`]);
        toast.error("⚠️ Tab switching detected! This has been recorded.", {
          duration: 4000,
        });
        
        setTimeout(() => {
          setMonitoringStatus((prev) => ({ ...prev, tabSwitch: false }));
        }, 3000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [interviewTimer]);

  // --- HANDLE NEXT QUESTION (SAVE ANSWER) ---
  
  const handleNextQuestion = async () => {
    if (window.recognition) {
      window.recognition.stop();
    }
  
    const currentQuestion = interviewQuestions[currentQuestionIndex];
    try {
      const response = await fetch("http://localhost:5000/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          answerText: transcript,
        }),
      });
  
      const data = await response.json();
  
      if (!data.success) {
        toast.error("Failed to save answer");
        return;
      }
  
      setAnswers((prev) => [...prev, data.data]);
      console.log("Saved Answer:", data.data);
  
      if (currentQuestionIndex < interviewQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAiText("");
        setTranscript("");
      } else {
        toast.success("Interview completed!");
        if (onCompleteInterview) setTimeout(onCompleteInterview, 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save answer");
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
              Question {currentQuestionIndex + 1}/{interviewQuestions.length || 1}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            
            {/* Candidate Video Panel */}
            <Card className="bg-white border-gray-200 overflow-hidden shadow-lg">
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                
                {/* Fixed Video Implementation: Not conditionally rendered, just hidden/shown via CSS */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transform -scale-x-100 ${!monitoringStatus.camera ? 'hidden' : 'block'}`}
                  />
                  
                  {!monitoringStatus.camera && (
                    <div className="text-center">
                      <Camera className="w-24 h-24 text-red-400 mx-auto mb-4 animate-pulse" />
                      <p className="text-gray-500 font-medium">Initializing Camera...</p>
                      <p className="text-xs text-red-400 mt-1">Ensure permissions are granted.</p>
                    </div>
                  )}
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

                {/* AI Interviewer Preview */}
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
                  </div>
                </div>
              </div>
            </Card>

            {/* Live Transcript Display */}
            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
                <Mic className={`w-4 h-4 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} /> 
                Your Answer (live):
              </p>
              <p className="text-gray-900 min-h-[3rem]">
                {transcript || (isListening ? "Listening..." : "Waiting for question to finish...")}
              </p>
            </div>

            {/* Interview Controls */}
            <Card className="bg-white border-gray-200 p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${monitoringStatus.camera ? 'bg-green-500' : 'bg-red-500'}`}>
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Camera</p>
                      <p className="text-sm text-gray-900 font-medium">{monitoringStatus.camera ? "ON" : "OFF"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${monitoringStatus.mic ? 'bg-green-500' : 'bg-red-500'}`}>
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Microphone</p>
                      <p className="text-sm text-gray-900 font-medium">{monitoringStatus.mic ? "ON" : "OFF"}</p>
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
                  disabled={isAISpeaking || saving}
                  className="bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 disabled:opacity-50 shadow-md text-white"
                >
                  {saving ? "Saving..." : (currentQuestionIndex === interviewQuestions.length - 1 ? "Complete Interview" : "Next Question")}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Sidebar - Monitoring Panel */}
          <div className="lg:col-span-1 space-y-4">
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
                  <Badge variant="secondary" className={`text-white border-none ${monitoringStatus.camera ? 'bg-green-500' : 'bg-red-500'}`}>
                    {monitoringStatus.camera ? "ON" : "OFF"}
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
                    <Badge variant="destructive" className="text-xs">Detected</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-green-500 text-white text-xs border-none">Clear</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Eye Movement</span>
                  </div>
                  <Badge variant="secondary" className={`text-white text-xs border-none ${monitoringStatus.eyeTracking ? 'bg-gradient-to-r from-purple-600 to-cyan-400' : 'bg-red-500'}`}>
                    {monitoringStatus.eyeTracking ? "Tracking" : "Warning"}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="bg-yellow-50 border-yellow-300 p-4 shadow-lg">
              <h3 className="text-yellow-800 font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Warnings
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
                  <span>Phone use will be detected</span>
                </div>
              </div>
            </Card>

            {warnings.length > 0 && (
              <Card className="bg-red-50 border-red-300 p-4 shadow-lg">
                <h3 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Detection Log
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
          </div>
        </div>
      </div>
    </div>
  );
}