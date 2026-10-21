import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

export default function ChatPanel() {
  const {
    messages,
    sendChatMessage,
    setActiveTab,
    isAnalyzing,
    isPlanning,
    isQuizzing,
    isSubmittingQuiz,
  } = useSimulator();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isBusy = isAnalyzing || isPlanning || isQuizzing || isSubmittingQuiz;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBusy]);

  const handleSend = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isBusy) return;
    setInput('');
    await sendChatMessage(trimmed);
  };

  const handleQuickAction = async (action: string) => {
    if (isBusy) return;
    await sendChatMessage(action);
  };

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInput('Generate a 5-day study plan based on my skill gaps');
      }, 1800);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--color-bg-surface)' }}>
      {/* ── Chat Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success)',
            }}
          />
          <div>
            <h2 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
              Alexa+ Assistant Stream
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              Connected to MCP Runtime (Port 8787)
            </span>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.72rem',
            color: isListening ? 'var(--color-danger)' : 'var(--color-text-muted)',
            fontWeight: 500,
          }}
        >
          {isListening ? 'Listening...' : 'Voice & Text Active'}
        </span>
      </div>

      {/* ── Message Stream ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: '#fafbfc',
        }}
      >
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          const isSystem = msg.role === 'system';

          if (isSystem) {
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: 'center',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <Info size={13} color="var(--color-primary)" />
                {msg.content}
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '0.65rem',
                alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                maxWidth: '88%',
                flexDirection: isAssistant ? 'row' : 'row-reverse',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: isAssistant ? 'var(--color-primary-subtle)' : '#1e293b',
                  color: isAssistant ? 'var(--color-primary)' : '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {isAssistant ? <Bot size={15} /> : <User size={15} />}
              </div>

              {/* Message Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div
                  style={{
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-lg)',
                    borderTopLeftRadius: isAssistant ? '0.2rem' : 'var(--radius-lg)',
                    borderTopRightRadius: !isAssistant ? '0.2rem' : 'var(--radius-lg)',
                    backgroundColor: isAssistant ? '#ffffff' : 'var(--color-primary)',
                    border: isAssistant ? '1px solid var(--color-border)' : 'none',
                    color: isAssistant ? 'var(--color-text-primary)' : '#ffffff',
                    fontSize: '0.84rem',
                    lineHeight: '1.5',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>

                  {/* Inline Tool Execution Pill */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                      {msg.toolCalls.map((tName) => (
                        <button
                          key={tName}
                          type="button"
                          onClick={() => setActiveTab('trace')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: isAssistant ? 'var(--color-bg-subtle)' : 'rgba(255, 255, 255, 0.2)',
                            border: isAssistant ? '1px solid var(--color-border)' : 'none',
                            color: isAssistant ? 'var(--color-primary)' : '#ffffff',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <Zap size={11} />
                          tool: {tName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.15rem' }}>
                    {msg.suggestedActions.map((act) => (
                      <button
                        key={act}
                        type="button"
                        onClick={() => handleQuickAction(act)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: '#ffffff',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-secondary)',
                          fontSize: '0.73rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-xs)',
                          transition: 'all 120ms ease',
                        }}
                      >
                        <Sparkles size={11} color="var(--color-primary)" />
                        {act}
                      </button>
                    ))}
                  </div>
                )}

                <span
                  style={{
                    fontSize: '0.67rem',
                    color: 'var(--color-text-muted)',
                    alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                    padding: '0 0.2rem',
                  }}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Processing State */}
        {isBusy && (
          <div style={{ display: 'flex', gap: '0.65rem', alignSelf: 'flex-start' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={15} />
            </div>
            <div
              style={{
                padding: '0.65rem 0.95rem',
                borderRadius: 'var(--radius-lg)',
                borderTopLeftRadius: '0.2rem',
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: 'var(--color-text-secondary)',
                fontSize: '0.8rem',
              }}
            >
              <div
                className="spinner"
                style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #e2e8f0',
                  borderTopColor: 'var(--color-primary)',
                  borderRadius: '50%',
                }}
              />
              CareerPilot is analyzing with MCP tools...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-surface)',
        }}
      >
        <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={toggleVoice}
            className="btn btn-secondary"
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              color: isListening ? 'var(--color-danger)' : 'var(--color-text-secondary)',
            }}
            title={isListening ? 'Listening...' : 'Simulate voice speech'}
          >
            {isListening ? <Mic size={16} /> : <MicOff size={16} />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to simulated speech...'
                : 'Ask Alexa+ (e.g. "Analyze skills", "Create study plan")...'
            }
            disabled={isBusy}
            style={{
              flex: 1,
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.55rem 0.85rem',
              color: 'var(--color-text-primary)',
              fontSize: '0.84rem',
              outline: 'none',
            }}
          />

          <button
            type="submit"
            disabled={!input.trim() || isBusy}
            className="btn btn-primary"
            style={{
              padding: '0.55rem 0.85rem',
              opacity: !input.trim() || isBusy ? 0.5 : 1,
            }}
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
