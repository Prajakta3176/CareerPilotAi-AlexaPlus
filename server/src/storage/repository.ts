/**
 * Repository — PostgreSQL Persistence Layer with In-Memory Caching
 * Persists sessions, skill gaps, study plans, quiz results, and progress
 * directly into PostgreSQL.
 */
import { pool } from '../services/db';
import { saveSkillGapReport } from '../services/skillGapRepository';
import { saveStudyPlan } from '../services/studyPlanRepository';
import { saveQuizResult } from '../services/quizResultRepository';

export interface StoredSession {
  sessionId: string;
  comparison?: any;
  plan?: any;
  quizHistory: any[];
  progress: {
    sessionId: string;
    overallProgress: number;
    completedDays: number[];
    totalQuizzesTaken: number;
    averageQuizScore: number;
    topicMastery: Record<string, number>;
  };
  updatedAt: string;
}

export class RepositoryStore {
  protected sessions = new Map<string, StoredSession>();
  private defaultUserId = 1;

  public async init() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS session_store (
          session_id TEXT PRIMARY KEY,
          comparison JSONB,
          plan JSONB,
          quiz_history JSONB,
          progress JSONB,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('[Database] PostgreSQL session_store table verified');
    } catch (err: any) {
      console.warn('[Database] Could not verify session_store table:', err.message);
    }
  }

  public async getSession(sessionId: string): Promise<StoredSession> {
    let session = this.sessions.get(sessionId);
    if (!session) {
      // Try to load from PostgreSQL
      try {
        const res = await pool.query('SELECT * FROM session_store WHERE session_id = $1', [sessionId]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          session = {
            sessionId: row.session_id,
            comparison: row.comparison || null,
            plan: row.plan || null,
            quizHistory: row.quiz_history || [],
            progress: row.progress || {
              sessionId,
              overallProgress: 0,
              completedDays: [],
              totalQuizzesTaken: 0,
              averageQuizScore: 0,
              topicMastery: {},
            },
            updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
          };
          this.sessions.set(sessionId, session);
          return session;
        }
      } catch (err: any) {
        console.warn(`[Database] Failed to load session ${sessionId} from Postgres:`, err.message);
      }

      session = {
        sessionId,
        quizHistory: [],
        progress: {
          sessionId,
          overallProgress: 0,
          completedDays: [],
          totalQuizzesTaken: 0,
          averageQuizScore: 0,
          topicMastery: {},
        },
        updatedAt: new Date().toISOString(),
      };
      this.sessions.set(sessionId, session);
      await this.persistSession(session);
    }
    return session;
  }

  public getOrCreateSession(sessionId: string): StoredSession {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        quizHistory: [],
        progress: {
          sessionId,
          overallProgress: 0,
          completedDays: [],
          totalQuizzesTaken: 0,
          averageQuizScore: 0,
          topicMastery: {},
        },
        updatedAt: new Date().toISOString(),
      };
      this.sessions.set(sessionId, session);
      this.getSession(sessionId).catch(() => {});
    }
    return session;
  }

  private async persistSession(session: StoredSession) {
    try {
      const query = `
        INSERT INTO session_store (session_id, comparison, plan, quiz_history, progress, updated_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        ON CONFLICT (session_id)
        DO UPDATE SET
          comparison = EXCLUDED.comparison,
          plan = EXCLUDED.plan,
          quiz_history = EXCLUDED.quiz_history,
          progress = EXCLUDED.progress,
          updated_at = CURRENT_TIMESTAMP;
      `;
      await pool.query(query, [
        session.sessionId,
        JSON.stringify(session.comparison || null),
        JSON.stringify(session.plan || null),
        JSON.stringify(session.quizHistory || []),
        JSON.stringify(session.progress || {}),
      ]);

      // Sync to session_progress table
      await pool.query(
        `INSERT INTO session_progress (session_id, progress, updated_at)
         VALUES ($1, $2::jsonb, CURRENT_TIMESTAMP)
         ON CONFLICT (session_id)
         DO UPDATE SET
           progress = EXCLUDED.progress,
           updated_at = CURRENT_TIMESTAMP;`,
        [session.sessionId, JSON.stringify(session.progress)]
      );
    } catch (err: any) {
      console.error('[Database] Failed to persist session to Postgres:', err.message);
    }
  }

  public async saveComparison(sessionId: string, comparison: any) {
    const session = await this.getSession(sessionId);
    session.comparison = comparison;
    session.updatedAt = new Date().toISOString();

    await this.persistSession(session);

    // Write to skill_gaps table
    try {
      const resumeSkills = (comparison.matched || []).map((m: any) => m.name);
      const missingSkills = (comparison.missing || []).map((m: any) => m.name);
      const requiredSkills = [...resumeSkills, ...missingSkills];

      await saveSkillGapReport({
        userId: this.defaultUserId,
        resumeSkills,
        requiredSkills,
        missingSkills,
        matchPercentage: comparison.matchScore || 0,
      });
    } catch (err: any) {
      console.warn('[Database] Failed to write to skill_gaps table:', err.message);
    }

    return comparison;
  }

  public async getComparison(sessionId: string) {
    const session = await this.getSession(sessionId);
    return session.comparison || null;
  }

  public async savePlan(sessionId: string, plan: any) {
    const session = await this.getSession(sessionId);
    session.plan = plan;
    session.updatedAt = new Date().toISOString();

    await this.persistSession(session);

    // Write to study_plans table
    try {
      if (Array.isArray(plan.schedule)) {
        const items = plan.schedule.map((s: any) => ({
          day: s.day,
          skill: s.topic,
          topics: [s.objective || s.topic],
        }));
        await saveStudyPlan(this.defaultUserId, items);
      }
    } catch (err: any) {
      console.warn('[Database] Failed to write to study_plans table:', err.message);
    }

    return plan;
  }

  public async getPlan(sessionId: string) {
    const session = await this.getSession(sessionId);
    return session.plan || null;
  }

  public async updatePlanDay(sessionId: string, dayNum: number, completed: boolean) {
    const session = await this.getSession(sessionId);
    if (session.plan && Array.isArray(session.plan.schedule)) {
      const day = session.plan.schedule.find((d: any) => d.day === dayNum);
      if (day) {
        day.completed = completed;
      }
      const completedDays = session.plan.schedule
        .filter((d: any) => d.completed)
        .map((d: any) => d.day);
      session.progress.completedDays = completedDays;
      session.progress.overallProgress = Math.round(
        (completedDays.length / session.plan.schedule.length) * 100
      );
    }

    await this.persistSession(session);

    // Update study_plans completed column
    try {
      await pool.query(
        'UPDATE study_plans SET completed = $1 WHERE user_id = $2 AND day_number = $3',
        [completed, this.defaultUserId, dayNum]
      );
    } catch (err: any) {
      console.warn('[Database] Failed to update study_plans day completion:', err.message);
    }

    return session.plan;
  }

  public async addQuizResult(sessionId: string, result: any) {
    const session = await this.getSession(sessionId);
    session.quizHistory.push(result);
    session.progress.totalQuizzesTaken = session.quizHistory.length;
    const totalScore = session.quizHistory.reduce((acc, q) => acc + (q.score || 0), 0);
    session.progress.averageQuizScore = Math.round(totalScore / session.quizHistory.length);

    if (result.topic) {
      session.progress.topicMastery[result.topic] = result.score;
    }

    session.updatedAt = new Date().toISOString();

    await this.persistSession(session);

    // Write to quiz_results table
    try {
      await saveQuizResult({
        userId: this.defaultUserId,
        skill: result.topic || 'General',
        totalQuestions: result.totalQuestions || 3,
        correctAnswers: result.correctCount || 0,
        score: result.score || 0,
      });
    } catch (err: any) {
      console.warn('[Database] Failed to write to quiz_results table:', err.message);
    }

    return result;
  }

  public async getQuizHistory(sessionId: string) {
    const session = await this.getSession(sessionId);
    return session.quizHistory || [];
  }

  public async getProgress(sessionId: string) {
    const session = await this.getSession(sessionId);
    return session.progress;
  }

  public async updateProgress(sessionId: string, update: Partial<StoredSession['progress']>) {
    const session = await this.getSession(sessionId);
    session.progress = { ...session.progress, ...update };
    session.updatedAt = new Date().toISOString();
    await this.persistSession(session);
    return session.progress;
  }
}

export const repository = new RepositoryStore();
export class Repository extends RepositoryStore {}
