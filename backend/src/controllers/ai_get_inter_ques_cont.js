const aiService = require("../services/ai_get_ques_service");
const interviewService = require("../services/ai_get_ques_service");

/////////////////////////////////////////////////////
const saveAnswer = async (req, res) => {
  try {

    const { sessionId, questionId, answerText } = req.body;

    const result = await interviewService.saveInterviewAnswer(
      sessionId,
      questionId,
      answerText
    );

    res.status(201).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//////////////////////////////////////////////////////



const fetchInterviewQuestions = async (req, res) => {
  try {

    const { sessionId } = req.params;

    const questions = await aiService.getInterviewQuestions(sessionId);

    res.status(200).json({
      success: true,
      data: questions
    });

  } catch (error) {

    console.error("Error fetching questions:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interview questions"
    });

  }
};

module.exports = {
  fetchInterviewQuestions,
  saveAnswer
};