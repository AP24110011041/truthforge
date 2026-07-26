# TruthForge AI Architecture

## Scope

This repository currently contains the application shell and platform scaffolding only. The AI workflow layer is represented by package boundaries but contains no business logic.

## Frontend Boundaries

- `components/`: reusable app and UI components
- `pages/`: routed page-level views
- `hooks/`: React hooks for platform concerns
- `services/`: API clients and integration adapters
- `layouts/`: shared route layouts
- `types/`: shared TypeScript contracts
- `utils/`: environment, class merging, and small helpers

## Backend Boundaries

- `api/`: FastAPI routers and route modules
- `agents/`: future LangGraph agent implementations
- `services/`: future application service orchestration
- `core/`: settings, logging, and infrastructure configuration
- `models/`: domain and persistence models
- `schemas/`: Pydantic API contracts
- `utils/`: shared backend helpers
- `rag/`: future retrieval, embedding, and ChromaDB integration

## Initial Runtime Shape

```text
React/Vite frontend
  -> services/apiClient.ts
  -> FastAPI /api/v1
  -> api/router.py
  -> api/routes/health.py
```

## Future AI Layer

Planned modules should be added behind service and agent interfaces before exposing new API routes:

- Research planner agent
- Evidence collector agent
- Claim verifier agent
- Contradiction detector agent
- Hallucination detector agent
- Confidence scoring service
- Citation service
- Report generation service
