import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FileText, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const candidates = [
  {
    id: "1",
    name: "Emily Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    jobTitle: "Senior React Developer",
    status: "Interview Scheduled",
    score: 92,
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    jobTitle: "UX Designer",
    status: "Under Review",
    score: 88,
  },
  {
    id: "3",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    jobTitle: "Product Manager",
    status: "Shortlisted",
    score: 95,
  },
  {
    id: "4",
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    jobTitle: "Full Stack Developer",
    status: "Interview Scheduled",
    score: 90,
  },
  {
    id: "5",
    name: "Priya Patel",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    jobTitle: "Data Scientist",
    status: "Under Review",
    score: 87,
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Interview Scheduled":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "Under Review":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case "Shortlisted":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "Rejected":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
};

export function CandidateTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-gray-900">Recent Candidates</h3>
        <p className="text-gray-500 text-sm mt-1">
          Latest applications and their current status
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Candidate Name</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>AI Score</TableHead>
            <TableHead>Report</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {candidates.map((candidate) => (
            <TableRow
              key={candidate.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={candidate.avatar} />
                    <AvatarFallback>
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-900">
                    {candidate.name}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-gray-600">
                {candidate.jobTitle}
              </TableCell>

              <TableCell>
                <Badge
                  className={getStatusColor(candidate.status)}
                >
                  {candidate.status}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0052CC] to-[#00B8D9]"
                      style={{
                        width: `${candidate.score}%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-900">
                    {candidate.score}%
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View
                </Button>
              </TableCell>

              <TableCell>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#0052CC] to-[#00B8D9] hover:opacity-90 gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Evaluate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}