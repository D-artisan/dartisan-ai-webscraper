"""
Tests for all API endpoints.
"""

import pytest
from httpx import AsyncClient
from unittest.mock import patch, AsyncMock
from app.main import app


@pytest.mark.asyncio
async def test_scrape_success():
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


@pytest.mark.asyncio
async def test_scrape_invalid_url():
    """Test scraping with invalid URL (based on our custom validation)."""
    with patch('app.api.endpoints.scrape.scraper_service') as mock_scraper:
        mock_scraper.validate_url.return_value = False
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/scrape",
                json={
                    "url": "https://invalid-domain-that-does-not-exist.com",
                    "prompt": "Extract data",
                    "output_format": "text"
                }
            )
        
        assert response.status_code == 400
        data = response.json()
        assert "Invalid URL" in data["message"]


@pytest.mark.asyncio
async def test_scrape_empty_content():
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
        assert "No readable content" in data["message"]


@pytest.mark.asyncio
async def test_scrape_llm_failure():
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
        assert "LLM error" in data["message"]


@pytest.mark.asyncio
async def test_status_success():
    """Test successful status check."""
    with patch('app.api.endpoints.status.llm_service') as mock_llm:
        mock_llm.check_availability = AsyncMock(return_value=True)
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/api/status")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["llm_available"] is True
        assert "llm_provider" in data
        assert "version" in data


@pytest.mark.asyncio
async def test_status_llm_unavailable():
    """Test status when LLM service is unavailable."""
    with patch('app.api.endpoints.status.llm_service') as mock_llm:
        mock_llm.check_availability = AsyncMock(return_value=False)
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/api/status")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["llm_available"] is False


@pytest.mark.asyncio
async def test_status_service_error():
    """Test status when service check fails."""
    with patch('app.api.endpoints.status.llm_service') as mock_llm:
        mock_llm.check_availability = AsyncMock(side_effect=Exception("Service error"))
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/api/status")
        
        assert response.status_code == 500
        data = response.json()
        assert "Service error" in data["message"]


@pytest.mark.asyncio
async def test_health_check():
    """Test basic health check."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "message" in data


@pytest.mark.asyncio
async def test_root_endpoint():
    """Test root endpoint returns API information."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/")
    
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert "docs" in data
    assert "status" in data


@pytest.mark.asyncio
async def test_download_nonexistent_file():
    """Test downloading a file that doesn't exist."""
    from unittest.mock import MagicMock
    import pathlib
    
    with patch('app.api.endpoints.scrape.output_service') as mock_output:
        # Create a proper mock Path object
        mock_path = MagicMock(spec=pathlib.Path)
        mock_path.exists.return_value = False
        mock_output.output_dir.__truediv__.return_value = mock_path
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/api/download/nonexistent.txt")
        
        assert response.status_code == 404
