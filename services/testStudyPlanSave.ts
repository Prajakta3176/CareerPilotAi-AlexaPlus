
import { generateStudyPlan } from "./planner";
import { saveStudyPlan } from "./studyPlanRepository";
import { pool } from "./db";

async function main() {
  try {
    const missingSkills = ["React", "Node.js", "REST API"];

    const studyPlan = generateStudyPlan(missingSkills);

    console.log("Generated study plan:");
    console.log(JSON.stringify(studyPlan, null, 2));

    const result = await saveStudyPlan(1, studyPlan);

    console.log(result);
  } catch (error) {
    console.error("Study plan save failed:", error);
  } finally {
    await pool.end();
  }
}

main();
