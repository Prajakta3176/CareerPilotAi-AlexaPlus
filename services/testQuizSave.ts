
import "dotenv/config";
import { saveQuizResult } from "./quizResultRepository";

async function main() {
  try {
    const result = await saveQuizResult({
      userId: 1,
      skill: "React",
      totalQuestions: 3,
      correctAnswers: 2,
      score: 67,
    });

    console.log("Quiz result saved successfully!");
    console.log(result);
  } catch (error) {
    console.error("Failed to save quiz result:", error);
  } finally {
    // Connection pool ko test ke baad close karenge.
    const { pool } = await import("./db");
    await pool.end();
  }
}

main();
