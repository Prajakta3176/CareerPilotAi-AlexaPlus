/**
 * CareerPilot Backend Server
 * Express API + Agent Orchestrator + PostgreSQL Persistence
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import analysisRouter from './routes/analysis';
import plansRouter from './routes/plans';
import quizRouter from './routes/quiz';
import progressRouter from './routes/progress';
import { initDatabase } from './storage/db';

const app = express();
const PORT = process.env.SERVER_PORT ?? 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Initialize Database persistence
initDatabase();

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'careerpilot-server',
    database: 'postgresql',
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
app.use('/api/analysis', analysisRouter);
app.use('/api/plans', plansRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/progress', progressRouter);

app.listen(PORT, () => {
  console.log(`🚀 CareerPilot Server running on http://127.0.0.1:${PORT}`);
  console.log(`   Health: http://127.0.0.1:${PORT}/health`);
  console.log(`   Routes mounted: /api/analysis, /api/plans, /api/quiz, /api/progress`);
});
