import { useState } from 'react';
import type { MouseEvent } from 'react';
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

  const copyPayload = (item: ToolTraceItem, e: MouseEvent) => {
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
          <Terminal size={26} />
        </div>
        <h2>No MCP Tool Invocations Yet</h2>
        <p>
          This tab displays live Model Context Protocol telemetry. Trigger actions like <strong>Analyze Skills</strong> or <strong>Generate Plan</strong> to observe tool executions.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Top Header ── */}
      <div
        className="card"
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
          <Terminal size={18} color="var(--color-primary)" />
          <div>
            <h3 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
              Live MCP Tool Execution Log
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              Model Context Protocol • Streamable Telemetry
            </span>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Filter size={14} color="var(--color-text-secondary)" />
          <select
            value={filterTool}
            onChange={(e) => setFilterTool(e.target.value)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {displayedTraces.map((trace) => {
          const isExpanded = expandedId === trace.id;
          const isSuccess = trace.status === 'success';
          const isPending = trace.status === 'pending';

          const statusColor = isSuccess ? 'var(--color-success)' : isPending ? 'var(--color-primary)' : 'var(--color-danger)';
          const statusBg = isSuccess
            ? 'var(--color-success-bg)'
            : isPending
            ? 'var(--color-primary-subtle)'
            : 'var(--color-danger-bg)';
          const statusBorder = isSuccess
            ? 'var(--color-success-border)'
            : isPending
            ? 'var(--color-primary-border)'
            : 'var(--color-danger-border)';

          return (
            <div
              key={trace.id}
              className="card"
              style={{
                padding: '0.85rem 1.15rem',
                cursor: 'pointer',
                borderColor: isExpanded ? 'var(--color-primary)' : 'var(--color-border)',
              }}
              onClick={() => toggleExpand(trace.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    tool: {trace.toolName}
                  </span>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: statusBg,
                      color: statusColor,
                      border: `1px solid ${statusBorder}`,
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
                      fontSize: '0.74rem',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Clock size={12} />
                    {trace.durationMs > 0 ? `${trace.durationMs}ms` : 'active'}
                  </span>

                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                    {trace.timestamp}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => copyPayload(trace, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedId === trace.id ? 'var(--color-success)' : 'var(--color-text-secondary)',
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
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Input Parameters
                    </span>
                    <pre
                      style={{
                        margin: '0.3rem 0 0 0',
                        padding: '0.65rem',
                        backgroundColor: '#0f172a',
                        borderRadius: 'var(--radius-sm)',
                        color: '#93c5fd',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        overflowX: 'auto',
                      }}
                    >
                      {JSON.stringify(trace.inputSummary, null, 2)}
                    </pre>
                  </div>

                  {trace.outputSummary && (
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Output Payload
                      </span>
                      <pre
                        style={{
                          margin: '0.3rem 0 0 0',
                          padding: '0.65rem',
                          backgroundColor: '#0f172a',
                          borderRadius: 'var(--radius-sm)',
                          color: '#86efac',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          overflowX: 'auto',
                        }}
                      >
                        {JSON.stringify(trace.outputSummary, null, 2)}
                      </pre>
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
