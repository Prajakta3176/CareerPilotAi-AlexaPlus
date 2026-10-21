/**
 * LLM Prompt Templates
 * Structured prompts for each CareerPilot operation.
 */

export const SYSTEM_PROMPT = `You are CareerPilot AI, an expert career preparation assistant.
You help candidates analyze job requirements, identify skill gaps,
create study plans, and prepare through adaptive quizzes.

Guidelines:
- Be precise about skill assessments
- Separate verified evidence from inferences
- Never guarantee employment outcomes
- Use structured JSON output when requested`;

export const JOB_ANALYSIS_PROMPT = `Analyze the following job description and extract structured skills.
Group skills into categories: language/framework, backend, databases,
algorithms, system design, and soft skills.

Job Description:
{jobDescription}

Return valid JSON with this structure:
{
  "role": "string",
  "skills": [{ "name": "string", "category": "string", "importance": "required|preferred|nice-to-have" }]
}`;

export const RESUME_ANALYSIS_PROMPT = `Extract candidate skills and evidence from this resume.
For each skill, include the evidence snippet from the resume.
Separate explicit evidence from inferred skills.

Resume:
{resume}

Return valid JSON.`;

export const PLAN_GENERATION_PROMPT = `Generate a {days}-day study plan for the following skill gaps.
The candidate has {dailyMinutes} minutes available per day.

Skill Gaps:
{gaps}

Return a JSON array of daily plans.`;

export const QUIZ_GENERATION_PROMPT = `Generate {count} multiple-choice questions about: {topic}

Each question should have 4 options with one correct answer.
Return valid JSON.`;
