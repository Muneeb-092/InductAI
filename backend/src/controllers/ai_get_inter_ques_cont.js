const aiService = require("../services/ai_get_ques_service");

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
  fetchInterviewQuestions
};