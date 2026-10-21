
import { pool } from "./db";

export type QuizResultInput = {
  userId: number;
  skill: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
};

export async function saveQuizResult(result: QuizResultInput) {
  const query = `
    INSERT INTO quiz_results
      (user_id, skill, total_questions, correct_answers, score)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    result.userId,
    result.skill,
    result.totalQuestions,
    result.correctAnswers,
    result.score,
  ];

  const response = await pool.query(query, values);
  return response.rows[0];
}
