import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { StatCard } from './StatCard';
import { CandidateTable } from './CandidateTable';
import { Card } from './ui/card';
import { Briefcase, Users, FileCheck, Calendar } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const candidateProgressData = [
  { month: 'Jan', applications: 145, interviewed: 89, hired: 12 },
  { month: 'Feb', applications: 178, interviewed: 112, hired: 18 },
  { month: 'Mar', applications: 190, interviewed: 125, hired: 22 },
  { month: 'Apr', applications: 210, interviewed: 145, hired: 28 },
  { month: 'May', applications: 225, interviewed: 160, hired: 32 },
  { month: 'Jun', applications: 245, interviewed: 175, hired: 35 },
];

const jobApplicationsData = [
  { role: 'Software Engineer', value: 145, color: '#0052CC' },
  { role: 'Product Manager', value: 89, color: '#0078D4' },
  { role: 'UX Designer', value: 67, color: '#00B8D9' },
  { role: 'Data Scientist', value: 54, color: '#50E3C2' },
  { role: 'DevOps Engineer', value: 42, color: '#4CD4B0' },
];

export function Dashboard() {
  const [totalJobs, setTotalJobs] = useState("...");
  const [activeJobs, setActiveJobs] = useState("...");
  const [reportsGenerated, setReportsGenerated] = useState("...");
  const [totalInterviews, setTotalInterviews] = useState("...");

  useEffect(() => {
    const fetchJobStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs/count', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('recruiterToken')}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          // 2. Update both state variables with the new data
          setTotalJobs(data.total.toString());
          setActiveJobs(data.active.toString()); 
          setReportsGenerated(data.reports.toString());
          setTotalInterviews(data.interviews.toString());
        }
      } catch (error) {
        console.error("Failed to fetch job stats:", error);
        setTotalJobs("Error");
        setActiveJobs("Error");
      }
    };
  
    fetchJobStats();
  }, []);
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6">
            <StatCard
              title="Active Jobs"
              value={activeJobs}
              icon={Briefcase}
            />
            <StatCard
              title="Reports Generated"
              value={reportsGenerated}
              icon={FileCheck}
            />
            <StatCard
              title="Total Jobs Posted"
              value={totalJobs} 
              icon={Users}
            />
            <StatCard
              title="Total Interviews"
              value={totalInterviews}
              icon={Calendar}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6">
            {/* Candidate Progress Chart */}
            <Card className="p-6 bg-white border-gray-200">
              <div className="mb-6">
                <h3 className="text-gray-900">Candidate Progress Overview</h3>
                <p className="text-gray-500 text-sm mt-1">Monthly candidate pipeline metrics</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={candidateProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="applications" fill="#0052CC" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="interviewed" fill="#00B8D9" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="hired" fill="#50E3C2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Job Applications by Role */}
            <Card className="p-6 bg-white border-gray-200">
              <div className="mb-6">
                <h3 className="text-gray-900">Job Applications per Role</h3>
                <p className="text-gray-500 text-sm mt-1">Distribution of applications by position</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobApplicationsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ role, percent }) => `${role} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {jobApplicationsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Candidates Table */}
          <CandidateTable />
        </div>
      </div>
    </div>
  );
}
