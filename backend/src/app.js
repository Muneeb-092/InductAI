const express = require("express");
const cors = require("cors");

const interviewRoutes = require("./routes/ai_get_inter_ques_route");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/interview", interviewRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("AI Interview Backend Running");
});

module.exports = app;