/**
 * Repository — In-memory persistence with session tracking
 */

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
    }
    return session;
  }

  public saveComparison(sessionId: string, comparison: any) {
    const session = this.getOrCreateSession(sessionId);
    session.comparison = comparison;
    session.updatedAt = new Date().toISOString();
    return comparison;
  }

  public getComparison(sessionId: string) {
    return this.sessions.get(sessionId)?.comparison || null;
  }

  public savePlan(sessionId: string, plan: any) {
    const session = this.getOrCreateSession(sessionId);
    session.plan = plan;
    session.updatedAt = new Date().toISOString();
    return plan;
  }

  public getPlan(sessionId: string) {
    return this.sessions.get(sessionId)?.plan || null;
  }

  public updatePlanDay(sessionId: string, dayNum: number, completed: boolean) {
    const session = this.getOrCreateSession(sessionId);
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
    return session.plan;
  }

  public addQuizResult(sessionId: string, result: any) {
    const session = this.getOrCreateSession(sessionId);
    session.quizHistory.push(result);
    session.progress.totalQuizzesTaken = session.quizHistory.length;
    const totalScore = session.quizHistory.reduce((acc, q) => acc + (q.score || 0), 0);
    session.progress.averageQuizScore = Math.round(totalScore / session.quizHistory.length);

    if (result.topic) {
      session.progress.topicMastery[result.topic] = result.score;
    }

    session.updatedAt = new Date().toISOString();
    return result;
  }

  public getQuizHistory(sessionId: string) {
    return this.sessions.get(sessionId)?.quizHistory || [];
  }

  public getProgress(sessionId: string) {
    return this.getOrCreateSession(sessionId).progress;
  }

  public updateProgress(sessionId: string, update: Partial<StoredSession['progress']>) {
    const session = this.getOrCreateSession(sessionId);
    session.progress = { ...session.progress, ...update };
    session.updatedAt = new Date().toISOString();
    return session.progress;
  }
}

export const repository = new RepositoryStore();
export class Repository extends RepositoryStore {}
