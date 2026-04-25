const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const skillRoutes = require("./routes/skillRoutes");
const interviewRoutes = require("./routes/ai_get_inter_ques_route");
const proctoringRoutes = require('./routes/proctoring_route');
const jobRoutes = require('./routes/jobRoutes');
const questionRoutes = require('./routes/questionRoutes');
const authController = require('./controllers/authController');
dotenv.config();
const reportRoutes = require('./routes/reportRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const sessionRoutes = require('./routes/sessionRoute');


const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. Specific Routes First
app.use("/api/jobs", jobRoutes);
app.use('/api/questions', questionRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/generate", sessionRoutes);
app.use("/api/getMCQs", sessionRoutes);
app.use("/api/session", sessionRoutes);

// 3. General API Routes Last
app.use('/api', proctoringRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is humming along on port ${PORT}`);
});

// 4. Test route
app.get("/", (req, res) => {
  res.send("AI Interview Backend Running");
});
app.post('/api/auth/register', authController.registerRecruiter);
app.post('/api/auth/login', authController.loginRecruiter);
module.exports = app;