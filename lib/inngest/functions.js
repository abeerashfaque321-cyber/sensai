import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Check env
console.log("DATABASE:", !!process.env.DATABASE_URL);
console.log("GOOGLE_API_KEY:", !!process.env.GOOGLE_API_KEY);

// ✅ Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

export const generateIndustryInsights = inngest.createFunction(
  {
    id: "generate-industry-insights",
    name: "Generate Industry Insights",
    triggers: [
      {
        cron: "0 0 * * 0",
      },
    ],
  },
  async ({ step }) => {
    // 1. Fetch industries
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    // 2. Loop
    for (const { industry } of industries) {
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

IMPORTANT:
- Return ONLY valid JSON
- No markdown
- No explanation
`;

      let insights = null;

      try {
        // ✅ DIRECT CALL (no step.ai.wrap)
        const res = await model.generateContent(prompt);

        // ✅ safer extraction
        const text = res.response.text();

        const cleanedText = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        insights = JSON.parse(cleanedText);

      } catch (err) {
        console.error(`❌ Gemini/API error for ${industry}:`, err);
        continue;
      }

      // 3. Update DB
      await step.run(`Update ${industry}`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);