import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Search, Filter, FileText, TrendingUp, Users, Award } from 'lucide-react';
import { CandidateReportModal } from './CandidateReportModal';

export function CandidateReportsPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState({ id: null, name: '' });

  // ✅ Fetch API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/candidates', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('recruiterToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();

          setCandidates(data);
        }
      } catch (error) {
        console.error('Failed to fetch candidates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleOpenReport = (id, name) => {
    setSelectedCandidate({ id, name });
    setIsModalOpen(true);
  };

  // Filters
  const jobTitles = ['all', ...Array.from(new Set(candidates.map(c => c.jobTitle)))];

  const filteredCandidates = candidates
    .filter(candidate => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesJob =
        selectedJob === 'all' || candidate.jobTitle === selectedJob;

      return matchesSearch && matchesJob;
    })
    .sort((a, b) => b.overallScore - a.overallScore);

  const totalCandidates = filteredCandidates.length;

  const avgScore =
    totalCandidates > 0
      ? Math.round(
          filteredCandidates.reduce((sum, c) => sum + c.overallScore, 0) /
            totalCandidates
        )
      : 0;

  const topPerformers = filteredCandidates.filter(c => c.overallScore >= 80).length;

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 50) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // ✅ Loading UI
  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading candidates...</div>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ✅ SAME MODAL AS DASHBOARD */}
      <CandidateReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sessionId={selectedCandidate.id}
        candidateName={selectedCandidate.name}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-gray-900">Candidate Reports</h1>

        <div className="flex items-center gap-4 mt-4">
          <div className="w-64">
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger>
                <SelectValue placeholder="Select Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobTitles.slice(1).map(job => (
                  <SelectItem key={job} value={job}>
                    {job}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search candidate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-3 gap-6 bg-[#F5F7FA]">
        <Card className="p-5">
          <p>Total Candidates</p>
          <h3>{totalCandidates}</h3>
        </Card>

        <Card className="p-5">
          <p>Average Score</p>
          <h3>{avgScore}%</h3>
        </Card>

        <Card className="p-5">
          <p>Top Performers</p>
          <h3>{topPerformers}</h3>
        </Card>
      </div>

      {/* Table */}
<div className="p-6 bg-[#F5F7FA]">
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Job</TableHead>
          <TableHead>MCQ</TableHead>
          <TableHead>Technical</TableHead>
          <TableHead>Soft Skills</TableHead>
          <TableHead>Overall</TableHead>
          <TableHead>Rank</TableHead>
          <TableHead>Date</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredCandidates.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-10 text-gray-500">
              No candidates found
            </TableCell>
          </TableRow>
        ) : (
          filteredCandidates.map(c => (
            <TableRow
              key={c.id}
              className="cursor-pointer"
              onClick={() => handleOpenReport(c.id, c.name)}
            >
              <TableCell>{c.name}</TableCell>

              <TableCell>{c.jobTitle}</TableCell>

              <TableCell>
                <Badge className={getScoreColor(c.mcqScore)}>
                  {c.mcqScore}%
                </Badge>
              </TableCell>

              <TableCell>
                <Badge className={getScoreColor(c.technicalScore)}>
                  {c.technicalScore}%
                </Badge>
              </TableCell>

              <TableCell>
                <Badge className={getScoreColor(c.softSkillScore)}>
                  {c.softSkillScore}%
                </Badge>
              </TableCell>

              <TableCell>
                <Badge className={getScoreColor(c.overallScore)}>
                  {c.overallScore}%
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">
                    #{c.rank}
                  </span>
                </div>
              </TableCell>

              <TableCell>{formatDate(c.interviewDate)}</TableCell>

              <TableCell>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenReport(c.id, c.name);
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </Card>
</div>
    </div>
  );
}