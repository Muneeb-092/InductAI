const jobService = require("../services/jobService.js");

exports.createJob = async (req, res) => {
  try {
    const recruiterId = 1; // Replace with real auth later

    const job = await jobService.createJob({
      ...req.body,
      recruiterId,
    });

    // Generate link
    const jobLink = `https://inductai.com/apply/job-${job.id}`;

    res.status(201).json({
      success: true,
      data: { job, jobLink },
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};