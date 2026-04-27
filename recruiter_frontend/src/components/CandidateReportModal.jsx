import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, MessageSquare, Award, BrainCircuit, FileQuestion, Sparkles } from 'lucide-react';
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

  const interviewChartData = report ? [
    { skill: 'Technical', score: report?.breakdown?.interview?.metrics?.technical || 0 },
    { skill: 'Communication', score: report?.breakdown?.interview?.metrics?.communication || 0 },
    { skill: 'Teamwork', score: report?.breakdown?.interview?.metrics?.teamwork || 0 },
    { skill: 'Leadership', score: report?.breakdown?.interview?.metrics?.leadership || 0 },
    { skill: 'Logical', score: report?.breakdown?.interview?.metrics?.logicalThinking || 0 },
  ] : [];

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
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{candidateName}'s AI Report</h2>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={22} />
          </button>
        </div>

        <div style={styles.body}>
          {loading ? (
            <div style={styles.loaderWrap}>
              <div style={styles.loader}></div>
              <p>Analyzing AI evaluations...</p>
            </div>
          ) : report ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Scores */}
              <div style={styles.scoreGrid}>
                <div style={styles.mainScore}>
                  <div>
                    <h3 style={styles.scoreTitle}><Award size={16}/> Final Score</h3>
                    <p style={styles.scoreSub}>AI + Trust</p>
                  </div>
                  <div style={styles.bigScore}>{finalCombinedScore}%</div>
                </div>

                <div style={styles.card}>
                  <p>AI Score</p>
                  <strong>{aiScore}%</strong>
                </div>

                <div style={styles.card}>
                  <p>Trust Score</p>
                  <strong>{trustScore}%</strong>
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
              <div style={styles.gridWide}>

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

                {/* ✅ FIXED FULL WIDTH CHART */}
                <div style={styles.chartBox}>
                  <h3 style={styles.boxTitle}><BrainCircuit size={16}/> Interview Skills</h3>

                  <div style={{ width: "100%", height: "280px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={interviewChartData}
                        layout="vertical"
                        margin={{ top: 10, right: 10, left: 40, bottom: 10 }} // ✅ FIXED
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="skill" type="category" width={120} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#2563eb" barSize={26} radius={[0, 6, 6, 0]}>
                          <LabelList dataKey="score" position="right" formatter={(v) => `${v}%`} />
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
              
            {/* ✅ FIXED TRANSCRIPT (NO DOCKING FEEL) */}
              <div className="bg-white border rounded-xl p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare size={18}/> Interview Transcript
                </h3>

                <div className="space-y-5">
                  {report.breakdown.interview.transcript?.map((item, i) => (
                    <div key={i} className="border-b pb-4 last:border-0">

                      <p className="text-xs text-gray-500 font-semibold">
                        Question {item.questionNumber}
                      </p>

                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {item.question}
                      </p>

                      <div className="mt-2 bg-gray-50 p-3 rounded-lg border">
                        <p className="text-sm text-gray-700">{item.answer}</p>

                        <div className="mt-2 text-right">
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700">
                            AI Score: {item.aiScore}%
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>Failed to load data</div>
          )}
        </div>


          
        {/* Footer */}
        <div style={styles.footer}>
          <button onClick={onClose} style={styles.footerBtn}>Close</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 50
  },

  modal: {
    background: "#fff",
    width: "100%",
    maxWidth: "1100px",
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh"
  },

  header: {
    padding: "20px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between"
  },

  title: { fontSize: "20px", fontWeight: 600 },
  sub: { fontSize: "12px", color: "#777" },

  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer"
  },

  body: {
    padding: "20px",
    overflowY: "auto"
  },

  loaderWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px"
  },

  loader: {
    width: "40px",
    height: "40px",
    border: "3px solid #ddd",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  scoreGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: "16px"
  },

  mainScore: {
    background: "linear-gradient(135deg,#2563eb,#06b6d4)",
    color: "#fff",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between"
  },

  scoreTitle: {
    display: "flex",
    gap: "6px",
    alignItems: "center"
  },

  scoreSub: { fontSize: "12px", opacity: 0.8 },

  bigScore: { fontSize: "36px", fontWeight: 700 },

  card: {
    padding: "16px",
    border: "1px solid #eee",
    borderRadius: "12px"
  },

  gridWide: {
    display: "grid",
    gridTemplateColumns: "1fr 2.5fr", // ✅ more width to chart
    gap: "20px"
  },

  box: {
    border: "1px solid #eee",
    padding: "16px",
    borderRadius: "12px"
  },

  chartBox: {
    border: "1px solid #eee",
    padding: "16px",
    borderRadius: "12px",
    width: "100%"
  },

  boxTitle: {
    fontWeight: 600,
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },

  insightBox: {
    border: "1px solid #eee",
    padding: "16px",
    borderRadius: "12px",
    background: "#fafafa"
  },

  footer: {
    padding: "12px",
    borderTop: "1px solid #eee",
    textAlign: "right"
  },

  footerBtn: {
    padding: "8px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer"
  }
};