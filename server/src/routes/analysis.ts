/**
 * Analysis Routes
 * POST /api/analysis/compare — Compare skills between job and resume
 * POST /api/analysis/rag-query — Forward questions to Python Qdrant RAG engine
 * POST /api/analysis/job — Extract skills from job description
 * POST /api/analysis/resume — Extract skills from resume
 * GET  /api/analysis/compare/:sessionId — Retrieve cached comparison
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

    const comparison = createSkillGapReport(resumeText, jobText);

    if (sessionId) {
      await repository.saveComparison(String(sessionId), comparison);

      // Asynchronously trigger Python RAG indexing in Qdrant Vector DB
      fetch('http://127.0.0.1:8000/rag/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: String(sessionId),
          resume_text: resumeText,
          job_text: jobText,
        }),
      }).catch(() => {
        // AI service running in parallel / optional
      });
    }

    res.json(comparison);
  } catch (error: any) {
    console.error('[Route /analysis/compare] Error:', error);
    res.status(500).json({ error: error.message || 'Failed to compare skills' });
  }
});

// POST /api/analysis/rag-query
router.post('/rag-query', async (req: Request, res: Response) => {
  try {
    const { sessionId, query, topK = 4 } = req.body;
    const response = await fetch('http://127.0.0.1:8000/rag/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: String(sessionId || ''),
        query: String(query || ''),
        top_k: Number(topK) || 4,
      }),
    });

    if (!response.ok) {
      throw new Error(`RAG service error ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(503).json({
      error: 'Python RAG service offline at port 8000',
      details: error.message,
    });
  }
});

// GET /api/analysis/compare/:sessionId
router.get('/compare/:sessionId', async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.sessionId || '');
    const comparison = await repository.getComparison(sessionId);
    if (!comparison) {
      res.status(404).json({ error: 'No comparison found for this session' });
      return;
    }
    res.json(comparison);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/analysis/job
router.post('/job', (req: Request, res: Response) => {
  try {
    const { jobText } = req.body;
    if (!jobText) {
      res.status(400).json({ error: 'jobText is required.' });
      return;
    }
    const result = analyzeJobDescription(jobText);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/analysis/resume
router.post('/resume', (req: Request, res: Response) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      res.status(400).json({ error: 'resumeText is required.' });
      return;
    }
    const result = analyzeResume(resumeText);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
