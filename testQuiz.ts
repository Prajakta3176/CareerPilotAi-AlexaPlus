
import { generateQuiz, evaluateQuiz } from "./services/quizService";
import { pool } from "./services/db";

async function main() {
  try {
    const missingSkills = ["React", "Node.js", "REST API"];

    const questions = generateQuiz(missingSkills);

    const answers = [
      "To manage component state",
      "Running JavaScript outside the browser",
      "GET",
    ];

    const result = await evaluateQuiz(questions, answers, 1);

    console.log("Quiz evaluated successfully!");
    console.log(JSON.stringify(result, null, 2));
    console.log("Quiz results saved to PostgreSQL!");
  } catch (error) {
    console.error("Quiz test failed:", error);
  } finally {
    await pool.end();
  }
}

main();
