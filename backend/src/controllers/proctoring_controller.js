// src/controllers/proctoring_controller.js
require('dotenv').config(); // 1. Ensure env vars are loaded instantly
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// 2. Create a standard Postgres connection pool using your .env URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// 3. Wrap it in the Prisma Adapter (The new Prisma 7 requirement)
const adapter = new PrismaPg(pool);

// 4. Initialize Prisma Client securely
const prisma = new PrismaClient({ adapter });

// src/controllers/proctoring_controller.js

exports.analyzeFrame = async (req, res) => {
  try {
    const { image, timestamp, sessionId } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // 1. Send the image to the Python ML Server
    const pythonResponse = await axios.post('http://127.0.0.1:8000/analyze', {
      image,
      timestamp,
      sessionId
    });

    const aiData = pythonResponse.data;

    // 2. NEW: We DO NOT save to Prisma here anymore! 
    // We just pass the raw Python results straight back to React.
    // React is now keeping track of the warnings in its memory state.
    res.status(200).json(aiData);

  } catch (error) {
    // If Python is offline or the image is broken, it will land here
    console.error("❌ [Node] analyzeFrame Error:", error.message);
    res.status(500).json({ error: "Failed to process frame" });
  }
};

// ==========================================
// ==========================================
// Register Candidate & Start Session
// ==========================================
exports.registerAndStartSession = async (req, res) => {
  try {
    const { fullName, email, phone, gender, age, qualification, experience, skills, jobId } = req.body;

    // Convert experience string (e.g., "1-2") to a number for Prisma
    const parsedExperience = parseInt(experience.split('-')[0]) || 0;

    // 1. Create the Candidate in the DB
    // Removed 'phone' to fix the Prisma crash, mapped the correct schema fields
    const newCandidate = await prisma.candidate.create({
      data: {
        name: fullName,
        email: email,
        education: qualification,
        experienceYears: parsedExperience
      }
    });

    // 2. Create the Assessment Session
    const newSession = await prisma.assessmentSession.create({
      data: {
        candidateId: newCandidate.id, 
        jobId: parseInt(jobId),             
        status: "STARTED"    
      } 
    });

    // 3. Attach Questions to this session
    // const availableQuestions = await prisma.questionBank.findMany({ take: 4 });
    // const sessionQuestionsData = availableQuestions.map((q, index) => ({
    //   sessionId: newSession.id,
    //   questionId: q.id,
    //   orderIndex: index
    // }));

    // await prisma.sessionQuestion.createMany({
    //   data: sessionQuestionsData
    // });

    console.log(`🎉 [Database] Candidate registered and Session #${newSession.id} created!`);
    
    // 4. Return the Session ID to the React Frontend
    res.status(200).json({ sessionId: newSession.id });

  } catch (error) {
    console.error("❌ [Node] Error registering candidate:", error);
    res.status(500).json({ 
      error: "Failed to register candidate and start session",
      details: error.message 
    });
  }
};
// ==========================================
// NEW: Save the final batched proctoring report
// ==========================================
exports.saveProctoringReport = async (req, res) => {
  try {
    const { 
      sessionId, 
      lookingAwayCount, 
      multiplePeopleDetected, 
      phoneDetected, 
      infractionTimeline 
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    // 1. Save the aggregated data to the new 1-to-1 table
    const report = await prisma.proctoringReport.create({
      data: {
        sessionId: parseInt(sessionId),
        lookingAwayCount: parseInt(lookingAwayCount) || 0,
        multiplePeopleDetected: Boolean(multiplePeopleDetected),
        phoneDetected: Boolean(phoneDetected),
        infractionTimeline: infractionTimeline || [] // Saves the array of exact timestamps
      }
    });

    console.log(`📊 [Database] Proctoring Report saved for Session #${sessionId}`);
    
    // 2. (Optional) You can also mark the AssessmentSession status as "COMPLETED" here!
    await prisma.assessmentSession.update({
      where: { id: parseInt(sessionId) },
      data: { status: "COMPLETED", completedAt: new Date() }
    });

    res.status(200).json({ success: true, data: report });

  } catch (error) {
    console.error("❌ [Node] Error saving proctoring report:", error.message);
    res.status(500).json({ error: "Failed to save proctoring report" });
  }
};