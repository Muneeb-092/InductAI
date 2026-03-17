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

  const questions = await prisma.sessionQuestion.findMany({
    where: {
      sessionId: parseInt(sessionId)
    },
    orderBy: {
      orderIndex: "asc"
    },
    include: {
      question: true
    }
  });

  return questions.map((q) => ({
    id: q.question.id,
    text: q.question.text
  }));
};

module.exports = {
  getInterviewQuestions,
  saveInterviewAnswer
};