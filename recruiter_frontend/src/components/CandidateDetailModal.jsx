import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Download,
  Share2,
  Award,
  Brain,
  MessageSquare,
  Target,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Play,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export function CandidateDetailModal({ candidate, isOpen, onClose }) {
  const getPerformanceStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-700' };
    if (score >= 70) return { label: 'Good', color: 'bg-blue-100 text-blue-700' };
    if (score >= 50) return { label: 'Average', color: 'bg-orange-100 text-orange-700' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-700' };
  };

  const status = getPerformanceStatus(candidate.overallScore);

  const categoryScores = [
    { name: 'Problem Solving', score: 88, icon: Lightbulb, color: '#0052CC' },
    { name: 'Communication', score: 85, icon: MessageSquare, color: '#00B8D9' },
    { name: 'Domain Knowledge', score: 90, icon: Brain, color: '#6D28D9' },
    { name: 'Confidence', score: 82, icon: TrendingUp, color: '#22D3EE' },
    { name: 'Logical Thinking', score: 87, icon: Target, color: '#4CD4B0' },
  ];

  const interviewTranscript = [
    {
      question: "Can you explain the difference between state and props in React?",
      answer: "State is internal and controlled by the component itself, while props are external and controlled by whatever renders the component. State is mutable and can be changed using setState, whereas props are immutable from the component's perspective.",
      timestamp: "00:45",
      insights: ["Strong technical depth", "Clear explanation"],
    },
    {
      question: "How would you optimize the performance of a React application?",
      answer: "I would start by using React.memo for component memoization, implementing code splitting with lazy loading, optimizing re-renders using useCallback and useMemo hooks, and leveraging the virtual DOM efficiently. Additionally, I'd use production builds and consider using tools like React DevTools Profiler.",
      timestamp: "02:30",
      insights: ["Comprehensive answer", "Good practical knowledge"],
    },
    {
      question: "Describe a challenging project you worked on and how you overcame obstacles.",
      answer: "In my previous role, we had to migrate a legacy application to a modern React architecture. The main challenge was maintaining functionality while refactoring. We addressed this by implementing a gradual migration strategy, writing comprehensive tests, and ensuring backward compatibility.",
      timestamp: "05:15",
      insights: ["Strong problem-solving", "Good communication"],
    },
  ];

  const handleDownload = () => {
    toast.success('Report downloaded successfully');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://inductai.com/reports/${candidate.id}`);
    toast.success('Report link copied to clipboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={candidate.avatar} 
                alt={candidate.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <DialogTitle className="text-gray-900">{candidate.name}</DialogTitle>
                <p className="text-gray-500 text-sm mt-1">{candidate.jobTitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={status.color}>
                    {status.label}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Award className="w-3 h-3" />
                    Rank #{candidate.rank}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-[#0052CC] to-[#00B8D9]"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Score Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">Overall Score</p>
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - candidate.overallScore / 100)}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0052CC" />
                          <stop offset="100%" stopColor="#00B8D9" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-900">{candidate.overallScore}%</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <p className="text-gray-600 text-sm mb-3">MCQ Score</p>
                <h3 className="text-gray-900 mb-3">{candidate.mcqScore}%</h3>
                <Progress value={candidate.mcqScore} className="h-2" />
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <p className="text-gray-600 text-sm mb-3">Technical Score</p>
                <h3 className="text-gray-900 mb-3">{candidate.technicalScore}%</h3>
                <Progress value={candidate.technicalScore} className="h-2" />
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <p className="text-gray-600 text-sm mb-3">Soft Skill Score</p>
                <h3 className="text-gray-900 mb-3">{candidate.softSkillScore}%</h3>
                <Progress value={candidate.softSkillScore} className="h-2" />
              </Card>
            </div>

            {/* Category-Wise Breakdown */}
            <Card className="p-6 bg-white border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-gray-900">Category-Wise Performance</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Info className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">Scores are evaluated by AI based on responses, confidence, and domain expertise</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-5">
                {categoryScores.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color: category.color }} />
                          <span className="text-gray-700">{category.name}</span>
                        </div>
                        <span className="text-gray-900">{category.score}%</span>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 rounded-full transition-all"
                          style={{ 
                            width: `${category.score}%`,
                            backgroundColor: category.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
                {/* Interview Recording and Transcript */}
            <Card className="p-6 bg-white border-gray-200">
              <h3 className="text-gray-900 mb-4">Interview Recording & Transcript</h3>
              
              {/* Video Player Placeholder */}
              <div className="relative aspect-video bg-gray-900 rounded-lg mb-6 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Button 
                      size="lg" 
                      className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    >
                      <Play className="w-6 h-6 text-white" />
                    </Button>
                    <p className="text-white text-sm mt-4">Interview Recording</p>
                    <p className="text-white/70 text-xs">Duration: 15:32</p>
                  </div>
                </div>
              </div>

              {/* Transcript */}
              <Tabs defaultValue="transcript" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="transcript">Transcript</TabsTrigger>
                  <TabsTrigger value="insights">AI Insights</TabsTrigger>
                </TabsList>
                <TabsContent value="transcript" className="mt-4">
                  <ScrollArea className="h-64 pr-4">
                    <div className="space-y-4">
                      {interviewTranscript.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="text-xs">{item.timestamp}</Badge>
                            <div className="flex-1">
                              <p className="text-gray-900 mb-2">
                                <strong>Q:</strong> {item.question}
                              </p>
                              <p className="text-gray-600 mb-2">
                                <strong>A:</strong> {item.answer}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.insights.map((insight, i) => (
                                  <Badge key={i} className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                    {insight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          {index < interviewTranscript.length - 1 && <Separator className="my-4" />}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="insights" className="mt-4">
                  <div className="space-y-4">
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-gray-900 mb-1">Technical Evaluation</p>
                          <p className="text-gray-600 text-sm">Strong understanding of React fundamentals and best practices. Demonstrates {candidate.technicalScore}% accuracy in technical responses.</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-gray-900 mb-1">Soft Skill Evaluation</p>
                          <p className="text-gray-600 text-sm">Confident, fluent, and polite communication style. Shows excellent interpersonal skills with clear articulation of complex concepts.</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-purple-50 border-purple-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-gray-900 mb-1">Cheating Detection</p>
                          <p className="text-gray-600 text-sm">No suspicious activity detected. Eye movement patterns are consistent, and response timing is natural.</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* AI Evaluation Summary */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#0052CC] to-[#00B8D9] flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900">AI Evaluation Summary</h3>
                  <p className="text-gray-600 text-sm">Powered by Gemini & NLP Models</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm">Strong Technical Foundation</p>
                      <p className="text-gray-600 text-xs">Excellent grasp of core concepts and frameworks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm">Clear Communication</p>
                      <p className="text-gray-600 text-xs">Articulates thoughts effectively and concisely</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm">Room for Growth</p>
                      <p className="text-gray-600 text-xs">Could improve system design knowledge</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm">Problem Solving Skills</p>
                      <p className="text-gray-600 text-xs">Demonstrates logical thinking and creativity</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}