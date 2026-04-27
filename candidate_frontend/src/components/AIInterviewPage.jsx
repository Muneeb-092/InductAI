import { useParams, useNavigate } from "react-router-dom";
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
  const { sessionId } = useParams();
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
  
  // --- PROCTORING AGGREGATION STATE ---
  const [infractionTimeline, setInfractionTimeline] = useState([]);
  const [lookingAwayCount, setLookingAwayCount] = useState(0);
  const [phoneFlagged, setPhoneFlagged] = useState(false);
  const [multiplePeopleFlagged, setMultiplePeopleFlagged] = useState(false);

  // --- REFS ---
  const videoRef = useRef(null);
  const wasLookingAwayRef = useRef(false); // Keeps the app from spamming 30 toasts per second
  const wasFaceMissingRef = useRef(false);
  const shouldListenRef = useRef(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const [monitoringStatus, setMonitoringStatus] = useState({
    camera: false, 
    mic: false,
    faceDetected: true,
    singlePerson: true,
    tabSwitch: false,
    eyeTracking: true,
  });

  const navigate = useNavigate();
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
  
  // FIX: Auto-restart if we still want to be listening
  recognition.onend = () => {
    setIsListening(false);
    if (shouldListenRef.current && window.recognition) {
      try {
        window.recognition.start();
      } catch (e) {
        console.error("Speech recognition restart error", e);
      }
    }
  };

  window.recognition = recognition;
}, []);

useEffect(() => {
  // Pre-load voices to prevent the voice from changing mid-interview
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}, []);

// --- SIMULATE AI ASKING QUESTION (SYNCED FIX) ---
  useEffect(() => {
    if (interviewQuestions.length === 0) return;

    let typingInterval;

    const askQuestion = () => {
      setIsAISpeaking(true);
      setAiText(""); // Clear previous question text

      const questionObj = interviewQuestions[currentQuestionIndex];
      const question = questionObj?.text;
      if (!question) return;

      // 1. Force candidate mic OFF so it doesn't transcribe the AI's voice
      shouldListenRef.current = false;
      if (window.recognition) {
        window.recognition.stop();
      }

      const voices = window.speechSynthesis.getVoices();
      const utterance = new SpeechSynthesisUtterance(question);
      
      // Grab a consistent voice
      const preferredVoice = voices[9];
        // voices.find(v => v.name.includes("Google US English")) || 
        // voices.find(v => v.lang === "en-US") || 
        // voices[0];
        
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 0.95;
      utterance.pitch = 1;

      // Prevent Chrome's aggressive garbage collection from deleting the audio mid-sentence
      window.speechUtterance = utterance; 

      // 2. ONLY start the typewriter effect WHEN the audio actually begins playing
      utterance.onstart = () => {
        let charIndex = 0;
        // 45ms matches the rough speed of the TTS voice
        typingInterval = setInterval(() => {
          if (charIndex <= question.length) {
            setAiText(question.slice(0, charIndex));
            charIndex++;
          } else {
            clearInterval(typingInterval);
          }
        }, 45); 
      };

      // 3. ONLY start listening to the candidate WHEN the audio finishes
      utterance.onend = () => {
        clearInterval(typingInterval);
        setAiText(question); // Ensure full text is rendered in case interval missed a frame
        
        setTimeout(() => {
          setIsAISpeaking(false);
          setTranscript(""); // Wipe out any noise caught during transition
          
          // Turn candidate mic back on safely
          shouldListenRef.current = true;
          if (window.recognition) {
            try { window.recognition.start(); } catch(e) { console.error("Mic restart error:", e); }
          }
        }, 100); // Brief breathing room before recording candidate
      };

      window.speechSynthesis.cancel(); // Clear any stuck audio
      window.speechSynthesis.speak(utterance);
    };

    const timeout = setTimeout(askQuestion, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(typingInterval);
      window.speechSynthesis.cancel(); // Stop AI if candidate switches pages
    };
  }, [currentQuestionIndex, interviewQuestions]);


  //--------------------------------------------------------- old speak function ---------- to use it comment above useEffect ---------------
  // --- TEXT TO SPEECH ---
// const speak = (text) => {
//   const voices = window.speechSynthesis.getVoices();
//   const utterance = new SpeechSynthesisUtterance(text);
  
//   // FIX: Look for a specific voice type instead of relying on an index
//   const preferredVoice = voices[9];
//     // voices.find(v => v.name.includes("Google US English")) || 
//     // voices.find(v => v.lang === "en-US") || 
//     // voices[0]; // Fallback to whatever is available
    
//   if (preferredVoice) {
//     utterance.voice = preferredVoice;
//   }
  
//   utterance.rate = 0.95;
//   utterance.pitch = 1;

//   window.speechSynthesis.cancel();
//   window.speechSynthesis.speak(utterance);
// };

  // --- PROCTORING HANDLER ---
  // --- PROCTORING HANDLER ---
  const handleProctoringResult = (result) => {
    // 1. Update the visual UI monitoring indicators
    setMonitoringStatus(prev => ({
      ...prev,
      faceDetected: result.faceDetected,
      singlePerson: result.singlePerson,
      eyeTracking: !result.isLookingAway 
    }));

    // 2. SILENT LOGGING (Phones & Multiple People)
    // As you requested, these do NOT show a warning toast to the candidate!
    if (result.phoneDetected && !phoneFlagged) {
      setPhoneFlagged(true);
      setInfractionTimeline(prev => [...prev, { time: formatTime(interviewTimer), type: "PHONE_DETECTED", severity: "CRITICAL" }]);
    }
    
    if (!result.singlePerson && result.faceDetected && !multiplePeopleFlagged) {
      setMultiplePeopleFlagged(true);
      setInfractionTimeline(prev => [...prev, { time: formatTime(interviewTimer), type: "MULTIPLE_PEOPLE", severity: "HIGH" }]);
    }

    // 3. STRICT NO FACE DETECTED WARNING (Fixed!)
    if (!result.faceDetected && !wasFaceMissingRef.current) {
      wasFaceMissingRef.current = true; // Mark that they left
      toast.error("⚠️ Face not detected! Please stay in the camera frame.");
    } else if (result.faceDetected && wasFaceMissingRef.current) {
      wasFaceMissingRef.current = false; // Reset when they come back
    }

    // 4. STRICT IMMEDIATE LOOK-AWAY WARNING
    if (result.isLookingAway && !wasLookingAwayRef.current) {
      wasLookingAwayRef.current = true;
      
      setLookingAwayCount(prev => prev + 1); 
      toast.error("⚠️ Please look at the screen.");
      setWarnings(prev => [...prev, `[${formatTime(interviewTimer)}] Candidate looked away`]);
      
      setInfractionTimeline(prev => [...prev, {
        time: formatTime(interviewTimer),
        type: "LOOKING_AWAY_WARNING",
        severity: "LOW"
      }]);
    } else if (!result.isLookingAway && wasLookingAwayRef.current) {
      wasLookingAwayRef.current = false;
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
            // Start recording candidate answer
            if (window.recognition) {
              shouldListenRef.current = true; // Tell our app we WANT to listen
              try {
                window.recognition.start();
              } catch(e) {}
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
        setWarnings((prev) => [...prev, `[${formatTime(interviewTimer)}] Tab switch detected`]);
        toast.error("⚠️ Tab switching detected! This has been recorded.", {
          duration: 4000,
        });
        
        // Log to timeline
        setInfractionTimeline(prev => [...prev, {
          time: formatTime(interviewTimer),
          type: "TAB_SWITCH",
          severity: "HIGH",
          details: "Candidate switched browser tabs"
        }]);
        
        setTimeout(() => {
          setMonitoringStatus((prev) => ({ ...prev, tabSwitch: false }));
        }, 3000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [interviewTimer]);

  // --- SUBMIT FINAL PROCTORING REPORT ---
  const submitProctoringReport = async () => {
    try {
      await fetch("http://localhost:5000/api/save-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          lookingAwayCount: lookingAwayCount,
          multiplePeopleDetected: multiplePeopleFlagged,
          phoneDetected: phoneFlagged,
          infractionTimeline: infractionTimeline
        })
      });
      console.log("✅ Final proctoring report submitted securely.");
    } catch (err) {
      console.error("Failed to submit proctoring report:", err);
    }
  };
  // --- HARDWARE KILL SWITCH ---
  const stopMediaTracks = () => {
    // 1. Stop the Camera & Mic streams
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop()); // Kills the hardware light
      videoRef.current.srcObject = null;
    }
    
    // 2. Stop Speech Recognition
    shouldListenRef.current = false; // Tell our app to stop forcing restarts
if (window.recognition) {
  window.recognition.stop();
}

    // 3. Update the UI State
    setMonitoringStatus(prev => ({ ...prev, camera: false, mic: false }));
    setIsListening(false);
  };
  // --- HANDLE NEXT QUESTION (SAVE ANSWER) ---
  const handleNextQuestion = async () => {
  shouldListenRef.current = false; // Tell our app to stop forcing restarts
if (window.recognition) {
  window.recognition.stop();
}

  const currentQuestion = interviewQuestions[currentQuestionIndex];
  setSaving(true);

  try {
    // 1. ALWAYS save the current answer first (even if it's the last one)
    const response = await fetch("http://localhost:5000/api/interview/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        questionId: currentQuestion.id,
        answerText: transcript, // This is the text from speech recognition
      }),
    });

    const data = await response.json();
    if (!data.success) {
      toast.error("Failed to save your answer. Please try clicking again.");
      setSaving(false);
      return;
    }

    // 2. Decide if we move to next question OR finish
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      // Not the last question: just move forward
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAiText("");
      setTranscript("");
      setSaving(false);
    } else {
      // THIS IS THE LAST QUESTION - Start the Finalization Chain
      setIsFinalizing(true);
      toast.info("Finalizing your interview and generating report...");

      // A. Stop hardware (Camera/Mic)
      stopMediaTracks();

      // B. Submit the proctoring data (logs of looking away, tab switches, etc.)
      await submitProctoringReport();

      // C. CALL THE EVALUATION API 
      // This is the specific step you asked for: calling the backend 
      // after all answers are saved.
      const evalResponse = await fetch(`http://localhost:5000/api/generate/${sessionId}/interview/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (!evalResponse.ok) {
        throw new Error("Evaluation failed at the server level");
      }

      toast.success("Interview and Evaluation completed!");
      
      // D. Final Redirect
      navigate(`/thank-you`);
    }
  } catch (err) {
    console.error("Finalization Error:", err);
    toast.error("An error occurred while finalizing. Please contact support.");
    setIsFinalizing(false);
    setSaving(false);
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
                
                {/* Fixed Video Implementation */}
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
            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200 max-h-48 overflow-y-auto">
              <p className="text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
                <Mic className={`w-4 h-4 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} /> 
                Your Answer (live):
              </p>
              {/* FIX: Swapped to div, added whitespace-pre-wrap, break-words, and relaxed leading */}
              <div className="text-gray-900 min-h-[3rem] whitespace-pre-wrap break-words leading-relaxed">
                {transcript || (isListening ? "Listening..." : "Waiting for question to finish...")}
              </div>
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