import {
  Sparkles,
  Bot,
  BrainCircuit,
  CalendarDays,
  HelpCircle,
  TrendingUp,
  Terminal,
  RotateCcw,
  FileText,
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
      {/* ── Top Navigation Bar ── */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo-container">
            <div className="alexa-orb">
              <Bot size={18} color="#070b14" />
            </div>
            <div>
              <h1 className="logo-title">CareerPilot AI</h1>
            </div>
          </div>
          <span className="track-badge">Alexa+ Track • Hackathon 2026</span>
        </div>

        <div className="header-actions">
          <span className="session-badge" title="Active Session ID">
            ID: {sessionId.slice(0, 14)}...
          </span>

          <button
            type="button"
            className={`btn ${isSampleLoaded ? 'btn-secondary' : 'btn-sample'}`}
            onClick={loadSampleData}
            title="Pre-populate with realistic full-stack job & resume for instant demo"
          >
            <Sparkles size={15} />
            {isSampleLoaded ? 'Sample Loaded ✓' : 'Load Sample Data'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetSession}
            title="Reset and start a fresh session"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </header>

      {/* ── Main Two-Column Layout ── */}
      <main className="app-main">
        {/* Left Column: Alexa+ Voice & Chat Simulator */}
        <section className="chat-panel-container">
          <ChatPanel />
        </section>

        {/* Right Column: Dynamic Workspace Panels */}
        <section className="workspace-panel-container">
          <nav className="workspace-tabs" aria-label="Workspace Tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'onboarding' ? 'active' : ''}`}
              onClick={() => setActiveTab('onboarding')}
            >
              <FileText size={15} />
              Input & Onboarding
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              <BrainCircuit size={15} />
              Skill Gaps
              {comparison && <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>({comparison.matchScore}%)</span>}
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
              onClick={() => setActiveTab('plan')}
            >
              <CalendarDays size={15} />
              5-Day Plan
              {plan && <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>({plan.schedule.length}d)</span>}
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              <HelpCircle size={15} />
              Adaptive Quiz
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              <TrendingUp size={15} />
              Progress
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'trace' ? 'active' : ''}`}
              onClick={() => setActiveTab('trace')}
            >
              <Terminal size={15} />
              MCP Tool Trace
              {toolTraces.length > 0 && (
                <span
                  style={{
                    backgroundColor: 'rgba(0, 200, 255, 0.25)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
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
