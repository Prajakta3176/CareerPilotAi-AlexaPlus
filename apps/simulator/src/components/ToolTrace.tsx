import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
} from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';
import { ToolTraceItem } from '../types';

export default function ToolTrace() {
  const { toolTraces } = useSimulator();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterTool, setFilterTool] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const copyPayload = (item: ToolTraceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const displayedTraces = toolTraces.filter((item) => {
    if (filterTool === 'all') return true;
    return item.toolName === filterTool;
  });

  const toolNames = Array.from(new Set(toolTraces.map((t) => t.toolName)));

  if (toolTraces.length === 0) {
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
          <Terminal size={28} />
        </div>
        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No MCP Tool Invocations Yet</h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', lineHeight: '1.5' }}>
          This panel observes live tool execution between CareerPilot AI and the Model Context Protocol runtime (Port 8787).
          Trigger an action like <strong>Analyze Skills</strong> or <strong>Generate Plan</strong> to see real-time tool traces.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Top Header & Filters ── */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.9rem 1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Terminal size={20} color="var(--color-alexa-cyan)" />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>
              Live MCP Tool Execution Trace
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              Specification 2025-11-25 • Truthful Trace Telemetry
            </span>
          </div>
        </div>

        {/* Filter by Tool */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={14} color="var(--color-text-secondary)" />
          <select
            value={filterTool}
            onChange={(e) => setFilterTool(e.target.value)}
            style={{
              backgroundColor: 'rgba(7, 11, 20, 0.7)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.65rem',
              color: 'var(--color-text-primary)',
              fontSize: '0.78rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Tools ({toolTraces.length})</option>
            {toolNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Trace List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {displayedTraces.map((trace) => {
          const isExpanded = expandedId === trace.id;
          const isSuccess = trace.status === 'success';
          const isPending = trace.status === 'pending';

          const statusColor = isSuccess ? '#10b981' : isPending ? 'var(--color-alexa-cyan)' : '#ef4444';
          const statusBg = isSuccess
            ? 'rgba(16, 185, 129, 0.15)'
            : isPending
            ? 'rgba(0, 200, 255, 0.15)'
            : 'rgba(239, 68, 68, 0.15)';

          return (
            <div
              key={trace.id}
              className="glass-card"
              style={{
                padding: '0.85rem 1.1rem',
                cursor: 'pointer',
                borderColor: isExpanded ? 'var(--color-alexa-cyan)' : 'var(--color-border)',
              }}
              onClick={() => toggleExpand(trace.id)}
            >
              {/* Row Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      fontSize: '0.86rem',
                      color: '#fff',
                    }}
                  >
                    tool: {trace.toolName}
                  </span>

                  {/* Status Pill */}
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: statusBg,
                      color: statusColor,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    {isPending ? (
                      <Loader2 size={11} className="spinner" />
                    ) : isSuccess ? (
                      <CheckCircle2 size={11} />
                    ) : (
                      <AlertCircle size={11} />
                    )}
                    {trace.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Clock size={12} />
                    {trace.durationMs > 0 ? `${trace.durationMs}ms` : 'active'}
                  </span>

                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {trace.timestamp}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => copyPayload(trace, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedId === trace.id ? '#10b981' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      padding: '0.2rem',
                    }}
                    title="Copy full JSON payload"
                  >
                    <Copy size={13} />
                  </button>

                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>
              </div>

              {/* Expanded JSON Inspector */}
              {isExpanded && (
                <div
                  style={{
                    marginTop: '0.85rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Input Payload */}
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                      Input Arguments (Sanitized)
                    </span>
                    <pre
                      style={{
                        margin: '0.3rem 0 0 0',
                        padding: '0.65rem',
                        backgroundColor: 'rgba(7, 11, 20, 0.75)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-alexa-cyan)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        overflowX: 'auto',
                      }}
                    >
                      {JSON.stringify(trace.inputSummary, null, 2)}
                    </pre>
                  </div>

                  {/* Output Payload */}
                  {trace.outputSummary && (
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                        Output Result Payload
                      </span>
                      <pre
                        style={{
                          margin: '0.3rem 0 0 0',
                          padding: '0.65rem',
                          backgroundColor: 'rgba(7, 11, 20, 0.75)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          color: '#10b981',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          overflowX: 'auto',
                        }}
                      >
                        {JSON.stringify(trace.outputSummary, null, 2)}
                      </pre>
                    </div>
                  )}

                  {trace.error && (
                    <div style={{ color: '#ef4444', fontSize: '0.78rem' }}>
                      <strong>Execution Error:</strong> {trace.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
