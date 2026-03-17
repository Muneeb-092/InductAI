const express = require("express");
const router = express.Router();

const interviewController = require("../controllers/ai_get_inter_ques_cont");

router.get(
  "/:sessionId/questions",
  interviewController.fetchInterviewQuestions
);

module.exports = router;