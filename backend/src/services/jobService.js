const prisma  = require("../config/db");

exports.createJob = async (jobData) => {
  const {
    title,
    description,
    experience,
    jobType,
    gender,
    minAge,
    maxAge,
    recruiterId,
    skills = [], // [{id, name, importance}]
  } = jobData;

  // 1. Create the job
  const job = await prisma.job.create({
    data: {
      title,
      description,
      experience: Number(experience),
      jobType,
      gender: gender || "any",
      minAge: minAge ? Number(minAge) : null,
      maxAge: maxAge ? Number(maxAge) : null,
      recruiterId,
    },
  });

  // 2. Map skills to only use skillId & importance
  if (skills.length > 0) {
    const skillData = skills.map((s) => ({
      jobId: job.id,
      skillId: s.id,          // <-- Important: must be `id` from frontend
      importance: (s.importance || "CORE").toUpperCase(),
    }));

    await prisma.jobSkill.createMany({
      data: skillData,
    });
  }

  return job; // return the job so controller can generate link
};