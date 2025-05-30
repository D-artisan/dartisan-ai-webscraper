"""
Main FastAPI application entry point.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os

from app.api.endpoints import scrape, status
from app.utils.config import settings
from app.utils.logger import logger
from app.models import ErrorResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info("Starting AI Web Scraper API")
    logger.info(f"LLM Provider: {settings.llm_provider}")
    logger.info(f"Debug mode: {settings.debug}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Web Scraper API")

# Create FastAPI application
app = FastAPI(
    title="AI Web Scraper API",
    description="An AI-powered web scraper that extracts data using LLM processing",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(scrape.router, prefix="/api", tags=["scraping"])
app.include_router(status.router, prefix="/api", tags=["status"])

# Create outputs directory if it doesn't exist
os.makedirs("outputs", exist_ok=True)

# Serve static files (outputs) for download
if os.path.exists("outputs"):
    app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "AI Web Scraper API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "/api/status"
    }


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    """Custom HTTP exception handler."""
    logger.error(f"HTTP {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error="HTTP_ERROR",
            message=exc.detail
        ).model_dump()
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc: Exception):
    """General exception handler for unhandled exceptions."""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,        content=ErrorResponse(
            error="INTERNAL_ERROR",
            message="An internal server error occurred"
        ).model_dump()
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
        log_level="info"
    )
