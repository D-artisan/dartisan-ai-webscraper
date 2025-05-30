# Developer Guide

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [Setup Development Environment](#setup-development-environment)
3. [Backend Development](#backend-development)
4. [Frontend Development](#frontend-development)
5. [API Documentation](#api-documentation)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Contributing](#contributing)

## Project Architecture

### Overview
The AI Web Scraper is built using a modern full-stack architecture:

- **Backend**: FastAPI (Python) with async/await support
- **Frontend**: React with TypeScript and Vite
- **LLM Integration**: OpenAI/OpenRouter APIs
- **Output Formats**: Word, PDF, Excel, Text
- **Testing**: pytest (backend), Vitest (frontend)

### Directory Structure
```
ai-webscraper/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── models.py       # Pydantic models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── tests/              # Backend tests
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── pages/          # Page components
│   └── tests/              # Frontend tests
└── docs/                   # Documentation
```

## Setup Development Environment

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env.local for environment variables
```

### Environment Variables

#### Backend (.env)
```
OPENAI_API_KEY=your_openai_key
OPENROUTER_API_KEY=your_openrouter_key
LLM_PROVIDER=openai  # or openrouter
LOG_LEVEL=INFO
```

#### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000
```

## Backend Development

### Service Layer Architecture

#### LLM Service (`services/llm_service.py`)
- Handles communication with OpenAI/OpenRouter APIs
- Provides content processing with user prompts
- Implements retry logic and error handling

#### Scraper Service (`services/scraper_service.py`)
- Web page content extraction
- Content cleaning and preprocessing
- URL validation

#### Output Service (`services/output_service.py`)
- Multi-format output generation
- File management and cleanup
- Professional document styling

### API Endpoints

#### POST /api/scrape
```python
{
    "url": "https://example.com",
    "prompt": "Extract product information",
    "output_format": "excel"  # text, word, pdf, excel
}
```

#### GET /api/status
Returns system health and LLM service availability.

#### GET /api/download/{task_id}
Downloads generated output files.

### Adding New Features

1. **New Output Format**:
   - Add format to `OutputFormat` enum in `models.py`
   - Implement generation logic in `output_service.py`
   - Add tests

2. **New LLM Provider**:
   - Extend `LLMService` class
   - Add configuration options
   - Update provider selection logic

### Error Handling
- Use custom exceptions for specific error types
- Log errors with appropriate levels
- Return user-friendly error messages
- Implement retry logic for external APIs

## Frontend Development

### Component Architecture

#### ScrapeForm Component
- Handles user input (URL, prompt, format)
- Form validation
- API request submission

#### ResultPreview Component
- Displays scraping results
- File download functionality
- Status monitoring

### State Management
- Local component state using React hooks
- API calls using axios
- Type-safe interfaces for all data

### Styling
- Tailwind CSS for utility-first styling
- Responsive design principles
- Component-based CSS classes

### Adding New Components

1. Create component in `src/components/`
2. Add TypeScript interfaces in `src/types/`
3. Write tests in `tests/`
4. Update imports in parent components

## API Documentation

### Authentication
Currently, the API doesn't require authentication, but API keys are configured server-side.

### Rate Limiting
Implement rate limiting for production use:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
```

### Error Responses
All endpoints return consistent error format:
```json
{
    "success": false,
    "message": "Error description",
    "data": null
}
```

## Testing

### Backend Testing
```bash
cd backend
pytest tests/ -v
pytest tests/ --cov=app  # With coverage
```

#### Test Structure
- `test_scrape.py`: Scraping endpoint tests
- `test_status.py`: Status endpoint tests
- Mock external dependencies (LLM APIs, web requests)

### Frontend Testing
```bash
cd frontend
npm test
npm run test:coverage
```

#### Test Structure
- Component testing with React Testing Library
- API service mocking
- User interaction testing

### Writing Tests

#### Backend Example
```python
@pytest.mark.asyncio
async def test_scrape_success():
    with patch('app.services.llm_service.LLMService') as mock_llm:
        mock_llm.process_content.return_value = {"title": "Test"}
        # Test implementation
```

#### Frontend Example
```typescript
test('renders scrape form', () => {
    render(<ScrapeForm onSubmit={mockSubmit} />);
    expect(screen.getByText('URL')).toBeInTheDocument();
});
```

## Deployment

### Docker Setup
Create `Dockerfile` for containerization:

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Considerations
1. **Security**:
   - Use HTTPS
   - Implement API authentication
   - Validate all inputs
   - Rate limiting

2. **Performance**:
   - Implement caching
   - Database for persistent storage
   - Load balancing

3. **Monitoring**:
   - Health checks
   - Error tracking (Sentry)
   - Performance monitoring

### Environment Setup
```bash
# Production environment variables
export ENVIRONMENT=production
export DEBUG=false
export DATABASE_URL=postgresql://...
```

## Contributing

### Code Style
- Backend: Black formatter, flake8 linting
- Frontend: Prettier, ESLint
- Type hints for all Python functions
- TypeScript strict mode

### Git Workflow
1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Add tests for new features
4. Submit pull request
5. Code review and merge

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### Development Best Practices
1. Write tests before implementing features
2. Keep functions small and focused
3. Use meaningful variable names
4. Add docstrings for public functions
5. Handle errors gracefully
6. Log important events
7. Update documentation with changes

## Troubleshooting

### Common Issues

#### Backend
1. **LLM API Errors**: Check API keys and rate limits
2. **Import Errors**: Verify Python path and virtual environment
3. **Port Conflicts**: Change port in uvicorn command

#### Frontend
1. **CORS Errors**: Configure backend CORS settings
2. **Build Failures**: Check Node.js version and dependencies
3. **API Connection**: Verify VITE_API_URL environment variable

### Debug Mode
Enable debug logging:
```python
# Backend
LOG_LEVEL=DEBUG

# Add debug endpoints
@app.get("/debug/logs")
async def get_logs():
    return {"logs": "Recent log entries"}
```

### Performance Monitoring
```python
import time
from functools import wraps

def timing_decorator(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        result = await func(*args, **kwargs)
        end = time.time()
        logger.info(f"{func.__name__} took {end - start:.2f} seconds")
        return result
    return wrapper
```
