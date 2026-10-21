
export function analyzeResume(resumeText: string) {
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

  const resume = resumeText.toLowerCase();

  const skills = skillKeywords.filter((skill) =>
    resume.includes(skill.toLowerCase())
  );

  return {
    skills,
    totalSkills: skills.length,
  };
}
