
import { createSkillGapReport } from "./services/planner";

const resume = `
I know Java, SQL, Git and Data Structures.
I have practiced Algorithms.
`;

const jobDescription = `
We need a developer with Java, SQL, React, Node.js,
Git and REST API knowledge.
`;

const report = createSkillGapReport(resume, jobDescription);

console.log(JSON.stringify(report, null, 2));
