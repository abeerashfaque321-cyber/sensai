"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIInsights = async (industry) => {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }
    IMPORTANT: Return ONLY raw JSON. No markdown.
  `;

export const getIndustryInsights = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user?.industry) {
    throw new Error("User industry not found");
  }

  const insights = await generateAIInsights(user.industry);

  return insights;
};

  try {
    // 1. Model name change karke dekhte hain (kuch regions mein 'gemini-1.5-flash-latest' behtar chalta hai)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Agar ye fail ho, toh isse "gemini-1.5-flash-latest" karke dekhein
    });

    // 2. Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 3. Clean and parse
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);

  } catch (error) {
    console.error("Gemini API Error Detail:", error.message);
    throw new Error("AI Insights generate nahi ho paye. Please try again.");
  }
};

// ... baaki ka getIndustryInsights code same rahega