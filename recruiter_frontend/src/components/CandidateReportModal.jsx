import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle, Smartphone, Users, EyeOff, BrainCircuit, FileQuestion, MessageSquare, Award } from 'lucide-react';
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

  const aiScore = report ? parseFloat(report.overallScore) : 0;
  const trustScore = report ? parseFloat(report.trustScore) : 0;
  const finalCombinedScore = report ? ((aiScore + trustScore) / 2).toFixed(1) : 0;

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
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0052CC]"></div>
              <p className="mt-4 text-gray-500">Analyzing AI evaluations...</p>
            </div>
          ) : report ? (
            <div className="space-y-6">

              {/* Scores */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#0052CC] to-[#00B8D9] p-6 rounded-xl text-white flex justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Award size={18}/> Final Score
                    </h3>
                    <p className="text-sm text-blue-100">AI + Trust</p>
                  </div>
                  <div className="text-4xl font-bold">{finalCombinedScore}%</div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl flex justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900">AI Score</h3>
                    <p className="text-sm text-blue-700">Test + Interview</p>
                  </div>
                  <div className="text-3xl font-bold text-[#0052CC]">{report.overallScore}%</div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl flex justify-between">
                  <div>
                    <h3 className="font-semibold text-green-900">Trust Score</h3>
                    <p className="text-sm text-green-700">Proctoring AI</p>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{report.trustScore}%</div>
                </div>
              </div>

              {/* Proctoring + Chart */}
              <div className="grid grid-cols-3 gap-6">

                {/* Proctoring */}
                <div className="border rounded-xl p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <ShieldAlert size={18}/> AI Proctoring
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Looked Away</span>
                      <span>{report?.breakdown?.proctoring?.lookingAwayCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Multiple Faces</span>
                      <span>{report?.breakdown?.proctoring?.multiplePeopleDetected ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone</span>
                      <span>{report?.breakdown?.proctoring?.phoneDetected ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="col-span-2 border rounded-xl p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BrainCircuit size={18}/> Interview Skills
                  </h3>

                  {/* Bar Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={interviewChartData}
                        layout="vertical"
                        margin={{ top: 10, right: 40, left: 60, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="skill" type="category" />
                        <Tooltip />
                        <Bar dataKey="score" fill="#0052CC" barSize={22} radius={[0, 6, 6, 0]}>
                          <LabelList dataKey="score" position="right" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Progress Bars (Better readability) */}
                  <div className="mt-6 space-y-3">
                    {interviewChartData.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm">
                          <span>{item.skill}</span>
                          <span className="font-semibold">{item.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-[#0052CC] h-2 rounded-full"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="border rounded-xl p-5">
                <h3 className="font-semibold mb-4">Assessment Breakdown</h3>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">MCQ Test</h4>
                    <p className="text-sm mt-2">Accuracy: {report.breakdown.mcq.accuracy}%</p>
                    <p className="text-sm">Correct: {mcqCorrect}/{mcqTotal}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">Interview</h4>
                    <p className="text-sm mt-2">Average: {report.breakdown.interview.averageScore}</p>
                    <p className="text-sm">5 Metrics Evaluated</p>
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
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}