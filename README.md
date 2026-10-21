# CareerPilot AI 🚀

> AI-powered career preparation assistant — skill gap analysis, personalized study plans, adaptive quizzes, and intelligent coaching.

**Built for the [Amazon Developer Hackathon 2026](https://amazonappdev2026.devpost.com/) — Alexa+ Track**

---

## 🎯 What is CareerPilot?

CareerPilot AI analyzes job descriptions against your resume, identifies skill gaps, generates personalized multi-day study plans, and adaptively quizzes you — all orchestrated through an MCP-powered agent with a beautiful Alexa+-style simulator UI.

### Core Workflow

1. **Input** — Paste a job description + resume (or use sample data)
2. **Analyze** — AI extracts required skills & matches against your experience
3. **Plan** — Generates a day-by-day study plan within your time budget
4. **Quiz** — Adaptive questions that adjust your plan based on performance
5. **Track** — Persistent progress across sessions

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Simulator Frontend (apps/simulator/)                       │
│  React + Vite + TypeScript                                  │
│  Chat UI • Skill Gap Panel • Plan Timeline • Quiz • Trace   │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP / REST
┌─────────────────────▼───────────────────────────────────────┐
│  Backend Server (server/)                                    │
│  Node.js + TypeScript + Express                              │
│  Agent Orchestrator • Services • Persistence (SQLite)        │
└─────────────────────┬───────────────────────────────────────┘
                      │ Internal calls
┌─────────────────────▼───────────────────────────────────────┐
│  MCP Server (mcp-server/)                                    │
│  Official MCP TypeScript SDK • Streamable HTTP               │
│  Tools: analyze_job, analyze_resume, compare_skills,         │
│         generate_plan, generate_quiz, grade_quiz,            │
│         get_progress, update_progress                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 9
- Git

### Installation

```bash
git clone https://github.com/<your-org>/careerpilot-ai.git
cd careerpilot-ai
npm install
```

### Setup Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### Run Everything

```bash
npm run dev          # starts simulator + server + MCP server
```

### Run Individual Components

```bash
npm run dev:web      # simulator only (port 5173)
npm run dev:server   # backend API server only (port 3001)
npm run dev:mcp      # MCP server only (port 8787)
```

### Test

```bash
npm test             # all tests
npm run typecheck    # TypeScript checks
```

---

## 📁 Repository Structure

Each team member owns a separate top-level folder to minimize merge conflicts:

| Folder | Owner | Responsibility |
|--------|-------|---------------|
| `apps/simulator/` | **Member 1** | Frontend UI — chat, panels, visualizations |
| `server/` | **Member 2** | Backend API, agent orchestrator, services, DB |
| `mcp-server/` | **Member 3** | MCP tools over Streamable HTTP |

Shared files at root (`README.md`, `package.json`, `docs/`, `samples/`) are coordinated together.

---

## 🧪 Sample Mode

Click **"Load Sample Data"** to use the built-in sample resume and job description — no personal data needed for judging.

---

## 📋 MCP Tools

| Tool | Description |
|------|-------------|
| `analyze_job` | Extract structured skills from a job description |
| `analyze_resume` | Extract skills and evidence from a resume |
| `compare_skills` | Skill-gap analysis: matched, partial, missing |
| `generate_plan` | Create a personalized multi-day study plan |
| `generate_quiz` | Generate adaptive quiz questions for a topic |
| `grade_quiz` | Grade answers and return feedback |
| `get_progress` | Retrieve saved progress and scores |
| `update_progress` | Save quiz results and plan updates |

---

## 🎬 Demo Video

> [YouTube link — to be added before submission]

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

## 🙏 Acknowledgments

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [ChartKeep MCP](https://github.com/sherotree/chartkeep-mcp) — reference architecture
- [Alexa+ Smart Home Agent](https://github.com/guptachetan1995/alexa-plus) — reference implementation
- Amazon Developer Hackathon 2026
