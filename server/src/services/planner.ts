// LLM-powered: domain-agnostic skill gap analysis and study plan generation
import { analyzeJobDescription } from './jobAnalyzer';
import { analyzeResume } from './resumeAnalyzer';
import { callLLMJSON } from './llm';

export interface SkillItem {
  name: string;
  category: 'language' | 'framework' | 'backend' | 'database' | 'algorithms' | 'system-design' | 'cloud' | 'devops' | 'tools' | 'soft-skill';
  matchType: 'matched' | 'partial' | 'missing';
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
  targetRole?: string;
}

const GAP_SYSTEM_PROMPT = `You are an expert career coach performing a precise skill gap analysis.
Compare the candidate's skills from their resume against the job requirements.
Be domain-agnostic — this could be any field: tech, medicine, law, finance, design, etc.
Base your analysis on the actual content of the resume and job description, not assumptions.
Return ONLY valid JSON, no markdown, no code blocks.`;

export async function createSkillGapReport(
  resumeText: string,
  jobDescription: string
): Promise<SkillComparison> {
  try {
    // Extract skills with LLM in parallel
    const [jobAnalysis, resumeAnalysis] = await Promise.all([
      analyzeJobDescription(jobDescription),
      analyzeResume(resumeText),
    ]);

    const result = await callLLMJSON<SkillComparison>(
      GAP_SYSTEM_PROMPT,
      `Perform a skill gap analysis.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME/SKILLS:
${resumeText}

Job requires these skills: ${JSON.stringify(jobAnalysis.requiredSkills)}
Candidate has these skills: ${JSON.stringify(resumeAnalysis.skills)}

Return JSON in this exact format:
{
  "targetRole": "${jobAnalysis.role}",
  "matchScore": 0,
  "totalRequired": 0,
  "matchedCount": 0,
  "partialCount": 0,
  "missingCount": 0,
  "matched": [
    { "name": "skill", "category": "language|framework|backend|database|algorithms|system-design|cloud|devops|tools|soft-skill", "matchType": "matched", "evidenceSnippet": "exact quote from resume proving this skill", "source": "resume", "confidence": 0.95 }
  ],
  "partial": [
    { "name": "skill", "category": "tools", "matchType": "partial", "evidenceSnippet": "related but not direct evidence from resume", "source": "inferred", "confidence": 0.6 }
  ],
  "missing": [
    { "name": "skill", "category": "tools", "matchType": "missing", "source": "gap" }
  ],
  "recommendation": "Specific, personalized 2-sentence advice about what this exact candidate should focus on for this specific role"
}

Rules:
- matchScore = ((matched.length + partial.length * 0.5) / totalRequired * 100), rounded
- A skill is "matched" only if there is clear evidence in the resume
- A skill is "partial" if there is related but indirect evidence
- A skill is "missing" if there is no evidence in the resume
- Be domain-specific: if this is a medical role, use medical categories; if legal, use legal categories
- category must be one of: language, framework, backend, database, algorithms, system-design, cloud, devops, tools, soft-skill`
    );

    // Ensure counts match arrays
    result.matchedCount = result.matched?.length || 0;
    result.partialCount = result.partial?.length || 0;
    result.missingCount = result.missing?.length || 0;
    result.totalRequired = result.matchedCount + result.partialCount + result.missingCount;
    if (result.totalRequired > 0) {
      result.matchScore = Math.round(
        ((result.matchedCount + result.partialCount * 0.5) / result.totalRequired) * 100
      );
    }

    return result;
  } catch (err) {
    console.error('[planner] createSkillGapReport LLM failed:', err);
    return {
      matchScore: 0,
      totalRequired: 0,
      matchedCount: 0,
      partialCount: 0,
      missingCount: 0,
      matched: [],
      partial: [],
      missing: [],
      recommendation: 'Analysis failed — please try again.',
    };
  }
}

export interface StudyPlanDay {
  day: number;
  topic: string;
  allocatedMinutes: number;
  objective: string;
  practiceTask: string;
  resources: string[];
  completed: boolean;
}

export interface StudyPlan {
  planId: string;
  sessionId: string;
  totalDays: number;
  dailyMinutes: number;
  targetRole: string;
  schedule: StudyPlanDay[];
  createdAt: string;
}

const PLAN_SYSTEM_PROMPT = `You are an expert learning coach and curriculum designer.
Create personalized, evidence-backed study plans for any field or domain.
Plans must be practical, specific, and achievable within the given time constraints.
Be domain-specific: medical prep gets medical tasks, coding prep gets coding tasks, law prep gets law tasks.
Return ONLY valid JSON, no markdown, no code blocks.`;

export async function generatePersonalizedStudyPlan(
  sessionId: string,
  totalDays: number = 5,
  dailyMinutes: number = 60,
  missingSkills: string[] = [],
  targetRole: string = 'Target Role'
): Promise<StudyPlan> {
  try {
    const skillsList = missingSkills.length > 0
      ? missingSkills.join(', ')
      : 'General professional skills for this role';

    const result = await callLLMJSON<{ targetRole: string; schedule: StudyPlanDay[] }>(
      PLAN_SYSTEM_PROMPT,
      `Create a ${totalDays}-day study plan for a candidate preparing for: ${targetRole}

Missing skills to address (prioritized):
${skillsList}

Constraints:
- ${dailyMinutes} minutes available per day
- Total days: ${totalDays}

Return JSON in this exact format:
{
  "targetRole": "${targetRole}",
  "schedule": [
    {
      "day": 1,
      "topic": "Specific topic directly addressing a missing skill",
      "allocatedMinutes": ${dailyMinutes},
      "objective": "Clear, measurable learning objective for this day (what will they be able to DO after)",
      "practiceTask": "Concrete, hands-on task to complete today (be specific — name exact exercises, problems, or projects)",
      "resources": ["Specific book chapter / free website / tool to use today"],
      "completed": false
    }
  ]
}

Rules:
- Generate exactly ${totalDays} days in the schedule array
- Each day must address one of the missing skills
- Distribute days proportionally: more days for more critical or harder skills
- Be domain-specific: if preparing for a medical role, recommend medical textbooks; if coding, recommend coding platforms
- Resources must be real and specific (e.g., "LeetCode - Array problems", "Khan Academy - Statistics", "USMLE First Aid Chapter 3")
- If missing skills list is empty, generate a well-rounded prep plan for the target role`
    );

    return {
      planId: `plan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      sessionId,
      totalDays,
      dailyMinutes,
      targetRole: result.targetRole || targetRole,
      schedule: result.schedule || [],
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[planner] generatePersonalizedStudyPlan LLM failed:', err);
    // Fallback: build a basic plan from missingSkills without LLM
    const schedule: StudyPlanDay[] = Array.from({ length: totalDays }, (_, i) => ({
      day: i + 1,
      topic: missingSkills[i % Math.max(missingSkills.length, 1)] || `Day ${i + 1} Preparation`,
      allocatedMinutes: dailyMinutes,
      objective: `Build understanding and practical ability in ${missingSkills[i] || 'this skill'}.`,
      practiceTask: `Study core concepts and complete practice exercises for ${missingSkills[i] || 'this topic'}.`,
      resources: ['Online documentation', 'Practice exercises'],
      completed: false,
    }));

    return {
      planId: `plan_${Date.now()}`,
      sessionId,
      totalDays,
      dailyMinutes,
      targetRole,
      schedule,
      createdAt: new Date().toISOString(),
    };
  }
}
