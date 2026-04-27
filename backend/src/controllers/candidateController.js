const prisma = require("../config/db");

exports.getAllCandidates = async (req, res) => {
  try {
    const recruiterId = req.recruiter.id;

    const sessions = await prisma.assessmentSession.findMany({
      where: {
        job: {
          recruiterId: recruiterId,
        },
      },
      include: {
        job: true,
        candidate: true,
        mcqAttempt: true,
        interview: true,
        proctoringReport: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    let formattedCandidates = sessions.map((session) => {
      // ✅ MCQ Score
      const mcqScore = session.mcqAttempt?.score || 0;

      // ✅ Interview Scores
      const technicalScore = session.interview?.technicalScore || 0;

      const softSkillScore = session.interview
        ? (
            session.interview.communication +
            session.interview.teamwork +
            session.interview.leadership +
            session.interview.logicalThinking
          ) / 4
        : 0;

      // ✅ Interview Average (for AI score)
      const interviewAverage = session.interview
        ? (
            session.interview.technicalScore +
            session.interview.communication +
            session.interview.teamwork +
            session.interview.leadership +
            session.interview.logicalThinking
          ) / 5
        : 0;

      // ✅ AI Score
      const aiScore = (mcqScore * 0.4) + (interviewAverage * 0.6);

      // ✅ Trust Score
      let trustScore = 100;

      if (session.proctoringReport) {
        trustScore -= session.proctoringReport.lookingAwayCount * 2;

        if (session.proctoringReport.multiplePeopleDetected) trustScore -= 40;
        if (session.proctoringReport.phoneDetected) trustScore -= 50;
      }

      if (session.mcqAttempt?.status === "FLAGGED") trustScore -= 20;

      trustScore = Math.max(0, trustScore);

      // ✅ Final Score
      const overallScore = Number(((aiScore + trustScore) / 2).toFixed(1));

      const candidateName = session.candidate?.name || "Unknown";

      return {
        id: session.id.toString(),
        name: candidateName,
        email: session.candidate?.email || "N/A",
        avatar: `https://ui-avatars.com/api/?name=${candidateName}&background=random`,

        jobTitle: session.job?.title || "Unknown Job",

        // 🔥 ALL SCORES
        mcqScore: Math.round(mcqScore),
        technicalScore: Math.round(technicalScore),
        softSkillScore: Math.round(softSkillScore),
        overallScore,

        // 👇 Keep old field for dashboard compatibility
        score: overallScore,

        // Extra fields
        interviewDate: session.completedAt || session.startedAt,
        status: session.status,
      };
    });

    // ✅ Ranking (for reports page)
    formattedCandidates = formattedCandidates
      .sort((a, b) => b.overallScore - a.overallScore)
      .map((c, index) => ({
        ...c,
        rank: index + 1,
      }));

    res.status(200).json(formattedCandidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Failed to fetch candidates" });
  }
};