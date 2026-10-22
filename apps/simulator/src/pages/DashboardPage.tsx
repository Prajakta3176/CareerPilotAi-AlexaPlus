import React from 'react';
import {
  Compass,
  FileCheck2,
  Calendar,
  MessageSquareCode,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  PlayCircle,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSimulator } from '../context/SimulatorContext';
import { AppPage } from '../components/Navbar';

interface DashboardPageProps {
  setCurrentPage: (page: AppPage) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const {
    sessionId,
    comparison,
    plan,
    quizResult,
    setActiveTab,
    toggleDayCompletion,
    loadSampleData,
    isSampleLoaded,
  } = useSimulator();

  const candidateName = user?.name || 'Alex Morgan';
  const targetRole = user?.targetRole || 'Senior Full-Stack Cloud Engineer';

  const matchScore = comparison?.matchScore ?? 82;
  const matchedCount = comparison?.matchedCount ?? 5;
  const missingCount = comparison?.missingCount ?? 3;

  const navigateToTab = (tab: 'onboarding' | 'analysis' | 'plan' | 'quiz' | 'progress' | 'trace') => {
    setActiveTab(tab);
    setCurrentPage('simulator');
  };

  return (
    <div className="dashboard-container">
      {/* ── Candidate Welcome Banner ── */}
      <section className="dashboard-banner">
        <div className="banner-text">
          <div className="banner-tag">
            <span className="live-dot" /> ACTIVE PREPARATION SESSION
          </div>
          <h1 className="banner-heading">
            Welcome back, <span className="gradient-text">{candidateName}</span>! 👋
          </h1>
          <p className="banner-subtext">
            Preparing for <strong>{targetRole}</strong>. Here is your real-time readiness breakdown, study schedule, and technical quiz performance.
          </p>
        </div>

        <div className="banner-actions">
          <button
            type="button"
            className="banner-primary-btn"
            onClick={() => navigateToTab('onboarding')}
          >
            <MessageSquareCode size={16} />
            <span>Open AI Simulator Workspace</span>
            <ArrowRight size={14} />
          </button>

          {!isSampleLoaded && (
            <button
              type="button"
              className="banner-secondary-btn"
              onClick={loadSampleData}
            >
              <Sparkles size={14} />
              <span>Load Realistic Sample</span>
            </button>
          )}
        </div>
      </section>

      {/* ── 4 Main Metric Highlights ── */}
      <section className="metrics-summary-grid">
        {/* Metric 1: Readiness Score */}
        <div className="metric-card readiness-card" onClick={() => navigateToTab('analysis')}>
          <div className="metric-header">
            <span className="metric-label">Target Role Match</span>
            <span className="metric-badge green">Verified</span>
          </div>
          <div className="metric-body">
            <span className="metric-value-large">{matchScore}%</span>
            <div className="metric-progress-track">
              <div
                className="metric-progress-fill"
                style={{ width: `${matchScore}%` }}
              />
            </div>
          </div>
          <div className="metric-footer">
            <span>{matchedCount} Matched • {missingCount} Gaps to Address</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Metric 2: Study Plan Days */}
        <div className="metric-card" onClick={() => navigateToTab('plan')}>
          <div className="metric-header">
            <span className="metric-label">Study Plan Pace</span>
            <span className="metric-badge blue">5-Day Sprint</span>
          </div>
          <div className="metric-body">
            <span className="metric-value-large">
              {plan ? `${plan.schedule.filter((d) => d.completed).length}/${plan.schedule.length}` : '2/5'}
            </span>
            <p className="metric-sub-detail">
              {plan?.dailyMinutes || 60} mins daily commitment
            </p>
          </div>
          <div className="metric-footer">
            <span>Next: AWS SQS & Dead-Letter Queues</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Metric 3: Quiz Mastery */}
        <div className="metric-card" onClick={() => navigateToTab('quiz')}>
          <div className="metric-header">
            <span className="metric-label">Quiz Mastery</span>
            <span className="metric-badge purple">
              {quizResult ? `${quizResult.score}%` : '85% Avg'}
            </span>
          </div>
          <div className="metric-body">
            <span className="metric-value-large">
              {quizResult?.passed ? 'Passed' : '3 Topics'}
            </span>
            <p className="metric-sub-detail">
              AWS, Redis, and Distributed Systems
            </p>
          </div>
          <div className="metric-footer">
            <span>Adaptive Quiz Available</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Metric 4: Session Persistence */}
        <div className="metric-card" onClick={() => navigateToTab('progress')}>
          <div className="metric-header">
            <span className="metric-label">Database Sync</span>
            <span className="metric-badge green">PostgreSQL</span>
          </div>
          <div className="metric-body">
            <span className="metric-value-code">
              {sessionId.slice(0, 14)}...
            </span>
            <p className="metric-sub-detail">
              Telemetry active across all MCP tools
            </p>
          </div>
          <div className="metric-footer">
            <span>View Comprehensive Progress</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </section>

      {/* ── Two Column Workspace Preview on Dashboard ── */}
      <div className="dashboard-content-split">
        {/* Left Column: Active Study Plan & Today's Tasks */}
        <div className="dashboard-card-panel">
          <div className="card-panel-header">
            <div className="panel-title-group">
              <Calendar size={18} className="panel-icon blue" />
              <div>
                <h3 className="panel-title">Active Study Schedule</h3>
                <p className="panel-subtitle">Check off completed architectural topics as you prepare</p>
              </div>
            </div>
            <button
              type="button"
              className="panel-action-btn"
              onClick={() => navigateToTab('plan')}
            >
              <span>Full Timeline</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="schedule-preview-list">
            {(plan?.schedule || [
              {
                day: 1,
                topic: 'AWS Serverless Architecture (Lambda & SQS)',
                objective: 'Understand event-driven decoupled architecture and message queues.',
                allocatedMinutes: 60,
                completed: true,
              },
              {
                day: 2,
                topic: 'Distributed Caching Strategies with Redis',
                objective: 'Master Cache-Aside, Write-Through, and eviction policies under high concurrency.',
                allocatedMinutes: 60,
                completed: false,
              },
              {
                day: 3,
                topic: 'DynamoDB Single-Table Design & Partitioning',
                objective: 'Learn partition key design, secondary indexes (GSI), and query vs scan performance.',
                allocatedMinutes: 60,
                completed: false,
              },
              {
                day: 4,
                topic: 'System Design: High-Throughput SaaS Metrics',
                objective: 'Design for P99 latency guarantees, rate limiting, and horizontal auto-scaling.',
                allocatedMinutes: 60,
                completed: false,
              },
            ]).slice(0, 4).map((dayItem) => (
              <div
                key={dayItem.day}
                className={`schedule-day-row ${dayItem.completed ? 'completed' : ''}`}
                onClick={() => toggleDayCompletion(dayItem.day)}
              >
                <div className="day-check-wrap">
                  <input
                    type="checkbox"
                    checked={dayItem.completed}
                    onChange={() => toggleDayCompletion(dayItem.day)}
                    className="day-checkbox"
                    aria-label={`Mark Day ${dayItem.day} as completed`}
                  />
                </div>
                <div className="day-info-wrap">
                  <div className="day-badge-line">
                    <span className="day-num-pill">Day {dayItem.day}</span>
                    <span className="day-time"><Clock size={12} /> {dayItem.allocatedMinutes}m</span>
                  </div>
                  <h4 className="day-topic-title">{dayItem.topic}</h4>
                  <p className="day-objective">{dayItem.objective}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Skill Gaps & Recommended Quizzes */}
        <div className="dashboard-card-panel">
          <div className="card-panel-header">
            <div className="panel-title-group">
              <FileCheck2 size={18} className="panel-icon emerald" />
              <div>
                <h3 className="panel-title">Identified Skill Focus</h3>
                <p className="panel-subtitle">Competencies extracted from your target role</p>
              </div>
            </div>
            <button
              type="button"
              className="panel-action-btn"
              onClick={() => navigateToTab('analysis')}
            >
              <span>View Breakdown</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="gaps-preview-container">
            <div className="gaps-group-box">
              <h4 className="gaps-group-label missing">
                <AlertCircle size={14} /> Critical Gaps to Bridge (Before Interview)
              </h4>
              <div className="chips-flow">
                <span className="skill-chip missing" onClick={() => navigateToTab('quiz')}>
                  AWS Lambda & SQS <PlayCircle size={12} />
                </span>
                <span className="skill-chip missing" onClick={() => navigateToTab('quiz')}>
                  Redis Distributed Caching <PlayCircle size={12} />
                </span>
                <span className="skill-chip missing" onClick={() => navigateToTab('quiz')}>
                  DynamoDB Partitioning <PlayCircle size={12} />
                </span>
              </div>
            </div>

            <div className="gaps-group-box">
              <h4 className="gaps-group-label matched">
                <CheckCircle2 size={14} /> Verified Candidate Strengths
              </h4>
              <div className="chips-flow">
                <span className="skill-chip matched">TypeScript (95% Conf)</span>
                <span className="skill-chip matched">React 19 & Next.js</span>
                <span className="skill-chip matched">Node.js Express APIs</span>
                <span className="skill-chip matched">PostgreSQL Modeling</span>
                <span className="skill-chip matched">Git Collaboration</span>
              </div>
            </div>

            {/* Quick Quiz Launch Card */}
            <div className="quick-quiz-banner" onClick={() => navigateToTab('quiz')}>
              <div className="quick-quiz-text">
                <span className="quick-quiz-pill">RECOMMENDED ASSESSMENT</span>
                <h4 className="quick-quiz-title">Test Your AWS & Distributed Systems Knowledge</h4>
                <p className="quick-quiz-desc">3 adaptive multiple-choice questions on SQS dead-letter queues & DynamoDB</p>
              </div>
              <button type="button" className="quick-quiz-btn">
                <span>Start Quiz</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full Workspace Quick Launch Strip ── */}
      <section className="workspace-strip-banner">
        <div className="strip-info">
          <h3 className="strip-title">Ready for Interactive Simulation?</h3>
          <p className="strip-desc">
            Use the full dual-column workspace to chat with the Alexa+ Copilot, inspect MCP tool calls, or update your target job description.
          </p>
        </div>
        <button
          type="button"
          className="strip-cta-btn"
          onClick={() => setCurrentPage('simulator')}
        >
          <Compass size={18} />
          <span>Launch AI Simulator Workspace</span>
        </button>
      </section>
    </div>
  );
};
