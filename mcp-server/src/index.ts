/**
 * CareerPilot MCP Server
 * Exposes Career preparation tools via Model Context Protocol (MCP)
 * Supports Streamable HTTP (SSE) on port 8787 and stdio transport.
 */
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { tools, handleToolCall } from './tools/index.js';

const PORT = Number(process.env.MCP_PORT ?? 8787);

// Initialize MCP Server instance
const mcpServer = new Server(
  {
    name: 'careerpilot-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register list_tools handler
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

// Register call_tool handler
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return handleToolCall(name, args ?? {});
});

// Setup Express SSE server
const app = express();
app.use(cors());

// Map to store active SSE transports by session id
const transports: Record<string, SSEServerTransport> = {};

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'careerpilot-mcp',
    version: '0.1.0',
    toolsCount: tools.length,
    activeSessions: Object.keys(transports).length,
  });
});

// List tools via HTTP GET for easy testing and simulator inspection
app.get('/tools', (_req: Request, res: Response) => {
  res.json({ tools });
});

// SSE endpoint for MCP clients
app.get('/sse', async (req: Request, res: Response) => {
  console.log('[MCP] New SSE connection established');
  const transport = new SSEServerTransport('/message', res);
  transports[transport.sessionId] = transport;

  req.on('close', () => {
    console.log(`[MCP] SSE connection closed: ${transport.sessionId}`);
    delete transports[transport.sessionId];
  });

  await mcpServer.connect(transport);
});

// Message endpoint for SSE post-backs
app.post('/message', async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (!transport) {
    res.status(404).send('Session not found');
    return;
  }
  await transport.handlePostMessage(req, res);
});

// Start listening
app.listen(PORT, () => {
  console.log(`[CareerPilot MCP] Server running on http://localhost:${PORT}`);
  console.log(`[CareerPilot MCP] SSE endpoint: http://localhost:${PORT}/sse`);
  console.log(`[CareerPilot MCP] Registered tools: ${tools.map((t) => t.name).join(', ')}`);
});
