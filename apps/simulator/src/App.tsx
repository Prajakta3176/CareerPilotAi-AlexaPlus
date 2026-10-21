import {
  Compass,
  FileText,
  CheckSquare,
  Calendar,
  HelpCircle,
  BarChart3,
  Terminal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SimulatorProvider, useSimulator } from './context/SimulatorContext';
import ChatPanel from './components/ChatPanel';
import JobInputForm from './components/JobInputForm';
import SkillGapPanel from './components/SkillGapPanel';
import PlanTimeline from './components/PlanTimeline';
import QuizPanel from './components/QuizPanel';
import ProgressPanel from './components/ProgressPanel';
import ToolTrace from './components/ToolTrace';

function SimulatorApp() {
  const {
    activeTab,
    setActiveTab,
    sessionId,
    isSampleLoaded,
    loadSampleData,
    resetSession,
    comparison,
    plan,
    toolTraces,
  } = useSimulator();

  return (
    <div className="app">
      {/* ── Top SaaS Header ── */}
      <header className="app-header">
        <div className="header-left">
          <div className="brand-badge">
            <div className="brand-icon">
              <Compass size={18} />
            </div>
            <div>
              <span className="brand-title">CareerPilot AI</span>
            </div>
          </div>
          <span className="badge-tag">Alexa+ Track • Hackathon 2026</span>
        </div>

        <div className="header-actions">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-bg-subtle)',
              padding: '0.25rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
            }}
          >
            Session: {sessionId.slice(0, 12)}
          </span>

          <button
            type="button"
            className={`btn ${isSampleLoaded ? 'btn-secondary' : 'btn-subtle'}`}
            onClick={loadSampleData}
            title="Load realistic job description & resume for quick evaluation"
          >
            <Sparkles size={14} />
            {isSampleLoaded ? 'Sample Loaded' : 'Load Demo Sample'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetSession}
            title="Reset session state"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      </header>

      {/* ── Main Two-Column Structure ── */}
      <main className="app-main">
        {/* Left Column: Conversational Assistant */}
        <section className="chat-panel-container">
          <ChatPanel />
        </section>

        {/* Right Column: Structured Workflow Workspace */}
        <section className="workspace-panel-container">
          <nav className="workspace-tabs" aria-label="Workflow Navigation">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'onboarding' ? 'active' : ''}`}
              onClick={() => setActiveTab('onboarding')}
            >
              <FileText size={15} />
              1. Job & Resume
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              <CheckSquare size={15} />
              2. Skill Gaps {comparison && `(${comparison.matchScore}%)`}
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
              onClick={() => setActiveTab('plan')}
            >
              <Calendar size={15} />
              3. Study Plan {plan && `(${plan.schedule.length}d)`}
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              <HelpCircle size={15} />
              4. Adaptive Quiz
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              <BarChart3 size={15} />
              5. Progress
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'trace' ? 'active' : ''}`}
              onClick={() => setActiveTab('trace')}
            >
              <Terminal size={15} />
              MCP Tools
              {toolTraces.length > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    color: 'var(--color-text-secondary)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                >
                  {toolTraces.length}
                </span>
              )}
            </button>
          </nav>

          <div className="workspace-content">
            {activeTab === 'onboarding' && <JobInputForm />}
            {activeTab === 'analysis' && <SkillGapPanel />}
            {activeTab === 'plan' && <PlanTimeline />}
            {activeTab === 'quiz' && <QuizPanel />}
            {activeTab === 'progress' && <ProgressPanel />}
            {activeTab === 'trace' && <ToolTrace />}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <SimulatorProvider>
      <SimulatorApp />
    </SimulatorProvider>
  );
}
