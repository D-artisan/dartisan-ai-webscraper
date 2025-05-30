"""
Tests for scraping endpoints.
"""

import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch
from app.main import app


@pytest.mark.asyncio
class TestScrapeEndpoint:
    """Test cases for the scrape endpoint."""
    
    async def test_scrape_success(self):
        """Test successful scraping request."""
        mock_scraped_data = {"title": "Test Page", "content": "Test content"}
        mock_filename = "test_output.txt"
        mock_filepath = "/path/to/test_output.txt"
        
        with patch('app.api.endpoints.scrape.scraper_service') as mock_scraper, \
             patch('app.api.endpoints.scrape.llm_service') as mock_llm, \
             patch('app.api.endpoints.scrape.output_service') as mock_output:
            
            # Mock service responses with AsyncMock for async methods
            mock_scraper.validate_url.return_value = True
            mock_scraper.fetch_content = AsyncMock(return_value=("raw_html", "cleaned_content"))
            mock_llm.process_content = AsyncMock(return_value=mock_scraped_data)
            mock_output.generate_output = AsyncMock(return_value=(mock_filename, mock_filepath))
            mock_output.cleanup_old_files = AsyncMock()
            
            async with AsyncClient(app=app, base_url="http://test") as client:
                response = await client.post(
                    "/api/scrape",
                    json={
                        "url": "https://example.com",
                        "prompt": "Extract the title",
                        "output_format": "text"
                    }
                )
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["message"] == "Scraping completed successfully"
            assert data["data"] == mock_scraped_data
            assert data["filename"] == mock_filename
    
    async def test_scrape_invalid_url(self):
        """Test scraping with invalid URL."""
        with patch('app.api.endpoints.scrape.scraper_service') as mock_scraper:
            mock_scraper.validate_url.return_value = False
            
            async with AsyncClient(app=app, base_url="http://test") as client:
                response = await client.post(
                    "/api/scrape",
                    json={
                        "url": "invalid-url",
                        "prompt": "Extract data",
                        "output_format": "text"
                    }
                )
            
            assert response.status_code == 400
            data = response.json()
            assert "Invalid URL" in data["detail"]
    
    async def test_scrape_empty_content(self):
        """Test scraping when no content is found."""
        with patch('app.api.endpoints.scrape.scraper_service') as mock_scraper:
            mock_scraper.validate_url.return_value = True
            mock_scraper.fetch_content = AsyncMock(return_value=("raw_html", ""))
            
            async with AsyncClient(app=app, base_url="http://test") as client:
                response = await client.post(
                    "/api/scrape",
                    json={
                        "url": "https://example.com",
                        "prompt": "Extract data",
                        "output_format": "text"
                    }
                )
            
            assert response.status_code == 400
            data = response.json()
            assert "No readable content" in data["detail"]
    
    async def test_scrape_llm_failure(self):
        """Test scraping when LLM processing fails."""
        with patch('app.api.endpoints.scrape.scraper_service') as mock_scraper, \
             patch('app.api.endpoints.scrape.llm_service') as mock_llm:
            
            mock_scraper.validate_url.return_value = True
            mock_scraper.fetch_content = AsyncMock(return_value=("raw_html", "content"))
            mock_llm.process_content = AsyncMock(side_effect=Exception("LLM error"))
            
            async with AsyncClient(app=app, base_url="http://test") as client:
                response = await client.post(
                    "/api/scrape",
                    json={
                        "url": "https://example.com",
                        "prompt": "Extract data",
                        "output_format": "text"
                    }
                )
            
            assert response.status_code == 500
            data = response.json()
            assert "LLM error" in data["detail"]


@pytest.mark.asyncio
class TestDownloadEndpoint:
    """Test cases for the download endpoint."""
    
    async def test_download_existing_file(self):
        """Test downloading an existing file."""
        with patch('app.api.endpoints.scrape.output_service') as mock_output:
            # Mock file exists
            mock_filepath = AsyncMock()
            mock_filepath.exists.return_value = True
            mock_filepath.suffix = ".txt"
            mock_output.output_dir.__truediv__.return_value = mock_filepath
            
            with patch('app.api.endpoints.scrape.FileResponse') as mock_file_response:
                async with AsyncClient(app=app, base_url="http://test") as client:
                    response = await client.get("/api/download/test.txt")
                
                # FileResponse will be called, so we expect it to be mocked
                mock_file_response.assert_called_once()
    
    async def test_download_nonexistent_file(self):
        """Test downloading a file that doesn't exist."""
        with patch('app.api.endpoints.scrape.output_service') as mock_output:
            # Mock file doesn't exist
            mock_filepath = AsyncMock()
            mock_filepath.exists.return_value = False
            mock_output.output_dir.__truediv__.return_value = mock_filepath
            
            async with AsyncClient(app=app, base_url="http://test") as client:
                response = await client.get("/api/download/nonexistent.txt")
            
            assert response.status_code == 404
