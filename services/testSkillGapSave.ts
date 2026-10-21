
import { createSkillGapReport } from "./planner";
import { saveSkillGapReport } from "./skillGapRepository";
import { pool } from "./db";

async function main() {
  try {
    const resumeText =
      "I know Java, SQL, Git and Data Structures. I have practiced Algorithms.";

    const jobDescription =
      "We need a developer with Java, SQL, React, Node.js, Git and REST API knowledge.";

    const report = createSkillGapReport(
      resumeText,
      jobDescription
    );

    console.log("Generated skill-gap report:");
    console.log(JSON.stringify(report, null, 2));

    const savedReport = await saveSkillGapReport({
      userId: 1,
      ...report,
    });

    console.log("Skill-gap report saved successfully!");
    console.log(savedReport);
  } catch (error) {
    console.error("Skill-gap save failed:", error);
  } finally {
    await pool.end();
  }
}

main();
