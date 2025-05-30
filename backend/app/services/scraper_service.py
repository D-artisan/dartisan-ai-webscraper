"""
Web scraping service for fetching and cleaning web content.
"""

import re
from typing import Tuple
import httpx
from bs4 import BeautifulSoup
from app.utils.config import settings
from app.utils.logger import logger


class ScraperService:
    """Service for fetching and processing web content."""
    
    def __init__(self):
        self.timeout = settings.request_timeout
        self.max_content_length = settings.max_content_length
        
    async def fetch_content(self, url: str) -> Tuple[str, str]:
        """
        Fetch and clean content from a web URL.
        
        Args:
            url: Target URL to scrape
            
        Returns:
            Tuple of (raw_html, cleaned_text)
            
        Raises:
            Exception: If fetching fails
        """
        try:
            headers = {
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/91.0.4472.124 Safari/537.36"
                ),
                "Accept": (
                    "text/html,application/xhtml+xml,application/xml;"
                    "q=0.9,image/webp,*/*;q=0.8"
                ),
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Connection": "keep-alive",
            }
            
            async with httpx.AsyncClient(
                timeout=self.timeout,
                follow_redirects=True
            ) as client:
                logger.info(f"Fetching content from: {url}")
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                
                raw_html = response.text
                cleaned_text = self._clean_html_content(raw_html)
                
                # Truncate if too long
                if len(cleaned_text) > self.max_content_length:
                    cleaned_text = cleaned_text[:self.max_content_length] + "..."
                    logger.warning(f"Content truncated to {self.max_content_length} characters")
                
                logger.info(f"Successfully fetched {len(cleaned_text)} characters of content")
                return raw_html, cleaned_text
                
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error fetching {url}: {e.response.status_code}")
            raise Exception(f"Failed to fetch URL: HTTP {e.response.status_code}")
        except httpx.TimeoutException:
            logger.error(f"Timeout fetching {url}")
            raise Exception("Request timeout - the website took too long to respond")
        except Exception as e:
            logger.error(f"Error fetching {url}: {str(e)}")
            raise Exception(f"Failed to fetch content: {str(e)}")
    
    def _clean_html_content(self, html: str) -> str:
        """
        Clean HTML content and extract readable text.
        
        Args:
            html: Raw HTML content
            
        Returns:
            Cleaned text content
        """
        try:
            # Parse HTML
            soup = BeautifulSoup(html, 'lxml')
            
            # Remove script and style elements
            for element in soup(["script", "style", "meta", "link", "noscript"]):
                element.decompose()
            
            # Get text content
            text = soup.get_text()
            
            # Clean up whitespace
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            # Remove extra whitespace
            text = re.sub(r'\s+', ' ', text)
            
            return text.strip()
            
        except Exception as e:
            logger.error(f"Error cleaning HTML content: {str(e)}")
            # Fallback: return raw text with basic cleaning
            text = re.sub(r'<[^>]+>', '', html)
            text = re.sub(r'\s+', ' ', text)
            return text.strip()
    
    def validate_url(self, url: str) -> bool:
        """
        Validate if URL is properly formatted and accessible.
        
        Args:
            url: URL to validate
            
        Returns:
            True if URL is valid, False otherwise
        """
        try:
            # Basic URL validation
            if not url.startswith(('http://', 'https://')):
                return False
            
            # Check for common invalid patterns
            invalid_patterns = [
                r'localhost:\d+',  # Localhost URLs
                r'127\.0\.0\.1',   # Local IP
                r'file://',        # File URLs
            ]
            
            for pattern in invalid_patterns:
                if re.search(pattern, url):
                    return False
            
            return True
            
        except Exception:
            return False
