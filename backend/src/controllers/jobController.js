const jobService = require("../services/jobService.js");
const prisma = require("../config/db");

exports.createJob = async (req, res) => {
  try {
    
    const recruiterId = req.recruiter.id;

    // 1. Create the job first so PostgreSQL assigns it an ID
    const job = await jobService.createJob({
      ...req.body,
      recruiterId,
    });

    // 2. Generate the link using the brand new ID
    const jobLink = `http://localhost:3000/apply/${job.id}`;

    // 3. Update the job in the database to save the link
    const updatedJob = await prisma.job.update({
      where: { id: job.id },
      data: { jobLink: jobLink }, // Saving it to the jobLink column!
    });

    res.status(201).json({
      success: true,
      data: { 
        job: updatedJob, // Send back the updated job that includes the link
        jobLink 
      },
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
exports.getTotalJobs = async (req, res) => {
  try {
    const currentRecruiterId = req.recruiter.id;

    const allJobs = await prisma.job.findMany({
      where: {
        recruiterId: currentRecruiterId, 
        status: {
          not: "ARCHIVED" 
        }
      },
      // 1. NEW: Include the session statuses so we can count them
      include: {
        sessions: {
          select: {
            status: true 
          }
        }
      },
      orderBy: {
        createdAt: 'desc' 
      }
    });

    // 2. NEW: Map through the jobs and calculate the exact metrics for the table
    const formattedJobs = allJobs.map((job) => {
      
      // Tested: Anyone who at least finished the MCQ
      const candidatesTested = job.sessions.filter(session => 
        ["MCQ_COMPLETED", "INTERVIEW_COMPLETED", "COMPLETED"].includes(session.status)
      ).length;

      // Interviewed: Anyone who reached the Interview stage or finished completely
      const candidatesInterviewed = job.sessions.filter(session => 
        ["INTERVIEW_COMPLETED", "COMPLETED"].includes(session.status)
      ).length;

      // Format the date for the "Created On" column (e.g., "Mar 29, 2026")
      const createdOnDate = new Intl.DateTimeFormat('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }).format(new Date(job.createdAt));

      // Return the clean object
      return {
        id: job.id,
        title: job.title,
        jobType: job.jobType,
        status: job.status,
        createdOn: createdOnDate,
        jobLink: job.jobLink,
        candidatesTested: candidatesTested,
        candidatesInterviewed: candidatesInterviewed,
        description: job.description,
        experience: job.experience,
        gender: job.gender,
        minAge: job.minAge,
        maxAge: job.maxAge,
        createdAt: job.createdAt
      };
    });

    // 3. Return your formatted array inside the data object
    res.status(200).json({ 
      success: true, 
      data: formattedJobs 
    });
    
  } catch (error) {
    console.error("Error fetching job listing:", error);
    res.status(500).json({ message: "Failed to fetch job listing stats" });
  }
};
exports.getTotalJobsCount = async (req, res) => {
  try {
    const currentRecruiterId = req.recruiter.id;
    
    // 1. Total Jobs
    const totalJobs = await prisma.job.count({
      where: { 
        recruiterId: currentRecruiterId,
        status: {
          not: "ARCHIVED" 
        }
      },
    });

    // 2. Active Jobs
    const activeJobs = await prisma.job.count({
      where: {
        recruiterId: currentRecruiterId,
        status: "ACTIVE", 
      },
    });

    // 3. Reports Generated (All sessions, regardless of if they finished)
    const totalReports = await prisma.assessmentSession.count({
      where: {
        job: { recruiterId: currentRecruiterId },
        status: "COMPLETED"
      }
    });

    // 4. NEW: Total Interviews (ONLY completed sessions)
    const totalInterviews = await prisma.assessmentSession.count({
      where: {
        status: "COMPLETED", // Filtering by the completed status!
        job: { recruiterId: currentRecruiterId }
      }
    });
    
    // Send all four numbers back!
    res.status(200).json({ 
      total: totalJobs, 
      active: activeJobs,
      reports: totalReports,
      interviews: totalInterviews // Added the final metric
    });
    
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
// --- CLOSE JOB ---
exports.closeJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);

    // Update the status column to "CLOSED"
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status: "CLOSED" },
    });

    res.status(200).json({ success: true, data: updatedJob });
  } catch (error) {
    console.error("Error closing job:", error);
    res.status(500).json({ success: false, message: "Failed to close job" });
  }
};

// --- DELETE JOB ---
// --- "SOFT DELETE" (ARCHIVE) JOB ---
exports.deleteJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);

    // Instead of deleting the row and the skills, we simply update the status.
    // This perfectly preserves all candidate data, assessment sessions, and skills!
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "ARCHIVED" },
    });

    res.status(200).json({ 
      success: true, 
      message: "Job successfully archived" 
    });
  } catch (error) {
    console.error("Error archiving job:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to archive job" 
    });
  }
};

// --- GET SINGLE JOB BY ID (Public for Candidates) ---
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        // We include recruiter to show the Company Name (organization)
        recruiter: {
          select: {
            organization: true,
          },
        },
        // We include skills so the candidate knows what they are being tested on
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error("Error fetching single job:", error);
    res.status(500).json({ success: false, message: "Server error fetching job details" });
  }
};