// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Initialize the SDK. It automatically picks up process.env.GEMINI_API_KEY
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// exports.generateQuestionsForSkill = async (skillName) => {
//   try {
//     console.log(process.env.GEMINI_API_KEY)
//     const models = await ai.models.list();
// console.log(models);    
//     // Using gemini-1.5-flash as it is fast, cost-effective, and great at JSON
//     const model = genAI.getGenerativeModel(
//         {
//             model: "gemini-2.5-flash-latest",
//             generationConfig: {
//                 temperature: 0.7, // A bit of creativity for varied questions
//                 topP: 0.9,
//                 topK: 40
//             }
//         }
        
       
//     );

//     // We are setting default experience and skill_type here for now.
//     // You can make these dynamic later based on the job requirements!
//     const promptInput = {
//       skill: skillName,
//       experience_level: "intermediate", 
//       skill_type: "core"
//     };

//     // Your exact prompt, dynamically injecting the inputs
//     const prompt = `
// You are an AI question generator for a hiring platform.

// INPUT:
// ${JSON.stringify(promptInput)}

// RULES:

// 1. QUESTION COUNT
// - core: 25 mcq, 10 interview
// - secondary: 15 mcq, 5 interview

// 2. DIFFICULTY (apply separately to mcq + interview)
// - beginner: 60% easy, 30% medium, 10% hard
// - intermediate: 30% easy, 50% medium, 20% hard
// - advanced: 20% easy, 40% medium, 40% hard
// Use exact counts.

// 3. MCQ
// - 4 options only
// - options order = A, B, C, D
// - correct_answer must be "A" | "B" | "C" | "D"
// - practical, non-repetitive
// - cover multiple subtopics

// 4. INTERVIEW
// - natural spoken questions
// - no symbols (< > = { } etc.)
// - no code
// - clear and conversational

// 5. OUTPUT (STRICT JSON ONLY, MINIFIED)

// {
//   "mcq_questions":[
//     {
//       "question":"",
//       "options":["","","",""],
//       "correct_answer":"",
//       "difficulty":"",
//       "skill":"",
//       "type":"mcq"
//     }
//   ],
//   "interview_questions":[
//     {
//       "question":"",
//       "difficulty":"",
//       "skill":"",
//       "type":"interview"
//     }
//   ]
// }

// CONSTRAINTS:
// - no explanations
// - no duplicates
// - no text outside JSON
// - valid JSON only
// - if invalid, regenerate internally
//     `;

//     // Call the Gemini API
//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();
    
//     // Parse the JSON directly (safe because of responseMimeType)
//     const parsedData = JSON.parse(responseText);

//     // Combine and format the data for Prisma
//     const formattedQuestions = [];

//     // Map MCQs
//     if (parsedData.mcq_questions) {
//       parsedData.mcq_questions.forEach(q => {
//         formattedQuestions.push({
//           questionType: 'MCQ',
//           text: q.question,
//           options: q.options,
//           correctAns: q.correct_answer,
//           difficulty: q.difficulty.toUpperCase(), // Ensure 'MEDIUM' instead of 'medium'
//         });
//       });
//     }

//     // Map Interview Questions
//     if (parsedData.interview_questions) {
//       parsedData.interview_questions.forEach(q => {
//         formattedQuestions.push({
//           questionType: 'INTERVIEW',
//           text: q.question,
//           options: null,
//           correctAns: null,
//           difficulty: q.difficulty.toUpperCase(),
//         });
//       });
//     }

//     return formattedQuestions;

//   } catch (error) {
//     console.error(`Gemini API Error for skill ${skillName}:`, error);
//     throw new Error("Failed to generate questions from AI");
//   }
// };

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.generateQuestionsForSkill = async (skillName, experienceLevel, skillType) => {
  try {
    const promptInput = {
      skill: skillName,
      experience_level: experienceLevel,
      skill_type: skillType,
    };

    const prompt = `
        You are an AI question generator for a hiring platform.

        INPUT:
        ${JSON.stringify(promptInput)}

        RULES:

        1. QUESTION COUNT
        - core: 25 mcq, 10 interview
        - secondary: 15 mcq, 5 interview

        2. DIFFICULTY (apply separately to mcq + interview)
        - beginner: 60% easy, 30% medium, 10% hard
        - intermediate: 30% easy, 50% medium, 20% hard
        - advanced: 20% easy, 40% medium, 40% hard
        Use exact counts.

        3. MCQ
        - 4 options only
        - options order = A, B, C, D
        - correct_answer must be "A" | "B" | "C" | "D"
        - correct_answer must be random 
        - practical, non-repetitive
        - cover multiple subtopics

        4. INTERVIEW
        - natural spoken questions
        - no symbols (< > = { } etc.)
        - no code
        - clear and conversational

        5. OUTPUT (STRICT JSON ONLY, MINIFIED)

        {
        "mcq_questions":[
          {
            "question":"",
            "options":["","","",""],
            "correct_answer":"",
            "difficulty":"",
            "skill":"",
            "type":"mcq"
          }
        ],
        "interview_questions":[
          {
            "question":"",
            "difficulty":"",
            "skill":"",
            "type":"interview"
          }
        ]
        }

        CONSTRAINTS:
        - no explanations
        - no duplicates
        - no text outside JSON
        - valid JSON only
        - if invalid, regenerate internally
        `;
   
const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  console.log(response.text);

    let responseText = response.text;

    // ✅ Clean response (VERY IMPORTANT)
    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ Safe JSON parse
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (err) {
      console.error("JSON Parse Error:", responseText);
      throw new Error("Invalid JSON from AI");
    }

    const formattedQuestions = [];

    // ✅ MCQs
    if (parsedData.mcq_questions) {
      parsedData.mcq_questions.forEach((q) => {
        formattedQuestions.push({
          questionType: "MCQ",
          text: q.question,
          options: q.options,
          correctAns: q.correct_answer,
          difficulty: q.difficulty.toUpperCase(),
        });
      });
    }

    // ✅ Interview Questions
    if (parsedData.interview_questions) {
      parsedData.interview_questions.forEach((q) => {
        formattedQuestions.push({
          questionType: "INTERVIEW",
          text: q.question,
          options: null,
          correctAns: null,
          difficulty: q.difficulty.toUpperCase(),
        });
      });
    }

    return formattedQuestions;

  } catch (error) {
    console.error(`Gemini API Error for skill ${skillName}:`, error);
    throw new Error("Failed to generate questions from AI");
  }
};