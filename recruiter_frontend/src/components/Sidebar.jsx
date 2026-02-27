import {
  LayoutDashboard,
  PlusSquare,
  FileText,
  BarChart3,
  Brain,
  Settings,
  LogOut,
} from "lucide-react";

export function Sidebar({ activeItem = "Dashboard", onNavigate }) {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Create Job", icon: PlusSquare },
    { name: "Job Listings", icon: FileText },
    { name: "Candidate Reports", icon: BarChart3 },
    { name: "AI Question Bank", icon: Brain },
  ];

  const bottomItems = [
    { name: "Settings", icon: Settings },
    { name: "Logout", icon: LogOut },
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-[#0052CC] to-[#00B8D9] text-white flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white tracking-wide">InductAI</h2>
            <p className="text-white/70 text-xs">Recruiting Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;

          return (
            <button
              key={item.name}
              onClick={() => onNavigate && onNavigate(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-white/20 backdrop-blur-sm shadow-lg"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="p-4 space-y-1 border-t border-white/20">
        {bottomItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}