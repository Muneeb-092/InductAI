const prisma = require("../config/db");

const SOFT_SKILLS = ["communication", "teamwork", "leadership", "logical"];

// Shuffle helper
const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());

// Difficulty distribution
const getDifficultyCounts = (total) => {
  const easy = Math.floor(total * 0.4);
  const medium = Math.floor(total * 0.4);
  const hard = total - easy - medium;
  return { easy, medium, hard };
};

// services/sessionService.js

exports.getMCQQuestions = async (sessionId) => {
  const questions = await prisma.sessionQuestion.findMany({
    where: {
      sessionId: parseInt(sessionId),
    },
    include: {
      question: true,
    },
    orderBy: {
      orderIndex: "asc",
    },
    take: 20, // 🔥 only MCQs
  });

  // format for frontend
  return questions.map((q, index) => ({
    id: q.question.id,
    text: q.question.text,
    options: q.question.options,
    questionNumber: index + 1,

    skill: q.question.skillName,       // e.g., "React", "Node.js"
    difficulty: q.question.difficulty, // e.g., "EASY", "MEDIUM", "HARD"
  }));
};

exports.generateSessionQuestions = async (sessionId) => {
     const usedQuestionIds = new Set();
  const session = await prisma.assessmentSession.findUnique({
    where: { id: parseInt(sessionId) },
    include: {
      job: {
        include: {
          skills: {
            include: { skill: true },
          },
        },
      },
    },
  });

  if (!session) throw new Error("Session not found");
console.log(session)
  const skills = session.job.skills.map(js => js.skill);
  const skillCount = skills.length;

  if (skillCount === 0) throw new Error("No skills found for job");

  // =========================
  // 🎯 MCQ LOGIC (20)
  // =========================

  const TOTAL_MCQ = 20;
  const basePerSkill = Math.floor(TOTAL_MCQ / skillCount);
  let remainder = TOTAL_MCQ % skillCount;

  let mcqQuestions = [];

  for (let skill of skills) {
    let count = basePerSkill;

    // distribute remainder
    if (remainder > 0) {
      count += 1;
      remainder--;
    }

    const { easy, medium, hard } = getDifficultyCounts(count);

    const [easyQ, mediumQ, hardQ] = await Promise.all([
      prisma.questionBank.findMany({
        where: {
          questionType: "MCQ",
          skillId: skill.id,
          difficulty: "EASY",
        },
        take: easy,
      }),
      prisma.questionBank.findMany({
        where: {
          questionType: "MCQ",
          skillId: skill.id,
          difficulty: "MEDIUM",
        },
        take: medium,
      }),
      prisma.questionBank.findMany({
        where: {
          questionType: "MCQ",
          skillId: skill.id,
          difficulty: "HARD",
        },
        take: hard,
      }),
    ]);

    let combined = [...easyQ, ...mediumQ, ...hardQ];

    // fallback if not enough questions
    if (combined.length < count) {
      const extra = await prisma.questionBank.findMany({
        where: {
          questionType: "MCQ",
          skillId: skill.id,
        },
        take: count - combined.length,
      });

      combined.push(...extra);
    }

    mcqQuestions.push(...combined);
  }

  mcqQuestions = shuffle(mcqQuestions).slice(0, 20);

 // =========================
// 🎯 INTERVIEW (10)
// =========================

let technicalInterviewQuestions = [];
let softSkillQuestions = [];

const TOTAL_TECH = 6;
const baseTech = Math.floor(TOTAL_TECH / skillCount);
let techRem = TOTAL_TECH % skillCount;

// 🔥 Technical with difficulty
for (let skill of skills) {
  let count = baseTech + (techRem-- > 0 ? 1 : 0);

  const easy = Math.floor(count * 0.4);
  const medium = Math.floor(count * 0.4);
  const hard = count - easy - medium;

  const [e, m, h] = await Promise.all([
    prisma.questionBank.findMany({
      where: {
        questionType: "INTERVIEW",
        skillId: skill.id,
        difficulty: "EASY",
        id: { notIn: Array.from(usedQuestionIds) },
      },
      take: easy,
    }),
    prisma.questionBank.findMany({
      where: {
        questionType: "INTERVIEW",
        skillId: skill.id,
        difficulty: "MEDIUM",
        id: { notIn: Array.from(usedQuestionIds) },
      },
      take: medium,
    }),
    prisma.questionBank.findMany({
      where: {
        questionType: "INTERVIEW",
        skillId: skill.id,
        difficulty: "HARD",
        id: { notIn: Array.from(usedQuestionIds) },
      },
      take: hard,
    }),
  ]);

  let combined = [...e, ...m, ...h];

  // fallback (same skill)
  if (combined.length < count) {
    const extra = await prisma.questionBank.findMany({
      where: {
        questionType: "INTERVIEW",
        skillId: skill.id,
        id: { notIn: Array.from(usedQuestionIds) },
      },
      take: count - combined.length,
    });

    combined.push(...extra);
  }

  combined.forEach(q => usedQuestionIds.add(q.id));
  technicalInterviewQuestions.push(...combined);
}

// 🔥 Ensure total 6
if (technicalInterviewQuestions.length < 6) {
  const extra = await prisma.questionBank.findMany({
    where: {
      questionType: "INTERVIEW",
      id: { notIn: Array.from(usedQuestionIds) },
    },
    take: 6 - technicalInterviewQuestions.length,
  });

  extra.forEach(q => usedQuestionIds.add(q.id));
  technicalInterviewQuestions.push(...extra);
}

technicalInterviewQuestions = shuffle(technicalInterviewQuestions).slice(0, 6);

// =========================
// ✅ SOFT SKILLS (ALWAYS LAST)
// =========================

for (let soft of SOFT_SKILLS) {
  let q = await prisma.questionBank.findFirst({
    where: {
      questionType: "INTERVIEW",
      skillName: {
        contains: soft,
        mode: "insensitive",
      },
      id: { notIn: Array.from(usedQuestionIds) },
    },
  });

  // fallback if missing
  if (!q) {
    q = await prisma.questionBank.findFirst({
      where: {
        questionType: "INTERVIEW",
        id: { notIn: Array.from(usedQuestionIds) },
      },
    });
  }

  if (q) {
    usedQuestionIds.add(q.id);
    softSkillQuestions.push(q);
  }
}

// =========================
// FINAL INTERVIEW LIST
// =========================

const interviewQuestions = [
  ...technicalInterviewQuestions, // first 6
  ...softSkillQuestions,          // last 4
];

  // =========================
  // 🧱 INSERT ORDERED
  // =========================

  let orderIndex = 1;
  const data = [];

  // MCQ first (1–20)
  for (let q of mcqQuestions) {
    data.push({
      sessionId: session.id,
      questionId: q.id,
      orderIndex: orderIndex++,
    });
  }

  // Interview (21–30)
  for (let q of interviewQuestions) {
    data.push({
      sessionId: session.id,
      questionId: q.id,
      orderIndex: orderIndex++,
    });
  }

  // Clear old
  await prisma.sessionQuestion.deleteMany({
    where: { sessionId: session.id },
  });

  // Insert
  await prisma.sessionQuestion.createMany({ data });

  return data;
};


exports.submitMCQAnswers = async (sessionId, userAnswersArray) => {
  const sessionIdInt = parseInt(sessionId);

  // 1. Check if an attempt already exists
  const existingAttempt = await prisma.mCQAttempt.findUnique({
    where: { sessionId: sessionIdInt },
  });

  if (existingAttempt) {
    throw new Error("MCQ attempt has already been submitted for this session.");
  }

  // 2. Fetch all assigned MCQs for this session to use as the answer key
  const mcqQuestions = await prisma.sessionQuestion.findMany({
    where: {
      sessionId: sessionIdInt,
      question: { questionType: "MCQ" },
    },
    include: { question: true },
  });

  if (!mcqQuestions || mcqQuestions.length === 0) {
    throw new Error("No MCQs found for this session.");
  }

  // Convert the user's incoming answers into a fast-lookup map
  // Expected input format: [{ questionId: 10, selectedOpt: "A" }, ...]
  const userAnswersMap = userAnswersArray.reduce((acc, curr) => {
    acc[curr.questionId] = curr.selectedOpt;
    return acc;
  }, {});

  let correctCount = 0;
  const answerRecordsToCreate = [];

  // 3. Evaluate each question
  for (const sessionQ of mcqQuestions) {
    const qId = sessionQ.questionId;
    const correctAns = sessionQ.question.correctAns;
    const userOpt = userAnswersMap[qId]; // Undefined if unattempted

    let isCorrect = false;

    // Safely compare answers (ignoring case and whitespace)
    if (
      userOpt && 
      correctAns && 
      userOpt.trim().toLowerCase() === correctAns.trim().toLowerCase()
    ) {
      isCorrect = true;
      correctCount++;
    }

    // Prepare data for the MCQAnswer table
    answerRecordsToCreate.push({
      questionId: qId,
      selectedOpt: userOpt || "UNATTEMPTED", // Handle missing answers
      isCorrect: isCorrect,
    });
  }

  const totalScore = correctCount; 

  // 4. Save everything securely in a single database transaction
  const result = await prisma.$transaction(async (tx) => {
    
    // A. Create the MCQAttempt record
    const attempt = await tx.mCQAttempt.create({
      data: {
        sessionId: sessionIdInt,
        score: totalScore,
        status: "COMPLETED",
      },
    });

    // B. Create all the individual MCQAnswer records attached to this attempt
    const answersData = answerRecordsToCreate.map((a) => ({
      attemptId: attempt.id,
      questionId: a.questionId,
      selectedOpt: a.selectedOpt,
      isCorrect: a.isCorrect,
    }));

    await tx.mCQAnswer.createMany({ data: answersData });

    // C. Update the overall Session Status
    await tx.assessmentSession.update({
      where: { id: sessionIdInt },
      data: { status: "MCQ_COMPLETED" },
    });

    return { attempt, score: totalScore };
  });

  return result;
};