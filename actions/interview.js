"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

// ✅ Gemini setup (use ONLY GEMINI_API_KEY in .env)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ GENERATE QUIZ
export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
Generate 10 technical interview questions for a ${user.industry} professional ${
    user.skills?.length ? `with skills in ${user.skills.join(", ")}` : ""
  }.

Return ONLY JSON:
{
  "questions": [
    {
      "question": "string",
      "options": ["string","string","string","string"],
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}
`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash-002", // ✅ FIXED MODEL
      contents: prompt,
    });

    const text = result.text;

    const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleaned);

    return quiz.questions;
  } catch (error) {
    console.error("Quiz Error:", error);
    throw new Error("Failed to generate quiz");
  }
}

// ✅ SAVE RESULT
export async function saveQuizResult(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { questions, answers, score } = data;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = (questions || []).map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  let improvementTip = null;

  if (wrongAnswers.length > 0) {
    const wrongText = wrongAnswers
      .map(
        (q) =>
          `Q: ${q.question}\nCorrect: ${q.answer}\nUser: ${q.userAnswer}`
      )
      .join("\n\n");

    const prompt = `
User got these wrong:

${wrongText}

Give 1 short improvement tip (max 2 sentences).
`;

    try {
      const res = await ai.models.generateContent({
        model: "gemini-1.5-flash-002", // ✅ FIXED MODEL
        contents: prompt,
      });

      improvementTip = res.text.trim();
    } catch (e) {
      console.error("Tip Error:", e);
    }
  }

  try {
    const saved = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return {
      id: saved.id,
      quizScore: saved.quizScore,
      improvementTip: saved.improvementTip,
      createdAt: saved.createdAt.toISOString(),
      questions: saved.questions,
    };
  } catch (error) {
    console.error("Save Error:", error);
    throw new Error("Failed to save quiz result");
  }
}

// ✅ GET ASSESSMENTS
export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return assessments.map((a) => ({
      id: a.id,
      quizScore: a.quizScore,
      improvementTip: a.improvementTip,
      createdAt: a.createdAt.toISOString(),
      questions: a.questions,
    }));
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch assessments");
  }
}