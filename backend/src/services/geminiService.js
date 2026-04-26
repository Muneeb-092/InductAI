const { GoogleGenAI, Type } = require("@google/genai");

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

exports.evaluateInterviewAnswers = async (mcqScore, jobData, answersData) => {
  try {
    const prompt = `
      You are an expert technical recruiter and AI evaluator assessing a candidate's interview performance.
      
      Candidate Profile & Context:
      - Job Title: ${jobData.title}
      - Required Experience: ${jobData.experience} years
      - Job Description: ${jobData.description}
      - Candidate MCQ Score: ${mcqScore}/20 (Baseline technical knowledge)
      
      Interview Questions & Answers:
      ${JSON.stringify(answersData, null, 2)}
      
      Task:
      1. Score each individual answer out of 100 based on accuracy, depth, and clarity, considering the question's difficulty level and the specific skill it tests.
      2. Write a concise summary (maximum 3-4 sentences) of their performance. You MUST explicitly comment on their soft skills based on their answers. Use their MCQ score and job context to frame your summary.
      3. Write a concise final recommendation for the recruiter (e.g., "Strong Hire", "Hire", "No Hire") with a brief 1-2 sentence justification.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            evaluatedAnswers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionId: { type: Type.INTEGER },
                  aiScore: { type: Type.INTEGER }
                }
              }
            },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["evaluatedAnswers", "summary", "recommendation"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("DEBUG GEMINI ERROR:", error); // This shows the real issue in your terminal
    throw error; 
  }
};