import type { FormEvent } from 'react';
import {
  Sparkles,
  FileText,
  Briefcase,
  Clock,
  Calendar,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

export default function JobInputForm() {
  const {
    jobText,
    setJobText,
    resumeText,
    setResumeText,
    days,
    setDays,
    dailyMinutes,
    setDailyMinutes,
    isSampleLoaded,
    loadSampleData,
    runAnalysis,
    isAnalyzing,
  } = useSimulator();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!jobText.trim() || !resumeText.trim()) return;
    await runAnalysis();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── Demo Mode Banner ── */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isSampleLoaded
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(0, 200, 255, 0.15) 100%)'
            : 'rgba(30, 41, 59, 0.5)',
          borderColor: isSampleLoaded ? 'rgba(0, 200, 255, 0.4)' : 'var(--color-border)',
          padding: '1rem 1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(0, 200, 255, 0.15)',
              color: 'var(--color-alexa-cyan)',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '0.2rem' }}>
              {isSampleLoaded ? 'Sample Mode Active: Full-Stack Engineer' : 'Fast-Track Evaluation'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              {isSampleLoaded
                ? 'Sample job description and resume loaded. Ready for skill gap analysis and plan generation.'
                : 'Click "Load Sample Data" to evaluate without pasting your personal data.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSampleData}
          className="btn btn-sample"
          style={{ whiteSpace: 'nowrap', padding: '0.5rem 1rem' }}
        >
          <Sparkles size={14} />
          {isSampleLoaded ? 'Reload Sample' : 'Load Sample Data'}
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* ── Form Inputs (Two Columns) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* Job Description Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label
                htmlFor="job-desc"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                }}
              >
                <Briefcase size={16} color="var(--color-alexa-cyan)" />
                Target Job Description
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                {jobText.length > 0 ? `${jobText.length} chars` : 'Required'}
              </span>
            </div>

            <textarea
              id="job-desc"
              rows={11}
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste the target job description, requirements, and responsibilities here..."
              required
              style={{
                width: '100%',
                backgroundColor: 'rgba(7, 11, 20, 0.6)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.82rem',
                lineHeight: '1.5',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>

          {/* Resume Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label
                htmlFor="resume-desc"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                }}
              >
                <FileText size={16} color="#a855f7" />
                Candidate Resume / Experience
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                {resumeText.length > 0 ? `${resumeText.length} chars` : 'Required'}
              </span>
            </div>

            <textarea
              id="resume-desc"
              rows={11}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste candidate resume text, skills, past experience, and projects here..."
              required
              style={{
                width: '100%',
                backgroundColor: 'rgba(7, 11, 20, 0.6)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.82rem',
                lineHeight: '1.5',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* ── Preferences Bar ── */}
        <div
          className="glass-card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          {/* Days selector */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
              <Calendar size={15} color="var(--color-text-secondary)" />
              <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>Total Prep Duration</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[3, 5, 7].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  style={{
                    flex: 1,
                    padding: '0.45rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: days === d ? 'var(--color-alexa-cyan)' : 'var(--color-border)',
                    backgroundColor: days === d ? 'rgba(0, 200, 255, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                    color: days === d ? '#fff' : 'var(--color-text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: days === d ? 600 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {d} Days {d === 5 && '⭐'}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Study Time selector */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
              <Clock size={15} color="var(--color-text-secondary)" />
              <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>Daily Study Budget</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[30, 45, 60, 90].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDailyMinutes(m)}
                  style={{
                    flex: 1,
                    padding: '0.45rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: dailyMinutes === m ? 'var(--color-alexa-cyan)' : 'var(--color-border)',
                    backgroundColor: dailyMinutes === m ? 'rgba(0, 200, 255, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                    color: dailyMinutes === m ? '#fff' : 'var(--color-text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: dailyMinutes === m ? 600 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {m}m {m === 60 && '⭐'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Submit Action ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          {!jobText.trim() || !resumeText.trim() ? (
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              Fill in both fields or click <strong>Load Sample Data</strong> to begin.
            </span>
          ) : (
            <span style={{ fontSize: '0.82rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={15} /> Ready to analyze
            </span>
          )}

          <button
            type="submit"
            disabled={!jobText.trim() || !resumeText.trim() || isAnalyzing}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.75rem',
              fontSize: '0.92rem',
              opacity: !jobText.trim() || !resumeText.trim() || isAnalyzing ? 0.5 : 1,
              cursor: !jobText.trim() || !resumeText.trim() || isAnalyzing ? 'not-allowed' : 'pointer',
            }}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                Analyzing Skill Gaps...
              </>
            ) : (
              <>
                Run Skill Gap Analysis
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
