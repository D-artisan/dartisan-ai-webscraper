"""
Pydantic models for request/response validation.
"""

from typing import Literal, Optional
from pydantic import BaseModel, HttpUrl, Field


class ScrapeRequest(BaseModel):
    """Request model for scraping endpoint."""
    
    url: HttpUrl = Field(..., description="Target URL to scrape")
    prompt: str = Field(
        ..., 
        min_length=1, 
        max_length=1000,
        description="Instructions for the LLM on what to extract"
    )
    output_format: Literal["word", "pdf", "excel", "text"] = Field(
        default="text",
        description="Desired output format"
    )


class ScrapeResponse(BaseModel):
    """Response model for scraping endpoint."""
    
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Status message")
    data: Optional[dict] = Field(None, description="Extracted data")
    download_url: Optional[str] = Field(None, description="URL to download the output file")
    filename: Optional[str] = Field(None, description="Generated filename")


class StatusResponse(BaseModel):
    """Response model for status endpoint."""
    
    status: str = Field(..., description="API status")
    llm_provider: str = Field(..., description="Current LLM provider")
    llm_available: bool = Field(..., description="Whether LLM service is available")
    version: str = Field(default="1.0.0", description="API version")


class ErrorResponse(BaseModel):
    """Error response model."""
    
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[dict] = Field(None, description="Additional error details")
