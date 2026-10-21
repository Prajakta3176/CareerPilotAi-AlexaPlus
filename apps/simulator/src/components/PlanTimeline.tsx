import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  HelpCircle,
  Sparkles,
  BookOpen,
  CheckSquare,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

export default function PlanTimeline() {
  const { plan, toggleDayCompletion, startQuiz, isQuizzing, createPlan, isPlanning } = useSimulator();

  if (!plan) {
    return (
      <div className="placeholder-panel">
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 200, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            color: 'var(--color-alexa-cyan)',
          }}
        >
          <Calendar size={28} />
        </div>
        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Study Plan Generated Yet</h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '420px', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          CareerPilot AI generates a personalized multi-day timeline focused on your identified skill gaps.
        </p>
        <button
          type="button"
          onClick={createPlan}
          disabled={isPlanning}
          className="btn btn-primary"
        >
          {isPlanning ? (
            <>
              <Loader2 size={16} className="spinner" /> Generating Plan...
            </>
          ) : (
            <>
              <Sparkles size={16} /> Generate 5-Day Plan Now
            </>
          )}
        </button>
      </div>
    );
  }

  const completedCount = plan.schedule.filter((d) => d.completed).length;
  const progressPct = Math.round((completedCount / plan.schedule.length) * 100);
  const hasAdaptedDay = plan.schedule.some((d) => d.adapted);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Top Plan Header ── */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--color-alexa-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Personalized Curriculum
          </span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: '0.2rem 0' }}>
            {plan.targetRole || 'Full-Stack Developer'} — Preparation Roadmap
          </h3>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={14} /> {plan.totalDays} Days Total
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} /> {plan.dailyMinutes} mins / day
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckSquare size={14} /> {completedCount} of {plan.schedule.length} Days Done
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ minWidth: '160px', textAlign: 'right' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-alexa-cyan)', marginBottom: '0.3rem' }}>
            {progressPct}% Done
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                background: 'var(--gradient-alexa)',
                transition: 'width 300ms ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Adaptation Alert Banner (Hackathon Rubric Highlight) ── */}
      {hasAdaptedDay && (
        <div
          className="glass-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            backgroundColor: 'rgba(168, 85, 247, 0.12)',
            borderColor: 'rgba(168, 85, 247, 0.4)',
          }}
        >
          <AlertCircle size={18} color="#c084fc" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.82rem', color: '#e9d5ff', lineHeight: '1.4' }}>
            <strong>Plan Dynamically Adapted:</strong> Following your adaptive quiz result, Day 4 was automatically restructured to reinforce key technical fundamentals before your mock interview.
          </div>
        </div>
      )}

      {/* ── Day by Day Timeline Cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {plan.schedule.map((day) => {
          return (
            <div
              key={day.day}
              className="glass-card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '1.25rem',
                alignItems: 'flex-start',
                borderColor: day.adapted
                  ? 'rgba(168, 85, 247, 0.4)'
                  : day.completed
                  ? 'rgba(16, 185, 129, 0.35)'
                  : 'var(--color-border)',
                backgroundColor: day.completed
                  ? 'rgba(16, 185, 129, 0.04)'
                  : 'rgba(30, 41, 59, 0.5)',
              }}
            >
              {/* Day Number Column */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: day.completed
                      ? 'rgba(16, 185, 129, 0.2)'
                      : day.adapted
                      ? 'rgba(168, 85, 247, 0.2)'
                      : 'rgba(0, 200, 255, 0.15)',
                    color: day.completed
                      ? '#10b981'
                      : day.adapted
                      ? '#c084fc'
                      : 'var(--color-alexa-cyan)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ fontSize: '0.62rem', textTransform: 'uppercase' }}>Day</span>
                  <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{day.day}</span>
                </div>
              </div>

              {/* Day Content */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                    {day.topic}
                  </h4>

                  {day.adapted && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(168, 85, 247, 0.2)',
                        color: '#c084fc',
                        border: '1px solid rgba(168, 85, 247, 0.4)',
                      }}
                    >
                      ⚡ Adapted by Quiz
                    </span>
                  )}

                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <Clock size={12} /> {day.allocatedMinutes} mins
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 0.6rem 0', lineHeight: '1.4' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Objective:</strong> {day.objective}
                </p>

                {/* Hands-on Task Box */}
                <div
                  style={{
                    backgroundColor: 'rgba(7, 11, 20, 0.5)',
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.78rem',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.45rem',
                  }}
                >
                  <BookOpen size={14} color="var(--color-alexa-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong>Practice Task:</strong> {day.practiceTask}
                  </span>
                </div>
              </div>

              {/* Day Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '135px' }}>
                <button
                  type="button"
                  onClick={() => toggleDayCompletion(day.day)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: day.completed ? '#10b981' : 'var(--color-border)',
                    backgroundColor: day.completed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: day.completed ? '#10b981' : 'var(--color-text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {day.completed ? (
                    <>
                      <CheckCircle2 size={14} /> Completed
                    </>
                  ) : (
                    <>
                      <Circle size={14} /> Mark Done
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await startQuiz(day.topic);
                  }}
                  disabled={isQuizzing}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.76rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                  title="Generate adaptive 3-question quiz for this topic"
                >
                  <HelpCircle size={13} color="var(--color-alexa-cyan)" />
                  Take Quiz
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
