import { Header } from "./Header";
import { ProgressIndicator } from "./ProgressIndicator";
import { JobOverviewCard } from "./JobOverviewCard";
import { CandidateForm } from "./CandidateForm";
import { Footer } from "./Footer";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function CandidateLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-cyan-50/30">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        <ProgressIndicator currentStep={1} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Job Info and Form */}
          <div className="space-y-6">
            <JobOverviewCard />
            <CandidateForm onProceedToTest={(id) => onProceedToTest(id)} />
          </div>
          
          {/* Right Column - Illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-400/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop"
                  alt="AI Interview Candidate"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
                
                <div className="mt-8 space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-md border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">AI-Powered Assessment</h3>
                        <p className="text-sm text-gray-600">Fair & unbiased evaluation</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-md border border-cyan-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Secure & Monitored</h3>
                        <p className="text-sm text-gray-600">Your data is protected</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-md border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Quick Process</h3>
                        <p className="text-sm text-gray-600">Complete in 30-45 minutes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
