import { useState, useEffect } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Calendar,
  Loader2,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSimulator } from '../context/SimulatorContext';

export default function QuizPanel() {
  const {
    activeQuiz,
    quizResult,
    submitQuiz,
    isSubmittingQuiz,
    startQuiz,
    isQuizzing,
    setActiveTab,
    plan,
  } = useSimulator();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  // Reset index when activeQuiz changes
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedAnswers({});
  }, [activeQuiz?.quizId]);

  // Trigger celebration confetti on pass
  useEffect(() => {
    if (quizResult && quizResult.passed) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00c8ff', '#6366f1', '#10b981', '#ffffff'],
      });
    }
  }, [quizResult]);

  if (!activeQuiz) {
    const defaultTopic = plan?.schedule[0]?.topic || 'AWS Serverless Architecture (Lambda & SQS)';

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
          <HelpCircle size={28} />
        </div>
        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Active Quiz Selected</h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '420px', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Test your technical recall and system design edge cases. Weak scores automatically adapt your 5-day study plan.
        </p>
        <button
          type="button"
          onClick={() => startQuiz(defaultTopic)}
          disabled={isQuizzing}
          className="btn btn-primary"
        >
          {isQuizzing ? (
            <>
              <Loader2 size={16} className="spinner" /> Generating Questions...
            </>
          ) : (
            <>
              <Sparkles size={16} /> Quiz Me on "{defaultTopic.split('(')[0]?.trim() || defaultTopic}"
            </>
          )}
        </button>
      </div>
    );
  }

  // ── Quiz Results View ──
  if (quizResult) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Result Header Card */}
        <div
          className="glass-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            background: quizResult.passed
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
            borderColor: quizResult.passed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: quizResult.passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: quizResult.passed ? '#10b981' : '#ef4444',
              }}
            >
              {quizResult.passed ? <Award size={32} /> : <AlertTriangle size={32} />}
            </div>

            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  color: quizResult.passed ? '#10b981' : '#ef4444',
                  fontWeight: 600,
                }}
              >
                {quizResult.passed ? 'Passed • Mastery Verified' : 'Review Needed • Plan Adapted'}
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', margin: '0.2rem 0' }}>
                Score: {quizResult.score}% ({quizResult.correctCount} of {quizResult.totalQuestions} Correct)
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                Topic: {quizResult.topic}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => startQuiz(quizResult.topic)}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <RotateCcw size={14} /> Retake Quiz
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('plan')}
              className="btn btn-primary"
              style={{ fontSize: '0.82rem' }}
            >
              <Calendar size={14} /> View Updated Plan <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Feedback / Adaptation Notice */}
        <div
          className="glass-card"
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: quizResult.passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(168, 85, 247, 0.12)',
            borderColor: quizResult.passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(168, 85, 247, 0.4)',
            fontSize: '0.85rem',
            lineHeight: '1.5',
            color: '#fff',
          }}
        >
          <strong>Coach Assessment:</strong> {quizResult.feedback}
        </div>

        {/* Question by Question Review */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h4 style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', margin: '0.5rem 0 0 0' }}>
            Question Breakdown & Detailed Explanations
          </h4>

          {activeQuiz.questions.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isCorrect = userChoice === q.correctOption;

            return (
              <div
                key={q.id}
                className="glass-card"
                style={{
                  borderLeft: `4px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    Question {idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: isCorrect ? '#10b981' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{q.question}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                  <div style={{ color: isCorrect ? '#10b981' : '#f87171' }}>
                    <strong>Your Answer:</strong> {userChoice || 'No answer selected'}
                  </div>
                  {!isCorrect && (
                    <div style={{ color: '#10b981' }}>
                      <strong>Correct Answer:</strong> {q.correctOption}
                    </div>
                  )}
                </div>

                {/* Explanation */}
                <div
                  style={{
                    backgroundColor: 'rgba(7, 11, 20, 0.6)',
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <strong style={{ color: 'var(--color-alexa-cyan)' }}>Explanation:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Active Quiz Question View ──
  const currentQ = activeQuiz.questions[currentIdx];
  const totalQ = activeQuiz.questions.length;
  const isLast = currentIdx === totalQ - 1;

  if (!currentQ) {
    return null;
  }

  const handleSelectOption = (opt: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: opt,
    }));
  };

  const handleNextOrSubmit = async () => {
    if (isLast) {
      // Build submissions array
      const submissions = activeQuiz.questions.map((q) => ({
        questionId: q.id,
        selectedOption: selectedAnswers[q.id] || '',
        correctOption: q.correctOption,
      }));
      await submitQuiz(submissions);
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Progress & Topic Header ── */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.9rem 1.25rem',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--color-alexa-cyan)',
              textTransform: 'uppercase',
            }}
          >
            Topic Assessment • {activeQuiz.difficulty}
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', margin: '0.15rem 0 0 0' }}>
            {activeQuiz.topic}
          </h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-alexa-cyan)' }}>
            Question {currentIdx + 1} of {totalQ}
          </span>
          <div
            style={{
              width: '120px',
              height: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginTop: '0.35rem',
            }}
          >
            <div
              style={{
                width: `${((currentIdx + 1) / totalQ) * 100}%`,
                height: '100%',
                background: 'var(--gradient-alexa)',
                transition: 'width 250ms ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Question Card ── */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', margin: 0, lineHeight: '1.5' }}>
          {currentQ.question}
        </h4>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {currentQ.options.map((opt) => {
            const isSelected = selectedAnswers[currentQ.id] === opt;

            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectOption(opt)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--color-alexa-cyan)' : 'var(--color-border)',
                  backgroundColor: isSelected ? 'rgba(0, 200, 255, 0.12)' : 'rgba(7, 11, 20, 0.5)',
                  color: isSelected ? '#fff' : 'var(--color-text-secondary)',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  boxShadow: isSelected ? '0 0 14px rgba(0, 200, 255, 0.15)' : 'none',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: isSelected ? 'var(--color-alexa-cyan)' : 'rgba(148, 163, 184, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-alexa-cyan)',
                      }}
                    />
                  )}
                </div>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="btn btn-secondary"
            style={{ opacity: currentIdx === 0 ? 0.3 : 1 }}
          >
            <ArrowLeft size={14} /> Previous
          </button>

          <button
            type="button"
            onClick={handleNextOrSubmit}
            disabled={!selectedAnswers[currentQ.id] || isSubmittingQuiz}
            className="btn btn-primary"
            style={{
              opacity: !selectedAnswers[currentQ.id] || isSubmittingQuiz ? 0.5 : 1,
            }}
          >
            {isSubmittingQuiz ? (
              <>
                <Loader2 size={15} className="spinner" /> Grading Quiz...
              </>
            ) : isLast ? (
              <>
                Submit & Grade Answers <CheckCircle2 size={15} />
              </>
            ) : (
              <>
                Next Question <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
