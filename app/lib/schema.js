import { z } from "zod";

// ---------------- ONBOARDING ----------------
export const onboardingSchema = z.object({
  industry: z.string().min(1, "Please select an industry"),
  subIndustry: z.string().min(1, "Please select a specialization"),
  bio: z.string().optional().or(z.literal("")),

  experience: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Experience must be a number" })
      .min(0)
      .max(50)
  ),

  skills: z.string().min(1, "Please enter skills"),
});

// ---------------- CONTACT ----------------
export const contactSchema = z.object({
  email: z.string().email("Invalid email address").or(z.literal("")),
  mobile: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  twitter: z.string().optional().or(z.literal("")),
});

// ---------------- ENTRY ----------------
export const entrySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().or(z.literal("")),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && (!data.endDate || data.endDate === "")) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

// ---------------- RESUME ----------------
export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.array(entrySchema).default([]),   // ✅ FIX
  education: z.array(entrySchema).default([]),    // ✅ FIX
  projects: z.array(entrySchema).default([]),     // ✅ FIX
});

// ---------------- COVER LETTER ----------------
export const coverLetterSchema = z.object({
  companyName: z.string().min(1),
  jobTitle: z.string().min(1),
  jobDescription: z.string().min(1),
});