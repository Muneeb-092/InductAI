const questionService = require("../services/questionService");

exports.verifyAndGenerateQuestions = async (req, res) => {
  try {
    // 1. Destructure skills and experience from the body
    // Expecting experience to be a number (e.g., 3)
    const { skills, experience } = req.body;

    // 2. Validate Skills
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Please provide an array of skills." 
      });
    }

    // 3. Validate/Sanitize Experience
    // Default to 0 if not provided, or return error if you want it mandatory
    const years = experience !== undefined ? Number(experience) : 0;

    if (isNaN(years)) {
      return res.status(400).json({
        success: false,
        error: "Experience must be a valid number."
      });
    }

    // 4. Pass both skills and years to the service
    const result = await questionService.checkAndGenerateForSkills(skills, years);

    res.json({ 
      success: true, 
      message: `Question bank verification complete for ${years} years of experience.`, 
      data: result 
    });

  } catch (err) {
    console.error("Error in verifyAndGenerateQuestions:", err); 
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: err.message 
    });
  }
};