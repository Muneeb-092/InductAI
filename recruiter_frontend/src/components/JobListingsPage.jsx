import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Search,
  Plus,
  Link as LinkIcon,
  Eye,
  Ban,
  Trash2,
  Briefcase,
  UserCheck,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export function JobListingsPage({ onNavigate }) {

  // 1. FIXED: Initialize as an empty array
  const [jobs, setJobs] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [jobToClose, setJobToClose] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobToView, setJobToView] = useState(null);
  // 2. Add this simple handler function
  const handleViewJob = (job) => {
    setJobToView(job);
};

  // 2. FIXED: Calculate dashboard stats dynamically based on the fetched jobs
  const totalJobs = jobs.length;
  // Note: Adjust 'Active' or 'ACTIVE' depending on how it's saved in your DB
  const activeJobs = jobs.filter(job => job.status?.toUpperCase() === 'ACTIVE').length;
  const closedJobs = jobs.filter(job => job.status?.toUpperCase() === 'CLOSED').length;
  // Assuming your DB has a candidatesInterviewed column. If not, this defaults to 0.
  const totalInterviews = jobs.reduce((sum, job) => sum + (job.candidatesInterviewed || 0), 0);

  const filteredJobs = jobs
    .filter((job) => {
      // Add safety check in case job title is missing
      const jobTitle = job.title || "";
      const matchesSearch = jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      const jobStatus = job.status || "";
      const matchesStatus =
        statusFilter === "all" ||
        jobStatus.toLowerCase() === statusFilter.toLowerCase();
        
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // 3. FIXED: Changed createdOn to createdAt (Prisma's default)
      if (sortOrder === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  const copyJobLink = (link) => {
    // Fallback if link is missing
    const finalLink = link || "https://inductai.com/apply/pending";
    navigator.clipboard.writeText(finalLink);
    toast.success("Job link copied to clipboard!");
  };

  const handleCloseJob = async (jobId) => {
    try {
      // 1. Make the API call to update the database
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/close`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('recruiterToken')}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Failed to close job");

      // 2. Update the React state ONLY if the database update was successful
      setJobs(
        jobs.map((job) =>
          job.id === jobId ? { ...job, status: "CLOSED" } : job
        )
      );
      
      setJobToClose(null);
      toast.success("Job has been closed successfully");
      
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while closing the job.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      // 1. Make the API call to delete from the database
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('recruiterToken')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete job");
      }

      // 2. Remove it from the React state ONLY if it successfully deleted from the DB
      setJobs(jobs.filter((job) => job.id !== jobId));
      setJobToDelete(null);
      toast.success("Job has been deleted successfully");

    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred while deleting the job.");
    }
  };
  const getJobTypeColor = (type) => {
    switch (type) {
      case "Remote":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Hybrid":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case "Onsite":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Make sure this matches your actual backend route!
        const response = await fetch('http://localhost:5000/api/jobs/totalJobs', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('recruiterToken')}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setJobs(data.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      }
    };
  
    fetchJobs();
  }, []);
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">Job Listings</h1>
            <p className="text-gray-500 mt-1">View and manage all your active and closed job posts.</p>
          </div>
          <Button
            onClick={() => onNavigate?.('Create Job')}
            className="bg-gradient-to-r from-[#0052CC] to-[#00B8D9] hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Job
          </Button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#F5F7FA]">
        <div className="p-8 space-y-6">
          
          {/* Analytics Summary */}
          <div className="grid grid-cols-4 gap-6">
            <Card className="p-5 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Jobs</p>
                  <h3 className="text-gray-900">{totalJobs}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-[#0052CC]" />
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Active Jobs</p>
                  <h3 className="text-gray-900">{activeJobs}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Closed Jobs</p>
                  <h3 className="text-gray-900">{closedJobs}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-slate-100 flex items-center justify-center">
                  <Ban className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Interviews Conducted</p>
                  <h3 className="text-gray-900">{totalInterviews}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="p-6 bg-white border-gray-200">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by job title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="w-48">
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Jobs Table */}
          <Card className="bg-white border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Job Title</TableHead>
                  <TableHead>Job Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Job Link</TableHead>
                  <TableHead>Candidates Tested</TableHead>
                  <TableHead>Candidates Interviewed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Briefcase className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500">No jobs found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <button 
                          className="text-[#0052CC] hover:underline"
                          onClick={() => toast.info('Job details feature coming soon')}
                        >
                          {job.title}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge className={getJobTypeColor(job.jobType)}>
                          {job.jobType || "Remote"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          job.status === 'Active' || job.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                        }>
                          {job.status || "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {job.createdOn}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyJobLink(job.jobLink)}
                                className="gap-2"
                              >
                                <LinkIcon className="w-4 h-4" />
                                Copy Link
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{job.jobLink || "Link not generated"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{job.candidatesTested || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{job.candidatesInterviewed || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewJob(job)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {(job.status === 'Active' || job.status === 'ACTIVE') && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setJobToClose(job.id)}
                                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                  >
                                    <Ban className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Close Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setJobToDelete(job.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Job</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination Info */}
          {filteredJobs.length > 0 && (
            <div className="flex items-center justify-between px-2">
              <p className="text-sm text-gray-500">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Close Job Confirmation Dialog */}
      <AlertDialog open={jobToClose !== null} onOpenChange={() => setJobToClose(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the job as closed and stop accepting new applications. You can always reopen it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => jobToClose && handleCloseJob(jobToClose)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Close Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Job Confirmation Dialog */}
      <AlertDialog open={jobToDelete !== null} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job posting and all associated candidate data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => jobToDelete && handleDeleteJob(jobToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* --- VIEW JOB DETAILS MODAL --- */}
      <Dialog open={!!jobToView} onOpenChange={(open) => !open && setJobToView(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {jobToView && (
            <>
              <DialogHeader className="border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {jobToView.title}
                    </DialogTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge className={jobToView.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {jobToView.status}
                      </Badge>
                      <Badge variant="outline" className="text-gray-600 capitalize">
                        {jobToView.jobType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Top Stats Row */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Experience</p>
                    <p className="text-gray-900 font-semibold">{jobToView.experience} Years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Gender Pref.</p>
                    <p className="text-gray-900 font-semibold capitalize">{jobToView.gender || "Any"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Age Range</p>
                    <p className="text-gray-900 font-semibold">
                      {jobToView.minAge || "Any"} - {jobToView.maxAge || "Any"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <div className="p-4 bg-white border border-gray-200 rounded-xl">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {jobToView.description}
                    </p>
                  </div>
                </div>

                {/* Application Link */}
                {jobToView.jobLink && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Shareable Link</h3>
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <code className="text-sm text-[#0052CC] truncate pr-4">
                        {jobToView.jobLink}
                      </code>
                      <Button 
                        size="sm" 
                        className="bg-white text-[#0052CC] hover:bg-gray-50 border border-blue-200"
                        onClick={() => {
                          navigator.clipboard.writeText(jobToView.jobLink);
                          toast.success("Link copied!");
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
                <Button variant="outline" onClick={() => setJobToView(null)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>

  );
  
}