const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

// Fill session questions
router.post("/:sessionId", sessionController.generateSessionQuestions);

// routes/sessionRoute.js
router.get("/:sessionId/mcq", sessionController.getMCQQuestions);
router.post("/:sessionId/mcq/submit", sessionController.submitMCQAnswers);

module.exports = router;