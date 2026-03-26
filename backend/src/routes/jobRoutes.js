const express = require("express");
const router = express.Router();
const { createJob, getTotalJobsCount } = require("../controllers/jobController");
const jobController = require("../controllers/jobController.js");

router.get("/count", getTotalJobsCount);
router.post("/", jobController.createJob);

module.exports = router;