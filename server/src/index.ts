/**
 * CareerPilot Backend Server
 * Express API + Agent Orchestrator (Groq-powered) + PostgreSQL Persistence
 */
import dotenv from 'dotenv';
import path from 'path';

// Load .env from both local and parent directories
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import express from 'express';
import cors from 'cors';

import analysisRouter from './routes/analysis';
import plansRouter from './routes/plans';
import quizRouter from './routes/quiz';
import progressRouter from './routes/progress';
import chatRouter from './routes/chat';
import { initDatabase } from './storage/db';

const app = express();
const PORT = process.env.SERVER_PORT ?? 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Initialize Database persistence
initDatabase();

// Health check
app.get('/health', (_req, res) => {
  const hasGroq = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0);
  res.json({
    status: 'ok',
    service: 'careerpilot-server',
    llm: hasGroq ? 'groq-connected' : 'missing-api-key',
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    database: 'postgresql',
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
app.use('/api/analysis', analysisRouter);
app.use('/api/plans', plansRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/progress', progressRouter);
app.use('/api/chat', chatRouter);

app.listen(PORT, () => {
  const hasGroq = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0);
  console.log(`🚀 CareerPilot Server running on http://127.0.0.1:${PORT}`);
  console.log(`   LLM: ${hasGroq ? 'Groq connected' : '⚠️ GROQ_API_KEY missing'} (${process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'})`);
  console.log(`   Health: http://127.0.0.1:${PORT}/health`);
  console.log(`   Routes: /api/analysis, /api/plans, /api/quiz, /api/progress, /api/chat`);
});
