/**
 * Quiz Routes — async LLM-powered quiz generation + DB persistence
 */
import { Router, Request, Response } from 'express';
import { getQuizForTopic, gradeQuizSubmission } from '../services/quizService';
import { repository } from '../storage/repository';

const router = Router();

// POST /api/quiz/generate
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { topic = 'General Knowledge', difficulty = 'intermediate' } = req.body;
    const quiz = await getQuizForTopic(String(topic), difficulty as 'beginner' | 'intermediate' | 'advanced');
    res.json(quiz);
  } catch (error: any) {
    console.error('[Route /quiz/generate] Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
});

// POST /api/quiz/submit
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { sessionId, quizId, topic, submissions } = req.body;
    const sid = sessionId ? String(sessionId) : `session_${Date.now()}`;
    const qid = quizId ? String(quizId) : `quiz_${Date.now()}`;
    const top = topic ? String(topic) : 'General Technical';
    const result = await gradeQuizSubmission(sid, qid, top, submissions || []);
    res.json(result);
  } catch (error: any) {
    console.error('[Route /quiz/submit] Error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit quiz' });
  }
});

// GET /api/quiz/history/:sessionId
router.get('/history/:sessionId', async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.sessionId || '');
    const history = await repository.getQuizHistory(sessionId);
    res.json({ sessionId, history });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
