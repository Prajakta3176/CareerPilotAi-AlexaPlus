/**
 * Zod Schemas — Validation for all inputs and LLM outputs
 */
import { z } from 'zod';

export const SkillSchema = z.object({
  name: z.string(),
  category: z.enum(['language', 'framework', 'backend', 'database', 'algorithms', 'system-design', 'soft-skills', 'other']),
  importance: z.enum(['required', 'preferred', 'nice-to-have']),
});

export const JobAnalysisSchema = z.object({
  role: z.string(),
  skills: z.array(SkillSchema),
});

export const ResumeSkillSchema = z.object({
  name: z.string(),
  evidence: z.string(),
  confidence: z.enum(['verified', 'inferred']),
});

export const SkillGapSchema = z.object({
  skill: z.string(),
  status: z.enum(['matched', 'partial', 'missing']),
  evidence: z.string().optional(),
});

export const PlanDaySchema = z.object({
  day: z.number(),
  topic: z.string(),
  objective: z.string(),
  timeMinutes: z.number(),
  practiceTask: z.string(),
  completed: z.boolean().default(false),
});

export const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().min(0).max(3),
  explanation: z.string(),
});

export const QuizSubmissionSchema = z.object({
  sessionId: z.string(),
  answers: z.record(z.string(), z.number()),
});

export type Skill = z.infer<typeof SkillSchema>;
export type JobAnalysis = z.infer<typeof JobAnalysisSchema>;
export type ResumeSkill = z.infer<typeof ResumeSkillSchema>;
export type SkillGap = z.infer<typeof SkillGapSchema>;
export type PlanDay = z.infer<typeof PlanDaySchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
