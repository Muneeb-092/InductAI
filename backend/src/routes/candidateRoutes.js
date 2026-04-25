const express = require("express");
const router = express.Router();
const { getAllCandidates } = require("../controllers/candidateController");
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllCandidates);

module.exports = router;