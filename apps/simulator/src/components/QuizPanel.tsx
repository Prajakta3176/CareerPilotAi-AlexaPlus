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

  useEffect(() => {
    setCurrentIdx(0);
    setSelectedAnswers({});
  }, [activeQuiz?.quizId]);

  useEffect(() => {
    if (quizResult && quizResult.passed) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#6366f1'],
      });
    }
  }, [quizResult]);

  if (!activeQuiz) {
    const defaultTopic = plan?.schedule[0]?.topic || 'AWS Serverless Architecture (Lambda & SQS)';

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
          <HelpCircle size={26} />
        </div>
        <h2>No Active Quiz Selected</h2>
        <p>
          Assess your technical recall and edge-case reasoning. Performance automatically updates your preparation plan.
        </p>
        <button
          type="button"
          onClick={() => startQuiz(defaultTopic)}
          disabled={isQuizzing}
          className="btn btn-primary"
        >
          {isQuizzing ? (
            <>
              <Loader2 size={15} className="spinner" /> Generating Questions...
            </>
          ) : (
            <>
              <Sparkles size={15} /> Quiz Me on "{defaultTopic.split('(')[0]?.trim() || defaultTopic}"
            </>
          )}
        </button>
      </div>
    );
  }

  // ── Results Screen ──
  if (quizResult) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Score Header Card */}
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            backgroundColor: quizResult.passed ? 'var(--color-success-bg)' : 'var(--color-purple-bg)',
            borderColor: quizResult.passed ? 'var(--color-success-border)' : 'var(--color-purple-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: quizResult.passed ? '#d1fae5' : '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: quizResult.passed ? 'var(--color-success)' : 'var(--color-purple)',
              }}
            >
              {quizResult.passed ? <Award size={28} /> : <AlertTriangle size={28} />}
            </div>

            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  color: quizResult.passed ? 'var(--color-success)' : 'var(--color-purple)',
                  fontWeight: 700,
                }}
              >
                {quizResult.passed ? 'Mastery Verified' : 'Review Recommended • Plan Adapted'}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0.15rem 0' }}>
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

        {/* Coach Assessment Note */}
        <div
          className="card"
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: quizResult.passed ? 'var(--color-success-bg)' : 'var(--color-purple-bg)',
            borderColor: quizResult.passed ? 'var(--color-success-border)' : 'var(--color-purple-border)',
            fontSize: '0.85rem',
            lineHeight: '1.5',
            color: quizResult.passed ? '#065f46' : '#581c87',
          }}
        >
          <strong>Coach Assessment:</strong> {quizResult.feedback}
        </div>

        {/* Question Review Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: '0.5rem 0 0 0', fontWeight: 600 }}>
            Question Breakdown & Explanations
          </h4>

          {activeQuiz.questions.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isCorrect = userChoice === q.correctOption;

            return (
              <div
                key={q.id}
                className="card"
                style={{
                  borderLeft: `4px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.55rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    Question {idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: isCorrect ? 'var(--color-success)' : 'var(--color-danger)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {q.question}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.82rem' }}>
                  <div style={{ color: isCorrect ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    <strong>Your Choice:</strong> {userChoice || 'None'}
                  </div>
                  {!isCorrect && (
                    <div style={{ color: 'var(--color-success)' }}>
                      <strong>Correct Answer:</strong> {q.correctOption}
                    </div>
                  )}
                </div>

                {/* Explanation */}
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <strong style={{ color: 'var(--color-text-primary)' }}>Explanation:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Active Question Stepper ──
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
      {/* ── Progress Header ── */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.85rem 1.25rem',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Topic Assessment • {activeQuiz.difficulty}
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0.1rem 0 0 0' }}>
            {activeQuiz.topic}
          </h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Question {currentIdx + 1} of {totalQ}
          </span>
          <div
            style={{
              width: '120px',
              height: '6px',
              backgroundColor: 'var(--color-bg-subtle)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginTop: '0.35rem',
            }}
          >
            <div
              style={{
                width: `${((currentIdx + 1) / totalQ) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--color-primary)',
                transition: 'width 250ms ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Question Card ── */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0, lineHeight: '1.5' }}>
          {currentQ.question}
        </h4>

        {/* Options */}
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
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-primary-subtle)' : '#ffffff',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border-subtle)',
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
                        backgroundColor: 'var(--color-primary)',
                      }}
                    />
                  )}
                </div>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="btn btn-secondary"
            style={{ opacity: currentIdx === 0 ? 0.4 : 1 }}
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
