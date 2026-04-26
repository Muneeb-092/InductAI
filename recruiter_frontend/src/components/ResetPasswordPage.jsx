import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user"); // Grabs the ID from ?user=...
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

const handleReset = async (e) => {
e.preventDefault(); // Prevents page reload on 'Enter'

if (password !== confirmPassword) {
    return toast.error("Passwords do not match!");
}

setLoading(true);
try {
    const res = await fetch("http://localhost:5000/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, newPassword: password }),
    });

    const data = await res.json();
    
    if (data.success) {
    toast.success("Password updated! Redirecting to login...");
    
    // OPTION 1: Immediate Success UI (The one we built)
    setIsSuccess(true); 

    // OPTION 2: Auto-redirect after 2 seconds so they can see the checkmark
    setTimeout(() => {
        navigate("/login");
    }, 2500);

    } else {
    toast.error(data.message || "Reset failed.");
    }
    } catch (err) {
        toast.error("Server error. Please try again.");
    } finally {
        setLoading(false);
    }
};

  if (isSuccess) {
    return (
      <div className="h-screen overflow-hidden flex items-center justify-center bg-[#F5F7FA] p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">All Set!</h2>
          <p className="text-gray-600">Your password has been updated. You can now log in with your new credentials.</p>
          <Button onClick={() => navigate("/login")} className="w-full !bg-[#0052CC]">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[#F5F7FA] p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-500 text-sm mt-2">Enter your new secure password below.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                type="password" 
                className="pl-10" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                type="password" 
                className="pl-10" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full !bg-[#0052CC] h-11">
            {loading ? "Updating..." : "Update Password"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </Card>
    </div>
  );
}