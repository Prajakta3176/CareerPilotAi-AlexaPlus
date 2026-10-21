/**
 * MCP Tools Registry and Handlers
 * Defines schemas and dispatch handlers for all CareerPilot MCP tools.
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
  {
    name: 'analyze_job',
    description: 'Extract structured required skills, experience level, and role expectations from a job description text.',
    inputSchema: {
      type: 'object',
      properties: {
        jobText: {
          type: 'string',
          description: 'The full text of the job description or posting',
        },
        roleTitle: {
          type: 'string',
          description: 'Optional role title (e.g. Senior Frontend Engineer)',
        },
      },
      required: ['jobText'],
    },
  },
  {
    name: 'analyze_resume',
    description: 'Extract candidate skills, years of experience, projects, and evidence snippets from resume text.',
    inputSchema: {
      type: 'object',
      properties: {
        resumeText: {
          type: 'string',
          description: 'Plain text or extracted text of the candidate resume',
        },
      },
      required: ['resumeText'],
    },
  },
  {
    name: 'compare_skills',
    description: 'Perform skill gap analysis between required job skills and candidate resume skills.',
    inputSchema: {
      type: 'object',
      properties: {
        jobSkills: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of skills extracted from job description',
        },
        resumeSkills: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of skills extracted from candidate resume',
        },
      },
      required: ['jobSkills', 'resumeSkills'],
    },
  },
  {
    name: 'generate_plan',
    description: 'Generate a personalized multi-day preparation plan based on identified skill gaps and available daily study time.',
    inputSchema: {
      type: 'object',
      properties: {
        skillGaps: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of missing or partially matched skills to focus on',
        },
        dailyMinutes: {
          type: 'number',
          description: 'Available study time per day in minutes (default 60)',
        },
        totalDays: {
          type: 'number',
          description: 'Number of preparation days before interview (e.g. 5 or 7)',
        },
      },
      required: ['skillGaps', 'totalDays'],
    },
  },
  {
    name: 'generate_quiz',
    description: 'Generate 3 to 5 adaptive interview questions for a specific skill topic, with multiple-choice options and answers.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Topic or skill name (e.g. System Design, React Performance, SQL Indexing)',
        },
        difficulty: {
          type: 'string',
          enum: ['beginner', 'intermediate', 'advanced'],
          description: 'Difficulty level',
        },
        count: {
          type: 'number',
          description: 'Number of questions to generate (default 3)',
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'grade_quiz',
    description: 'Grade candidate answers to quiz questions, providing score percentage, breakdown, and feedback.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Topic of the quiz',
        },
        submissions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              questionId: { type: 'string' },
              selectedOption: { type: 'string' },
              correctOption: { type: 'string' },
            },
            required: ['questionId', 'selectedOption', 'correctOption'],
          },
          description: 'List of candidate answers alongside correct options',
        },
      },
      required: ['topic', 'submissions'],
    },
  },
  {
    name: 'get_progress',
    description: 'Retrieve current preparation progress, completed plan days, and quiz history for a candidate session.',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Unique session identifier',
        },
      },
      required: ['sessionId'],
    },
  },
  {
    name: 'update_progress',
    description: 'Record day completion or quiz attempt results to persist session progress.',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Unique session identifier',
        },
        completedDay: {
          type: 'number',
          description: 'Day number completed',
        },
        quizScore: {
          type: 'number',
          description: 'Quiz score percentage achieved',
        },
        topic: {
          type: 'string',
          description: 'Topic associated with update',
        },
      },
      required: ['sessionId'],
    },
  },
];

export async function handleToolCall(name: string, args: Record<string, unknown>) {
  console.log(`[MCP Tool Call] Tool: ${name}`, args);

  switch (name) {
    case 'analyze_job': {
      const jobText = String(args.jobText || '');
      // Mock / initial heuristic extraction (member 3 can connect to LLM or call server API)
      const mockSkills = ['TypeScript', 'React', 'Node.js', 'System Design', 'REST APIs', 'Cloud Architecture'];
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              role: args.roleTitle || 'Full Stack Engineer',
              requiredSkills: mockSkills,
              experienceLevel: 'Mid to Senior',
              summary: `Extracted ${mockSkills.length} key competencies from job description.`,
            }, null, 2),
          },
        ],
      };
    }

    case 'analyze_resume': {
      const mockSkills = ['TypeScript', 'React', 'JavaScript', 'HTML/CSS', 'Git'];
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              candidateSkills: mockSkills,
              yearsOfExperience: 3,
              summary: 'Candidate shows strong frontend baseline with TypeScript and React experience.',
            }, null, 2),
          },
        ],
      };
    }

    case 'compare_skills': {
      const jobSkills = (args.jobSkills as string[]) || [];
      const resumeSkills = (args.resumeSkills as string[]) || [];
      const resumeLower = new Set(resumeSkills.map((s) => s.toLowerCase()));

      const matched: string[] = [];
      const missing: string[] = [];

      for (const skill of jobSkills) {
        if (resumeLower.has(skill.toLowerCase())) {
          matched.push(skill);
        } else {
          missing.push(skill);
        }
      }

      const matchScore = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              matchScore,
              matched,
              missing,
              recommendation: `Focus preparation on ${missing.slice(0, 3).join(', ')}.`,
            }, null, 2),
          },
        ],
      };
    }

    case 'generate_plan': {
      const gaps = (args.skillGaps as string[]) || ['System Design', 'Cloud Architecture', 'Node.js'];
      const totalDays = Number(args.totalDays) || 5;
      const dailyMinutes = Number(args.dailyMinutes) || 60;

      const schedule = Array.from({ length: totalDays }, (_, i) => {
        const topic = gaps[i % gaps.length] || 'Interview Mock & Review';
        return {
          day: i + 1,
          topic,
          allocatedMinutes: dailyMinutes,
          objective: `Master core principles and interview patterns for ${topic}`,
          practiceTask: `Complete hands-on exercise and self-assessment for ${topic}`,
          completed: false,
        };
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              totalDays,
              dailyMinutes,
              schedule,
            }, null, 2),
          },
        ],
      };
    }

    case 'generate_quiz': {
      const topic = String(args.topic || 'General Technical');
      const questions = [
        {
          id: 'q1',
          question: `Which of the following is considered a best practice in ${topic}?`,
          options: ['Option A: Linear scaling with caching', 'Option B: Unbounded queue depth', 'Option C: Hardcoded configuration', 'Option D: Synchronous polling'],
          correctOption: 'Option A: Linear scaling with caching',
          explanation: 'Caching reduces roundtrips and mitigates latency bottlenecks.',
        },
        {
          id: 'q2',
          question: `In a production scenario involving ${topic}, what is the primary failure mode to guard against?`,
          options: ['Resource exhaustion & cascading failures', 'Excessive logging', 'Fast cold start', 'Strict typing'],
          correctOption: 'Resource exhaustion & cascading failures',
          explanation: 'Cascading failures propagate across distributed dependencies without circuit breakers.',
        },
        {
          id: 'q3',
          question: `How does one typically measure resilience and latency for ${topic}?`,
          options: ['P99 latency & error budgets', 'Only average CPU usage', 'Number of code commits', 'Bundle file count'],
          correctOption: 'P99 latency & error budgets',
          explanation: 'P99 tail latency and SLIs/SLOs define real user experience and reliability.',
        },
      ];

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              topic,
              questions,
            }, null, 2),
          },
        ],
      };
    }

    case 'grade_quiz': {
      const submissions = (args.submissions as Array<{ selectedOption: string; correctOption: string }>) || [];
      let correctCount = 0;
      for (const sub of submissions) {
        if (sub.selectedOption === sub.correctOption) {
          correctCount++;
        }
      }
      const score = submissions.length > 0 ? Math.round((correctCount / submissions.length) * 100) : 0;
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              topic: args.topic,
              totalQuestions: submissions.length,
              correctCount,
              score,
              passed: score >= 70,
              feedback: score >= 70 ? 'Solid mastery demonstrated! Ready for next topic.' : 'Review recommended before moving on.',
            }, null, 2),
          },
        ],
      };
    }

    case 'get_progress': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              sessionId: args.sessionId,
              overallProgress: 40,
              completedDays: [1, 2],
              quizzesTaken: 2,
              averageScore: 85,
            }, null, 2),
          },
        ],
      };
    }

    case 'update_progress': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              sessionId: args.sessionId,
              message: 'Progress recorded successfully.',
            }, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
