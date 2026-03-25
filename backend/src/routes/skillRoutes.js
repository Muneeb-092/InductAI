const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skillController");

router.get("/search", skillController.searchSkills);

module.exports = router;