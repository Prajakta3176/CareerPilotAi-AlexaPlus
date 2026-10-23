/**
 * Analysis Routes — now async, LLM-powered
 */
import { Router, Request, Response } from 'express';
import { createSkillGapReport } from '../services/planner';
import { analyzeJobDescription } from '../services/jobAnalyzer';
import { analyzeResume } from '../services/resumeAnalyzer';
import { repository } from '../storage/repository';

const router = Router();

// POST /api/analysis/compare
router.post('/compare', async (req: Request, res: Response) => {
  try {
    const { sessionId, jobText, resumeText } = req.body;
    if (!jobText || !resumeText) {
      res.status(400).json({ error: 'jobText and resumeText are required.' });
      return;
    }

    const comparison = await createSkillGapReport(resumeText, jobText);

    if (sessionId) {
      repository.saveComparison(String(sessionId), comparison);
    }

    res.json(comparison);
  } catch (error: any) {
    console.error('[Route /analysis/compare] Error:', error);
    res.status(500).json({ error: error.message || 'Failed to compare skills' });
  }
});

// GET /api/analysis/compare/:sessionId
router.get('/compare/:sessionId', (req: Request, res: Response) => {
  const sessionId = String(req.params.sessionId || '');
  const comparison = repository.getComparison(sessionId);
  if (!comparison) {
    res.status(404).json({ error: 'No comparison found for this session' });
    return;
  }
  res.json(comparison);
});

// POST /api/analysis/job
router.post('/job', async (req: Request, res: Response) => {
  try {
    const { jobText } = req.body;
    if (!jobText) {
      res.status(400).json({ error: 'jobText is required.' });
      return;
    }
    const result = await analyzeJobDescription(jobText);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/analysis/resume
router.post('/resume', async (req: Request, res: Response) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      res.status(400).json({ error: 'resumeText is required.' });
      return;
    }
    const result = await analyzeResume(resumeText);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
