import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

export function Header() {
  return (
    <div className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
      {/* Left Section - Breadcrumb/Title */}
      <div>
        <h1 className="text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Sarah!</p>
      </div>

      {/* Right Section - Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search candidates, jobs..."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all duration-200">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-[#0052CC] to-[#00B8D9] text-white flex items-center justify-center p-0 text-xs">
            3
          </Badge>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-gray-900 text-sm">Sarah Mitchell</p>
            <p className="text-gray-500 text-xs">Senior Recruiter</p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}