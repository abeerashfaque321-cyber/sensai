"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Gemini setup (CORRECT SDK)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// ✅ Helper: user create if not exists
async function getOrCreateUser(userId) {
  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    console.log("⚠️ Creating new user...");

    user = await db.user.create({
      data: {
        clerkUserId: userId,
        email: `${userId}@temp.com`,
        name: "New User",
      },
    });
  }

  return user;
}

// ================= SAVE RESUME =================
export async function saveResume(content) {
  const { userId } = await auth();
  console.log("UserId:", userId);

  if (!userId) throw new Error("Unauthorized");

  const user = await getOrCreateUser(userId);

  try {
    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: { content },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("❌ Save Error:", error);
    throw new Error("Failed to save resume");
  }
}

// ================= GET RESUME =================
export async function getResume() {
  const { userId } = await auth();
  console.log("UserId:", userId);

  if (!userId) throw new Error("Unauthorized");

  const user = await getOrCreateUser(userId);

  try {
    return await db.resume.findUnique({
      where: { userId: user.id },
    });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    throw new Error("Failed to fetch resume");
  }
}

// ================= AI IMPROVE =================
export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getOrCreateUser(userId);

  const prompt = `
As an expert resume writer, improve the following ${type} description for a ${user.industry || "general"} professional.

Current content: "${current}"

Requirements:
- Use strong action verbs
- Add measurable achievements
- Highlight skills
- Keep it concise
- Focus on impact

Return ONLY the improved paragraph.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    return response;
  } catch (error) {
    console.error("❌ AI Error:", error);
    throw new Error("Failed to improve content");
  }
}