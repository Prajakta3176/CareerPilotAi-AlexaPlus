import { useState, useEffect } from 'react';
import {
  FileText,
  CheckSquare,
  Calendar,
  HelpCircle,
  BarChart3,
  Terminal,
  ArrowLeft,
} from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { SimulatorProvider, useSimulator } from './context/SimulatorContext';
import { Navbar, AppPage } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

import ChatPanel from './components/ChatPanel';
import JobInputForm from './components/JobInputForm';
import SkillGapPanel from './components/SkillGapPanel';
import PlanTimeline from './components/PlanTimeline';
import QuizPanel from './components/QuizPanel';
import ProgressPanel from './components/ProgressPanel';
import ToolTrace from './components/ToolTrace';

function SimulatorMainApp() {
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    // Check if there is a hash or default to home
    const hash = window.location.hash.replace('#', '') as AppPage;
    if (['home', 'login', 'dashboard', 'simulator'].includes(hash)) {
      return hash;
    }
    return 'home'; // Landing page first!
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('careerpilot_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('careerpilot_theme', theme);
    } catch (e) {
      console.warn(e);
    }
  }, [theme]);

  // Sync hash
  useEffect(() => {
    window.location.hash = currentPage;
  }, [currentPage]);

  const {
    activeTab,
    setActiveTab,
    sessionId,
    comparison,
    plan,
    toolTraces,
  } = useSimulator();

  return (
    <div className={`app-root-layout theme-${theme}`} data-theme={theme}>
      {/* ── Persistent Global Navigation ── */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* ── Page Routing ── */}
      {currentPage === 'home' && (
        <main className="page-body">
          <HomePage setCurrentPage={setCurrentPage} />
          <Footer setCurrentPage={setCurrentPage} />
        </main>
      )}

      {currentPage === 'login' && (
        <main className="page-body">
          <LoginPage setCurrentPage={setCurrentPage} />
          <Footer setCurrentPage={setCurrentPage} />
        </main>
      )}

      {currentPage === 'dashboard' && (
        <main className="page-body">
          <DashboardPage setCurrentPage={setCurrentPage} />
          <Footer setCurrentPage={setCurrentPage} />
        </main>
      )}

      {currentPage === 'simulator' && (
        <div className="simulator-workspace-page">
          {/* Sub-header with back button and active session breadcrumb */}
          <div className="simulator-sub-header">
            <div className="sub-header-left">
              <button
                type="button"
                className="sub-header-back-btn"
                onClick={() => setCurrentPage('dashboard')}
              >
                <ArrowLeft size={14} />
                <span>Back to Dashboard</span>
              </button>
              <span className="sub-header-divider">/</span>
              <span className="sub-header-title">
                AI Interactive Workspace & Live Simulation
              </span>
            </div>

            <div className="sub-header-right">
              <span className="session-id-pill">
                Session: {sessionId.slice(0, 14)}
              </span>
            </div>
          </div>

          {/* Dual-Column Interactive Workspace */}
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
                    <span className="badge-count">
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
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SimulatorProvider>
        <SimulatorMainApp />
      </SimulatorProvider>
    </AuthProvider>
  );
}
