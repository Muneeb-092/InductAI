import { useState } from "react";
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

const mockJobs = [
  {
    id: "1",
    title: "Senior React Developer",
    jobType: "Remote",
    status: "Active",
    createdOn: "2025-10-10",
    jobLink: "https://inductai.com/apply/job-12345",
    candidatesTested: 45,
    candidatesInterviewed: 12,
  },
  {
    id: "2",
    title: "Product Manager",
    jobType: "Hybrid",
    status: "Active",
    createdOn: "2025-10-08",
    jobLink: "https://inductai.com/apply/job-12346",
    candidatesTested: 32,
    candidatesInterviewed: 8,
  },
  {
    id: "3",
    title: "UX Designer",
    jobType: "Onsite",
    status: "Active",
    createdOn: "2025-10-05",
    jobLink: "https://inductai.com/apply/job-12347",
    candidatesTested: 28,
    candidatesInterviewed: 6,
  },
  {
    id: "4",
    title: "Full Stack Developer",
    jobType: "Remote",
    status: "Closed",
    createdOn: "2025-09-28",
    jobLink: "https://inductai.com/apply/job-12348",
    candidatesTested: 67,
    candidatesInterviewed: 18,
  },
  {
    id: "5",
    title: "Data Scientist",
    jobType: "Hybrid",
    status: "Active",
    createdOn: "2025-10-12",
    jobLink: "https://inductai.com/apply/job-12349",
    candidatesTested: 22,
    candidatesInterviewed: 5,
  },
  {
    id: "6",
    title: "DevOps Engineer",
    jobType: "Remote",
    status: "Closed",
    createdOn: "2025-09-15",
    jobLink: "https://inductai.com/apply/job-12350",
    candidatesTested: 41,
    candidatesInterviewed: 11,
  },
  {
    id: "7",
    title: "Backend Developer",
    jobType: "Onsite",
    status: "Active",
    createdOn: "2025-10-14",
    jobLink: "https://inductai.com/apply/job-12351",
    candidatesTested: 19,
    candidatesInterviewed: 4,
  },
  {
    id: "8",
    title: "Frontend Developer",
    jobType: "Remote",
    status: "Active",
    createdOn: "2025-10-11",
    jobLink: "https://inductai.com/apply/job-12352",
    candidatesTested: 34,
    candidatesInterviewed: 9,
  },
];

export function JobListingsPage({ onNavigate }) {
  const [jobs, setJobs] = useState(mockJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [jobToClose, setJobToClose] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "Active").length;
  const closedJobs = jobs.filter((j) => j.status === "Closed").length;
  const totalInterviews = jobs.reduce(
    (sum, job) => sum + job.candidatesInterviewed,
    0
  );

  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch = job.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        job.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          new Date(b.createdOn).getTime() -
          new Date(a.createdOn).getTime()
        );
      } else {
        return (
          new Date(a.createdOn).getTime() -
          new Date(b.createdOn).getTime()
        );
      }
    });

  const copyJobLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Job link copied to clipboard!");
  };

  const handleCloseJob = (jobId) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId ? { ...job, status: "Closed" } : job
      )
    );
    setJobToClose(null);
    toast.success("Job has been closed successfully");
  };

  const handleDeleteJob = (jobId) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
    setJobToDelete(null);
    toast.success("Job has been deleted");
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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
                          {job.jobType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          job.status === 'Active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                        }>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(job.createdOn)}
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
                              <p className="text-xs">{job.jobLink}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{job.candidatesTested}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{job.candidatesInterviewed}</span>
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
                                  onClick={() => toast.info('View details feature coming soon')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {job.status === 'Active' && (
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
              className="bg-orange-600 hover:bg-orange-700"
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
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}