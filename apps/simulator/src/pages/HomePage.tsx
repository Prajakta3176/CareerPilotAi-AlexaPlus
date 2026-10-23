import React from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  FileSearch,
  CalendarCheck,
  BrainCircuit,
  Bot,
  Terminal,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Award,
  Play,
  Star,
} from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';
import { AppPage } from '../components/Navbar';

interface HomePageProps {
  setCurrentPage: (page: AppPage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const { loadSampleData, setActiveTab } = useSimulator();

  const handleLaunchDemo = () => {
    loadSampleData();
    setActiveTab('onboarding');
    setCurrentPage('simulator');
  };

  const handleStartAssessment = () => {
    setActiveTab('onboarding');
    setCurrentPage('simulator');
  };

  return (
    <div className="home-page-container">
      {/* ── Ambient Background Glows ── */}
      <div className="ambient-glow glow-top-left" />
      <div className="ambient-glow glow-top-right" />
      <div className="ambient-glow glow-middle-center" />

      {/* ── 1. Hero Section ── */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <span className="badge-pulse" />
            <Sparkles size={14} className="badge-sparkle" />
            <span>Amazon Developer Hackathon 2026 • Alexa+ Track</span>
          </div>

          <h1 className="hero-title">
            Master Your Next Tech Interview with{' '}
            <span className="gradient-text">Intelligent Agentic Coaching</span>
          </h1>

          <p className="hero-subtitle">
            Bridge your technical gaps with precision. CareerPilot AI evaluates your resume against high-bar job descriptions, generates tailored multi-day prep roadmaps, and tests you with adaptive architectural quizzes.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="hero-primary-btn"
              onClick={handleStartAssessment}
            >
              <span>Launch Assessment</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={handleLaunchDemo}
            >
              <Play size={16} className="play-icon" />
              <span>Explore Live Demo (1-Click)</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-number">94%</span>
              <span className="stat-label">Interview Readiness</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Core Tech Competencies</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">&lt; 3s</span>
              <span className="stat-label">Instant Gap Telemetry</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">MCP</span>
              <span className="stat-label">Bounded Agent Tools</span>
            </div>
          </div>
        </div>

        {/* ── Hero Interactive Live Mockup Card ── */}
        <div className="hero-mockup-wrapper">
          <div className="hero-card-glass">
            <div className="mockup-header-bar">
              <div className="window-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="mockup-header-title">
                <Compass size={13} />
                <span>CareerPilot AI Workspace • Active Evaluation</span>
              </div>
              <span className="live-status-pill">
                <span className="live-dot" /> LIVE
              </span>
            </div>

            <div className="mockup-body">
              {/* Skill Gap mini summary */}
              <div className="mockup-score-box">
                <div className="score-ring-outer">
                  <div className="score-ring-inner">
                    <span className="score-val">82%</span>
                    <span className="score-sub">Match</span>
                  </div>
                </div>
                <div className="score-meta">
                  <p className="score-title">Target: Senior Full-Stack Engineer</p>
                  <p className="score-desc">Strong match in TypeScript & React. Focus needed on AWS & Redis caching.</p>
                  <div className="gap-badges-row">
                    <span className="badge-chip matched"><CheckCircle2 size={12} /> TypeScript (Verified)</span>
                    <span className="badge-chip matched"><CheckCircle2 size={12} /> React 19 (Verified)</span>
                    <span className="badge-chip missing"><AlertTriangle size={12} /> AWS Serverless</span>
                    <span className="badge-chip missing"><AlertTriangle size={12} /> Redis Caching</span>
                  </div>
                </div>
              </div>

              {/* Simulated Agent Chat bubble */}
              <div className="mockup-chat-preview">
                <div className="mockup-avatar">
                  <Bot size={15} />
                </div>
                <div className="mockup-chat-bubble">
                  <p className="chat-text">
                    "I analyzed your CloudScale Innovations role. You're solid on full-stack fundamentals, but Day 1 of your study plan focuses on <strong>AWS SQS & Dead-Letter Queues</strong> to ensure you nail the distributed systems round."
                  </p>
                  <div className="chat-meta-actions">
                    <button
                      type="button"
                      className="quick-action-chip"
                      onClick={() => {
                        setActiveTab('plan');
                        setCurrentPage('simulator');
                      }}
                    >
                      <CalendarCheck size={12} />
                      <span>View 5-Day Study Plan</span>
                    </button>
                    <button
                      type="button"
                      className="quick-action-chip secondary"
                      onClick={() => {
                        setActiveTab('quiz');
                        setCurrentPage('simulator');
                      }}
                    >
                      <BrainCircuit size={12} />
                      <span>Take AWS Adaptive Quiz</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. How It Works (3 Steps) ── */}
      <section className="how-it-works-section">
        <div className="section-header">
          <span className="section-eyebrow">STEP-BY-STEP WORKFLOW</span>
          <h2 className="section-title">How CareerPilot AI Guides Your Prep</h2>
          <p className="section-description">
            A structured, bound agentic workflow ensuring you focus precisely on what technical interviewers evaluate.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon-wrap">
              <FileSearch size={24} />
            </div>
            <h3 className="step-card-title">Job & Resume Ingestion</h3>
            <p className="step-card-text">
              Paste or upload your candidate resume and target job posting. Our engine extracts hard requirements, frameworks, database proficiencies, and implicit qualifications.
            </p>
          </div>

          <div className="step-card featured">
            <div className="step-number">02</div>
            <div className="step-icon-wrap">
              <BrainCircuit size={24} />
            </div>
            <h3 className="step-card-title">Precision Skill Gap Analysis</h3>
            <p className="step-card-text">
              Categorizes competencies into matched, partial, or missing. Evaluates candidate depth and separates verified accomplishments from inferences.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon-wrap">
              <CalendarCheck size={24} />
            </div>
            <h3 className="step-card-title">Adaptive Roadmaps & Quizzes</h3>
            <p className="step-card-text">
              Receives a day-by-day practice roadmap tailored to your daily schedule. Test your comprehension with interactive quizzes that adapt when you struggle.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Six Deep Feature Pillars ── */}
      <section className="features-pillar-section">
        <div className="section-header">
          <span className="section-eyebrow">ENTERPRISE-GRADE CAPABILITIES</span>
          <h2 className="section-title">Engineered for Technical High-Bar Excellence</h2>
          <p className="section-description">
            Powered by modern LLM reasoning, bounded MCP tool execution, and vector-backed RAG memory.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-badge blue">
              <FileSearch size={20} />
            </div>
            <h3 className="feature-title">Semantic Skill Matching</h3>
            <p className="feature-text">
              Goes far beyond keyword matches. Detects relational understanding across distributed systems, ORMs, asynchronous messaging, and container workflows.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-badge purple">
              <CalendarCheck size={20} />
            </div>
            <h3 className="feature-title">Personalized Study Plans</h3>
            <p className="feature-text">
              Choose your preparation timeline (3 to 14 days) and daily available hours. Daily modules include specific architectural tasks and interview patterns.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-badge emerald">
              <BrainCircuit size={20} />
            </div>
            <h3 className="feature-title">Adaptive Quiz Engine</h3>
            <p className="feature-text">
              Questions challenge real-world trade-offs (CAP theorem, cache invalidation, cold starts). Missed questions automatically adapt your study schedule.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-badge amber">
              <Bot size={20} />
            </div>
            <h3 className="feature-title">Alexa+ Voice & Chat Copilot</h3>
            <p className="feature-text">
              Conversational assistant with integrated voice playback. Ask follow-up questions, drill down into code patterns, or practice behavioral STAR stories.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-badge cyan">
              <Terminal size={20} />
            </div>
            <h3 className="feature-title">MCP Tool Observability</h3>
            <p className="feature-text">
              Inspect live Model Context Protocol tool execution in real-time. View execution latency, tool payloads, and verified outputs transparently.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-badge pink">
              <BarChart3 size={20} />
            </div>
            <h3 className="feature-title">PostgreSQL Progress Telemetry</h3>
            <p className="feature-text">
              All progress, quiz attempts, and completed milestones persist in PostgreSQL, allowing candidates to pick up right where they left off across devices.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Candidate Spotlight / Social Proof ── */}
      <section className="proof-section">
        <div className="proof-card">
          <div className="proof-header">
            <div className="proof-stars">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>
            <span className="proof-tag">Candidate Experience</span>
          </div>
          <blockquote className="proof-quote">
            "CareerPilot AI pointed out that while my React experience was senior-grade, I had zero verifiable cloud queue patterns on my resume for the AWS role. Following the 5-day plan and adaptive quizzes gave me the exact vocabulary to breeze through the system design loop."
          </blockquote>
          <div className="proof-author">
            <div className="author-avatar">AM</div>
            <div>
              <p className="author-name">Alex Morgan</p>
              <p className="author-title">Senior Full-Stack Engineer • AWS Track Candidate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Bottom Call to Action ── */}
      <section className="bottom-cta-section">
        <div className="bottom-cta-card">
          <div className="cta-icon-wrap">
            <Award size={36} />
          </div>
          <h2 className="cta-title">Accelerate Your Technical Career Today</h2>
          <p className="cta-text">
            Join candidates using AI-driven precision to prepare for senior engineering roles. Get your complete skill gap breakdown in seconds.
          </p>
          <div className="cta-btn-group">
            <button
              type="button"
              className="cta-primary-btn"
              onClick={handleLaunchDemo}
            >
              <Sparkles size={18} />
              <span>Try Live Demo Now</span>
            </button>
            <button
              type="button"
              className="cta-secondary-btn"
              onClick={() => setCurrentPage('dashboard')}
            >
              <span>Go to Candidate Dashboard</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
