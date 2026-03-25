import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { User, Mail, Phone, GraduationCap, Briefcase, Upload, Shield } from "lucide-react";
import { toast } from "sonner"; // Removed @2.0.3 to match standard imports

// NEW: Added isSubmitting state and updated props to pass back the real ID
export function CandidateForm({ onProceedToTest }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    qualification: "",
    experience: "",
    skills: "",
    resume: null,
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.qualification.trim()) newErrors.qualification = "Qualification is required";
    if (!formData.experience.trim()) newErrors.experience = "Experience is required";
    if (!formData.skills.trim()) newErrors.skills = "Skills are required";
    if (!formData.agreedToTerms) newErrors.agreedToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- NEW: The API Submission Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // 1. Send candidate info to backend to create Candidate AND start Session
        const response = await fetch("http://localhost:5000/api/register-candidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            age: parseInt(formData.age),
            qualification: formData.qualification,
            experience: formData.experience,
            skills: formData.skills,
            jobId: 4 // Hardcoded for now, assuming they are applying for Job #4. Change if needed!
          })
        });

        const data = await response.json();

        if (response.ok && data.sessionId) {
          toast.success("Profile created successfully! Redirecting...");
          
          // 2. Pass the real, newly created Session ID up to the parent component
          setTimeout(() => {
            onProceedToTest(data.sessionId); 
          }, 1500);
        } else {
          toast.error(data.error || "Failed to start session.");
          setIsSubmitting(false);
        }

      } catch (err) {
        console.error("Submission error:", err);
        toast.error("Network error. Please try again.");
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  return (
    <Card className="p-8 bg-white shadow-xl border-t-4 border-t-transparent bg-gradient-to-r from-purple-600/10 via-transparent to-cyan-400/10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Candidate Information
        </h2>
        <p className="text-sm text-gray-600">
          Please fill in your details to proceed with the assessment
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            Full Name *
          </Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
            >
              <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className={errors.age ? "border-red-500" : ""}
              min="18"
              max="100"
            />
            {errors.age && (
              <p className="text-xs text-red-500">{errors.age}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="qualification" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-500" />
            Highest Qualification *
          </Label>
          <Select
            value={formData.qualification}
            onValueChange={(value) => setFormData({ ...formData, qualification: value })}
          >
            <SelectTrigger className={errors.qualification ? "border-red-500" : ""}>
              <SelectValue placeholder="Select your qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="associate">Associate Degree</SelectItem>
              <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
              <SelectItem value="master">Master's Degree</SelectItem>
              <SelectItem value="phd">Ph.D.</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.qualification && (
            <p className="text-xs text-red-500">{errors.qualification}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            Years of Experience *
          </Label>
          <Select
            value={formData.experience}
            onValueChange={(value) => setFormData({ ...formData, experience: value })}
          >
            <SelectTrigger className={errors.experience ? "border-red-500" : ""}>
              <SelectValue placeholder="Select years of experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1">0-1 years</SelectItem>
              <SelectItem value="1-2">1-2 years</SelectItem>
              <SelectItem value="2-4">2-4 years</SelectItem>
              <SelectItem value="4-6">4-6 years</SelectItem>
              <SelectItem value="6-10">6-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
          {errors.experience && (
            <p className="text-xs text-red-500">{errors.experience}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Relevant Skills *</Label>
          <Textarea
            id="skills"
            placeholder="e.g., React, Node.js, TypeScript, MongoDB, AWS..."
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            className={errors.skills ? "border-red-500" : ""}
            rows={3}
          />
          {errors.skills && (
            <p className="text-xs text-red-500">{errors.skills}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume" className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-gray-500" />
            Upload Resume (Optional)
          </Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          {formData.resume && (
            <p className="text-xs text-green-600">
              Selected: {formData.resume.name}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-3 mb-4">
            <Checkbox
              id="terms"
              checked={formData.agreedToTerms}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, agreedToTerms: checked })
              }
              className={errors.agreedToTerms ? "border-red-500" : ""}
            />
            <div className="flex-1">
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 cursor-pointer leading-relaxed"
              >
                I agree to the{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Terms and Conditions
                </a>{" "}
                and understand that I will be monitored during the test and interview for fairness and authenticity.
              </label>
              {errors.agreedToTerms && (
                <p className="text-xs text-red-500 mt-1">{errors.agreedToTerms}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            size="lg"
          >
            {isSubmitting ? "Creating Profile..." : "Proceed to Test"}
            {!isSubmitting && <Shield className="w-5 h-5" />}
          </Button>

          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-purple-800">
              <Shield className="w-4 h-4" />
              <span className="font-medium">AI Verified Assessment</span>
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Your identity and responses will be verified using AI technology
            </p>
          </div>
        </div>
      </form>
    </Card>
  );
}