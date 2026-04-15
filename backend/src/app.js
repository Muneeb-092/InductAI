const express = require("express");
const cors = require("cors");
const skillRoutes = require("./routes/skillRoutes");
const interviewRoutes = require("./routes/ai_get_inter_ques_route");
const proctoringRoutes = require('./routes/proctoring_route');
const jobRoutes = require('./routes/jobRoutes');
const reportRoutes = require('./routes/reportRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. Specific Routes First
app.use("/api/jobs", jobRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/candidates", candidateRoutes);

// 3. General API Routes Last
app.use('/api', proctoringRoutes);

// 4. Test route
app.get("/", (req, res) => {
  res.send("AI Interview Backend Running");
});

module.exports = app;