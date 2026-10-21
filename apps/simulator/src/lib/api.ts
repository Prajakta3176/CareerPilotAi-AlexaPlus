/**
 * API client for communicating with the CareerPilot backend server.
 * All HTTP calls to /api/* go through here.
 */

const API_BASE = '/api';

export interface ApiError {
  message: string;
  status: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error: ApiError = {
      message: `Request failed: ${response.statusText}`,
      status: response.status,
    };
    throw error;
  }

  return response.json() as Promise<T>;
}

// ── Analysis ──
export async function analyzeJob(jobDescription: string) {
  return request('/analysis/job', {
    method: 'POST',
    body: JSON.stringify({ jobDescription }),
  });
}

export async function analyzeResume(resume: string) {
  return request('/analysis/resume', {
    method: 'POST',
    body: JSON.stringify({ resume }),
  });
}

export async function compareSkills(sessionId: string) {
  return request(`/analysis/compare/${sessionId}`);
}

// ── Plans ──
export async function generatePlan(sessionId: string, options: { days: number; dailyMinutes: number }) {
  return request('/plans/generate', {
    method: 'POST',
    body: JSON.stringify({ sessionId, ...options }),
  });
}

export async function getPlan(sessionId: string) {
  return request(`/plans/${sessionId}`);
}

// ── Quiz ──
export async function generateQuiz(sessionId: string, topic: string) {
  return request('/quiz/generate', {
    method: 'POST',
    body: JSON.stringify({ sessionId, topic }),
  });
}

export async function submitQuiz(sessionId: string, answers: Record<string, string>) {
  return request('/quiz/submit', {
    method: 'POST',
    body: JSON.stringify({ sessionId, answers }),
  });
}

// ── Progress ──
export async function getProgress(sessionId: string) {
  return request(`/progress/${sessionId}`);
}
