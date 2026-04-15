const skillService = require("../services/skillServices");

exports.searchSkills = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query missing" });

    const skills = await skillService.searchSkills(q);
    res.json(skills);
  } catch (err) {
    console.error("Error in searchSkills:", err); // <-- log full error
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};