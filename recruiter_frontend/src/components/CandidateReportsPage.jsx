import { useState } from 'react';
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
import { CandidateDetailModal } from './CandidateDetailModal';

const mockCandidates = [
  {
    id: '1',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    jobTitle: 'Senior React Developer',
    mcqScore: 92,
    technicalScore: 88,
    softSkillScore: 85,
    overallScore: 88,
    rank: 1,
    interviewDate: '2025-10-15',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    jobTitle: 'Senior React Developer',
    mcqScore: 85,
    technicalScore: 90,
    softSkillScore: 78,
    overallScore: 84,
    rank: 2,
    interviewDate: '2025-10-14',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    jobTitle: 'Product Manager',
    mcqScore: 88,
    technicalScore: 82,
    softSkillScore: 92,
    overallScore: 87,
    rank: 1,
    interviewDate: '2025-10-13',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    jobTitle: 'Senior React Developer',
    mcqScore: 78,
    technicalScore: 75,
    softSkillScore: 80,
    overallScore: 78,
    rank: 3,
    interviewDate: '2025-10-12',
  },
  {
    id: '5',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    jobTitle: 'Data Scientist',
    mcqScore: 95,
    technicalScore: 93,
    softSkillScore: 88,
    overallScore: 92,
    rank: 1,
    interviewDate: '2025-10-11',
  },
  {
    id: '6',
    name: 'James Williams',
    email: 'james.williams@email.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    jobTitle: 'Senior React Developer',
    mcqScore: 65,
    technicalScore: 68,
    softSkillScore: 72,
    overallScore: 68,
    rank: 4,
    interviewDate: '2025-10-10',
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    jobTitle: 'UX Designer',
    mcqScore: 82,
    technicalScore: 85,
    softSkillScore: 90,
    overallScore: 86,
    rank: 1,
    interviewDate: '2025-10-09',
  },
  {
    id: '8',
    name: 'Robert Taylor',
    email: 'robert.taylor@email.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    jobTitle: 'Senior React Developer',
    mcqScore: 45,
    technicalScore: 48,
    softSkillScore: 52,
    overallScore: 48,
    rank: 5,
    interviewDate: '2025-10-08',
  },
];

export function CandidateReportsPage({ onNavigate }) {
  const [candidates] = useState(mockCandidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const jobTitles = ['all', ...Array.from(new Set(candidates.map(c => c.jobTitle)))];

  const filteredCandidates = candidates
    .filter(candidate => {
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesJob = selectedJob === 'all' || candidate.jobTitle === selectedJob;
      return matchesSearch && matchesJob;
    })
    .sort((a, b) => b.overallScore - a.overallScore);

  const totalCandidates = filteredCandidates.length;
  const avgScore = totalCandidates > 0 
    ? Math.round(filteredCandidates.reduce((sum, c) => sum + c.overallScore, 0) / totalCandidates)
    : 0;
  const topPerformers = filteredCandidates.filter(c => c.overallScore >= 80).length;

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700 hover:bg-green-100';
    if (score >= 50) return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
    return 'bg-red-100 text-red-700 hover:bg-red-100';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-gray-900">Candidate Reports</h1>
            <p className="text-gray-500 mt-1">View and analyze AI-generated performance reports for all candidates.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-64">
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger>
                <SelectValue placeholder="Select Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobTitles.slice(1).map(job => (
                  <SelectItem key={job} value={job}>{job}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search candidate by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#F5F7FA]">
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <Card className="p-5 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Candidates</p>
                  <h3 className="text-gray-900">{totalCandidates}</h3>
                  <p className="text-gray-400 text-xs mt-1">Completed interviews</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0052CC]" />
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Average Score</p>
                  <h3 className="text-gray-900">{avgScore}%</h3>
                  <p className="text-gray-400 text-xs mt-1">Across all metrics</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Top Performers</p>
                  <h3 className="text-gray-900">{topPerformers}</h3>
                  <p className="text-gray-400 text-xs mt-1">Score ≥ 80%</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-white border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Candidate Name</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>MCQ Score</TableHead>
                  <TableHead>Technical Score</TableHead>
                  <TableHead>Soft Skill Score</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Interview Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500">No candidates found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map(candidate => (
                    <TableRow 
                      key={candidate.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={candidate.avatar} 
                            alt={candidate.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-gray-900">{candidate.name}</p>
                            <p className="text-gray-500 text-sm">{candidate.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{candidate.jobTitle}</TableCell>
                      <TableCell>
                        <Badge className={getScoreColor(candidate.mcqScore)}>
                          {candidate.mcqScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getScoreColor(candidate.technicalScore)}>
                          {candidate.technicalScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getScoreColor(candidate.softSkillScore)}>
                          {candidate.softSkillScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getScoreColor(candidate.overallScore)}>
                          {candidate.overallScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">#{candidate.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(candidate.interviewDate)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-[#0052CC] to-[#00B8D9] hover:opacity-90"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedCandidate(candidate);
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {filteredCandidates.length > 0 && (
            <div className="flex items-center justify-between px-2">
              <p className="text-sm text-gray-500">
                Showing {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}