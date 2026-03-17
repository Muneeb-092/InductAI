const express = require("express");
const router = express.Router();

const interviewController = require("../controllers/ai_get_inter_ques_cont");

// SAVE ANSWER
router.post("/answer", interviewController.saveAnswer);

router.get(
  "/:sessionId/questions",
  interviewController.fetchInterviewQuestions
);

module.exports = router;