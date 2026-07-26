"""Main API router that includes all route modules."""

from fastapi import APIRouter
from .v1 import router as v1_router

api_router = APIRouter()

# Include v1 API routes
api_router.include_router(v1_router)

