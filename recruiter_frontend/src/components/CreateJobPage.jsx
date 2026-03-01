import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Plus,
  Trash2,
  Sparkles,
  Info,
  ChevronRight,
  CheckCircle2,
  Home,
} from "lucide-react";
import { toast } from "sonner";

export function CreateJobPage({ onNavigate }) {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [mustAskQuestions, setMustAskQuestions] = useState([
    { id: "1", text: "" },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const addQuestion = () => {
    setMustAskQuestions([
      ...mustAskQuestions,
      { id: Date.now().toString(), text: "" },
    ]);
  };

  const removeQuestion = (id) => {
    if (mustAskQuestions.length > 1) {
      setMustAskQuestions(
        mustAskQuestions.filter((q) => q.id !== id)
      );
    }
  };

  const updateQuestion = (id, text) => {
    setMustAskQuestions(
      mustAskQuestions.map((q) =>
        q.id === id ? { ...q, text } : q
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  const aiGeneratedQuestions = [
    {
      id: 1,
      question:
        "Describe your experience with React and modern JavaScript frameworks.",
      difficulty: "Medium",
    },
    {
      id: 2,
      question:
        "How do you approach performance optimization in web applications?",
      difficulty: "Hard",
    },
    {
      id: 3,
      question:
        "Explain the difference between state and props in React.",
      difficulty: "Easy",
    },
    {
      id: 4,
      question:
        "What is your experience with TypeScript and type safety?",
      difficulty: "Medium",
    },
    {
      id: 5,
      question:
        "How would you implement authentication in a React application?",
      difficulty: "Hard",
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Home className="w-4 h-4" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-600 hover:text-gray-900">Jobs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">Create Job</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-gray-900">Create New Job</h1>
        <p className="text-gray-500 mt-1">Define your job requirements and preferences.</p>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-900">Job Info</span>
        </div>
      </div>

      {/* Scrollable Form Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <Card className="p-8 bg-white border-gray-200 shadow-sm">
                {/* Section A: Basic Information */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#0052CC] to-[#00B8D9] rounded-full" />
                    <h3 className="text-gray-900">Basic Information</h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input 
                        id="jobTitle" 
                        placeholder="e.g., Senior React Developer"
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="jobDescription">Job Description</Label>
                      <Textarea 
                        id="jobDescription"
                        placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
                        className="mt-2 min-h-32"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="experience">Required Experience (years)</Label>
                        <Input 
                          id="experience"
                          type="number"
                          min="0"
                          placeholder="e.g., 3"
                          className="mt-2"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="jobType">Job Type</Label>
                        <Select>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="onsite">Onsite</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Section B: Candidate Preferences */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#0052CC] to-[#00B8D9] rounded-full" />
                    <h3 className="text-gray-900">Candidate Preferences</h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="gender">Gender Preference</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="minAge">Minimum Age</Label>
                        <Input 
                          id="minAge"
                          type="number"
                          min="18"
                          max="65"
                          placeholder="e.g., 22"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="maxAge">Maximum Age</Label>
                        <Input 
                          id="maxAge"
                          type="number"
                          min="18"
                          max="65"
                          placeholder="e.g., 45"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Section D: Must-Ask Questions */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#0052CC] to-[#00B8D9] rounded-full" />
                    <h3 className="text-gray-900">Add Must-Ask Questions</h3>
                    <button type="button" className="text-gray-400 hover:text-gray-600">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {mustAskQuestions.map((question, index) => (
                      <div key={question.id} className="flex gap-3">
                        <div className="flex-1">
                          <Label htmlFor={`question-${question.id}`} className="text-sm">
                            Question {index + 1}
                          </Label>
                          <div className="flex gap-2 mt-2">
                            <Input
                              id={`question-${question.id}`}
                              value={question.text}
                              onChange={(e) => updateQuestion(question.id, e.target.value)}
                              placeholder="Enter your custom question..."
                            />
                            {mustAskQuestions.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeQuestion(question.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addQuestion}
                      className="w-full border-dashed"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Question
                    </Button>
                  </div>
                </div>

                {/* Section E: Submission Controls */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-6 bg-gradient-to-r from-[#0052CC] to-[#00B8D9] hover:opacity-90"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Create Job
                  </Button>
                </div>
              </Card>
            </form>
          </div>
        </div>
      </div>

      {/* AI Questions Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0052CC]" />
              AI-Generated Interview Questions
            </DialogTitle>
            <DialogDescription>
              Preview of questions generated by Gemini AI based on your job requirements
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {aiGeneratedQuestions.map((q) => (
              <div key={q.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-gray-900 flex-1">{q.question}</p>
                  <Badge 
                    variant="outline"
                    className={
                      q.difficulty === 'Easy' 
                        ? 'border-green-300 text-green-700 bg-green-50' 
                        : q.difficulty === 'Medium'
                        ? 'border-yellow-300 text-yellow-700 bg-yellow-50'
                        : 'border-red-300 text-red-700 bg-red-50'
                    }
                  >
                    {q.difficulty}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button 
              className="bg-gradient-to-r from-[#0052CC] to-[#00B8D9]"
              onClick={() => {
                setShowPreview(false);
                toast.success('AI questions added to your job posting');
              }}
            >
              Use These Questions
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Job Successfully Created!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0052CC] to-[#00B8D9] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-500 mb-6">Your job posting has been created and is now live. Share the application link with candidates.</p>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-6">
              <p className="text-sm text-gray-500 mb-1">Application Link</p>
              <code className="text-sm text-[#0052CC]">https://inductai.com/apply/job-12345</code>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowSuccess(false)}>
                Create Another Job
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-[#0052CC] to-[#00B8D9]">
                View Job Listings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}