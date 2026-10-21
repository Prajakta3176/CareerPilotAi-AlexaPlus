import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Quote,
  Sparkles,
  ArrowRight,
  TrendingUp,
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
          <BrainCircuit size={28} />
        </div>
        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Skill Gap Analysis Yet</h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '420px', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Paste your target job description and resume, or load the sample data to see structured matches, evidence quotes, and gaps.
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
              <Loader2 size={16} className="spinner" /> Analyzing...
            </>
          ) : (
            <>
              Go to Onboarding / Run Analysis <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    );
  }

  // Filter skills
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
      {/* ── Top Summary Header ── */}
      <div
        className="glass-card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '1.5rem',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
        }}
      >
        {/* Match Score Meter */}
        <div style={{ textAlign: 'center', minWidth: '100px' }}>
          <div
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              background: 'var(--gradient-alexa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}
          >
            {comparison.matchScore}%
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Role Match
          </span>
        </div>

        {/* Breakdown Stats */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>
              <CheckCircle2 size={16} />
              {comparison.matchedCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Verified Matches</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>
              <AlertTriangle size={16} />
              {comparison.partialCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Partial / Inferred</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontWeight: 700, fontSize: '1.1rem' }}>
              <XCircle size={16} />
              {comparison.missingCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Critical Gaps</span>
          </div>
        </div>

        {/* CTA to Generate Plan */}
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
                <Sparkles size={15} /> Build Study Plan <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── AI Recommendation Insight ── */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1.25rem',
          borderColor: 'rgba(0, 200, 255, 0.3)',
          backgroundColor: 'rgba(0, 200, 255, 0.05)',
        }}
      >
        <TrendingUp size={18} color="var(--color-alexa-cyan)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-primary)', lineHeight: '1.4' }}>
          <strong>Agent Recommendation:</strong> {comparison.recommendation}
        </span>
      </div>

      {/* ── Filter Pills ── */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>Filter:</span>
        <button
          type="button"
          onClick={() => setFilter('all')}
          style={{
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: filter === 'all' ? 'var(--color-alexa-cyan)' : 'var(--color-border)',
            backgroundColor: filter === 'all' ? 'rgba(0, 200, 255, 0.15)' : 'transparent',
            color: filter === 'all' ? '#fff' : 'var(--color-text-secondary)',
            fontSize: '0.78rem',
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
            borderColor: filter === 'matched' ? '#10b981' : 'var(--color-border)',
            backgroundColor: filter === 'matched' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            color: filter === 'matched' ? '#10b981' : 'var(--color-text-secondary)',
            fontSize: '0.78rem',
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
            borderColor: filter === 'partial' ? '#f59e0b' : 'var(--color-border)',
            backgroundColor: filter === 'partial' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
            color: filter === 'partial' ? '#f59e0b' : 'var(--color-text-secondary)',
            fontSize: '0.78rem',
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
            borderColor: filter === 'missing' ? '#ef4444' : 'var(--color-border)',
            backgroundColor: filter === 'missing' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
            color: filter === 'missing' ? '#ef4444' : 'var(--color-text-secondary)',
            fontSize: '0.78rem',
            cursor: 'pointer',
          }}
        >
          Missing Gaps ({comparison.missingCount})
        </button>
      </div>

      {/* ── Skills Cards Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.85rem' }}>
        {displayedSkills.map((skill, idx) => {
          const isMatched = skill.matchType === 'matched';
          const isPartial = skill.matchType === 'partial';

          const badgeColor = isMatched ? '#10b981' : isPartial ? '#f59e0b' : '#ef4444';
          const badgeBg = isMatched
            ? 'rgba(16, 185, 129, 0.15)'
            : isPartial
            ? 'rgba(245, 158, 11, 0.15)'
            : 'rgba(239, 68, 68, 0.15)';
          const badgeLabel = isMatched ? 'Verified Match' : isPartial ? 'Partial / Inferred' : 'Critical Gap';

          return (
            <div
              key={`${skill.name}-${idx}`}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.65rem',
                borderLeft: `4px solid ${badgeColor}`,
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
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: badgeBg,
                      color: badgeColor,
                    }}
                  >
                    {badgeLabel}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff', margin: 0 }}>{skill.name}</h4>
              </div>

              {/* Evidence Quote */}
              {skill.evidenceSnippet ? (
                <div
                  style={{
                    backgroundColor: 'rgba(7, 11, 20, 0.5)',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px dashed var(--color-border)',
                    display: 'flex',
                    gap: '0.45rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <Quote size={13} color="var(--color-alexa-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0, fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                    "{skill.evidenceSnippet}"
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.74rem',
                    color: '#f87171',
                  }}
                >
                  ⚠️ Not found in resume — prioritized for your study plan schedule.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
