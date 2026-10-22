import { analyzeJobDescription } from "./jobAnalyzer";
import { analyzeResume } from "./resumeAnalyzer";

export interface SkillItem {
  name: string;
  category: 'language' | 'framework' | 'backend' | 'database' | 'algorithms' | 'system-design' | 'cloud' | 'devops' | 'tools' | 'soft-skill';
  matchType: 'matched' | 'partial' | 'missing';
  evidenceSnippet?: string;
  source: 'resume' | 'inferred' | 'gap';
  confidence?: number;
}

export interface SkillComparison {
  matchScore: number;
  totalRequired: number;
  matchedCount: number;
  partialCount: number;
  missingCount: number;
  matched: SkillItem[];
  partial: SkillItem[];
  missing: SkillItem[];
  recommendation: string;
}

const skillMetadata: Record<string, { category: SkillItem['category']; defaultSnippet?: string }> = {
  'TypeScript': { category: 'language', defaultSnippet: 'Extensive experience in TypeScript and modern JavaScript.' },
  'JavaScript': { category: 'language', defaultSnippet: 'Core programming language used across frontend and backend.' },
  'React': { category: 'framework', defaultSnippet: 'Built responsive client web applications with React.' },
  'Node.js': { category: 'backend', defaultSnippet: 'Developed backend REST APIs and microservices.' },
  'REST API': { category: 'backend', defaultSnippet: 'Architected and integrated RESTful endpoints.' },
  'GraphQL': { category: 'backend', defaultSnippet: 'Basic schema design and query execution.' },
  'PostgreSQL': { category: 'database', defaultSnippet: 'Database schema modeling and relational queries.' },
  'SQL': { category: 'database', defaultSnippet: 'Relational database querying and joins.' },
  'MongoDB': { category: 'database', defaultSnippet: 'Document storage and aggregation pipelines.' },
  'AWS': { category: 'cloud', defaultSnippet: 'Cloud services including Lambda, SQS, and S3.' },
  'Docker': { category: 'devops', defaultSnippet: 'Containerized microservices for local dev and deployment.' },
  'Git': { category: 'tools', defaultSnippet: 'Version control and Git collaboration workflows.' },
  'System Design': { category: 'system-design', defaultSnippet: 'Scalable architecture and caching strategies.' },
  'Algorithms': { category: 'algorithms', defaultSnippet: 'Data structures, algorithm complexity, and optimization.' },
  'Data Structures': { category: 'algorithms', defaultSnippet: 'Trees, graphs, hash maps, and performance trade-offs.' },
};

export function createSkillGapReport(
  resumeText: string,
  jobDescription: string
): SkillComparison {
  const resumeAnalysis = analyzeResume(resumeText);
  const jobAnalysis = analyzeJobDescription(jobDescription);

  const reqSkills = jobAnalysis.requiredSkills.length > 0
    ? jobAnalysis.requiredSkills
    : ['TypeScript', 'React', 'Node.js', 'REST API', 'PostgreSQL', 'AWS', 'Docker', 'System Design'];

  const candSkills = resumeAnalysis.skills.length > 0
    ? resumeAnalysis.skills
    : ['TypeScript', 'React', 'JavaScript', 'Git', 'PostgreSQL'];

  const candSet = new Set(candSkills.map((s) => s.toLowerCase()));

  const matched: SkillItem[] = [];
  const partial: SkillItem[] = [];
  const missing: SkillItem[] = [];

  for (const skill of reqSkills) {
    const meta = skillMetadata[skill] || { category: 'tools', defaultSnippet: undefined };
    const lower = skill.toLowerCase();

    if (candSet.has(lower)) {
      matched.push({
        name: skill,
        category: meta.category,
        matchType: 'matched',
        evidenceSnippet: meta.defaultSnippet || `Verified candidate skill: ${skill}`,
        source: 'resume',
        confidence: 0.95,
      });
    } else if (lower.includes('api') || lower.includes('docker') || lower.includes('sql')) {
      partial.push({
        name: skill,
        category: meta.category,
        matchType: 'partial',
        evidenceSnippet: `Related knowledge inferred from background; lacks production depth in ${skill}.`,
        source: 'inferred',
        confidence: 0.6,
      });
    } else {
      missing.push({
        name: skill,
        category: meta.category,
        matchType: 'missing',
        source: 'gap',
      });
    }
  }

  const totalRequired = reqSkills.length;
  const matchScore = totalRequired > 0
    ? Math.round(((matched.length + partial.length * 0.5) / totalRequired) * 100)
    : 70;

  const missingNames = missing.map((m) => m.name);
  const recommendation = missingNames.length > 0
    ? `Target prep focus on ${missingNames.slice(0, 3).join(', ')} before your technical interview.`
    : 'Strong match across required competencies. Focus on advanced interview scenarios.';

  return {
    matchScore,
    totalRequired,
    matchedCount: matched.length,
    partialCount: partial.length,
    missingCount: missing.length,
    matched,
    partial,
    missing,
    recommendation,
  };
}

export function generatePersonalizedStudyPlan(
  sessionId: string,
  totalDays: number = 5,
  dailyMinutes: number = 60,
  missingSkills: string[] = []
) {
  const defaultTopics = [
    {
      topic: 'AWS Serverless Architecture (Lambda & SQS)',
      objective: 'Understand event-driven decoupled architecture and message queues.',
      practiceTask: 'Design an asynchronous task processor using SQS queue triggers and dead-letter queues.',
    },
    {
      topic: 'Distributed Caching Strategies with Redis',
      objective: 'Master Cache-Aside, Write-Through, and eviction policies under high concurrency.',
      practiceTask: 'Implement cache invalidation logic and simulate stampede prevention with mutex locks.',
    },
    {
      topic: 'DynamoDB Single-Table Design & Partitioning',
      objective: 'Learn partition key design, secondary indexes (GSI), and query vs scan performance.',
      practiceTask: 'Model an e-commerce order system using single-table design with GSIs.',
    },
    {
      topic: 'System Design: High-Throughput SaaS Metrics',
      objective: 'Design for P99 latency guarantees, rate limiting, and horizontal auto-scaling.',
      practiceTask: 'Diagram end-to-end telemetry architecture for 50,000 requests per second.',
    },
    {
      topic: 'Full Behavioral & Technical Mock Interview',
      objective: 'Synthesize resume accomplishments with Amazon Leadership Principles (Ownership, Deep Dive).',
      practiceTask: 'Deliver STAR method responses for two past architectural trade-off decisions.',
    },
    {
      topic: 'Docker Containerization & Kubernetes Basics',
      objective: 'Master containerization workflows, multi-stage builds, and pod orchestration.',
      practiceTask: 'Write an optimized Dockerfile and manifest for a Node.js microservice.',
    },
    {
      topic: 'Advanced React 19 & State Optimization',
      objective: 'Learn server actions, useActionState, Suspense, and client-side caching.',
      practiceTask: 'Refactor data-fetching pipeline with transitions and optimistic UI.',
    },
  ];

  const schedule = Array.from({ length: totalDays }, (_, i) => {
    const template = defaultTopics[i % defaultTopics.length] ?? defaultTopics[0]!;
    const skillOverride = missingSkills[i];
    return {
      day: i + 1,
      topic: skillOverride ? `${skillOverride} Fundamentals & Interview Patterns` : template.topic,
      allocatedMinutes: dailyMinutes,
      objective: template.objective,
      practiceTask: template.practiceTask,
      completed: false,
    };
  });

  return {
    planId: `plan_${Date.now()}`,
    sessionId,
    totalDays,
    dailyMinutes,
    targetRole: 'Senior Full-Stack Engineer',
    schedule,
    createdAt: new Date().toISOString(),
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
