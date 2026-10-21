/**
 * CareerPilot Simulator — Central State Context
 * Holds session data, conversation messages, plan, quiz state, and live tool traces.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  SkillComparison,
  StudyPlan,
  Quiz,
  QuizResult,
  SessionProgress,
  ToolTraceItem,
  ChatMessage,
  ActiveTab,
} from '../types';
import {
  analyzeJobAndResume,
  generateStudyPlan,
  fetchQuiz,
  submitQuizAnswers,
  fetchProgress,
  registerTraceListener,
} from '../lib/api';

interface SimulatorContextType {
  sessionId: string;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  // Inputs
  jobText: string;
  setJobText: (val: string) => void;
  resumeText: string;
  setResumeText: (val: string) => void;
  days: number;
  setDays: (val: number) => void;
  dailyMinutes: number;
  setDailyMinutes: (val: number) => void;
  isSampleLoaded: boolean;
  loadSampleData: () => void;
  // Domain data
  comparison: SkillComparison | null;
  plan: StudyPlan | null;
  activeQuiz: Quiz | null;
  quizResult: QuizResult | null;
  progress: SessionProgress | null;
  toolTraces: ToolTraceItem[];
  messages: ChatMessage[];
  // Loading states
  isAnalyzing: boolean;
  isPlanning: boolean;
  isQuizzing: boolean;
  isSubmittingQuiz: boolean;
  // Actions
  runAnalysis: () => Promise<void>;
  createPlan: () => Promise<void>;
  startQuiz: (topic: string) => Promise<void>;
  submitQuiz: (submissions: Array<{ questionId: string; selectedOption: string; correctOption: string }>) => Promise<void>;
  toggleDayCompletion: (dayNum: number) => void;
  sendChatMessage: (content: string) => Promise<void>;
  resetSession: () => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

const SAMPLE_JOB_TEXT = `Title: Senior Full-Stack Engineer
Company: CloudScale Innovations
Location: Seattle, WA (Hybrid)

Key Responsibilities:
- Design and implement end-to-end features using TypeScript, React 19, and Node.js.
- Architect resilient REST and GraphQL APIs backed by PostgreSQL and Redis.
- Build distributed event-driven workflows leveraging AWS (Lambda, SQS, DynamoDB).
- Ensure reliability, observability, and 99.99% uptime with CI/CD and automated testing.
- Mentor junior developers and participate in architectural design reviews.

Required Qualifications:
- 4+ years of professional full-stack development experience.
- Deep expertise in TypeScript, React, and modern CSS/state management.
- Hands-on experience with Node.js microservices and SQL/NoSQL databases.
- Strong grasp of distributed systems concepts, caching strategies, and REST API design.
- Familiarity with AWS cloud services and Docker containerization.`;

const SAMPLE_RESUME_TEXT = `Alex Morgan
alex.morgan@example.com | Full-Stack Software Engineer (3+ Years Experience)

Professional Summary:
Full-Stack Software Engineer specializing in React frontends, TypeScript, and Express APIs. Proven track record of improving web app performance and shipping responsive customer-facing features. Looking to expand into cloud architecture and distributed systems.

Core Skills:
JavaScript, TypeScript, React, Next.js, Node.js, Express, HTML5 / CSS3, Git, PostgreSQL, Jest, TailwindCSS.

Experience:
Frontend / Full-Stack Engineer — Apex Web Tech (2023 - Present)
- Built responsive client portals with React and TypeScript, boosting engagement by 35%.
- Created Node.js REST endpoints for user authentication and profile management.
- Integrated PostgreSQL database models using Prisma ORM.

Junior Web Developer — PixelCraft Studios (2021 - 2023)
- Maintained single-page applications using JavaScript, HTML, and CSS.
- Refactored legacy codebases to modern TypeScript standards.

Education:
B.S. in Computer Science, State University (2021)`;

export const SimulatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string>(() => {
    return localStorage.getItem('careerpilot_session_id') || `session_${Date.now().toString(36)}`;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('onboarding');
  const [jobText, setJobText] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const [days, setDays] = useState<number>(5);
  const [dailyMinutes, setDailyMinutes] = useState<number>(60);
  const [isSampleLoaded, setIsSampleLoaded] = useState<boolean>(false);

  const [comparison, setComparison] = useState<SkillComparison | null>(null);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [progress, setProgress] = useState<SessionProgress | null>(null);
  const [toolTraces, setToolTraces] = useState<ToolTraceItem[]>([]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isQuizzing, setIsQuizzing] = useState(false);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: 'Hello! I am your CareerPilot AI assistant on Alexa+. I can help analyze your target job, identify skill gaps against your resume, and build an adaptive preparation plan. To start, paste your details or click "Load Sample Data".',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: ['Load Sample Data', 'Tell me about the interview plan'],
    },
  ]);

  // Save session ID
  useEffect(() => {
    localStorage.setItem('careerpilot_session_id', sessionId);
  }, [sessionId]);

  // Hook live MCP tool trace events
  useEffect(() => {
    const unregister = registerTraceListener((traceItem) => {
      setToolTraces((prev) => {
        const existingIdx = prev.findIndex((t) => t.id === traceItem.id);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = traceItem;
          return updated;
        }
        return [traceItem, ...prev].slice(0, 50); // retain latest 50
      });
    });
    return unregister;
  }, []);

  const loadSampleData = useCallback(() => {
    setJobText(SAMPLE_JOB_TEXT);
    setResumeText(SAMPLE_RESUME_TEXT);
    setIsSampleLoaded(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        role: 'system',
        content: 'Loaded sample data for "Senior Full-Stack Engineer" and candidate "Alex Morgan".',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: ['Analyze Skill Gaps', 'Generate 5-Day Plan'],
      },
    ]);
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!jobText.trim() || !resumeText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeJobAndResume(sessionId, jobText, resumeText);
      setComparison(res);
      setActiveTab('analysis');

      setMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: `Analysis complete! You have a **${res.matchScore}% Match** for this role. I found ${res.matchedCount} verified skills and identified ${res.missingCount} critical gaps (notably in AWS Serverless and Redis Caching). Would you like me to generate your study plan?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolCalls: ['compare_skills'],
          suggestedActions: ['Generate 5-Day Plan', 'Inspect Missing Gaps'],
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [sessionId, jobText, resumeText]);

  const createPlan = useCallback(async () => {
    setIsPlanning(true);
    try {
      const res = await generateStudyPlan(sessionId, days, dailyMinutes);
      setPlan(res);
      setActiveTab('plan');

      setMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: `Here is your customized **${days}-Day Preparation Plan** (${dailyMinutes} mins/day). Day 1 focuses on AWS Serverless Architecture. You can check off tasks as you finish or take an adaptive quiz right now!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolCalls: ['generate_plan'],
          suggestedActions: ['Start Day 1 Quiz', 'View Full Timeline'],
        },
      ]);
    } finally {
      setIsPlanning(false);
    }
  }, [sessionId, days, dailyMinutes]);

  const startQuiz = useCallback(async (topic: string) => {
    setIsQuizzing(true);
    setQuizResult(null);
    try {
      const quizData = await fetchQuiz(sessionId, topic);
      setActiveQuiz(quizData);
      setActiveTab('quiz');

      setMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: `I've prepared a ${quizData.difficulty} quiz on **${topic}** with ${quizData.questions.length} questions. Let's see how you do!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolCalls: ['generate_quiz'],
        },
      ]);
    } finally {
      setIsQuizzing(false);
    }
  }, [sessionId]);

  const submitQuiz = useCallback(
    async (submissions: Array<{ questionId: string; selectedOption: string; correctOption: string }>) => {
      if (!activeQuiz) return;
      setIsSubmittingQuiz(true);
      try {
        const result = await submitQuizAnswers(sessionId, activeQuiz.quizId, activeQuiz.topic, submissions);
        setQuizResult(result);

        // If score is weak (<70), adapt the plan by adding a review session
        if (!result.passed && plan) {
          setPlan((prevPlan) => {
            if (!prevPlan) return null;
            const updatedSchedule = prevPlan.schedule.map((day) => {
              if (day.day === 4) {
                return {
                  ...day,
                  topic: `Reinforcement: ${result.topic}`,
                  objective: `Reinforce concepts following quiz score of ${result.score}%.`,
                  adapted: true,
                };
              }
              return day;
            });
            return { ...prevPlan, schedule: updatedSchedule };
          });
        }

        // Fetch refreshed progress
        const prog = await fetchProgress(sessionId);
        setProgress(prog);

        setMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: `You scored **${result.score}%** on ${result.topic}. ${
              result.passed
                ? 'Great job, you passed! I have logged this to your progress.'
                : 'Since you scored under 70%, I have automatically adapted Day 4 of your study plan to review this topic.'
            }`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            toolCalls: ['record_quiz_result'],
            suggestedActions: result.passed ? ['Next Topic Quiz', 'Check Progress'] : ['Review Updated Plan', 'Retake Quiz'],
          },
        ]);
      } finally {
        setIsSubmittingQuiz(false);
      }
    },
    [sessionId, activeQuiz, plan]
  );

  const toggleDayCompletion = useCallback((dayNum: number) => {
    setPlan((prev) => {
      if (!prev) return null;
      const updated = prev.schedule.map((d) => (d.day === dayNum ? { ...d, completed: !d.completed } : d));
      const completedCount = updated.filter((d) => d.completed).length;
      const pct = Math.round((completedCount / updated.length) * 100);

      setProgress((prevProg) => ({
        sessionId,
        overallProgress: pct,
        completedDays: updated.filter((d) => d.completed).map((d) => d.day),
        totalQuizzesTaken: prevProg?.totalQuizzesTaken || 1,
        averageQuizScore: prevProg?.averageQuizScore || 85,
        topicMastery: prevProg?.topicMastery || {},
      }));

      return { ...prev, schedule: updated };
    });
  }, [sessionId]);

  const sendChatMessage = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Conversational intent parser
      const lower = content.toLowerCase();
      if (lower.includes('sample')) {
        loadSampleData();
      } else if (lower.includes('analyze') || lower.includes('gap')) {
        if (!jobText || !resumeText) {
          loadSampleData();
        }
        await runAnalysis();
      } else if (lower.includes('plan') || lower.includes('schedule')) {
        await createPlan();
      } else if (lower.includes('quiz')) {
        const topic = plan?.schedule[0]?.topic || 'AWS Serverless Architecture';
        await startQuiz(topic);
      } else if (lower.includes('progress')) {
        setActiveTab('progress');
        const prog = await fetchProgress(sessionId);
        setProgress(prog);
      } else {
        // Echo assistant response
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `msg_${Date.now()}`,
              role: 'assistant',
              content: `Understood! You can ask me to "Analyze skills", "Generate plan", or "Quiz me on AWS".`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              suggestedActions: ['Analyze Skills', 'Generate Plan', 'Take Quiz'],
            },
          ]);
        }, 500);
      }
    },
    [jobText, resumeText, loadSampleData, runAnalysis, createPlan, plan, startQuiz, sessionId]
  );

  const resetSession = useCallback(() => {
    const newId = `session_${Date.now().toString(36)}`;
    setSessionId(newId);
    setComparison(null);
    setPlan(null);
    setActiveQuiz(null);
    setQuizResult(null);
    setProgress(null);
    setIsSampleLoaded(false);
    setActiveTab('onboarding');
    setMessages([
      {
        id: 'm_fresh',
        role: 'assistant',
        content: 'New session started. How can I assist with your preparation today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: ['Load Sample Data'],
      },
    ]);
  }, []);

  return (
    <SimulatorContext.Provider
      value={{
        sessionId,
        activeTab,
        setActiveTab,
        jobText,
        setJobText,
        resumeText,
        setResumeText,
        days,
        setDays,
        dailyMinutes,
        setDailyMinutes,
        isSampleLoaded,
        loadSampleData,
        comparison,
        plan,
        activeQuiz,
        quizResult,
        progress,
        toolTraces,
        messages,
        isAnalyzing,
        isPlanning,
        isQuizzing,
        isSubmittingQuiz,
        runAnalysis,
        createPlan,
        startQuiz,
        submitQuiz,
        toggleDayCompletion,
        sendChatMessage,
        resetSession,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};
