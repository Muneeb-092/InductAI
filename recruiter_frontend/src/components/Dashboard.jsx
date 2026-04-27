import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { StatCard } from './StatCard';
import { CandidateTable } from './CandidateTable';
import { Card } from './ui/card';
import { Briefcase, Users, FileCheck, Calendar } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export function Dashboard() {
  const [totalJobs, setTotalJobs] = useState("...");
  const [activeJobs, setActiveJobs] = useState("...");
  const [reportsGenerated, setReportsGenerated] = useState("...");
  const [totalInterviews, setTotalInterviews] = useState("...");

  // 🔥 NEW STATES FOR CHARTS
  const [monthlyData, setMonthlyData] = useState([]);
  const [jobWiseData, setJobWiseData] = useState([]);

  useEffect(() => {
    const fetchJobStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs/count', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('recruiterToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();

          // ✅ Existing stats (unchanged)
          setTotalJobs(data.total?.toString() || "0");
          setActiveJobs(data.active?.toString() || "0");
          setReportsGenerated(data.reports?.toString() || "0");
          setTotalInterviews(data.interviews?.toString() || "0");

          // 🔥 NEW: Chart Data (SAFE FALLBACKS)
          setMonthlyData(data.monthlyInterviews || []);
          setJobWiseData(data.jobWiseInterviews || []);
        }
      } catch (error) {
        console.error("Failed to fetch job stats:", error);

        setTotalJobs("Error");
        setActiveJobs("Error");
        setReportsGenerated("Error");
        setTotalInterviews("Error");
      }
    };

    fetchJobStats();
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-4 gap-6">
            <StatCard title="Active Jobs" value={activeJobs} icon={Briefcase} />
            <StatCard title="Reports Generated" value={reportsGenerated} icon={FileCheck} />
            <StatCard title="Total Jobs Posted" value={totalJobs} icon={Users} />
            <StatCard title="Total Interviews" value={totalInterviews} icon={Calendar} />
          </div>

          {/* ================= CHARTS ================= */}
          <div className="grid grid-cols-2 gap-6">

            {/* 📊 Monthly Interviews (Bar Chart) */}
            <Card className="p-6 bg-white border-gray-200">
              <div className="mb-6">
                <h3 className="text-gray-900">Interview Trends (Last 6 Months)</h3>
                <p className="text-gray-500 text-sm mt-1">Completed interviews per month</p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
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

                  <Bar
                    dataKey="interviewed"
                    name="Interviews"
                    fill="#0052CC"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* 🥧 Job-wise Interviews (Pie Chart) */}
            <Card className="p-6 bg-white border-gray-200">
              <div className="mb-6">
                <h3 className="text-gray-900">Interviews by Job (This Month)</h3>
                <p className="text-gray-500 text-sm mt-1">Distribution per job role</p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobWiseData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    nameKey="role"
                    label={({ role, percent }) =>
                      `${role} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {jobWiseData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={[
                          '#0052CC',
                          '#00B8D9',
                          '#50E3C2',
                          '#4CD4B0',
                          '#0078D4'
                        ][index % 5]}
                      />
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

          {/* ================= CANDIDATES TABLE ================= */}
          <CandidateTable />

        </div>
      </div>
    </div>
  );
}