const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController.js");

router.post("/", jobController.createJob);

module.exports = router;