const sessionService = require("../services/sessionService");

exports.generateSessionQuestions = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID missing" });
    }

    const result = await sessionService.generateSessionQuestions(sessionId);

    res.json({
      message: "Session questions generated successfully",
      totalQuestions: result.length,
    });
  } catch (err) {
    console.error("Error in generateSessionQuestions:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.getMCQQuestions = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const questions = await sessionService.getMCQQuestions(sessionId);

    res.json(questions);
  } catch (err) {
    console.error("Error fetching MCQs:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.submitMCQAnswers = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answers } = req.body; 

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID missing" });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers must be an array" });
    }

    const result = await sessionService.submitMCQAnswers(sessionId, answers);

    res.json({
      message: "MCQ answers submitted and evaluated successfully",
      score: result.score,
    });
  } catch (err) {
    console.error("Error submitting MCQs:", err);
    // If they already submitted, we catch the error here and send a 400
    if (err.message.includes("already submitted")) {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};



// controllers/sessionController.js
exports.evaluateInterview = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const report = await sessionService.evaluateInterviewAndGenerateReport(sessionId);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    // THIS LINE IS CRITICAL:
    console.error("DETAILED ERROR:", error); 
    
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      debug: error.message // Temporarily send this to Postman to see the real issue
    });
  }
};