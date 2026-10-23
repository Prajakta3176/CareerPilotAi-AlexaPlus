import { useState, useRef } from 'react';
import type { FormEvent, DragEvent, ChangeEvent } from 'react';
import {
  Sparkles,
  FileText,
  Briefcase,
  Clock,
  Calendar,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Upload,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';
import { extractTextFromPdf } from '../lib/pdfParser';

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

  const [jobExtracting, setJobExtracting] = useState(false);
  const [jobFileName, setJobFileName] = useState<string | null>(null);
  const [jobDragOver, setJobDragOver] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);

  const [resumeExtracting, setResumeExtracting] = useState(false);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [resumeDragOver, setResumeDragOver] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const jobFileInputRef = useRef<HTMLInputElement>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!jobText.trim() || !resumeText.trim()) return;
    await runAnalysis();
  };

  // Handler for Job PDF
  const handleJobFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setJobError('Please upload a valid .pdf file');
      return;
    }
    setJobError(null);
    setJobExtracting(true);
    setJobFileName(file.name);
    try {
      const extracted = await extractTextFromPdf(file);
      if (!extracted) {
        setJobError('Could not find extractable text in this PDF. It may be a scanned image.');
      } else {
        setJobText(extracted);
      }
    } catch (err: any) {
      console.error('[PDF] Job extraction error:', err);
      setJobError(err.message || 'Failed to parse PDF text');
    } finally {
      setJobExtracting(false);
    }
  };

  // Handler for Resume PDF
  const handleResumeFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setResumeError('Please upload a valid .pdf file');
      return;
    }
    setResumeError(null);
    setResumeExtracting(true);
    setResumeFileName(file.name);
    try {
      const extracted = await extractTextFromPdf(file);
      if (!extracted) {
        setResumeError('Could not find extractable text in this PDF. It may be a scanned image.');
      } else {
        setResumeText(extracted);
      }
    } catch (err: any) {
      console.error('[PDF] Resume extraction error:', err);
      setResumeError(err.message || 'Failed to parse PDF text');
    } finally {
      setResumeExtracting(false);
    }
  };

  // Drag and drop handlers
  const onJobDrop = (e: DragEvent) => {
    e.preventDefault();
    setJobDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleJobFile(e.dataTransfer.files[0]);
    }
  };

  const onResumeDrop = (e: DragEvent) => {
    e.preventDefault();
    setResumeDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleResumeFile(e.dataTransfer.files[0]);
    }
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
                : 'Upload your own PDF resume/job description below, or click "Load Demo Sample" to test instantly.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setJobFileName(null);
            setResumeFileName(null);
            loadSampleData();
          }}
          className={`btn ${isSampleLoaded ? 'btn-secondary' : 'btn-primary'}`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Sparkles size={14} />
          {isSampleLoaded ? 'Reload Sample' : 'Load Demo Sample'}
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* ── Dual Upload / Textarea Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* 1. Job Description Card */}
          <div
            className="card"
            onDragOver={(e) => {
              e.preventDefault();
              setJobDragOver(true);
            }}
            onDragLeave={() => setJobDragOver(false)}
            onDrop={onJobDrop}
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderColor: jobDragOver ? 'var(--color-primary)' : 'var(--color-border)',
              backgroundColor: jobDragOver ? 'rgba(0, 168, 232, 0.04)' : '#ffffff',
              transition: 'all 150ms ease',
            }}
          >
            <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Briefcase size={16} color="var(--color-primary)" />
                Target Job Description
              </span>

              {/* Upload PDF Button & Hidden Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  ref={jobFileInputRef}
                  style={{ display: 'none' }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      handleJobFile(e.target.files[0]);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => jobFileInputRef.current?.click()}
                  disabled={jobExtracting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.25rem 0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#ffffff',
                    color: 'var(--color-primary)',
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {jobExtracting ? <Loader2 size={12} className="spinner" /> : <Upload size={12} />}
                  Upload Job PDF
                </button>
              </div>
            </div>

            {/* Extraction Status Badge */}
            {jobFileName && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.35rem 0.65rem',
                  marginBottom: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(0, 168, 232, 0.08)',
                  color: 'var(--color-primary)',
                  fontSize: '0.73rem',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FileCheck size={13} /> Extracted from: <strong>{jobFileName}</strong>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {jobText.length} characters
                </span>
              </div>
            )}

            {jobError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.65rem',
                  marginBottom: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  fontSize: '0.73rem',
                }}
              >
                <AlertCircle size={13} /> {jobError}
              </div>
            )}

            <textarea
              rows={11}
              value={jobText}
              onChange={(e) => {
                setJobText(e.target.value);
                if (!e.target.value) setJobFileName(null);
              }}
              placeholder="Drop target job description PDF here, or paste qualifications & requirements..."
              required
              className="form-textarea"
            />
          </div>

          {/* 2. Resume Card */}
          <div
            className="card"
            onDragOver={(e) => {
              e.preventDefault();
              setResumeDragOver(true);
            }}
            onDragLeave={() => setResumeDragOver(false)}
            onDrop={onResumeDrop}
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderColor: resumeDragOver ? 'var(--color-purple)' : 'var(--color-border)',
              backgroundColor: resumeDragOver ? 'rgba(139, 92, 246, 0.04)' : '#ffffff',
              transition: 'all 150ms ease',
            }}
          >
            <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <FileText size={16} color="var(--color-purple)" />
                Candidate Resume / Experience
              </span>

              {/* Upload PDF Button & Hidden Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  ref={resumeFileInputRef}
                  style={{ display: 'none' }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      handleResumeFile(e.target.files[0]);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => resumeFileInputRef.current?.click()}
                  disabled={resumeExtracting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.25rem 0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#ffffff',
                    color: 'var(--color-purple)',
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {resumeExtracting ? <Loader2 size={12} className="spinner" /> : <Upload size={12} />}
                  Upload Resume PDF
                </button>
              </div>
            </div>

            {/* Extraction Status Badge */}
            {resumeFileName && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.35rem 0.65rem',
                  marginBottom: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(139, 92, 246, 0.08)',
                  color: 'var(--color-purple)',
                  fontSize: '0.73rem',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FileCheck size={13} /> Extracted from: <strong>{resumeFileName}</strong>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {resumeText.length} characters
                </span>
              </div>
            )}

            {resumeError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.65rem',
                  marginBottom: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  fontSize: '0.73rem',
                }}
              >
                <AlertCircle size={13} /> {resumeError}
              </div>
            )}

            <textarea
              rows={11}
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                if (!e.target.value) setResumeFileName(null);
              }}
              placeholder="Drop candidate resume PDF here, or paste technical competencies & project highlights..."
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            {!jobText.trim() || !resumeText.trim() ? (
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Upload or paste both Job Description & Resume, or click <strong>Load Demo Sample</strong>.
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
