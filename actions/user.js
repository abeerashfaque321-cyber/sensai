"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";

// // ✅ UPDATE USER (CREATE + UPDATE BOTH)
// export async function updateUser(data) {
//   try {
//     const { userId } = await auth();
//     const user = await currentUser();

//     if (!userId) throw new Error("Unauthorized");

//     const formattedSkills = Array.isArray(data.skills)
//       ? data.skills
//       : data.skills?.split(",").map((s) => s.trim()) || [];

//     const updatedUser = await db.user.upsert({
//       where: { clerkUserId: userId },

//       update: {
//         industry: data.industry,
//         experience: Number(data.experience) || 0,
//         bio: data.bio || "",
//         skills: formattedSkills,
//       },

//       create: {
//         clerkUserId: userId,
//         email: user.emailAddresses[0].emailAddress,
//         name: `${user.firstName || ""} ${user.lastName || ""}`,
//         imageUrl: user.imageUrl,

//         industry: data.industry,
//         experience: Number(data.experience) || 0,
//         bio: data.bio || "",
//         skills: formattedSkills,
//       },
//     });

//     return { success: true, user: updatedUser };

//   } catch (error) {
//     console.error("DB ERROR:", error);
//     return { success: false, error: error.message };
//   }
// }

export async function updateUser(data) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) throw new Error("Unauthorized");

    const formattedSkills = Array.isArray(data.skills)
      ? data.skills
      : data.skills?.split(",").map((s) => s.trim()) || [];

    const industryValue = data.industry?.trim();

    // ✅ STEP 1: Ensure Industry exists
    if (!industryInsight) {
       const insights = await generateAIInsights(data.industry);

    industryInsight = await db.industryInsight.create({
      data: {
        industry: data.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
      
    }

    // ✅ STEP 2: Now safe to upsert user
    const updatedUser = await db.user.upsert({
      where: { clerkUserId: userId },

      update: {
        industry: industryValue,
        experience: Number(data.experience) || 0,
        bio: data.bio || "",
        skills: formattedSkills,
      },

      create: {
        clerkUserId: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        imageUrl: user.imageUrl,

        industry: industryValue,
        experience: Number(data.experience) || 0,
        bio: data.bio || "",
        skills: formattedSkills,
      },
    });

    return { success: true, user: updatedUser };

  } catch (error) {
    console.error("DB ERROR:", error);
    return { success: false, error: error.message };
  }
}


// ✅ CHECK ONBOARDING STATUS
export async function getUserOnboardingStatus() {
  try {
    const { userId } = await auth();

    if (!userId) return { isOnboarded: false };

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    return {
      isOnboarded: !!user?.industry,
    };

  } catch (error) {
    console.error("STATUS ERROR:", error);
    return { isOnboarded: false };
  }
}