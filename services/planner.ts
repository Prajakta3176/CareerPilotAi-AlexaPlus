
import { analyzeJobDescription } from "./jobAnalyzer";
import { analyzeResume } from "./resumeAnalyzer";

export function createSkillGapReport(
  resumeText: string,
  jobDescription: string
) {
  const resumeAnalysis = analyzeResume(resumeText);
  const jobAnalysis = analyzeJobDescription(jobDescription);

  const missingSkills = jobAnalysis.requiredSkills.filter(
    (skill) => !resumeAnalysis.skills.includes(skill)
  );

  const matchedSkills = jobAnalysis.requiredSkills.filter(
    (skill) => resumeAnalysis.skills.includes(skill)
  );

  return {
    resumeSkills: resumeAnalysis.skills,
    requiredSkills: jobAnalysis.requiredSkills,
    matchedSkills,
    missingSkills,
    matchPercentage:
      jobAnalysis.totalSkills === 0
        ? 0
        : Math.round(
            (matchedSkills.length / jobAnalysis.totalSkills) * 100
          ),
  };
}

export function generateStudyPlan(missingSkills: string[]) {
  const topics: Record<string, string[]> = {
    React: ["Components and JSX", "Props and State", "Hooks"],
    "Node.js": ["Modules", "Async programming", "Express APIs"],
    "REST API": ["HTTP methods", "Status codes", "API testing"],
    Java: ["OOP", "Collections", "Exception handling"],
    SQL: ["SELECT and JOIN", "GROUP BY", "Subqueries"],
    Git: ["Commits and branches", "Merge conflicts", "Pull requests"],
  };

  return missingSkills.map((skill, index) => ({
    day: index + 1,
    skill,
    topics: topics[skill] ?? ["Learn the basics", "Practice examples"],
  }));
}
