const express = require("express");
const cors = require("cors");

const interviewRoutes = require("./routes/ai_get_inter_ques_route");
const proctoringRoutes = require('./routes/proctoring_route');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use("/api/interview", interviewRoutes);
app.use('/api', proctoringRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("AI Interview Backend Running");
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));



module.exports = app;