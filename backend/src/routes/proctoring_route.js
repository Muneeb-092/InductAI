// src/routes/proctoring_route.js
const express = require('express');
const router = express.Router();
const proctoringController = require('../controllers/proctoring_controller');

// Handle the POST request from the React webcam hook
router.post('/analyze-frame', proctoringController.analyzeFrame);

router.post('/register-candidate', proctoringController.registerAndStartSession);

// NEW: The route to save the final report
router.post('/save-report', proctoringController.saveProctoringReport); 

module.exports = router;

module.exports = router;