# TruthForge AI Backend - Quick Start Guide

## Installation

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

Required packages:
- fastapi>=0.104.0
- uvicorn>=0.24.0
- pydantic>=2.0.0
- python-dotenv>=1.0.0

### 2. Verify Installation
```bash
python -c "from backend.agents import Orchestrator; print('✓ Backend ready')"
```

---

## Running the Application

### Start the API Server
```bash
# From project root
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Access the API
- **API Docs (Swagger UI):** http://localhost:8000/docs
- **API Docs (ReDoc):** http://localhost:8000/redoc
- **API Health Check:** http://localhost:8000/api/v1/health

---

## API Endpoints Quick Reference

### 1. Health Check
```bash
curl http://localhost:8000/api/v1/health
```

### 2. Conduct Research
```bash
curl -X POST http://localhost:8000/api/v1/research \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is climate change?",
    "include_citations": true,
    "language": "en"
  }'
```

### 3. Verify a Claim
```bash
curl -X POST http://localhost:8000/api/v1/verify \
  -H "Content-Type: application/json" \
  -d '{
    "claim": "The Earth is warming",
    "sources": ["source_1", "source_2"],
    "confidence_threshold": 0.7
  }'
```

### 4. Upload a Document
```bash
curl -X POST http://localhost:8000/api/v1/upload \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Document content here...",
    "document_type": "research",
    "title": "My Research"
  }'
```

### 5. Get Agent Status
```bash
curl http://localhost:8000/api/v1/agents/health
```

### 6. List Reports
```bash
curl http://localhost:8000/api/v1/reports
```

---

## Architecture Overview

### Agent Pipeline
```
User Query
    ↓
Planner Agent (Create Plan)
    ↓
Research Agent (Gather Info)
    ↓
Fact Checker (Verify Claims)
    ↓
Hallucination Detector (Quality Check)
    ↓
Citation Generator (Format Citations)
    ↓
Report Generator (Final Report)
    ↓
JSON Response
```

### Service Architecture
```
API Routes (v1)
    ↓
Services (AgentService, DocumentService, etc.)
    ↓
Agents (Multi-agent System)
    ↓
RAG Layer (Mock implementations)
```

---

## Testing the Backend

### 1. Compile All Files
```bash
python -m compileall backend
```

### 2. Test Imports
```bash
python -c "
from backend.agents import Orchestrator
from backend.services import AgentService
from backend.schemas import ResearchRequest
print('✓ All imports working')
"
```

### 3. Test Agent Instantiation
```bash
python -c "
from backend.agents import (
    PlannerAgent, ResearchAgent, Orchestrator
)
planner = PlannerAgent()
orchestrator = Orchestrator()
print(f'✓ {len(orchestrator.agents)} agents registered')
"
```

### 4. Run API Tests with Python
```python
import asyncio
from backend.agents import Orchestrator

async def test_research():
    orchestrator = Orchestrator()
    result = await orchestrator.run({"question": "Test question?"})
    print(result)

asyncio.run(test_research())
```

---

## Development Guidelines

### Adding New Agents
1. Create new file in `backend/agents/`
2. Inherit from `BaseAgent`
3. Implement `run()` method
4. Export in `backend/agents/__init__.py`
5. Add to `Orchestrator` agents list

### Adding New Services
1. Create new file in `backend/services/`
2. Implement service class
3. Export in `backend/services/__init__.py`
4. Use in route handlers

### Adding New API Endpoints
1. Create route file in `backend/api/v1/`
2. Define FastAPI router and endpoints
3. Include in `backend/api/v1/__init__.py`
4. Routes automatically included via v1 router

### Adding New Schemas
1. Create schema in appropriate file in `backend/schemas/`
2. Export in `backend/schemas/__init__.py`
3. Use in request/response models

---

## Project Structure Notes

- **Agents:** Pure logic, no FastAPI dependencies
- **Services:** Orchestrate agents and manage data
- **Schemas:** Only for API contracts (Pydantic)
- **API Routes:** FastAPI endpoints that use services
- **Core:** Configuration and cross-cutting concerns
- **RAG:** Placeholder for future vector DB integration

---

## Environment Variables

Create `.env` file in backend directory:

```env
APP_NAME=TruthForge AI
APP_VERSION=1.0.0
API_V1_PREFIX=/api/v1
LOG_LEVEL=INFO
ENABLE_DOCS=true
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

---

## Performance Notes

- All operations are async
- Services use in-memory storage (mock)
- No external API calls (mock implementations)
- Agent pipeline processes sequentially
- Each agent: ~100ms execution (mock)
- Total pipeline: ~600ms-1s

---

## Future Enhancements

- [ ] Replace mock embeddings with real models
- [ ] Integrate ChromaDB or similar vector DB
- [ ] Add OpenAI/Claude/Gemini API integration
- [ ] Implement database persistence (PostgreSQL)
- [ ] Add authentication (JWT/OAuth2)
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Add monitoring (Prometheus, etc.)
- [ ] Add caching layer (Redis)
- [ ] Add batch processing
- [ ] Add WebSocket support for streaming
- [ ] Add background task processing (Celery)

---

## Support

For issues or questions:
1. Check `IMPLEMENTATION_SUMMARY.md` for architecture details
2. Review inline code documentation
3. Check Pydantic schemas for data formats
4. Verify all agents are properly instantiated

All code follows SOLID principles and clean architecture patterns.
