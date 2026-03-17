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

exports.analyzeFrame = async (req, res) => {
  try {
    const { image, timestamp, sessionId } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Send the image to the Python ML Server
    const pythonResponse = await axios.post('http://127.0.0.1:8000/analyze', {
      image,
      timestamp,
      sessionId
    });

    const aiData = pythonResponse.data;

    // Log to Prisma ONLY if a warning is detected
    if (aiData.warning) {
      let currentEventType = "SUSPICIOUS_BEHAVIOR";
      let currentSeverity = "LOW";

      if (aiData.warning.includes("phone") || aiData.objectsDetected.includes("cell phone")) {
        currentEventType = "PHONE_DETECTED";
        currentSeverity = "CRITICAL";
      } else if (!aiData.singlePerson && aiData.faceDetected) {
        currentEventType = "MULTIPLE_PEOPLE";
        currentSeverity = "HIGH";
      } else if (!aiData.faceDetected) {
        currentEventType = "NO_FACE_DETECTED";
        currentSeverity = "MEDIUM";
      } else if (aiData.isLookingAway) {
        currentEventType = "LOOKING_AWAY";
        currentSeverity = "LOW";
      }

      // Save to your existing CheatingLog table
      await prisma.cheatingLog.create({
        data: {
          sessionId: parseInt(sessionId), 
          eventType: currentEventType,
          severity: currentSeverity,
          metadata: aiData, 
        }
      });

      console.log(`📝 [Database] Logged ${currentEventType} (${currentSeverity}) for Session ${sessionId}`);
    }

    // Send AI results back to React
    res.status(200).json(aiData);

  } catch (error) {
    console.error("❌ [Node] Error:", error.message);
    res.status(500).json({ error: "Failed to process frame" });
  }
};