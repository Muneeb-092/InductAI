import { useState, useEffect } from "react";
import { User, Building, Mail, Save } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

export function RecruiterSettings() {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("recruiterToken");
    if (token) {
      const decoded = jwtDecode(token);
      // We fetch current data from the token, or you could fetch from a new /api/recruiter/me route
      setFormData({
        name: decoded.name || "",
        organization: decoded.organization || "",
        email: decoded.email || ""
      });
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("recruiterToken")}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        // Update the token in localStorage because the name/org might have changed!
        localStorage.setItem("recruiterToken", data.token);
        toast.success("Profile updated successfully! Refreshing...");
        setTimeout(() => window.location.reload(), 1500); 
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
      <Card className="p-6 bg-white border-gray-200">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                className="pl-10" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Organization</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                className="pl-10" 
                value={formData.organization} 
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address (Read-only)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input className="pl-10 bg-gray-50" value={formData.email} disabled />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full !bg-[#0052CC] text-white">
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}