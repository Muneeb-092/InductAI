const express = require("express");
const router = express.Router();

// We can just destructure all your controller functions nicely here
const { createJob, getTotalJobsCount, getTotalJobs, closeJob, deleteJob } = require("../controllers/jobController");

// Import the middleware
const { verifyToken } = require('../middleware/authMiddleware');

// EXACTLY 5 routes. Your original paths + the verifyToken security guard!
router.get("/count", verifyToken, getTotalJobsCount);
router.get("/totalJobs", verifyToken, getTotalJobs);
router.post("/", verifyToken, createJob);
router.patch("/:id/close", verifyToken, closeJob); 
router.delete("/:id", verifyToken, deleteJob);

module.exports = router;