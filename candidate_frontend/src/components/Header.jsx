import { HelpCircle } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-bold">IA</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">InductAI</h1>
              <p className="text-xs text-gray-500">Powered by AI Hiring Platform</p>
            </div>
          </div>
        </div>
        
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <a href="#" className="hover:text-purple-600 transition-colors flex items-center gap-1">
            <HelpCircle className="w-4 h-4" />
            Help
          </a>
          <a href="#" className="hover:text-purple-600 transition-colors">
            Privacy Policy
          </a>
        </nav>
      </div>
    </header>
  );
}
