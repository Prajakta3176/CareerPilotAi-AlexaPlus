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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Demo Sample Mode Banner ── */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isSampleLoaded ? 'var(--color-primary-subtle)' : '#ffffff',
          borderColor: isSampleLoaded ? 'var(--color-primary-border)' : 'var(--color-border)',
          padding: '1rem 1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.45rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isSampleLoaded ? '#dbeafe' : 'var(--color-bg-subtle)',
              color: 'var(--color-primary)',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.15rem' }}>
              {isSampleLoaded ? 'Sample Mode Active: Senior Full-Stack Engineer' : 'Fast-Track Judging Evaluation'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              {isSampleLoaded
                ? 'Sample job description and resume loaded. Ready for skill gap analysis and plan generation.'
                : 'Click "Load Demo Sample" to test CareerPilot AI instantly without typing personal data.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSampleData}
          className={`btn ${isSampleLoaded ? 'btn-secondary' : 'btn-primary'}`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Sparkles size={14} />
          {isSampleLoaded ? 'Reload Sample' : 'Load Demo Sample'}
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* ── Dual Textareas ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* Job Description Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Briefcase size={16} color="var(--color-primary)" />
                Target Job Description
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                {jobText.length > 0 ? `${jobText.length} characters` : 'Required'}
              </span>
            </div>

            <textarea
              rows={11}
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste target job description, qualifications, and role requirements here..."
              required
              className="form-textarea"
            />
          </div>

          {/* Resume Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <FileText size={16} color="var(--color-purple)" />
                Candidate Resume / Experience
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                {resumeText.length > 0 ? `${resumeText.length} characters` : 'Required'}
              </span>
            </div>

            <textarea
              rows={11}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste candidate resume text, project highlights, and technical competencies here..."
              required
              className="form-textarea"
            />
          </div>
        </div>

        {/* ── Preparation Preferences ── */}
        <div
          className="card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            alignItems: 'center',
          }}
        >
          {/* Total Duration */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
              <Calendar size={15} color="var(--color-text-secondary)" />
              <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>Total Study Duration</span>
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
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: days === d ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: days === d ? 'var(--color-primary-subtle)' : 'var(--color-bg-surface)',
                    color: days === d ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: days === d ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >
                  {d} Days {d === 5 && '• Recommended'}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Study Budget */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
              <Clock size={15} color="var(--color-text-secondary)" />
              <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>Daily Study Time</span>
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
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: dailyMinutes === m ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: dailyMinutes === m ? 'var(--color-primary-subtle)' : 'var(--color-bg-surface)',
                    color: dailyMinutes === m ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: dailyMinutes === m ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >
                  {m} mins
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Submit Action ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            {!jobText.trim() || !resumeText.trim() ? (
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Fill in both fields or click <strong>Load Demo Sample</strong> to proceed.
              </span>
            ) : (
              <span style={{ fontSize: '0.82rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={15} /> Ready for skill comparison
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!jobText.trim() || !resumeText.trim() || isAnalyzing}
            className="btn btn-primary"
            style={{
              padding: '0.65rem 1.4rem',
              fontSize: '0.88rem',
              opacity: !jobText.trim() || !resumeText.trim() || isAnalyzing ? 0.5 : 1,
              cursor: !jobText.trim() || !resumeText.trim() || isAnalyzing ? 'not-allowed' : 'pointer',
            }}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={16} className="spinner" />
                Analyzing Skill Gaps...
              </>
            ) : (
              <>
                Run Skill Gap Analysis
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
