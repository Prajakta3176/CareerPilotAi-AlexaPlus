import { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import JobInputForm from './components/JobInputForm';
import SkillGapPanel from './components/SkillGapPanel';
import PlanTimeline from './components/PlanTimeline';
import QuizPanel from './components/QuizPanel';
import ProgressPanel from './components/ProgressPanel';
import ToolTrace from './components/ToolTrace';

type View = 'onboarding' | 'analysis' | 'plan' | 'quiz' | 'progress';

function App() {
  const [currentView, setCurrentView] = useState<View>('onboarding');

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">🚀</span>
          <h1>CareerPilot AI</h1>
        </div>
        <nav className="app-nav">
          <button
            className={currentView === 'onboarding' ? 'active' : ''}
            onClick={() => setCurrentView('onboarding')}
          >
            Input
          </button>
          <button
            className={currentView === 'analysis' ? 'active' : ''}
            onClick={() => setCurrentView('analysis')}
          >
            Analysis
          </button>
          <button
            className={currentView === 'plan' ? 'active' : ''}
            onClick={() => setCurrentView('plan')}
          >
            Plan
          </button>
          <button
            className={currentView === 'quiz' ? 'active' : ''}
            onClick={() => setCurrentView('quiz')}
          >
            Quiz
          </button>
          <button
            className={currentView === 'progress' ? 'active' : ''}
            onClick={() => setCurrentView('progress')}
          >
            Progress
          </button>
        </nav>
      </header>

      <main className="app-main">
        <section className="panel-left">
          <ChatPanel />
        </section>

        <section className="panel-right">
          {currentView === 'onboarding' && <JobInputForm />}
          {currentView === 'analysis' && <SkillGapPanel />}
          {currentView === 'plan' && <PlanTimeline />}
          {currentView === 'quiz' && <QuizPanel />}
          {currentView === 'progress' && <ProgressPanel />}
        </section>
      </main>

      <footer className="app-footer">
        <ToolTrace />
      </footer>
    </div>
  );
}

export default App;
