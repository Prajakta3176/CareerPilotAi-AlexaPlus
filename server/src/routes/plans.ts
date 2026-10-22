/**
 * Plans Routes
 * POST /api/plans/generate — Generate personalized study plan
 * GET  /api/plans/:sessionId — Get current plan
 * PATCH /api/plans/:sessionId/day/:dayNum — Update day completion
 */
import { Router, Request, Response } from 'express';
import { generatePersonalizedStudyPlan } from '../services/planner';
import { repository } from '../storage/repository';

const router = Router();

// POST /api/plans/generate
router.post('/generate', (req: Request, res: Response) => {
  try {
    const { sessionId, totalDays = 5, dailyMinutes = 60 } = req.body;
    const sid = sessionId ? String(sessionId) : `session_${Date.now()}`;

    // Get missing skills from past comparison if available
    const existingComp = repository.getComparison(sid);
    const missingSkills = existingComp?.missing?.map((m: any) => m.name) || [];

    const plan = generatePersonalizedStudyPlan(
      sid,
      Number(totalDays) || 5,
      Number(dailyMinutes) || 60,
      missingSkills
    );

    repository.savePlan(sid, plan);
    res.json(plan);
  } catch (error: any) {
    console.error('[Route /plans/generate] Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate study plan' });
  }
});

// GET /api/plans/:sessionId
router.get('/:sessionId', (req: Request, res: Response) => {
  const sessionId = String(req.params.sessionId || '');
  const plan = repository.getPlan(sessionId);
  if (!plan) {
    res.status(404).json({ error: 'No plan found for this session' });
    return;
  }
  res.json(plan);
});

// PATCH /api/plans/:sessionId/day/:dayNum
router.patch('/:sessionId/day/:dayNum', (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.sessionId || '');
    const dayNum = String(req.params.dayNum || '');
    const { completed = true } = req.body;
    const updatedPlan = repository.updatePlanDay(sessionId, Number(dayNum), Boolean(completed));
    res.json({ success: true, plan: updatedPlan });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update plan day' });
  }
});

export default router;
