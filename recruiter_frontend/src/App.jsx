import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { CreateJobPage } from "./components/CreateJobPage";
import { JobListingsPage } from "./components/JobListingsPage";
import { CandidateReportsPage } from "./components/CandidateReportsPage";
import { Sidebar } from "./components/Sidebar";
import { RecruiterAuthPage } from "./components/RecruiterAuthPage"; 
import { RecruiterSettings } from "./components/RecruiterSettings"; 
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// 1. Protects routes from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("recruiterToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 2. Wraps the sidebar around our private pages
const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Highlight the correct sidebar item based on the URL
  const getActiveItem = () => {
    if (location.pathname === "/create-job") return "Create Job";
    if (location.pathname === "/jobs") return "Job Listings";
    if (location.pathname === "/reports") return "Candidate Reports";
    if (location.pathname === "/settings") return "Settings";
    if (location.pathname === "/logout") return "Logout";

    return "Dashboard";
  };

  // Convert old sidebar clicks into URL changes
  const handleSidebarNavigate = (page) => {
    if (page === "Dashboard") navigate("/");
    if (page === "Create Job") navigate("/create-job");
    if (page === "Job Listings") navigate("/jobs");
    if (page === "Candidate Reports") navigate("/reports");
    if (page === "Settings") navigate("/settings");
    if (page === "Logout") {
      localStorage.removeItem("recruiterToken");
      navigate("/login");
      toast.success("Logged out successfully");
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      <Sidebar activeItem={getActiveItem()} onNavigate={handleSidebarNavigate} />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        
        {/* PUBLIC ROUTE: The Login/Signup Page */}
        <Route path="/login" element={<RecruiterAuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* PRIVATE ROUTES: Require JWT Token */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/create-job" element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateJobPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/jobs" element={
          <ProtectedRoute>
            <DashboardLayout>
              <JobListingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <DashboardLayout>
              <CandidateReportsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <DashboardLayout>
              <RecruiterSettings />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
  );
}