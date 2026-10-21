
import { pool } from "./db";

export type SkillGapReportInput = {
  userId: number;
  resumeSkills: string[];
  requiredSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
};

export async function saveSkillGapReport(
  report: SkillGapReportInput
) {
  const query = `
    INSERT INTO skill_gaps (
      user_id,
      resume_skills,
      required_skills,
      missing_skills,
      match_percentage
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    report.userId,
    report.resumeSkills,
    report.requiredSkills,
    report.missingSkills,
    report.matchPercentage,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}
