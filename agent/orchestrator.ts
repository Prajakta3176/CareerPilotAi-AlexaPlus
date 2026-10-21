
import { createSkillGapReport, generateStudyPlan } from "../services/planner";
import { generateQuiz } from "../services/quizService";
import { saveSkillGapReport } from "../services/skillGapRepository";
import { saveStudyPlan } from "../services/studyPlanRepository";

export async function startCareerPilot(
  userId: number,
  resumeText: string,
  jobDescription: string
) {
  // 1. Resume aur job description compare karo
  const report = createSkillGapReport(resumeText, jobDescription);

  // 2. Skill-gap report database mein save karo
  const savedReport = await saveSkillGapReport({
    userId,
    ...report,
  });

  // 3. Missing skills se study plan banao
  const studyPlan = generateStudyPlan(report.missingSkills);

  // 4. Study plan database mein save karo
  const savedPlan = await saveStudyPlan(userId, studyPlan);

  // 5. Missing skills ke liye quiz generate karo
  const quizQuestions = generateQuiz(report.missingSkills);

  return {
    skillGapReport: savedReport,
    studyPlan,
    savedStudyPlanCount: savedPlan.savedCount,
    quizQuestions,
  };
}
