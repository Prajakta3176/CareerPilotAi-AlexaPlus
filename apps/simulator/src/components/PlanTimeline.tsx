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
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <Calendar size={26} />
        </div>
        <h2>No Study Plan Generated Yet</h2>
        <p>
          CareerPilot AI generates a personalized multi-day preparation timeline structured around your verified skill gaps.
        </p>
        <button
          type="button"
          onClick={createPlan}
          disabled={isPlanning}
          className="btn btn-primary"
        >
          {isPlanning ? (
            <>
              <Loader2 size={15} className="spinner" /> Generating Plan...
            </>
          ) : (
            <>
              <Sparkles size={15} /> Generate 5-Day Plan
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
        className="card"
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
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Personalized Roadmap
          </span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0.15rem 0 0.35rem 0' }}>
            {plan.targetRole || 'Full-Stack Developer'} — Preparation Timeline
          </h3>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={14} /> {plan.totalDays} Days Total
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} /> {plan.dailyMinutes} mins / day
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckSquare size={14} /> {completedCount} of {plan.schedule.length} Days Complete
            </span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div style={{ minWidth: '160px', textAlign: 'right' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
            {progressPct}% Completed
          </div>
          <div
            style={{
              width: '100%',
              height: '7px',
              backgroundColor: 'var(--color-bg-subtle)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                backgroundColor: 'var(--color-primary)',
                transition: 'width 250ms ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Adaptation Alert Banner ── */}
      {hasAdaptedDay && (
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.15rem',
            backgroundColor: 'var(--color-purple-bg)',
            borderColor: 'var(--color-purple-border)',
          }}
        >
          <AlertCircle size={18} color="var(--color-purple)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.84rem', color: '#581c87', lineHeight: '1.45' }}>
            <strong>Curriculum Dynamically Adapted:</strong> Following your adaptive quiz result, Day 4 was automatically reorganized to reinforce key technical fundamentals before your mock interview.
          </div>
        </div>
      )}

      {/* ── Day by Day Timeline Cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {plan.schedule.map((day) => {
          return (
            <div
              key={day.day}
              className="card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '1.25rem',
                alignItems: 'flex-start',
                borderColor: day.adapted
                  ? 'var(--color-purple-border)'
                  : day.completed
                  ? 'var(--color-success-border)'
                  : 'var(--color-border)',
                backgroundColor: day.completed
                  ? 'var(--color-success-bg)'
                  : '#ffffff',
              }}
            >
              {/* Day Number Box */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: day.completed
                      ? 'var(--color-success)'
                      : day.adapted
                      ? 'var(--color-purple-bg)'
                      : 'var(--color-primary-subtle)',
                    color: day.completed
                      ? '#ffffff'
                      : day.adapted
                      ? 'var(--color-purple)'
                      : 'var(--color-primary)',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                    {day.topic}
                  </h4>

                  {day.adapted && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-purple-bg)',
                        color: 'var(--color-purple)',
                        border: '1px solid var(--color-purple-border)',
                      }}
                    >
                      Adapted by Quiz
                    </span>
                  )}

                  <span
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <Clock size={12} /> {day.allocatedMinutes} mins
                  </span>
                </div>

                <p style={{ fontSize: '0.83rem', color: 'var(--color-text-secondary)', margin: '0 0 0.55rem 0', lineHeight: '1.45' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Objective:</strong> {day.objective}
                </p>

                {/* Hands-on Task Box */}
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.78rem',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.45rem',
                  }}
                >
                  <BookOpen size={14} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong>Practice Task:</strong> {day.practiceTask}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', minWidth: '130px' }}>
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
                    borderColor: day.completed ? 'var(--color-success)' : 'var(--color-border)',
                    backgroundColor: day.completed ? 'var(--color-success-bg)' : '#ffffff',
                    color: day.completed ? 'var(--color-success)' : 'var(--color-text-secondary)',
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
                >
                  <HelpCircle size={13} color="var(--color-primary)" />
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
