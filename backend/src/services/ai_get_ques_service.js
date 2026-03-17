const prisma = require("../config/db");

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
  getInterviewQuestions
};