const prisma = require("../config/db");

exports.getAllCandidates = async (req, res) => {
  try {
    const currentRecruiterId = 1; // Hardcoded until JWT is implemented

    // This single query does exactly what you described:
    // It finds all sessions where the linked Job belongs to the Recruiter,
    // and it pulls in the linked Candidate data!
    const sessions = await prisma.assessmentSession.findMany({
      where: {
        job: { 
          recruiterId: currentRecruiterId 
        }
      },
      include: {
        job: true,
        candidate: true, // <--- ADDED: This fetches the actual Candidate table row!
        mcqAttempt: true, 
        interview: true,
        proctoringReport: true 
      },
      orderBy: {
        id: 'desc' 
      }
    });

    const formattedCandidates = sessions.map(session => {
      // 1. Calculate MCQ Score
      const mcqScore = session.mcqAttempt ? session.mcqAttempt.score : 0;
      
      // 2. Calculate Interview Score
      let interviewAverage = 0;
      if (session.interview) {
        interviewAverage = (
          session.interview.technicalScore +
          session.interview.communication +
          session.interview.teamwork +
          session.interview.leadership +
          session.interview.logicalThinking
        ) / 5;
      }

      const aiScore = (mcqScore * 0.40) + (interviewAverage * 0.60);

      // 3. Calculate Trust Score
      let trustScore = 100;
      if (session.proctoringReport) {
        trustScore -= (session.proctoringReport.lookingAwayCount * 2);
        if (session.proctoringReport.multiplePeopleDetected) trustScore -= 40;
        if (session.proctoringReport.phoneDetected) trustScore -= 50;
      }
      if (session.mcqAttempt?.status === 'FLAGGED') trustScore -= 20;
      trustScore = Math.max(0, trustScore);

      const finalScore = ((aiScore + trustScore) / 2).toFixed(1);

      // 4. Safely extract the candidate's name from the new relation
      // If the name is stored as firstName/lastName in your schema, change this to:
      // `${session.candidate.firstName} ${session.candidate.lastName}`
      const candidateName = session.candidate ? session.candidate.name : "Unknown Candidate";

      return {
        id: session.id.toString(),
        name: candidateName, 
        jobTitle: session.job ? session.job.title : "Unknown Job",
        status: session.status || "Pending",
        score: finalScore,
        avatar: `https://ui-avatars.com/api/?name=${candidateName}&background=random`
      };
    });

    res.status(200).json(formattedCandidates);

  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Failed to fetch candidates" });
  }
};