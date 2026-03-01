export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © 2025 InductAI. All rights reserved.
          </p>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-purple-600 transition-colors">
              Terms
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:text-purple-600 transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:text-purple-600 transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
