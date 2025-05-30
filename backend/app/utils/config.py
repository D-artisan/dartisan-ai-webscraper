"""
Configuration settings for the AI Web Scraper application.
"""

import os
from typing import List
from pydantic import Field, ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = ConfigDict(env_file=".env", case_sensitive=False)
    
    # API Configuration
    api_host: str = Field(default="localhost")
    api_port: int = Field(default=8000)
    debug: bool = Field(default=True)
    
    # LLM API Keys
    openai_api_key: str = Field(default="")
    openrouter_api_key: str = Field(default="")
    
    # LLM Provider Configuration
    llm_provider: str = Field(default="openai")
    openrouter_model: str = Field(default="openai/gpt-3.5-turbo")
      # CORS Configuration
    allowed_origins: List[str] = Field(
        default=["http://localhost:5173", "http://127.0.0.1:5173"]
    )
    
    # Request Configuration
    max_content_length: int = Field(default=100000)
    request_timeout: int = Field(default=30)


# Global settings instance
settings = Settings()
