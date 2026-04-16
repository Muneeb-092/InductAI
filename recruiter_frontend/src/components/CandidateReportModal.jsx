import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle, Smartphone, Users, EyeOff, BrainCircuit, FileQuestion, MessageSquare, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function CandidateReportModal({ isOpen, onClose, sessionId, candidateName, onScoreCalculated }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/reports/${sessionId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('recruiterToken')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setReport(data);
        }
      } catch (error) {
        console.error("Failed to fetch report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [isOpen, sessionId]);

  if (!isOpen) return null;

  // Format interview data for the chart
  const interviewChartData = report ? [
    { skill: 'Technical', score: report.breakdown.interview.metrics.technical },
    { skill: 'Communication', score: report.breakdown.interview.metrics.communication },
    { skill: 'Teamwork', score: report.breakdown.interview.metrics.teamwork },
    { skill: 'Leadership', score: report.breakdown.interview.metrics.leadership },
    { skill: 'Logical', score: report.breakdown.interview.metrics.logicalThinking },
  ] : [];

  // Calculate Combined Final Score and MCQ Stats safely
  const aiScore = report ? parseFloat(report.overallScore) : 0;
  const trustScore = report ? parseFloat(report.trustScore) : 0;
  const finalCombinedScore = report ? ((aiScore + trustScore) / 2).toFixed(1) : 0;
  if (onScoreCalculated) {
    // Pass the ID and the calculated score back to CandidateTable
   onScoreCalculated(sessionId, finalCombinedScore);
 }
  const mcqTotal = report?.breakdown?.mcq?.totalQuestions || 0;
  // If correctAnswers isn't directly in the JSON, we calculate it from accuracy
  const mcqCorrect = report?.breakdown?.mcq?.correctAnswers !== undefined 
    ? report.breakdown.mcq.correctAnswers 
    : Math.round((report?.breakdown?.mcq?.accuracy / 100) * mcqTotal);

  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{candidateName}'s AI Report</h2>
            <p className="text-sm text-gray-500">Session ID: {sessionId}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0052CC]"></div>
              <p className="mt-4 text-gray-500 animate-pulse">Analyzing AI evaluations...</p>
            </div>
          ) : report ? (
            <div className="space-y-6">
              
              {/* Top Row: Core Scores (Now 3 Columns!) */}
              <div className="grid grid-cols-3 gap-6">
                
                {/* 1. Final Combined Score (New!) */}
                <div className="bg-gradient-to-br from-[#0052CC] to-[#00B8D9] p-6 rounded-xl flex items-center justify-between text-white shadow-md">
                  <div>
                    <h3 className="font-semibold mb-1 flex items-center gap-2">
                      <Award size={18} /> Final Score
                    </h3>
                    <p className="text-sm text-blue-100">AI + Trust Average</p>
                  </div>
                  <div className="text-4xl font-bold">{finalCombinedScore}%</div>
                </div>

                {/* 2. Overall AI Score */}
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="text-blue-900 font-semibold mb-1">AI Score</h3>
                    <p className="text-sm text-blue-700">Test & Interview</p>
                  </div>
                  <div className="text-3xl font-bold text-[#0052CC]">{report.overallScore}%</div>
                </div>

                {/* 3. Trust Score */}
                <div className={`border p-6 rounded-xl flex items-center justify-between ${
                  report.trustScore >= 90 ? 'bg-green-50 border-green-100' : 
                  report.trustScore >= 70 ? 'bg-yellow-50 border-yellow-100' : 'bg-red-50 border-red-100'
                }`}>
                  <div>
                    <h3 className={`font-semibold mb-1 ${
                      report.trustScore >= 90 ? 'text-green-900' : 
                      report.trustScore >= 70 ? 'text-yellow-900' : 'text-red-900'
                    }`}>Trust Score</h3>
                    <div className="flex items-center gap-1 text-sm mt-1">
                      {report.trustScore >= 90 ? <CheckCircle size={14} className="text-green-600"/> : <ShieldAlert size={14} className="text-red-500"/>}
                      <span className={report.trustScore >= 90 ? 'text-green-700' : 'text-red-700'}>
                        {report.trustScore >= 90 ? 'High Confidence' : 'Anomalies'}
                      </span>
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${
                      report.trustScore >= 90 ? 'text-green-600' : 
                      report.trustScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {report.trustScore}%
                  </div>
                </div>
              </div>

              {/* Middle Row: Proctoring Warnings & MCQ */}
              <div className="grid grid-cols-3 gap-6">
                
                {/* Warnings Panel */}
                <div className="col-span-1 border border-gray-200 rounded-xl p-5 bg-white">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-gray-500"/> AI Proctoring Log
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-gray-600"><EyeOff size={16}/> Looked Away</span>
                      <span className="font-medium">{report.breakdown.proctoring?.lookingAwayCount || 0} times</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-gray-600"><Users size={16}/> Multiple Faces</span>
                      <span className={`font-medium px-2 py-0.5 rounded ${report.breakdown.proctoring?.multiplePeopleDetected ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {report.breakdown.proctoring?.multiplePeopleDetected ? 'Yes' : 'No'}
                      </span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-gray-600"><Smartphone size={16}/> Phone Detected</span>
                      <span className={`font-medium px-2 py-0.5 rounded ${report.breakdown.proctoring?.phoneDetected ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {report.breakdown.proctoring?.phoneDetected ? 'Yes' : 'No'}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Interview Skills Chart */}
                <div className="col-span-2 border border-gray-200 rounded-xl p-5 bg-white">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BrainCircuit size={18} className="text-gray-500"/> Interview Skill Breakdown
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={interviewChartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="skill" type="category" axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="score" fill="#0052CC" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Question Breakdown (NEW!) */}
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h3 className="font-semibold text-gray-900 mb-4">Assessment Breakdown</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* MCQ Breakdown */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <FileQuestion size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">MCQ Technical Test</h4>
                      <div className="mt-2 flex justify-between items-center text-sm text-gray-600">
                        <span>Accuracy</span>
                        <span className="font-semibold text-gray-900">{report.breakdown.mcq.accuracy}%</span>
                      </div>
                      <div className="mt-1 flex justify-between items-center text-sm text-gray-600">
                        <span>Correct Answers</span>
                        <span className="font-semibold text-gray-900">{mcqCorrect} / {mcqTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interview Breakdown */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                      <MessageSquare size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">AI Video Interview</h4>
                      <div className="mt-2 flex justify-between items-center text-sm text-gray-600">
                        <span>Average AI Rating</span>
                        <span className="font-semibold text-gray-900">{report.breakdown.interview.averageScore} / 100</span>
                      </div>
                      <div className="mt-1 flex justify-between items-center text-sm text-gray-600">
                        <span>Skills Evaluated</span>
                        <span className="font-semibold text-gray-900">5 Metrics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">Failed to load candidate data.</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}