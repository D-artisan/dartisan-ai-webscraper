"""
Tests for status endpoints.
"""

import pytest
from httpx import AsyncClient
from unittest.mock import patch, AsyncMock
from app.main import app


@pytest.mark.asyncio
class TestStatusEndpoint:
    """Test cases for the status endpoint."""
    
    async def test_status_success(self):
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
    
    async def test_status_llm_unavailable(self):
        """Test status when LLM service is unavailable."""
        with patch('app.api.endpoints.status.llm_service') as mock_llm:
            mock_llm.check_availability = AsyncMock(return_value=False)
            
            async with AsyncClient(app=app, base_url="http://test") as client:
                response = await client.get("/api/status")
            
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
            assert data["llm_available"] is False
    
    async def test_status_service_error(self):
        """Test status when service check fails."""
        with patch('app.api.endpoints.status.llm_service') as mock_llm:
            mock_llm.check_availability = AsyncMock(side_effect=Exception("Service error"))
            
            async with AsyncClient(app=app, base_url="http://test") as client:
                response = await client.get("/api/status")
            
            assert response.status_code == 500
            data = response.json()
            assert "Service error" in data["detail"]


@pytest.mark.asyncio
class TestHealthEndpoint:
    """Test cases for the health endpoint."""
    
    async def test_health_check(self):
        """Test basic health check."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/api/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "message" in data


@pytest.mark.asyncio
class TestRootEndpoint:
    """Test cases for the root endpoint."""
    
    async def test_root_endpoint(self):
        """Test root endpoint returns API information."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert "docs" in data
        assert "status" in data
