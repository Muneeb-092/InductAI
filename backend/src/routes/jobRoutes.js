const express = require("express");
const router = express.Router();
const { createJob, getTotalJobsCount, getTotalJobs, closeJob, deleteJob } = require("../controllers/jobController");
const jobController = require("../controllers/jobController.js");

router.get("/count", getTotalJobsCount);
router.get("/totalJobs", getTotalJobs);
router.post("/", jobController.createJob);
router.patch("/:id/close", closeJob); // PATCH is best practice for updating a single field
router.delete("/:id", deleteJob);

module.exports = router;