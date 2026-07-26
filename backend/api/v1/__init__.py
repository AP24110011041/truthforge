"""API v1 routes."""

from fastapi import APIRouter

# Import route modules
from . import health
from . import research
from . import verify
from . import upload
from . import agents
from . import reports

# Create router
router = APIRouter(tags=["v1"])
# Include route modules
router.include_router(health.router)
router.include_router(research.router)
router.include_router(verify.router)
router.include_router(upload.router)
router.include_router(agents.router)
router.include_router(reports.router)

__all__ = ["router"]
