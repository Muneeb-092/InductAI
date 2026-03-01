import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { CreateJobPage } from "./components/CreateJobPage";
import { JobListingsPage } from "./components/JobListingsPage";
import { CandidateReportsPage } from "./components/CandidateReportsPage";
import { Sidebar } from "./components/Sidebar";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeItem={currentPage} onNavigate={handleNavigation} />

        {/* Main Content */}
        {currentPage === "Dashboard" && <Dashboard />}
        {currentPage === "Create Job" && (
          <CreateJobPage onNavigate={handleNavigation} />
        )}
        {currentPage === "Job Listings" && (
          <JobListingsPage onNavigate={handleNavigation} />
        )}
        {currentPage === "Candidate Reports" && <CandidateReportsPage />}
      </div>
      <Toaster />
    </>
  );
}