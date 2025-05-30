"""
API endpoint for status checking.
"""

from fastapi import APIRouter, HTTPException
from app.models import StatusResponse
from app.services.llm_service import LLMService
from app.utils.config import settings
from app.utils.logger import logger

router = APIRouter()

# Service instances
llm_service = LLMService()


@router.get("/status", response_model=StatusResponse)
async def get_status() -> StatusResponse:
    """
    Get the current status of the API and connected services.
    
    Returns:
        Status information including LLM service availability
    """
    try:
        logger.info("Checking API status")
        
        # Check LLM service availability
        llm_available = await llm_service.check_availability()
        
        logger.info(f"Status check completed. LLM available: {llm_available}")
        
        return StatusResponse(
            status="healthy",
            llm_provider=settings.llm_provider,
            llm_available=llm_available,
            version="1.0.0"
        )
        
    except Exception as e:
        logger.error(f"Status check failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Status check failed: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """
    Simple health check endpoint.
    
    Returns:
        Basic health status
    """
    return {"status": "healthy", "message": "AI Web Scraper API is running"}
