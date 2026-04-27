import { useState, useEffect } from "react";
import { Search, Bell, UserCircle } from "lucide-react"; // Import UserCircle for a fallback
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { jwtDecode } from "jwt-decode"; // Correct named import for v4

export function Header() {
  const [recruiterName, setRecruiterName] = useState("Recruiter"); // Fallback name
  const [firstInitial, setFirstInitial] = useState("R"); // Fallback initial

  useEffect(() => {
    // 1. Grab the token from LocalStorage
    const token = localStorage.getItem('recruiterToken');
    
    if (token) {
      try {
        // 2. Decode the token to get the user data
        const decoded = jwtDecode(token);
        
        // Ensure your JWT payload actually includes the 'name' property!
        if (decoded.name) {
          setRecruiterName(decoded.name);
          setFirstInitial(decoded.name.charAt(0).toUpperCase());
        }
      } catch (error) {
        console.error("Error decoding token in header:", error);
        // If decoding fails, we just keep the default "Recruiter" name.
      }
    }
  }, []); // Run once on component load

  return (
    <div className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
      {/* Left Section */}
      <div>
        <h1 className="text-gray-900 font-semibold">Dashboard Overview</h1>
        {/* FIXED: Dynamic Name */}
        <p className="text-gray-500 text-sm mt-1">Welcome back, {recruiterName.split(' ')[0]}!</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
       

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            {/* FIXED: Dynamic Full Name */}
            <p className="text-gray-900 text-sm font-medium">{recruiterName}</p>
            {/* Keeping the title static for now */}
            <p className="text-gray-500 text-xs">Recruiter</p>
          </div>
          <Avatar className="w-10 h-10 border border-gray-100">
            {/* FIXED: Using a placeholder for a clean profile picture look. 
                Using a relative path or an online placeholder.
                If you have image_5.png in your 'public' folder, you can use:
                <AvatarImage src="/image_5.png" alt="Profile" />
                For now, let's use a nice, clean SVG fallback that matches the aesthetic.
            */}
            <AvatarFallback className="bg-gray-100 text-[#0052CC]">
              {/* Use the dynamic initial as a fallback */}
              {firstInitial}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}