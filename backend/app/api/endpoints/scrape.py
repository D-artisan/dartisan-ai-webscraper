"""
API endpoint for web scraping functionality.
"""

import os
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse

from app.models import ScrapeRequest, ScrapeResponse, ErrorResponse
from app.services.scraper_service import ScraperService
from app.services.llm_service import LLMService
from app.services.output_service import OutputService
from app.utils.logger import logger

router = APIRouter()

# Service instances
scraper_service = ScraperService()
llm_service = LLMService()
output_service = OutputService()


@router.post("/scrape", response_model=ScrapeResponse)
async def scrape_webpage(
    request: ScrapeRequest,
    background_tasks: BackgroundTasks
) -> ScrapeResponse:
    """
    Scrape a webpage and process the content using LLM.
    
    Args:
        request: Scraping request containing URL, prompt, and output format
        background_tasks: FastAPI background tasks for cleanup
        
    Returns:
        Scraping response with processed data and download link
    """
    try:
        # Validate URL
        if not scraper_service.validate_url(str(request.url)):
            logger.warning(f"Invalid URL provided: {request.url}")
            raise HTTPException(
                status_code=400,
                detail="Invalid URL. Please provide a valid HTTP/HTTPS URL."
            )
        
        # Fetch web content
        logger.info(f"Starting scrape for URL: {request.url}")
        raw_html, cleaned_content = await scraper_service.fetch_content(str(request.url))
        
        if not cleaned_content.strip():
            raise HTTPException(
                status_code=400,
                detail="No readable content found on the webpage."
            )
        
        # Process content with LLM
        logger.info("Processing content with LLM")
        processed_data = await llm_service.process_content(cleaned_content, request.prompt)
        
        # Generate output file
        logger.info(f"Generating {request.output_format} output")
        filename, filepath = await output_service.generate_output(
            processed_data,
            request.output_format,
            request.prompt
        )
        
        # Schedule cleanup of old files
        background_tasks.add_task(output_service.cleanup_old_files)
        
        logger.info(f"Scraping completed successfully. Generated file: {filename}")
        
        return ScrapeResponse(
            success=True,
            message="Scraping completed successfully",
            data=processed_data,
            download_url=f"/download/{filename}",
            filename=filename
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Scraping failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Scraping failed: {str(e)}"
        )


@router.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download a generated output file.
    
    Args:
        filename: Name of the file to download
        
    Returns:
        File response for download
    """
    try:
        filepath = output_service.output_dir / filename
        
        if not filepath.exists():
            logger.warning(f"Requested file not found: {filename}")
            raise HTTPException(status_code=404, detail="File not found")
        
        # Determine media type based on file extension
        media_type_map = {
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.pdf': 'application/pdf',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.txt': 'text/plain'
        }
        
        file_extension = filepath.suffix.lower()
        media_type = media_type_map.get(file_extension, 'application/octet-stream')
        
        logger.info(f"Serving file for download: {filename}")
        return FileResponse(
            path=str(filepath),
            filename=filename,
            media_type=media_type
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Download failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Download failed: {str(e)}"
        )
