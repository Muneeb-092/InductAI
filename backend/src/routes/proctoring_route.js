// src/routes/proctoring_route.js
const express = require('express');
const router = express.Router();
const proctoringController = require('../controllers/proctoring_controller');

// Handle the POST request from the React webcam hook
router.post('/analyze-frame', proctoringController.analyzeFrame);

router.post('/start-session', proctoringController.startSession);

module.exports = router;