/**
 * Progress Routes
 * GET  /api/progress/:sessionId — Get user's progress for session
 * POST /api/progress/:sessionId — Update progress manually
 */
import { Router, Request, Response } from 'express';
import { repository } from '../storage/repository';

const router = Router();

// GET /api/progress/:sessionId
router.get('/:sessionId', async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.sessionId || '');
    const progress = await repository.getProgress(sessionId);
    res.json(progress);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get progress' });
  }
});

// POST /api/progress/:sessionId
router.post('/:sessionId', async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.sessionId || '');
    const update = req.body;
    const progress = await repository.updateProgress(sessionId, update);
    res.json(progress);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update progress' });
  }
});

export default router;
