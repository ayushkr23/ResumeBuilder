import { z } from "zod";

// Resume data types
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.string().optional(),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
});

export const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  institution: z.string().min(1, "Institution is required"),
  gpa: z.string().optional(),
  startYear: z.number().optional(),
  endYear: z.number().optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  link: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
});

export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema,
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  summary: z.string().optional(),
  selectedRole: z.string().optional(),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ResumeData = z.infer<typeof resumeDataSchema>;

// AI suggestion types
export const aiSuggestionSchema = z.object({
  type: z.enum(["skill", "improvement", "content"]),
  title: z.string(),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"]),
});

export const resumeScoreSchema = z.object({
  score: z.number().min(0).max(10),
  feedback: z.string(),
  suggestions: z.array(aiSuggestionSchema),
});

export type AISuggestion = z.infer<typeof aiSuggestionSchema>;
export type ResumeScore = z.infer<typeof resumeScoreSchema>;
