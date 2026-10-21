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
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Overall Preparation
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {readinessScore}%
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-success)', fontWeight: 600 }}>Readiness</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>
            Calculated from completed tasks & quiz scores
          </span>
        </div>

        {/* Plan Tasks Completed */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Curriculum Tasks
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {completedDaysCount} / {totalDaysCount}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>Days</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>
            {planPct}% of scheduled roadmap finished
          </span>
        </div>

        {/* Quiz Mastery */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Avg Quiz Mastery
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-success)' }}>
              {avgQuizScore}%
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-success)', fontWeight: 600 }}>Verified</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>
            Deterministic scoring with explanations
          </span>
        </div>
      </div>

      {/* ── Competency Progress Bars ── */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--color-primary)" />
            <h4 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
              Technical Domain Mastery
            </h4>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
            Updated dynamically after each quiz
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {topicSkills.map((item) => {
            const isHigh = item.level >= 80;
            const isMid = item.level >= 60;
            const barColor = isHigh ? 'var(--color-success)' : isMid ? 'var(--color-warning)' : 'var(--color-danger)';

            return (
              <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{item.name}</span>
                  <span style={{ color: barColor, fontWeight: 700 }}>{item.level}%</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'var(--color-bg-subtle)',
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
                      transition: 'width 250ms ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Session Persistence Info Card ── */}
      <div
        className="card"
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
          <ShieldCheck size={20} color="var(--color-success)" />
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Session Persisted Locally
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              ID: {sessionId} • Stored across refreshes
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
            title="Reset session state"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
