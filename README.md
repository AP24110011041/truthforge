# TruthForge AI

**Forge Truth. Verify Every Claim.**

TruthForge AI is a SaaS foundation for an autonomous multi-agent research and fact-verification platform. This setup phase creates the production-ready project structure, frontend shell, backend API foundation, configuration files, and documentation. AI orchestration and business logic are intentionally not implemented yet.

## Monorepo Structure

```text
truthforge-ai/
  frontend/
    src/
      components/
      pages/
      hooks/
      services/
      layouts/
      types/
      utils/
  backend/
    api/
    agents/
    services/
    core/
    models/
    schemas/
    utils/
    rag/
  docs/
```

## Frontend

- React, Vite, TypeScript
- Tailwind CSS v4 via the Vite plugin
- shadcn/ui configuration in `frontend/components.json`
- Framer Motion page transitions
- React Router routes for overview, research, reports, settings, and 404
- Environment configuration through `frontend/.env.example`

Run locally:

```powershell
cd truthforge-ai/frontend
npm install
npm run dev
```

## Backend

- FastAPI app factory in `backend/main.py`
- Versioned API router at `/api/v1`
- Health endpoint at `/api/v1/health`
- Environment configuration through `backend/.env.example`
- Reserved packages for agents, services, models, schemas, RAG, and utilities
- Optional AI dependencies declared in `backend/pyproject.toml`

Run locally:

```powershell
cd truthforge-ai/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev,ai]"
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Environment

Frontend:

```text
VITE_APP_NAME="TruthForge AI"
VITE_API_BASE_URL="http://127.0.0.1:8001/api/v1"
```

Backend:

```text
TRUTHFORGE_APP_NAME="TruthForge AI"
TRUTHFORGE_ENVIRONMENT="development"
TRUTHFORGE_API_V1_PREFIX="/api/v1"
TRUTHFORGE_CORS_ORIGINS="http://127.0.0.1:5173,http://localhost:5173"
```

## Current Scope

Completed:

- Project structure
- Vite configuration
- Tailwind configuration
- shadcn/ui configuration
- FastAPI configuration
- Frontend routing
- Environment variable templates
- Placeholder SaaS pages and layouts
- README and architecture documentation

Not implemented yet:

- LangGraph agents
- LangChain workflows
- ChromaDB vector storage
- Sentence Transformer embeddings
- Research planning, evidence collection, claim verification, contradiction detection, hallucination detection, confidence scoring, citations, or report generation
