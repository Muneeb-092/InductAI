const prisma = require("../config/db");

exports.generateCandidateReport = async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
  
      // 1. Fetch all data for this session
      const mcqData = await prisma.mCQAttempt.findUnique({
        where: { sessionId: sessionId },
        include: { answers: true },
      });
  
      const interviewData = await prisma.interview.findUnique({
        where: { sessionId: sessionId },
        include: { answers: true },
      });
  
      // FETCH THE NEW PROCTORING MODEL
      const proctoringData = await prisma.proctoringReport.findUnique({
        where: { sessionId: sessionId }
      });
  
      if (!mcqData && !interviewData) {
        return res.status(404).json({ message: "No assessment data found." });
      }
  
      // 2. Calculate MCQ Metrics
      const mcqScore = mcqData ? mcqData.score : 0;
      const totalMCQAnswered = mcqData ? mcqData.answers.length : 0;
      const correctMCQAnswers = mcqData ? mcqData.answers.filter(a => a.isCorrect).length : 0;
  
      // 3. Calculate Interview Metrics
      let interviewAverage = 0;
      if (interviewData) {
        interviewAverage = (
          interviewData.technicalScore +
          interviewData.communication +
          interviewData.teamwork +
          interviewData.leadership +
          interviewData.logicalThinking
        ) / 5;
      }
  
      // 4. Calculate Final Overall Score (40% MCQ, 60% Interview)
      const finalScore = (mcqScore * 0.40) + (interviewAverage * 0.60);
  
      // ---------------------------------------------------------
      // 5. CALCULATE THE AI TRUST SCORE (UPDATED FOR NEW SCHEMA)
      // ---------------------------------------------------------
      let trustScore = 100; // Start with perfect trust
  
      if (proctoringData) {
        // Minor Deduction: Looked away (-2 points per glance)
        trustScore -= (proctoringData.lookingAwayCount * 2);
  
        // Severe Deduction: Multiple people detected
        if (proctoringData.multiplePeopleDetected) {
           trustScore -= 40; 
        }
  
        // Critical Deduction: Mobile phone detected
        if (proctoringData.phoneDetected) {
           trustScore -= 50; 
        }
      }
  
      // Also deduct if the MCQ itself flagged them for tab-switching
      if (mcqData?.status === 'FLAGGED') {
        trustScore -= 20; 
      }
  
      // Prevent the score from going below 0%
      trustScore = Math.max(0, trustScore);
  
      // 6. Assemble the final JSON report with the updated schema fields
      const report = {
        sessionId: sessionId,
        overallScore: finalScore.toFixed(1),
        trustScore: trustScore,
        breakdown: {
          proctoring: {
            lookingAwayCount: proctoringData?.lookingAwayCount || 0,
            multiplePeopleDetected: proctoringData?.multiplePeopleDetected || false,
            phoneDetected: proctoringData?.phoneDetected || false,
            // Safely pass the JSON array to the frontend
            infractionTimeline: proctoringData?.infractionTimeline || [] 
          },
          mcq: {
            score: mcqScore,
            accuracy: totalMCQAnswered > 0 ? Math.round((correctMCQAnswers / totalMCQAnswered) * 100) : 0,
            totalQuestions: totalMCQAnswered
          },
          interview: {
            averageScore: interviewAverage.toFixed(1),
            metrics: {
              technical: interviewData?.technicalScore || 0,
              communication: interviewData?.communication || 0,
              teamwork: interviewData?.teamwork || 0,
              leadership: interviewData?.leadership || 0,
              logicalThinking: interviewData?.logicalThinking || 0,
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