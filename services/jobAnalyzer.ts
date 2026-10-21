
const skillKeywords = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Java",
  "Python",
  "SQL",
  "MongoDB",
  "REST API",
  "Git",
  "Docker",
  "AWS",
  "Data Structures",
  "Algorithms",
];

export function analyzeJobDescription(jobDescription: string) {
  const description = jobDescription.toLowerCase();

  const requiredSkills = skillKeywords.filter((skill) =>
    description.includes(skill.toLowerCase())
  );

  return {
    requiredSkills,
    totalSkills: requiredSkills.length,
  };
}
