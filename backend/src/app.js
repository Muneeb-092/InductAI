const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const skillRoutes = require("./routes/skillRoutes");
const interviewRoutes = require("./routes/ai_get_inter_ques_route");
const proctoringRoutes = require('./routes/proctoring_route');
const jobRoutes = require('./routes/jobRoutes');
const questionRoutes = require('./routes/questionRoutes');
dotenv.config();

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 2. Specific Routes First
app.use("/api/jobs", jobRoutes);
app.use('/api/questions', questionRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/interview", interviewRoutes);

// 3. General API Routes Last
app.use('/api', proctoringRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is humming along on port ${PORT}`);
});

// 4. Test route
app.get("/", (req, res) => {
  res.send("AI Interview Backend Running");
});

module.exports = app;