"""
Baseball Stats Dashboard API - Main Application Entry Point

This module initializes the FastAPI application, configures middleware,
and includes API routers.

Copyright (c) 2025 Ken Johansen. All rights reserved.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.routes import players

# Check if we're in a testing environment
TESTING = os.environ.get("TESTING", "").lower() == "true"

# Define lifespan context manager for database connections
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB only if not in testing mode
    if not TESTING:
        from app.db.mongodb import connect_to_mongo, close_mongo_connection
        await connect_to_mongo()
        
    yield
    
    # Close MongoDB connection only if not in testing mode
    if not TESTING:
        from app.db.mongodb import close_mongo_connection
        await close_mongo_connection()

# Initialize FastAPI app with lifespan
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.PROJECT_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(players.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    """
    Root endpoint to check if the API is running
    """
    return {
        "message": "Baseball Stats Dashboard API",
        "version": settings.PROJECT_VERSION,
        "documentation": "/docs",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
