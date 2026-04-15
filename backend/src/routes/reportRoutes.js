const express = require("express");
const router = express.Router();
const { generateCandidateReport } = require("../controllers/reportController");

// GET /api/reports/:sessionId
router.get("/:sessionId", generateCandidateReport);

module.exports = router;