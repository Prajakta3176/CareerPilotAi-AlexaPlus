
import { saveQuizResult } from "./quizResultRepository";

export type QuizQuestion = {
  skill: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

const questionBank: Record<string, QuizQuestion[]> = {
  React: [
    {
      skill: "React",
      question: "What is the purpose of useState in React?",
      options: [
        "To manage component state",
        "To style components",
        "To create a database",
        "To navigate between pages",
      ],
      correctAnswer: "To manage component state",
      explanation:
        "useState lets a functional component store and update state.",
    },
  ],

  "Node.js": [
    {
      skill: "Node.js",
      question: "What is Node.js primarily used for?",
      options: [
        "Running JavaScript outside the browser",
        "Writing CSS styles",
        "Creating HTML tags",
        "Managing image files only",
      ],
      correctAnswer: "Running JavaScript outside the browser",
      explanation:
        "Node.js runs JavaScript outside the browser, commonly for backend development.",
    },
  ],

  "REST API": [
    {
      skill: "REST API",
      question: "Which HTTP method is commonly used to retrieve data?",
      options: ["POST", "GET", "DELETE", "PATCH"],
      correctAnswer: "GET",
      explanation:
        "GET requests are commonly used to retrieve resources.",
    },
  ],
};

export function generateQuiz(missingSkills: string[]) {
  return missingSkills.flatMap(
    (skill) => questionBank[skill] ?? []
  );
}

export async function evaluateQuiz(
  questions: QuizQuestion[],
  answers: string[],
  userId: number
) {
  const results = questions.map((question, index) => ({
    skill: question.skill,
    correct: question.correctAnswer === answers[index],
    explanation: question.explanation,
  }));

  const correctCount = results.filter(
    (result) => result.correct
  ).length;

  const score =
    questions.length === 0
      ? 0
      : Math.round((correctCount / questions.length) * 100);

  // Har quiz question ke skill ka result database mein save karo.
  const skills = [...new Set(questions.map((question) => question.skill))];

  for (const skill of skills) {
    const skillQuestions = questions.filter(
      (question) => question.skill === skill
    );

    const skillResults = results.filter(
      (result) => result.skill === skill
    );

    const skillCorrect = skillResults.filter(
      (result) => result.correct
    ).length;

    const skillScore =
      skillQuestions.length === 0
        ? 0
        : Math.round(
            (skillCorrect / skillQuestions.length) * 100
          );

    await saveQuizResult({
      userId,
      skill,
      totalQuestions: skillQuestions.length,
      correctAnswers: skillCorrect,
      score: skillScore,
    });
  }

  return {
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    score,
    results,
  };
}
