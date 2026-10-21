
import { pool } from "./db";

export type StudyPlanItem = {
  day: number;
  skill: string;
  topics: string[];
};

export async function saveStudyPlan(
  userId: number,
  studyPlan: StudyPlanItem[]
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const item of studyPlan) {
      await client.query(
        `INSERT INTO study_plans
          (user_id, skill, day_number, topics)
         VALUES ($1, $2, $3, $4)`,
        [userId, item.skill, item.day, item.topics]
      );
    }

    await client.query("COMMIT");

    return {
      savedCount: studyPlan.length,
      message: "Study plan saved successfully!",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
