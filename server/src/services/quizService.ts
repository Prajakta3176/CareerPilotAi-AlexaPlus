// LLM-powered: domain-agnostic quiz generation for any topic
import { callLLMJSON } from './llm';
import { repository } from '../storage/repository';

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
};

export type Quiz = {
  quizId: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: QuizQuestion[];
};

export type QuizSubmission = {
  questionId: string;
  selectedOption: string;
  correctOption: string;
};

export type QuizResult = {
  quizId: string;
  topic: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
  passed: boolean;
  feedback: string;
  adaptedTopic?: string;
};

const QUIZ_SYSTEM_PROMPT = `You are an expert quiz designer and educator. Create rigorous, domain-specific multiple-choice questions.
You can generate questions for ANY field: software engineering, medicine, law, finance, data science, design, languages, marketing, etc.
Questions must test real understanding, not just surface memorization.
Each question must have exactly 4 options. The correctOption must exactly match one of the options strings.
Return ONLY valid JSON, no markdown, no code blocks.`;

export async function getQuizForTopic(
  topic: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
): Promise<Quiz> {
  const topicPrefix = topic.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();

  try {
    const result = await callLLMJSON<{ questions: QuizQuestion[] }>(
      QUIZ_SYSTEM_PROMPT,
      `Generate 3 multiple-choice quiz questions about: ${topic}
Difficulty level: ${difficulty}

Return JSON in this exact format:
{
  "questions": [
    {
      "id": "${topicPrefix}_q1",
      "question": "A specific, clear question about ${topic}",
      "options": [
        "A: First option text",
        "B: Second option text",
        "C: Third option text",
        "D: Fourth option text"
      ],
      "correctOption": "A: First option text",
      "explanation": "Why this answer is correct and why the others are wrong"
    },
    {
      "id": "${topicPrefix}_q2",
      "question": "Second question about ${topic}",
      "options": ["A: ...", "B: ...", "C: ...", "D: ..."],
      "correctOption": "A: ...",
      "explanation": "..."
    },
    {
      "id": "${topicPrefix}_q3",
      "question": "Third question about ${topic}",
      "options": ["A: ...", "B: ...", "C: ...", "D: ..."],
      "correctOption": "A: ...",
      "explanation": "..."
    }
  ]
}

Rules:
- Questions must be specific to ${topic} — not generic
- If medical topic: ask about clinical concepts, pathophysiology, pharmacology
- If legal topic: ask about case law, statutes, legal principles
- If coding topic: ask about specific language features, patterns, best practices
- If finance topic: ask about financial instruments, regulations, calculations
- The correctOption string must exactly match one of the 4 options strings
- IDs must use the pattern: ${topicPrefix}_q1, ${topicPrefix}_q2, ${topicPrefix}_q3
- Make distractors plausible (not obviously wrong)`
    );

    return {
      quizId: `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      topic,
      difficulty,
      questions: result.questions || [],
    };
  } catch (err) {
    console.error('[quizService] LLM quiz generation failed, using fallback:', err);
    // Fallback with unique IDs per topic
    return {
      quizId: `quiz_${Date.now()}`,
      topic,
      difficulty,
      questions: [
        {
          id: `${topicPrefix}_q1`,
          question: `What is a core principle of ${topic}?`,
          options: [
            'A: Modular design with clear boundaries and separation of concerns',
            'B: Tight coupling of all components into a single unit',
            'C: Avoiding any form of abstraction or encapsulation',
            'D: Using only synchronous blocking operations',
          ],
          correctOption: 'A: Modular design with clear boundaries and separation of concerns',
          explanation: 'Modularity and separation of concerns are foundational principles in most professional domains.',
        },
        {
          id: `${topicPrefix}_q2`,
          question: `When approaching a complex problem in ${topic}, what is the recommended first step?`,
          options: [
            'A: Break the problem into smaller, well-defined sub-problems',
            'B: Immediately implement the first solution that comes to mind',
            'C: Wait until all requirements are perfectly specified',
            'D: Delegate the problem without attempting to understand it',
          ],
          correctOption: 'A: Break the problem into smaller, well-defined sub-problems',
          explanation: 'Decomposing complex problems into smaller parts is a universal best practice across all domains.',
        },
        {
          id: `${topicPrefix}_q3`,
          question: `How is quality typically measured and maintained in ${topic}?`,
          options: [
            'A: Through systematic review, testing, and iterative improvement',
            'B: By assuming the first version is always correct',
            'C: By avoiding documentation to save time',
            'D: By only reviewing work once before delivery',
          ],
          correctOption: 'A: Through systematic review, testing, and iterative improvement',
          explanation: 'Systematic review and iterative refinement are how professionals in any domain ensure quality.',
        },
      ],
    };
  }
}

export async function gradeQuizSubmission(
  sessionId: string,
  quizId: string,
  topic: string,
  submissions: QuizSubmission[]
): Promise<QuizResult> {
  // Fix: handle empty submissions without recording a false failure
  if (!submissions || submissions.length === 0) {
    return {
      quizId,
      topic,
      totalQuestions: 0,
      correctCount: 0,
      score: 0,
      passed: false,
      feedback: 'No answers submitted. Please complete the quiz and try again.',
    };
  }

  const correctCount = submissions.filter(
    (s) => s.selectedOption?.trim() === s.correctOption?.trim()
  ).length;

  const total = submissions.length;
  const score = Math.round((correctCount / total) * 100);
  const passed = score >= 70;

  const result: QuizResult = {
    quizId,
    topic,
    totalQuestions: total,
    correctCount,
    score,
    passed,
    feedback: passed
      ? `Excellent! You scored ${score}% on ${topic} — strong understanding demonstrated. Keep up the momentum!`
      : `You scored ${score}% on ${topic}. Review the key concepts and try again — your study plan has been updated to reinforce this area.`,
    adaptedTopic: !passed ? topic : undefined,
  };

  // Record into repository and Postgres
  await repository.addQuizResult(sessionId, result);

  return result;
}
