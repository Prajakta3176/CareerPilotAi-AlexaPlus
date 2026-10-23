// LLM-powered: domain-agnostic job description analyzer
import { callLLMJSON } from './llm';

export interface JobAnalysisResult {
  role: string;
  requiredSkills: string[];
  totalSkills: number;
  skillDetails: Array<{
    name: string;
    category: string;
    importance: 'required' | 'preferred' | 'nice-to-have';
  }>;
}

const SYSTEM_PROMPT = `You are a technical recruiter expert. Extract ALL skills from the job description.
Be comprehensive — include programming languages, frameworks, databases, cloud platforms, tools, methodologies, and domain knowledge.
This job could be in ANY field: software, data science, medicine, law, finance, design, marketing, etc.
Return ONLY valid JSON, no markdown, no code blocks.`;

export async function analyzeJobDescription(jobDescription: string): Promise<JobAnalysisResult> {
  try {
    const result = await callLLMJSON<JobAnalysisResult>(
      SYSTEM_PROMPT,
      `Analyze this job description and extract all required skills.

Job Description:
${jobDescription}

Return JSON in this exact format:
{
  "role": "job title extracted from description",
  "requiredSkills": ["skill1", "skill2"],
  "totalSkills": 0,
  "skillDetails": [
    { "name": "skill name", "category": "language|framework|backend|database|cloud|devops|tools|domain|soft-skill", "importance": "required|preferred|nice-to-have" }
  ]
}

Be thorough — extract every technical and domain skill mentioned. Include tools, methodologies, certifications, soft skills.`
    );

    // Ensure totalSkills is accurate
    result.totalSkills = result.requiredSkills?.length || 0;
    return result;
  } catch (err) {
    console.error('[jobAnalyzer] LLM failed, returning empty result:', err);
    return { role: 'Unknown Role', requiredSkills: [], totalSkills: 0, skillDetails: [] };
  }
}
