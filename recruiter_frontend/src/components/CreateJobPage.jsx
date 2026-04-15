import { useState, useEffect } from "react";
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
  ChevronRight,
  CheckCircle2,
  Home,
  X,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
//import { set } from "../../../backend/src/app";

export function CreateJobPage({ onNavigate }) {
  // --- Job Info
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  // --- New state for preferences
const [jobType, setJobType] = useState("onsite");
const [gender, setGender] = useState("any");
const [minAge, setMinAge] = useState("");
const [maxAge, setMaxAge] = useState("");

  // --- Autocomplete state
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [jobLink, setJobLink] = useState("");
  // --- SEARCH SKILLS FROM DB
  useEffect(() => {
    if (skillInput.trim().length < 1) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/skills/search?q=${skillInput}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [skillInput]);

  // --- RECOMMENDATIONS BASED ON JOB TITLE
  useEffect(() => {
    if (jobTitle.length < 3) {
      setRecommendations([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/skills/search?q=${jobTitle}`);
        const data = await res.json();

        const filtered = data.filter(
          (rec) => !skills.find((s) => s.id === rec.id)
        );

        setRecommendations(filtered.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [jobTitle, skills]);

  // --- HANDLE SKILL SELECTION
  const handleSelectSkill = (skillObj) => {
    if (skills.length >= 6) {
      toast.error("Maximum 6 skills allowed");
      return;
    }

    if (skills.find((s) => s.id === skillObj.id)) {
      toast.error("Skill already added");
      return;
    }

    setSkills([...skills, { ...skillObj, importance: "core" }]);
    setSkillInput("");
    setSearchResults([]);
  };

  const removeSkill = (id) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const updateSkillImportance = (id, importance) => {
    setSkills(
      skills.map((s) => (s.id === id ? { ...s, importance } : s))
    );
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const hasCoreSkill = skills.some((s) => s.importance === "core");

  if (skills.length === 0) {
    toast.error("Please add at least one skill.");
    return;
  }

  if (!hasCoreSkill) {
    toast.error("At least one core skill must be selected.");
    return;
  }

  try {
    const payload = {
      title: jobTitle,
      description,
      experience,
      jobType, 
      gender,
      minAge: minAge || null,
      maxAge: maxAge || null,
      skills,
    };

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error("Failed to create job");
    }

    const jobId = data.data.job.id;

    // 🔥 Generate link (NOT stored in DB)
    const link = `http://localhost:5173/apply/job-${jobId}`;
    setJobLink(link);

    setShowSuccess(true);

      fetch("/api/questions/verify-bank", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      skills, 
      // Change userExperience to experience (your state variable)
      experience: Number(experience) 
    })
  }).catch(err => console.error("Background question check failed", err));
    
    // Optional reset
    setJobTitle("");
    setDescription("");
    setExperience("");
    setJobType("onsite");
    setGender("any");
    setMinAge("");
    setMaxAge("");
    setSkills([]);

  } catch (err) {
    console.error(err);
    toast.error("Failed to create job");
  }
};

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Home className="w-4 h-4" /> Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                className="text-gray-600 hover:text-gray-900"
              >
                Jobs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">
                Create Job
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>
        <p className="text-gray-500 mt-1">
          Define your job requirements and preferences.
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <Card className="p-8 bg-white border-gray-200 shadow-sm">
                {/* Basic Info */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#0052CC] to-[#00B8D9] rounded-full" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Basic Information
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Senior React Developer"
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="jobDescription">Job Description</Label>
                      <Textarea
                        id="jobDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide a detailed description of the role..."
                        className="mt-2 min-h-32"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="experience">
                          Required Experience (years)
                        </Label>
                        <Input
                          id="experience"
                          type="number"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          min="0"
                          placeholder="e.g., 3"
                          className="mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="jobType">Job Type</Label>
                        <Select value={jobType} onValueChange={setJobType}>
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

                {/* Skills */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#0052CC] to-[#00B8D9] rounded-full" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Required Skills
                    </h3>
                    <Badge variant="secondary" className="ml-2 font-normal">
                      {skills.length}/6
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label>Search and Select Skills</Label>
                      <div className="mt-2 relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Type to search skills..."
                            className="pl-10"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                          />
                          {isLoading && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                          )}
                        </div>

                        {searchResults.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                            {searchResults.map((result) => (
                              <button
                                key={result.id}
                                type="button"
                                onClick={() => handleSelectSkill(result)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex flex-col transition-colors border-b last:border-0 border-gray-100"
                              >
                                <span className="font-medium text-gray-900">
                                  {result.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Recommendations */}
                      {recommendations.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 items-center">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-500" /> Suggested:
                          </span>
                          {recommendations.map((rec) => (
                            <button
                              key={rec.id}
                              type="button"
                              onClick={() => handleSelectSkill(rec)}
                              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors"
                            >
                              + {rec.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Selected Skills */}
                    <div className="grid grid-cols-1 gap-3">
                      {skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg group hover:border-blue-200 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <Badge className="bg-white text-gray-900 border-gray-200 px-3 py-1 text-sm shadow-sm">
                              {skill.name}
                            </Badge>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 uppercase font-semibold">
                                Importance:
                              </span>
                              <Select
                                value={skill.importance}
                                onValueChange={(val) =>
                                  updateSkillImportance(skill.id, val)
                                }
                              >
                                <SelectTrigger className="h-8 w-[120px] bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="core">Core</SelectItem>
                                  <SelectItem value="secondary">Secondary</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSkill(skill.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {skills.length === 0 && !skillInput && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-lg">
                          <p className="text-sm text-gray-400">
                            No skills selected. Search above to add skills.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Candidate Preferences */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#0052CC] to-[#00B8D9] rounded-full" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Candidate Preferences
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                      <Label htmlFor="gender">Gender Preference</Label>
                      <Select value={gender} onValueChange={setGender}>
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
                    <div>
                      <Label htmlFor="minAge">Minimum Age</Label>
                      <Input
                        id="minAge"
                        type="number"
                        value={minAge}
                        onChange={(e) => setMinAge(e.target.value)}
                        min="18"
                        placeholder="e.g., 22"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxAge">Maximum Age</Label>
                      <Input
                        id="maxAge"
                        type="number"
                        value={maxAge}
                        onChange={(e) => setMaxAge(e.target.value)}
                        max="65"
                        placeholder="e.g., 45"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Submission */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <Button type="button" variant="outline" className="px-6">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-6 bg-gradient-to-r from-[#0052CC] to-[#00B8D9] hover:opacity-90 text-white"
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
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle className="text-center text-xl">
        Job Successfully Created!
      </DialogTitle>
    </DialogHeader>

    <div className="text-center py-6">
      <div className="w-16 h-16 bg-gradient-to-r from-[#0052CC] to-[#00B8D9] rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-white" />
      </div>

      <p className="text-gray-500 mb-6">
        Your job posting is now live. Share the link below with candidates.
      </p>

      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-6">
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">
          Application Link
        </p>
        <code className="text-sm text-[#0052CC] break-all">
          {jobLink}
        </code>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowSuccess(false)}
        >
          Close
        </Button>

        <Button
          className="flex-1 bg-gradient-to-r from-[#0052CC] to-[#00B8D9] text-white"
          onClick={() => {
            navigator.clipboard.writeText(jobLink);
            toast.success("Link copied!");
          }}
        >
          Copy Link
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
    </div>

    
  );
}