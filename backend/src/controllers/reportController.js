// Inside your controller file
const prisma = require("../config/db");

exports.generateCandidateReport = async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);

    // 1. Fetch all assessment data
    const mcqData = await prisma.mCQAttempt.findUnique({
      where: { sessionId: sessionId },
      include: { answers: true },
    });

    const interviewData = await prisma.interview.findUnique({
      where: { sessionId: sessionId },
      include: { answers: true },
    });

    const proctoringData = await prisma.proctoringReport.findUnique({
      where: { sessionId: sessionId }
    });

    // 2. FETCH FROM THE REPORT TABLE (Where your summary is saved)
    const reportData = await prisma.report.findUnique({
      where: { sessionId: sessionId }
    });

    if (!mcqData && !interviewData) {
      return res.status(404).json({ message: "No assessment data found." });
    }

    // 3. Calculate Scores
    const mcqScore = mcqData ? mcqData.score : 0;
    const totalMCQAnswered = mcqData ? mcqData.answers.length : 0;
    const correctMCQAnswers = mcqData ? mcqData.answers.filter(a => a.isCorrect).length : 0;

    let interviewAverage = 0;
    if (interviewData) {
      interviewAverage = (
        (interviewData.technicalScore || 0) +
        (interviewData.communication || 0) +
        (interviewData.teamwork || 0) +
        (interviewData.leadership || 0) +
        (interviewData.logicalThinking || 0)
      ) / 5;
    }

    const finalScore = Math.round((mcqScore * 0.40) + (interviewAverage * 0.60));

    // 4. Calculate Trust Score
    let trustScore = 100;
    if (proctoringData) {
      trustScore -= (proctoringData.lookingAwayCount * 2);
      if (proctoringData.multiplePeopleDetected) trustScore -= 40; 
      if (proctoringData.phoneDetected) trustScore -= 50; 
    }
    if (mcqData?.status === 'FLAGGED') {
      trustScore -= 20; 
    }
    trustScore = Math.round(Math.max(0, trustScore));

    // 5. Assemble JSON (Pulling summary & recommendation from reportData)
    const report = {
      sessionId: sessionId,
      overallScore: finalScore,
      trustScore: trustScore,
      breakdown: {
        proctoring: {
          lookingAwayCount: proctoringData?.lookingAwayCount || 0,
          multiplePeopleDetected: proctoringData?.multiplePeopleDetected || false,
          phoneDetected: proctoringData?.phoneDetected || false,
          infractionTimeline: proctoringData?.infractionTimeline || [] 
        },
        mcq: {
          score: Math.round(mcqScore),
          accuracy: totalMCQAnswered > 0 ? Math.round((correctMCQAnswers / totalMCQAnswered) * 100) : 0,
          totalQuestions: totalMCQAnswered
        },
        interview: {
          averageScore: Math.round(interviewAverage),
          // ✅ FETCHING FROM THE REPORT TABLE NOW
          summary: reportData?.summary || "No AI summary available.",
          recommendation: reportData?.recommendation || "Pending Review",
          metrics: {
            technical: Math.round(interviewData?.technicalScore || 0),
            communication: Math.round(interviewData?.communication || 0),
            teamwork: Math.round(interviewData?.teamwork || 0),
            leadership: Math.round(interviewData?.leadership || 0),
            logicalThinking: Math.round(interviewData?.logicalThinking || 0),
          }
        }
      }
    };

    res.status(200).json(report);

  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Failed to generate candidate report" });
  }
};