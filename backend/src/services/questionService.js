const prisma = require("../config/db");
const geminiService = require("./geminiService");

const MIN_QUESTIONS = 20; 
const MONTHS_VALID = 6;

// Define your constant Core Skills
const CORE_SKILL_NAMES = ["Communication", "Leadership"];

// Helper to map years to Enum
const getExperienceLevel = (years) => {
  if (years <= 1) return "BEGINNER";
  if (years <= 5) return "INTERMEDIATE";
  return "ADVANCED"; 
};

exports.checkAndGenerateForSkills = async (userSkills, yearsOfExperience = 0) => {
  const MonthsAgo = new Date();
  MonthsAgo.setMonth(MonthsAgo.getMonth() - MONTHS_VALID);

  const level = getExperienceLevel(yearsOfExperience);

  try {
    // 1. Fetch the actual Skill objects for the Core Skills from your DB
    // We need their IDs and Types to maintain database integrity
    const coreSkillsFromDb = await prisma.skill.findMany({
      where: {
        name: { in: CORE_SKILL_NAMES }
      }
    });

    // 2. Merge user-provided skills with core skills
    // We use a Map or Set approach if you want to ensure no duplicates
    const allSkills = [...userSkills, ...coreSkillsFromDb];

    for (const skill of allSkills) {
      console.log(`--- Checking Skill: ${skill.name} ---`);

      // 3. Check DB for enough recent questions
      const count = await prisma.questionBank.count({
        where: {
          skillId: skill.id,
          isActive: true,
          createdAt: { gte: MonthsAgo }
        }
      });

      if (count >= MIN_QUESTIONS) {
        console.log(`${skill.name} has enough questions (${count}). Skipping...`);
        continue; 
      }

      console.log(`${skill.name} needs update (Current: ${count})`);

      try {
        // 4. Generate questions using AI
        const newQuestions = await geminiService.generateQuestionsForSkill(skill.name, level, skill.skillType);
      
        if (!newQuestions || newQuestions.length === 0) continue;

        // 5. Map and Save - Use the skill's actual type (TECHNICAL or SOFT_SKILL)
        const dataToSave = newQuestions.map(q => ({
          text: q.text,
          options: q.options || {}, 
          correctAns: String(q.correctAns || ""),
          questionType: q.questionType === 'MCQ' ? 'MCQ' : 'INTERVIEW',
          
          // MATCH THE TYPO: your schema uses 'QuestionDifficuty' (missing the 'l')
          difficulty: q.difficulty.toUpperCase(), 
          
          experience_level: getExperienceLevel(yearsOfExperience), 
          
          skillId: skill.id,       
          skillName: skill.name,   

          // Matches your 'CORE' or 'SECONDARY' enum
          skillType: CORE_SKILL_NAMES.includes(skill.name) ? "CORE" : "SECONDARY", 
        }));

    await prisma.questionBank.createMany({ 
      data: dataToSave,
      skipDuplicates: true 
    });

        console.log(`Successfully updated bank for ${skill.name}`);

      } catch (error) {
        console.error(`AI Generation failed for ${skill.name}:`, error.message);
      }
    }
    
    return { message: "Sync complete" };

  } catch (globalError) {
    console.error("Critical failure in checkAndGenerateForSkills:", globalError);
    throw globalError;
  }

  //  try {
  //   // ⚠️ Replace with a valid skillId from your DB
  //   const skill = await prisma.skill.findFirst();

  //   if (!skill) {
  //     throw new Error("No skill found in DB");
  //   }

  //   const sampleQuestions = [
  //     {
  //       text: "What is React mainly used for?",
  //       options: ["Styling", "Database", "UI building", "Networking"],
  //       correctAns: "C",
  //       questionType: "MCQ",
  //       difficulty: "EASY",
  //     },
  //     {
  //       text: "Tell me about a time you handled a difficult team situation",
  //       options: null,
  //       correctAns: null,
  //       questionType: "INTERVIEW",
  //       difficulty: "MEDIUM",
  //     },
  //   ];

  //   const dataToSave = sampleQuestions.map((q) => ({
  //     text: q.text,

  //     // ⚠️ Prisma JSON field MUST be valid object/array
  //     options: q.options || [],

  //     correctAns: q.correctAns || "",

  //     questionType: q.questionType,

  //     // ⚠️ VERY IMPORTANT: match your ENUM EXACTLY
  //     difficulty: q.difficulty, 

  //     experience_level: "BEGINNER",

  //     skillId: skill.id,
  //     skillName: skill.name,

  //     skillType: "CORE"
  //   }));

  //   const result = await prisma.questionBank.createMany({
  //     data: dataToSave,
  //   });

  //   console.log("Inserted:", result);

  // } catch (err) {
  //   console.error("Test Insert Error:", err);
  // }
};

// const prisma = require("../config/db");
// const geminiService = require("./geminiService");

// const MIN_QUESTIONS = 20; 
// const MONTHS_VALID = 6;

// const CORE_SKILL_NAMES = ["Communication", "Leadership", "Teamwork", "Logical Thinking"];

// const getExperienceLevel = (years) => {
//   if (years <= 1) return "BEGINNER";
//   if (years <= 5) return "INTERMEDIATE";
//   return "ADVANCED"; 
// };

// exports.checkAndGenerateForSkills = async (userSkills, yearsOfExperience = 0) => {
//   const MonthsAgo = new Date();
//   MonthsAgo.setMonth(MonthsAgo.getMonth() - MONTHS_VALID);

//   const level = getExperienceLevel(yearsOfExperience);

//   try { // <-- OUTER TRY OPEN
//     const coreSkillsFromDb = await prisma.skill.findMany({
//       where: {
//         name: { in: CORE_SKILL_NAMES }
//       }
//     });

//     const allSkills = [...userSkills, ...coreSkillsFromDb];

//     for (const skill of allSkills) { // <-- FOR LOOP OPEN
//       console.log(`--- Checking Skill: ${skill.name} ---`);

//       const count = await prisma.questionBank.count({
//         where: {
//           skillId: skill.id,
//           isActive: true,
//           createdAt: { gte: MonthsAgo }
//         }
//       });

//       if (count >= MIN_QUESTIONS) {
//         console.log(`${skill.name} has enough questions (${count}). Skipping...`);
//         continue; 
//       }

//       console.log(`${skill.name} needs update (Current: ${count})`);

//       try { // <-- INNER TRY OPEN
//         // TEST DATA INSERTION
//         const sampleQuestions = [
//           {
//             text: `What is ${skill.name} mainly used for?`, // Dynamic test text
//             options: ["Styling", "Database", "UI building", "Networking"],
//             correctAns: "C",
//             questionType: "MCQ",
//             difficulty: "EASY",
//           },
//           {
//             text: "Tell me about a time you handled a difficult team situation",
//             options: [],
//             correctAns: "",
//             questionType: "INTERVIEW",
//             difficulty: "MEDIUM",
//           },
//         ];

//         const dataToSave = sampleQuestions.map((q) => ({
//           text: q.text,
//           options: q.options || [],
//           correctAns: q.correctAns || "",
//           questionType: q.questionType,
//           difficulty: q.difficulty,
//           experience_level: "BEGINNER",
//           skillId: skill.id, // Uses the skill from the current loop iteration
//           skillName: skill.name,
//           skillType: CORE_SKILL_NAMES.includes(skill.name) ? "CORE" : "SECONDARY"
//         }));

//         const result = await prisma.questionBank.createMany({
//           data: dataToSave,
//         });

//         console.log(`Inserted test data for ${skill.name}:`, result);

//       } catch (innerErr) { // <-- INNER TRY CLOSE
//         console.error(`Test Insert Error for ${skill.name}:`, innerErr);
//       } 
//     } // <-- FOR LOOP CLOSE

//   } catch (globalError) { // <-- OUTER TRY CLOSE
//     console.error("Critical failure in checkAndGenerateForSkills:", globalError);
//   }
// };