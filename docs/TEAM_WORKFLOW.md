# CareerPilot AI — Team Workflow & Collaboration Guide 🤝

Amazon Developer Hackathon 2026 — Alexa+ Track

---

## 👥 Roles & Workspace Ownership

To eliminate Git merge conflicts and enable parallel independent development, the repository is split into 3 distinct workspaces. Each team member owns exactly one workspace:

| Role | Workspace Folder | Primary Responsibilities | Can Run Standalone? |
|---|---|---|---|
| **Member 1 (Frontend)** | `apps/simulator/` | Alexa+ Chat UI, Skill Gap Visualizer, Plan Timeline, Quiz Component, Progress Dashboard | Yes (`npm run dev:web` on `:5173`) |ś
| **Member 2 (Backend)** | `server/` | Express API, Agent Orchestrator, SQLite persistence, LLM Prompt chains, analysis endpoints | Yes (`npm run dev:server` on `:3001`) |
| **Member 3 (MCP & Tools)** | `mcp-server/` | Official MCP TypeScript SDK server, SSE transport on `:8787`, tools (`analyze_job`, `generate_quiz`, etc.) | Yes (`npm run dev:mcp` on `:8787`) |

---

## 🚫 Zero-Conflict Rules

1. **Never touch another member's folder directly.**
   - Member 1 stays in `apps/simulator/`.
   - Member 2 stays in `server/`.
   - Member 3 stays in `mcp-server/`.
2. **Contracts First.**
   - The API contract between Frontend and Backend is defined in `apps/simulator/src/lib/api.ts` and `server/src/agent/schemas.ts`.
   - The MCP tool contract is defined in `mcp-server/src/tools/index.ts`.
   - If you need a change in a contract, propose it to the owner rather than editing their file.
3. **Keep root files clean.**
   - `package.json`, `.gitignore`, `README.md` at root are shared and should only be edited with team consensus.

---

## 🌿 Git Branching Strategy

1. **`main` Branch**: Production-ready code only. Never commit broken code directly to `main`.
2. **Feature Branches**:
   - `member1/ui-components`
   - `member2/orchestrator-db`
   - `member3/mcp-tools`
3. **Workflow**:
   ```bash
   # Switch to your feature branch
   git checkout -b member1/ui-components

   # Work inside your folder
   git add apps/simulator/
   git commit -m "feat(ui): add interactive skill gap comparison chart"

   # Keep updated with main
   git checkout main
   git pull origin main
   git checkout member1/ui-components
   git merge main

   # Push and open Pull Request
   git push origin member1/ui-components
   ```

---

## 🚀 Running the Project

### Option A: Run Everything Concurrently (Root)
```bash
npm install
npm run dev
```
Starts Simulator (`:5173`), Backend (`:3001`), and MCP Server (`:8787`) together with synchronized colored logs.

### Option B: Run Only Your Workspace
- Member 1: `npm run dev:web` (or `cd apps/simulator && npm run dev`)
- Member 2: `npm run dev:server` (or `cd server && npm run dev`)
- Member 3: `npm run dev:mcp` (or `cd mcp-server && npm run dev`)
