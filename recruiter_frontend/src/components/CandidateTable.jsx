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
import { CandidateReportModal } from './CandidateReportModal';
import React, { useState, useEffect } from 'react';

const getStatusColor = (status) => {
  switch (status) {
    case "Interview Scheduled": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "Under Review": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case "Shortlisted": return "bg-green-100 text-green-700 hover:bg-green-100";
    case "Rejected": return "bg-red-100 text-red-700 hover:bg-red-100";
    default: return "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
};

export function CandidateTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState({ id: null, name: "" });
  const [candidatesList, setCandidatesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOpenReport = (sessionId, name) => {
    setSelectedCandidate({ id: sessionId, name: name });
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/candidates', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('recruiterToken')}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCandidatesList(data);
        }
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading candidates...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-gray-900">Recent Candidates</h3>
        <p className="text-gray-500 text-sm mt-1">Latest applications and their current status</p>
      </div>
      
      <CandidateReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        sessionId={selectedCandidate.id}
        candidateName={selectedCandidate.name}
      />
      
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Candidate Name</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>AI Score</TableHead>
            <TableHead>Report</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Changed 'candidatesList' to 'candidate' here for clarity */}
          {candidatesList.map((candidate) => (
            <TableRow key={candidate.id} className="hover:bg-gray-50 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={candidate.avatar} />
                    <AvatarFallback>
                      {/* Now candidate.name will work perfectly! */}
                      {candidate.name ? candidate.name.split(" ").map((n) => n[0]).join("") : "C"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-900">{candidate.name}</span>
                </div>
              </TableCell>

              <TableCell className="text-gray-600">{candidate.jobTitle}</TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0052CC] to-[#00B8D9]"
                      style={{ width: `${candidate.score}%` }}
                    />
                  </div>
                  <span className="text-gray-900">{candidate.score}%</span>
                </div>
              </TableCell>

              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  // Dynamically passing the real ID and Name to the Modal!
                  onClick={() => handleOpenReport(candidate.id, candidate.name)} 
                >
                  <FileText className="w-4 h-4" /> View
                </Button>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}