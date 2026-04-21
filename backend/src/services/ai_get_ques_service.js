const prisma = require("../config/db");

const saveInterviewAnswer = async (sessionId, questionId, answerText) => {
// =========================================================
  // 1. Check if interview exists
  let interview = await prisma.interview.findUnique({
    where: {
      sessionId: parseInt(sessionId)
    }
  });

  // 2. If not, create it
  if (!interview) {
    interview = await prisma.interview.create({
      data: {
        sessionId: parseInt(sessionId),
        transcript: "",
        videoUrl: "",
        technicalScore: 0,
        communication: 0,
        teamwork: 0,
        leadership: 0,
        logicalThinking: 0
      }
    });
  }

  // 3. Save answer
  const savedAnswer = await prisma.interviewAnswer.create({
    data: {
      interviewId: interview.id,
      questionId: parseInt(questionId),
      answerText,
      aiScore: 0
    }
  });

  return savedAnswer;
};

// =========================================================
const getInterviewQuestions = async (sessionId) => {
  let questions = await prisma.sessionQuestion.findMany({
    where: {
      sessionId: parseInt(sessionId)
    },
    orderBy: {
      orderIndex: "desc" // 🔥 Start from the highest order index (the end)
    },
    take: 10, // 🔥 Only grab the last 10 records
    include: {
      question: true
    }
  });

  // 🛡️ NEW: Don't fail silently! Throw an error if it's empty.
  if (!questions || questions.length === 0) {
    throw new Error(`No session questions found for sessionId: ${sessionId}`);
  }

  // 🔥 Reverse the array so the questions flow in standard ascending order
  questions.reverse();

  return questions.map((q) => ({
    id: q.question.id,
    text: q.question.text
  }));
};

module.exports = {
  getInterviewQuestions,
  saveInterviewAnswer
};