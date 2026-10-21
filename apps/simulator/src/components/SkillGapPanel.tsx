import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Quote,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Loader2,
  BrainCircuit,
} from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';
import { SkillItem } from '../types';

export default function SkillGapPanel() {
  const { comparison, createPlan, isPlanning, setActiveTab, runAnalysis, isAnalyzing, jobText, resumeText } = useSimulator();
  const [filter, setFilter] = useState<'all' | 'matched' | 'partial' | 'missing'>('all');

  if (!comparison) {
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
          <BrainCircuit size={26} />
        </div>
        <h2>No Skill Gap Analysis Yet</h2>
        <p>
          Input your job description and resume, or load the demo sample data to view matched competencies, evidence quotes, and gaps.
        </p>
        <button
          type="button"
          onClick={async () => {
            if (!jobText || !resumeText) {
              setActiveTab('onboarding');
            } else {
              await runAnalysis();
            }
          }}
          disabled={isAnalyzing}
          className="btn btn-primary"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={15} className="spinner" /> Analyzing...
            </>
          ) : (
            <>
              Go to Step 1: Input & Run Analysis <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    );
  }

  const allSkills: SkillItem[] = [
    ...comparison.matched,
    ...comparison.partial,
    ...comparison.missing,
  ];

  const displayedSkills = allSkills.filter((s) => {
    if (filter === 'all') return true;
    return s.matchType === filter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Top Match Score Card ── */}
      <div
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '1.5rem',
          alignItems: 'center',
        }}
      >
        {/* Match Percentage */}
        <div style={{ textAlign: 'center', minWidth: '90px' }}>
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
              lineHeight: 1,
            }}
          >
            {comparison.matchScore}%
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Role Match
          </span>
        </div>

        {/* 3 Metric Counts */}
        <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success)', fontWeight: 700, fontSize: '1.15rem' }}>
              <CheckCircle2 size={16} />
              {comparison.matchedCount}
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>Verified Skills</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-warning)', fontWeight: 700, fontSize: '1.15rem' }}>
              <AlertTriangle size={16} />
              {comparison.partialCount}
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>Partial / Inferred</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-danger)', fontWeight: 700, fontSize: '1.15rem' }}>
              <XCircle size={16} />
              {comparison.missingCount}
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>Critical Gaps</span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={createPlan}
            disabled={isPlanning}
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            {isPlanning ? (
              <>
                <Loader2 size={15} className="spinner" /> Generating Plan...
              </>
            ) : (
              <>
                <Sparkles size={14} /> Build 5-Day Study Plan <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── AI Recommendation Callout ── */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1.15rem',
          backgroundColor: 'var(--color-primary-subtle)',
          borderColor: 'var(--color-primary-border)',
        }}
      >
        <Lightbulb size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.84rem', color: '#1e3a8a', lineHeight: '1.45' }}>
          <strong>Preparation Strategy:</strong> {comparison.recommendation}
        </span>
      </div>

      {/* ── Filter Tabs ── */}
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginRight: '0.25rem', fontWeight: 600 }}>
          Filter:
        </span>
        <button
          type="button"
          onClick={() => setFilter('all')}
          style={{
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: filter === 'all' ? 'var(--color-primary)' : 'var(--color-border)',
            backgroundColor: filter === 'all' ? 'var(--color-primary-subtle)' : '#ffffff',
            color: filter === 'all' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontSize: '0.78rem',
            fontWeight: filter === 'all' ? 600 : 500,
            cursor: 'pointer',
          }}
        >
          All Skills ({allSkills.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('matched')}
          style={{
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: filter === 'matched' ? 'var(--color-success)' : 'var(--color-border)',
            backgroundColor: filter === 'matched' ? 'var(--color-success-bg)' : '#ffffff',
            color: filter === 'matched' ? 'var(--color-success)' : 'var(--color-text-secondary)',
            fontSize: '0.78rem',
            fontWeight: filter === 'matched' ? 600 : 500,
            cursor: 'pointer',
          }}
        >
          Verified ({comparison.matchedCount})
        </button>

        <button
          type="button"
          onClick={() => setFilter('partial')}
          style={{
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: filter === 'partial' ? 'var(--color-warning)' : 'var(--color-border)',
            backgroundColor: filter === 'partial' ? 'var(--color-warning-bg)' : '#ffffff',
            color: filter === 'partial' ? 'var(--color-warning)' : 'var(--color-text-secondary)',
            fontSize: '0.78rem',
            fontWeight: filter === 'partial' ? 600 : 500,
            cursor: 'pointer',
          }}
        >
          Partial ({comparison.partialCount})
        </button>

        <button
          type="button"
          onClick={() => setFilter('missing')}
          style={{
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: filter === 'missing' ? 'var(--color-danger)' : 'var(--color-border)',
            backgroundColor: filter === 'missing' ? 'var(--color-danger-bg)' : '#ffffff',
            color: filter === 'missing' ? 'var(--color-danger)' : 'var(--color-text-secondary)',
            fontSize: '0.78rem',
            fontWeight: filter === 'missing' ? 600 : 500,
            cursor: 'pointer',
          }}
        >
          Missing Gaps ({comparison.missingCount})
        </button>
      </div>

      {/* ── Skill Cards Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.85rem' }}>
        {displayedSkills.map((skill, idx) => {
          const isMatched = skill.matchType === 'matched';
          const isPartial = skill.matchType === 'partial';

          const statusColor = isMatched ? 'var(--color-success)' : isPartial ? 'var(--color-warning)' : 'var(--color-danger)';
          const statusBg = isMatched
            ? 'var(--color-success-bg)'
            : isPartial
            ? 'var(--color-warning-bg)'
            : 'var(--color-danger-bg)';
          const statusBorder = isMatched
            ? 'var(--color-success-border)'
            : isPartial
            ? 'var(--color-warning-border)'
            : 'var(--color-danger-border)';
          const label = isMatched ? 'Verified' : isPartial ? 'Partial' : 'Missing Gap';

          return (
            <div
              key={`${skill.name}-${idx}`}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.65rem',
                borderLeft: `4px solid ${statusColor}`,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-muted)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {skill.category}
                  </span>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: statusBg,
                      color: statusColor,
                      border: `1px solid ${statusBorder}`,
                    }}
                  >
                    {label}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                  {skill.name}
                </h4>
              </div>

              {/* Evidence Quote / Callout */}
              {skill.evidenceSnippet ? (
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    gap: '0.45rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <Quote size={13} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0, fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--color-text-secondary)', lineHeight: '1.45' }}>
                    "{skill.evidenceSnippet}"
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: 'var(--color-danger-bg)',
                    border: '1px solid var(--color-danger-border)',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--color-danger)',
                    fontWeight: 500,
                  }}
                >
                  Target focus area — prioritized for study plan and adaptive quizzes.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
