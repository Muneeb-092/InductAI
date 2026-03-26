const jobService = require("../services/jobService.js");
const prisma = require("../config/db");

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
exports.getTotalJobsCount = async (req, res) => {
  try {
    const currentRecruiterId = 1; // Hardcoded for now until we add JWT

    // 1. Count ALL jobs for this recruiter
    const totalJobs = await prisma.job.count({
      where: { recruiterId: currentRecruiterId },
    });

    // 2. Count ONLY ACTIVE jobs for this recruiter
    const activeJobs = await prisma.job.count({
      where: {
        recruiterId: currentRecruiterId,
        status: "ACTIVE", // We filter by our brand new column!
      },
    });
    
    // Send both numbers back to the frontend
    res.status(200).json({ 
      total: totalJobs, 
      active: activeJobs 
    });
    
  } catch (error) {
    console.error("Error fetching job stats:", error);
    res.status(500).json({ message: "Failed to fetch job stats" });
  }
};