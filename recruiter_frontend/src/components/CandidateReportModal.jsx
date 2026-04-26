import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle, Smartphone, Users, EyeOff, BrainCircuit, FileQuestion, MessageSquare, Award, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';

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

  // Chart Data
  const interviewChartData = report ? [
    { skill: 'Technical', score: report?.breakdown?.interview?.metrics?.technical || 0 },
    { skill: 'Communication', score: report?.breakdown?.interview?.metrics?.communication || 0 },
    { skill: 'Teamwork', score: report?.breakdown?.interview?.metrics?.teamwork || 0 },
    { skill: 'Leadership', score: report?.breakdown?.interview?.metrics?.leadership || 0 },
    { skill: 'Logical', score: report?.breakdown?.interview?.metrics?.logicalThinking || 0 },
  ] : [];

  // Data rounded securely for the UI
  const aiScore = report ? Math.round(report.overallScore) : 0;
  const trustScore = report ? Math.round(report.trustScore) : 0;
  const finalCombinedScore = report ? Math.round((aiScore + trustScore) / 2) : 0;

  if (onScoreCalculated) {
    onScoreCalculated(sessionId, finalCombinedScore);
  }

  const mcqTotal = report?.breakdown?.mcq?.totalQuestions || 0;
  const mcqCorrect = report?.breakdown?.mcq?.correctAnswers !== undefined 
    ? report.breakdown.mcq.correctAnswers 
    : Math.round((report?.breakdown?.mcq?.accuracy / 100) * mcqTotal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{candidateName}'s AI Report</h2>
            <p className="text-sm text-gray-500">Session ID: {sessionId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0052CC]"></div>
              <p className="mt-4 text-gray-500 font-medium">Analyzing AI evaluations...</p>
            </div>
          ) : report ? (
            <div className="space-y-6">

              {/* Scores */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#0052CC] to-[#00B8D9] p-6 rounded-xl text-white flex justify-between shadow-sm">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Award size={18}/> Final Score
                    </h3>
                    <p className="text-sm text-blue-100">AI + Trust</p>
                  </div>
                  <div className="text-4xl font-bold">{finalCombinedScore}%</div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl flex justify-between border border-blue-100">
                  <div>
                    <h3 className="font-semibold text-blue-900">AI Score</h3>
                    <p className="text-sm text-blue-700">Test + Interview</p>
                  </div>
                  <div className="text-3xl font-bold text-[#0052CC]">{aiScore}%</div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl flex justify-between border border-green-100">
                  <div>
                    <h3 className="font-semibold text-green-900">Trust Score</h3>
                    <p className="text-sm text-green-700">Proctoring AI</p>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{trustScore}%</div>
                </div>
              </div>

              
 {/* Bottom Assessment Breakdown */}
              <div className="border rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold mb-4 text-gray-800">Assessment Breakdown</h3>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <FileQuestion size={16} className="text-[#0052CC]"/> MCQ Test
                    </h4>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Accuracy</p>
                        <p className="text-lg font-semibold text-gray-900">{report.breakdown.mcq.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Score</p>
                        <p className="text-lg font-semibold text-gray-900">{mcqCorrect} / {mcqTotal}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <MessageSquare size={16} className="text-[#0052CC]"/> Interview Average
                    </h4>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 uppercase">Overall Average</p>
                      <p className="text-lg font-semibold text-gray-900">{report.breakdown.interview.averageScore}%</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Proctoring + Chart */}
              <div className="grid grid-cols-3 gap-6">

                {/* Proctoring */}
                <div className="border rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <ShieldAlert size={18} className="text-amber-500" /> AI Proctoring
                  </h3>

                  <div className="space-y-4 text-sm mt-6">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-gray-600">Looked Away</span>
                      <span className="font-semibold bg-gray-100 px-2 py-1 rounded">{report?.breakdown?.proctoring?.lookingAwayCount || 0} times</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-gray-600">Multiple Faces</span>
                      <span className={`font-semibold px-2 py-1 rounded ${report?.breakdown?.proctoring?.multiplePeopleDetected ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {report?.breakdown?.proctoring?.multiplePeopleDetected ? 'Detected' : 'Clear'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone Status</span>
                      <span className={`font-semibold px-2 py-1 rounded ${report?.breakdown?.proctoring?.phoneDetected ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {report?.breakdown?.proctoring?.phoneDetected ? 'Detected' : 'Clear'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="col-span-2 border rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <BrainCircuit size={18} className="text-[#0052CC]"/> Interview Skills
                  </h3>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={interviewChartData}
                        layout="vertical"
                        margin={{ top: 10, right: 40, left: 60, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="skill" type="category" fontWeight={500} />
                        <Tooltip cursor={{fill: '#f3f4f6'}} />
                        <Bar dataKey="score" fill="#0052CC" barSize={22} radius={[0, 6, 6, 0]}>
                          <LabelList dataKey="score" position="right" formatter={(val) => `${val}%`} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

             
              
              {/* ✅ NEW: AI Insights & Recommendation */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-indigo-900">
                  <Sparkles size={18} className="text-indigo-600" /> AI Interview Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1 bg-white p-4 rounded-lg border border-indigo-50">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-indigo-400 mb-1">Recommendation</h4>
                    <p className="font-semibold text-indigo-900">
                      {report.breakdown?.interview?.recommendation}
                    </p>
                  </div>
                  <div className="md:col-span-3 bg-white p-4 rounded-lg border border-indigo-50">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-indigo-400 mb-1">Performance Summary</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {report.breakdown?.interview?.summary}
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">Failed to load data</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-white border shadow-sm hover:bg-gray-50 font-medium rounded-lg transition-colors">
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}