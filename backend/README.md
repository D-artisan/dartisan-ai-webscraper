# AI Web Scraper Backend

## Overview

FastAPI-based backend service for the AI Web Scraper application. Provides RESTful APIs for web scraping, LLM processing, and file generation.

## Features

- **Web Scraping**: Fetch and clean content from web pages
- **LLM Integration**: Process content using OpenAI or OpenRouter APIs
- **Multiple Output Formats**: Generate Word, PDF, Excel, and text files
- **Async Processing**: High-performance async FastAPI backend
- **Error Handling**: Comprehensive error handling and logging
- **Testing**: Full test suite with pytest

## Quick Start

### Prerequisites

- Python 3.8+
- pip

### Installation

1. **Create virtual environment**
   ```powershell
   python -m venv venv
   venv\Scripts\Activate.ps1
   ```

2. **Install dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

3. **Environment Setup**

   ```powershell
   Copy-Item .env.example .env
   # Edit .env file with your API keys
   ```



4. **Run the server**

   ```powershell
   uvicorn app.main:app --reload
   ```


5. **Access the API**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/api/health

## API Endpoints

### POST /api/scrape
Scrape a webpage and process content with LLM.

**Request Body:**
```json
{
  "url": "https://example.com",
  "prompt": "Extract product names and prices",
  "output_format": "excel"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Scraping completed successfully",
  "data": { "extracted_data": "..." },
  "download_url": "/api/download/filename.xlsx",
  "filename": "filename.xlsx"
}
```

### GET /api/status
Check API and LLM service status.

### GET /api/download/{filename}
Download generated output files.

## Configuration

Environment variables in `.env`:

- `OPENAI_API_KEY`: OpenAI API key
- `OPENROUTER_API_KEY`: OpenRouter API key
- `LLM_PROVIDER`: LLM provider to use (openai/openrouter)
- `DEBUG`: Enable debug mode

## Testing

```powershell
pytest tests/ -v
```

## Architecture

```
app/
├── main.py              # FastAPI application
├── models.py            # Pydantic models
├── api/endpoints/       # API route handlers
├── services/            # Business logic services
└── utils/               # Utilities and configuration
```

## Services

- **ScraperService**: Web content fetching and cleaning
- **LLMService**: AI processing integration
- **OutputService**: Multi-format file generation
