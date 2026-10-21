import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Sparkles,
  Zap,
  Activity,
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

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBusy]);

  const handleSend = async (e?: React.FormEvent) => {
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
      // Simulate voice speech-to-text prompt after brief delay
      setTimeout(() => {
        setIsListening(false);
        setInput('Generate a 5-day study plan based on my skill gaps');
      }, 2200);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* ── Chat Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid var(--color-border)',
          background: 'rgba(15, 23, 42, 0.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          <div>
            <h2 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', margin: 0 }}>
              Alexa+ Voice & Agent Stream
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              Connected to MCP Runtime (Port 8787)
            </span>
          </div>
        </div>

        {/* Audio Wave Visualizer Simulation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px' }}>
          {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3].map((scale, i) => (
            <div
              key={i}
              style={{
                width: '3px',
                height: `${scale * 100}%`,
                backgroundColor: isListening || isBusy ? 'var(--color-alexa-cyan)' : 'rgba(148, 163, 184, 0.3)',
                borderRadius: '2px',
                animation: isListening || isBusy ? `pulseWave 1.${i + 2}s infinite ease-in-out` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Message History Stream ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Activity size={13} color="var(--color-alexa-cyan)" />
                {msg.content}
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                flexDirection: isAssistant ? 'row' : 'row-reverse',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: isAssistant ? 'rgba(0, 200, 255, 0.15)' : 'rgba(99, 102, 241, 0.2)',
                  border: `1px solid ${isAssistant ? 'rgba(0, 200, 255, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
                  color: isAssistant ? 'var(--color-alexa-cyan)' : '#818cf8',
                }}
              >
                {isAssistant ? <Bot size={16} /> : <User size={16} />}
              </div>

              {/* Message Bubble */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div
                  style={{
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-lg)',
                    borderTopLeftRadius: isAssistant ? '0.2rem' : 'var(--radius-lg)',
                    borderTopRightRadius: !isAssistant ? '0.2rem' : 'var(--radius-lg)',
                    backgroundColor: isAssistant ? 'rgba(30, 41, 59, 0.85)' : 'rgba(0, 200, 255, 0.18)',
                    border: `1px solid ${isAssistant ? 'var(--color-border)' : 'rgba(0, 200, 255, 0.4)'}`,
                    color: '#fff',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    boxShadow: isAssistant ? '0 2px 8px rgba(0,0,0,0.3)' : '0 0 12px rgba(0, 200, 255, 0.15)',
                  }}
                >
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>

                  {/* Inline Tool Call Badges */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
                      {msg.toolCalls.map((tName) => (
                        <button
                          key={tName}
                          type="button"
                          onClick={() => setActiveTab('trace')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.55rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(0, 200, 255, 0.35)',
                            color: 'var(--color-alexa-cyan)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                          }}
                          title="Click to view MCP execution details in Tool Trace"
                        >
                          <Zap size={12} />
                          tool: {tName}
                          <span style={{ opacity: 0.6 }}>→ Trace</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                    {msg.suggestedActions.map((act) => (
                      <button
                        key={act}
                        type="button"
                        onClick={() => handleQuickAction(act)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: 'var(--color-text-secondary)',
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}
                      >
                        <Sparkles size={11} color="var(--color-alexa-cyan)" />
                        {act}
                      </button>
                    ))}
                  </div>
                )}

                <span
                  style={{
                    fontSize: '0.68rem',
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

        {/* Agent Thinking Skeleton */}
        {isBusy && (
          <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start', maxWidth: '80%' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 200, 255, 0.15)',
                border: '1px solid rgba(0, 200, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-alexa-cyan)',
              }}
            >
              <Bot size={16} />
            </div>
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-lg)',
                borderTopLeftRadius: '0.2rem',
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--color-text-secondary)',
                fontSize: '0.8rem',
              }}
            >
              <div className="spinner" style={{ width: '12px', height: '12px' }} />
              Alexa+ is reasoning and executing MCP tools...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div
        style={{
          padding: '0.85rem 1rem',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Voice Mic Toggle */}
          <button
            type="button"
            onClick={toggleVoice}
            className="btn"
            style={{
              padding: '0.6rem',
              borderRadius: '50%',
              backgroundColor: isListening ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isListening ? '#ef4444' : 'var(--color-border)'}`,
              color: isListening ? '#ef4444' : 'var(--color-text-secondary)',
            }}
            title={isListening ? 'Listening...' : 'Simulate Voice Input'}
          >
            {isListening ? <Mic size={17} /> : <MicOff size={17} />}
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
              backgroundColor: 'rgba(7, 11, 20, 0.7)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.65rem 1.1rem',
              color: 'var(--color-text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />

          <button
            type="submit"
            disabled={!input.trim() || isBusy}
            className="btn btn-primary"
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-full)',
              opacity: !input.trim() || isBusy ? 0.4 : 1,
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
