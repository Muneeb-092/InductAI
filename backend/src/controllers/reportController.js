const prisma = require("../config/db");

exports.generateCandidateReport = async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);

    // =========================
    // 1. MCQ DATA
    // =========================
    const mcqData = await prisma.mCQAttempt.findUnique({
      where: { sessionId },
      include: { answers: true },
    });

    // =========================
    // 2. SESSION (SOURCE OF TRUTH)
    // =========================
    const session = await prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      include: {
        interview: true
      }
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const interviewData = session.interview;

    // =========================
    // 3. PROCTORING
    // =========================
    const proctoringData = await prisma.proctoringReport.findUnique({
      where: { sessionId },
    });

    // =========================
    // 4. AI REPORT
    // =========================
    const reportData = await prisma.report.findUnique({
      where: { sessionId },
    });

    // =========================
    // 5. SCORES
    // =========================
    const mcqScore = mcqData?.score || 0;
    const totalMCQAnswered = mcqData?.answers?.length || 0;
    const correctMCQAnswers =
      mcqData?.answers?.filter((a) => a.isCorrect).length || 0;

    let interviewAverage = 0;

    if (interviewData) {
      interviewAverage =
        (
          (interviewData.technicalScore || 0) +
          (interviewData.communication || 0) +
          (interviewData.teamwork || 0) +
          (interviewData.leadership || 0) +
          (interviewData.logicalThinking || 0)
        ) / 5;
    }

    const finalScore = Math.round(mcqScore * 0.4 + interviewAverage * 0.6);

    // =========================
    // 6. TRUST SCORE
    // =========================
    let trustScore = 100;

    if (proctoringData) {
      trustScore -= proctoringData.lookingAwayCount * 2;
      if (proctoringData.multiplePeopleDetected) trustScore -= 40;
      if (proctoringData.phoneDetected) trustScore -= 50;
    }

    if (mcqData?.status === "FLAGGED") {
      trustScore -= 20;
    }

    trustScore = Math.max(0, Math.round(trustScore));

    // =========================
    // 7. SESSION QUESTIONS (ONLY SOURCE OF TRUTH)
    // =========================
    const sessionQuestions = await prisma.sessionQuestion.findMany({
  where: { 
    sessionId,
    question: {
      questionType: "INTERVIEW"
    }
  },
  include: {
    question: true,
  },
  orderBy: {
    orderIndex: "asc",
  },
});
    
    // =========================
    // 8. INTERVIEW ANSWERS (FILTERED STRICTLY)
    // =========================
    const interviewAnswers = interviewData
      ? await prisma.interviewAnswer.findMany({
          where: {
            interviewId: interviewData.id,
          },
        })
      : [];

    // Map answers by questionId
    const answerMap = new Map();
    interviewAnswers.forEach((ans) => {
      answerMap.set(ans.questionId, ans);
    });

    // =========================
    // 9. FINAL TRANSCRIPT (FIXED)
    // =========================
    const transcript = sessionQuestions.map((sq, index) => {
      const ans = answerMap.get(sq.questionId);

      return {
        questionNumber: index + 1,
        questionId: sq.questionId,
        question: sq.question.text,

        answer: ans?.answerText || "No answer provided",
        aiScore: Math.round(ans?.aiScore || 0),
      };
    });

    // =========================
    // 10. RESPONSE
    // =========================
    const report = {
      sessionId,
      overallScore: finalScore,
      trustScore,

      breakdown: {
        proctoring: {
          lookingAwayCount: proctoringData?.lookingAwayCount || 0,
          multiplePeopleDetected:
            proctoringData?.multiplePeopleDetected || false,
          phoneDetected: proctoringData?.phoneDetected || false,
          infractionTimeline:
            proctoringData?.infractionTimeline || [],
        },

        mcq: {
          score: Math.round(mcqScore),
          accuracy:
            totalMCQAnswered > 0
              ? Math.round(
                  (correctMCQAnswers / totalMCQAnswered) * 100
                )
              : 0,
          totalQuestions: totalMCQAnswered,
        },

        interview: {
          averageScore: Math.round(interviewAverage),
          summary:
            reportData?.summary || "No AI summary available.",
          recommendation:
            reportData?.recommendation || "Pending Review",

          metrics: {
            technical: Math.round(
              interviewData?.technicalScore || 0
            ),
            communication: Math.round(
              interviewData?.communication || 0
            ),
            teamwork: Math.round(
              interviewData?.teamwork || 0
            ),
            leadership: Math.round(
              interviewData?.leadership || 0
            ),
            logicalThinking: Math.round(
              interviewData?.logicalThinking || 0
            ),
          },

          // ✅ FINAL CLEAN TRANSCRIPT
          transcript,
        },
      },
    };

    return res.status(200).json(report);

  } catch (error) {
    console.error("Error generating report:", error);
    return res.status(500).json({
      message: "Failed to generate candidate report",
    });
  }
};