/**
 * Quiz Routes
 * POST /api/quiz/generate — Generate quiz questions for a topic
 * POST /api/quiz/submit — Submit answers and get graded
 * GET  /api/quiz/history/:sessionId — Quiz attempt history
 */
import { Router, Request, Response } from 'express';
import { getQuizForTopic, gradeQuizSubmission } from '../services/quizService';
import { repository } from '../storage/repository';

const router = Router();

// POST /api/quiz/generate
router.post('/generate', (req: Request, res: Response) => {
  try {
    const { topic = 'General Architecture' } = req.body;
    const quiz = getQuizForTopic(String(topic));
    res.json(quiz);
  } catch (error: any) {
    console.error('[Route /quiz/generate] Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
});

// POST /api/quiz/submit
router.post('/submit', (req: Request, res: Response) => {
  try {
    const { sessionId, quizId, topic, submissions } = req.body;
    const sid = sessionId ? String(sessionId) : `session_${Date.now()}`;
    const qid = quizId ? String(quizId) : `quiz_${Date.now()}`;
    const top = topic ? String(topic) : 'General Technical';
    const result = gradeQuizSubmission(sid, qid, top, submissions || []);
    res.json(result);
  } catch (error: any) {
    console.error('[Route /quiz/submit] Error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit quiz' });
  }
});

// GET /api/quiz/history/:sessionId
router.get('/history/:sessionId', (req: Request, res: Response) => {
  const sessionId = String(req.params.sessionId || '');
  const history = repository.getQuizHistory(sessionId);
  res.json({ sessionId, history });
});

export default router;
