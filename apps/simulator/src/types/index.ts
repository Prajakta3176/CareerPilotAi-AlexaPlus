/**
 * CareerPilot Simulator — Central Type Definitions
 * Shared types for state management, API data contracts, and UI components.
 */

export type SkillCategory =
  | 'language'
  | 'framework'
  | 'backend'
  | 'database'
  | 'algorithms'
  | 'system-design'
  | 'cloud'
  | 'devops'
  | 'tools'
  | 'soft-skill';

export type SkillMatchType = 'matched' | 'partial' | 'missing';

export interface SkillItem {
  name: string;
  category: SkillCategory;
  matchType: SkillMatchType;
  evidenceSnippet?: string;
  source: 'resume' | 'inferred' | 'gap';
  confidence?: number;
}

export interface SkillComparison {
  matchScore: number;
  totalRequired: number;
  matchedCount: number;
  partialCount: number;
  missingCount: number;
  matched: SkillItem[];
  partial: SkillItem[];
  missing: SkillItem[];
  recommendation: string;
}

export interface PlanDay {
  day: number;
  topic: string;
  allocatedMinutes: number;
  objective: string;
  practiceTask: string;
  completed: boolean;
  adapted?: boolean;
}

export interface StudyPlan {
  planId: string;
  sessionId: string;
  totalDays: number;
  dailyMinutes: number;
  targetRole?: string;
  schedule: PlanDay[];
  createdAt: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

export interface Quiz {
  quizId: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: QuizQuestion[];
}

export interface QuizSubmission {
  questionId: string;
  selectedOption: string;
  correctOption: string;
}

export interface QuizResult {
  quizId: string;
  topic: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
  passed: boolean;
  feedback: string;
  adaptedTopic?: string;
  newPlanDayAdded?: number;
}

export interface SessionProgress {
  sessionId: string;
  overallProgress: number; // 0 to 100
  completedDays: number[];
  totalQuizzesTaken: number;
  averageQuizScore: number;
  topicMastery: Record<string, number>; // topic -> score %
}

export interface ToolTraceItem {
  id: string;
  timestamp: string;
  toolName: string;
  inputSummary: Record<string, unknown>;
  status: 'pending' | 'success' | 'error';
  durationMs: number;
  outputSummary?: Record<string, unknown>;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: string[]; // e.g. ['analyze_job', 'compare_skills']
  suggestedActions?: string[];
}

export type ActiveTab = 'onboarding' | 'analysis' | 'plan' | 'quiz' | 'progress' | 'trace';
