const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

// Endpoint to verify and generate questions if needed
router.post("/verify-bank", questionController.verifyAndGenerateQuestions);

module.exports = router;