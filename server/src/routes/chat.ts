/**
 * Chat Routes — conversational AI via Orchestrator
 */
import { Router, Request, Response } from 'express';
import { Orchestrator } from '../agent/orchestrator';
import { repository } from '../storage/repository';

const router = Router();

// In-memory orchestrator pool (one per session)
const orchestrators = new Map<string, Orchestrator>();

// POST /api/chat
router.post('/', async (req: Request, res: Response) => {
  try {
    const { sessionId, message, type } = req.body;
    const sid = sessionId ? String(sessionId) : `session_${Date.now()}`;

    if (!orchestrators.has(sid)) {
      orchestrators.set(sid, new Orchestrator());
    }
    const orchestrator = orchestrators.get(sid)!;

    const contextData = {
      skillGap: repository.getComparison(sid),
      studyPlan: repository.getPlan(sid),
      quizHistory: repository.getQuizHistory(sid),
    };

    let reply: string;

    if (type === 'explain_gap' && contextData.skillGap) {
      reply = await orchestrator.explainSkillGap(contextData.skillGap);
    } else if (type === 'explain_plan' && contextData.studyPlan) {
      reply = await orchestrator.explainPlan(contextData.studyPlan);
    } else if (type === 'explain_quiz') {
      const lastResult = contextData.quizHistory?.[contextData.quizHistory.length - 1];
      reply = lastResult
        ? await orchestrator.explainQuizResult(lastResult)
        : 'No quiz results found yet. Take a quiz first!';
    } else {
      reply = await orchestrator.chat(message || 'Hello', contextData);
    }

    res.json({ reply, sessionId: sid });
  } catch (error: any) {
    console.error('[Route /chat] Error:', error);
    res.status(500).json({ error: error.message || 'Chat failed' });
  }
});

export default router;
