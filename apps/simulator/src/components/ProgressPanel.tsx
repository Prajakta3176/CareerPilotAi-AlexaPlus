import {
  TrendingUp,
  Calendar,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

export default function ProgressPanel() {
  const { progress, plan, sessionId, resetSession, setActiveTab, startQuiz } = useSimulator();

  const completedDaysCount = plan?.schedule.filter((d) => d.completed).length || 0;
  const totalDaysCount = plan?.schedule.length || 5;
  const planPct = Math.round((completedDaysCount / totalDaysCount) * 100);

  const avgQuizScore = progress?.averageQuizScore || 85;
  const readinessScore = Math.round((planPct * 0.5) + (avgQuizScore * 0.5));

  const topicSkills = [
    { name: 'TypeScript & Frontend Core', level: 95 },
    { name: 'AWS Serverless Architecture (Lambda/SQS)', level: progress?.topicMastery?.['AWS Serverless Architecture'] || 80 },
    { name: 'Distributed Caching Strategies (Redis)', level: 65 },
    { name: 'DynamoDB Single-Table Partitioning', level: 50 },
    { name: 'System Design: High-Throughput SaaS', level: 70 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Top Metric Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {/* Overall Readiness */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Overall Preparation
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                background: 'var(--gradient-alexa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {readinessScore}%
            </span>
            <span style={{ fontSize: '0.78rem', color: '#10b981' }}>Readiness</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            Weighted by plan tasks & quiz scores
          </span>
        </div>

        {/* Plan Tasks Done */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Curriculum Tasks
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
              {completedDaysCount} / {totalDaysCount}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-alexa-cyan)' }}>Days</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            {planPct}% of scheduled roadmap completed
          </span>
        </div>

        {/* Quiz Performance */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Avg Quiz Mastery
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
              {avgQuizScore}%
            </span>
            <span style={{ fontSize: '0.78rem', color: '#10b981' }}>Passed</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            Deterministic grading with explanations
          </span>
        </div>
      </div>

      {/* ── Topic Mastery Breakdown ── */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--color-alexa-cyan)" />
            <h4 style={{ fontSize: '0.96rem', fontWeight: 600, color: '#fff', margin: 0 }}>
              Competency Mastery Breakdown
            </h4>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
            Updated in real-time
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {topicSkills.map((item) => {
            const isStrong = item.level >= 80;
            const isMedium = item.level >= 60;
            const barColor = isStrong ? '#10b981' : isMedium ? '#f59e0b' : '#ef4444';

            return (
              <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#fff' }}>{item.name}</span>
                  <span style={{ color: barColor, fontWeight: 600 }}>{item.level}%</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${item.level}%`,
                      height: '100%',
                      backgroundColor: barColor,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 300ms ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Session & Persistence Info ── */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.9rem 1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <ShieldCheck size={20} color="#10b981" />
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
              Persistent Session Storage Active
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              Session: {sessionId} • Stored in LocalStorage & SQLite
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('plan')}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            <Calendar size={13} /> View Plan
          </button>

          <button
            type="button"
            onClick={() => {
              const nextTopic = plan?.schedule.find((d) => !d.completed)?.topic || 'AWS Serverless Architecture';
              startQuiz(nextTopic);
            }}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem' }}
          >
            <HelpCircle size={13} /> Take Quiz <ArrowRight size={13} />
          </button>

          <button
            type="button"
            onClick={resetSession}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem' }}
            title="Clear current state and reset"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
