"""
LLM service for processing web content with AI models.
"""

import json
from typing import Dict, Any, Optional
import httpx
from app.utils.config import settings
from app.utils.logger import logger


class LLMService:
    """Service for interacting with Large Language Models."""
    
    def __init__(self):
        self.timeout = settings.request_timeout
        self.provider = settings.llm_provider
        
    async def process_content(self, content: str, prompt: str) -> Dict[str, Any]:
        """
        Process web content using LLM based on user prompt.
        
        Args:
            content: Raw web content to process
            prompt: User instructions for data extraction
            
        Returns:
            Processed data as dictionary
            
        Raises:
            Exception: If LLM processing fails
        """
        try:
            if self.provider == "openai":
                return await self._process_with_openai(content, prompt)
            elif self.provider == "openrouter":
                return await self._process_with_openrouter(content, prompt)
            else:
                raise ValueError(f"Unsupported LLM provider: {self.provider}")
                
        except Exception as e:
            logger.error(f"LLM processing failed: {str(e)}")
            raise
    
    async def _process_with_openai(self, content: str, prompt: str) -> Dict[str, Any]:
        """Process content using OpenAI API."""
        if not settings.openai_api_key:
            raise ValueError("OpenAI API key not configured")
        
        system_prompt = """You are an expert web scraper. Extract data from the provided web content according to the user's instructions. Return the result as a JSON object with clear structure. If you cannot extract the requested data, return an empty result with an explanation."""
        
        user_message = f"""
        User Instructions: {prompt}
        
        Web Content:
        {content[:settings.max_content_length]}
        
        Please extract the requested data and return it as a structured JSON object.
        """
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.1,
            "max_tokens": 2000
        }
        
        headers = {
            "Authorization": f"Bearer {settings.openai_api_key}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                json=payload,
                headers=headers
            )
            response.raise_for_status()
            
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            # Try to parse as JSON, fallback to text structure
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                return {"extracted_text": content}
    
    async def _process_with_openrouter(self, content: str, prompt: str) -> Dict[str, Any]:
        """Process content using OpenRouter API."""
        if not settings.openrouter_api_key:
            raise ValueError("OpenRouter API key not configured")
        
        system_prompt = """You are an expert web scraper. Extract data from the provided web content according to the user's instructions. Return the result as a JSON object with clear structure. If you cannot extract the requested data, return an empty result with an explanation."""
        
        user_message = f"""
        User Instructions: {prompt}
        
        Web Content:
        {content[:settings.max_content_length]}
        
        Please extract the requested data and return it as a structured JSON object.
        """
        
        payload = {
            "model": settings.openrouter_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.1,
            "max_tokens": 2000
        }
        
        headers = {
            "Authorization": f"Bearer {settings.openrouter_api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8000",
            "X-Title": "AI Web Scraper"
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=payload,
                headers=headers
            )
            response.raise_for_status()
            
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            # Try to parse as JSON, fallback to text structure
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                return {"extracted_text": content}
    
    async def check_availability(self) -> bool:
        """
        Check if the LLM service is available.
        
        Returns:
            True if service is available, False otherwise
        """
        try:
            # Simple test with minimal content
            test_result = await self.process_content(
                "Test content",
                "Return 'test successful' if you can process this."
            )
            return isinstance(test_result, dict)
        except Exception as e:
            logger.warning(f"LLM service unavailable: {str(e)}")
            return False
