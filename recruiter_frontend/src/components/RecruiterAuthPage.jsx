import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Building, ArrowRight, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Brain,
} from "lucide-react";

export function RecruiterAuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin 
            ? { email: formData.email, password: formData.password }
            : formData
        ),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("recruiterToken", data.token);
        toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
        navigate("/"); 
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Centered layout with standard background
    <div className="w-full h-screen flex items-center justify-center bg-[#F5F7FA] p-4">
      
      {/* Form Card */}
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-100">
        
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-[#0052CC]">
            <Brain className="w-6 h-6" /> 
            
            <span className="text-2xl font-bold tracking-tight text-gray-900">InductAI</span>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isLogin 
              ? "Enter your credentials to access your dashboard." 
              : "Sign up to start automating your hiring process."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Sarah Mitchell"
                    className="pl-10 h-11"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="organization"
                    placeholder="Organization Name"
                    className="pl-10 h-11"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="sarah@company.com"
                className="pl-10 h-11"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {isLogin && (
                <a href="#" className="text-sm text-[#0052CC] hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-11"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mb-2 !bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 h-11 rounded-lg disabled:opacity-70"
          >
            {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#0052CC] font-semibold hover:underline focus:outline-none transition-colors"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}