/**
 * ToolTrace — MCP tool call trace viewer
 * Shows: tool name, input summary, status, output summary.
 * Real server calls only — no decorative hard-coded status.
 */
export default function ToolTrace() {
  return (
    <div style={{ padding: 'var(--space-md) var(--space-xl)', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
      <strong>🔧 Tool Trace</strong> — MCP tool calls will appear here during operation
    </div>
  );
}
