// LLM-powered: domain-agnostic resume analyzer
import { callLLMJSON } from './llm';

export interface ResumeAnalysisResult {
  skills: string[];
  totalSkills: number;
  skillDetails: Array<{
    name: string;
    evidence: string;
    confidence: 'verified' | 'inferred';
  }>;
}

const SYSTEM_PROMPT = `You are an expert resume screener. Extract ALL skills a candidate has from their resume or skill description.
Look for explicit mentions AND implied skills from job history, projects, and education.
This resume could be from ANY field: software, medicine, law, finance, design, teaching, etc.
Return ONLY valid JSON, no markdown, no code blocks.`;

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysisResult> {
  try {
    const result = await callLLMJSON<ResumeAnalysisResult>(
      SYSTEM_PROMPT,
      `Extract all skills from this resume or skill description.

Resume/Skills:
${resumeText}

Return JSON in this exact format:
{
  "skills": ["skill1", "skill2"],
  "totalSkills": 0,
  "skillDetails": [
    { "name": "skill name", "evidence": "quote or context from resume showing this skill", "confidence": "verified|inferred" }
  ]
}

Be thorough — include technologies, tools, methodologies, domain knowledge, certifications, soft skills, and any implied expertise from job history or projects.`
    );

    result.totalSkills = result.skills?.length || 0;
    return result;
  } catch (err) {
    console.error('[resumeAnalyzer] LLM failed, returning empty result:', err);
    return { skills: [], totalSkills: 0, skillDetails: [] };
  }
}
