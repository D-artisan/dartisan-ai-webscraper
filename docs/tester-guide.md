# Tester Guide

## Table of Contents
1. [Testing Overview](#testing-overview)
2. [Test Environment Setup](#test-environment-setup)
3. [Backend Testing](#backend-testing)
4. [Frontend Testing](#frontend-testing)
5. [Integration Testing](#integration-testing)
6. [Test Data and Scenarios](#test-data-and-scenarios)
7. [Performance Testing](#performance-testing)
8. [Security Testing](#security-testing)
9. [Test Automation](#test-automation)
10. [Bug Reporting](#bug-reporting)

## Testing Overview

### Testing Strategy
The AI Web Scraper follows a comprehensive testing approach:

- **Unit Tests**: Individual components and functions
- **Integration Tests**: API endpoints and service interactions
- **Component Tests**: React component behavior
- **End-to-End Tests**: Complete user workflows
- **Performance Tests**: Load and stress testing
- **Security Tests**: Input validation and security vulnerabilities

### Test Pyramid
```
E2E Tests (Few)
Integration Tests (Some)
Unit Tests (Many)
```

## Test Environment Setup

### Prerequisites
- Python 3.8+ with pytest
- Node.js 16+ with npm
- Test API keys (separate from production)
- Chrome/Chromium for E2E tests

### Backend Test Setup
```bash
cd backend
python -m venv test_env
source test_env/bin/activate  # Windows: test_env\Scripts\activate
pip install -r requirements.txt
pip install pytest-cov pytest-asyncio
```

### Frontend Test Setup
```bash
cd frontend
npm install
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Test Environment Variables
Create `backend/.env.test`:
```
OPENAI_API_KEY=test_key_openai
OPENROUTER_API_KEY=test_key_openrouter
LLM_PROVIDER=openai
LOG_LEVEL=DEBUG
ENVIRONMENT=test
```

## Backend Testing

### Running Backend Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_scrape.py

# Run with verbose output
pytest -v

# Run only fast tests (exclude slow integration tests)
pytest -m "not slow"
```

### Test Structure

#### Unit Tests
Located in `backend/tests/`

**test_scrape.py**:
- Tests scraping endpoint functionality
- Mocks external dependencies (LLM APIs, web requests)
- Validates request/response formats

**test_status.py**:
- Tests health and status endpoints
- Validates system status reporting
- Tests error conditions

### Backend Test Cases

#### Scraping Endpoint Tests
```python
# Test successful scraping
async def test_scrape_success()

# Test invalid URL handling
async def test_scrape_invalid_url()

# Test empty content scenarios
async def test_scrape_empty_content()

# Test LLM service failures
async def test_scrape_llm_failure()

# Test output format generation
async def test_scrape_output_formats()
```

#### Status Endpoint Tests
```python
# Test healthy status
async def test_status_success()

# Test LLM unavailable
async def test_status_llm_unavailable()

# Test service errors
async def test_status_service_error()

# Test health check
async def test_health_check()
```

### Test Data Examples
```python
# Valid test URLs
TEST_URLS = [
    "https://example.com",
    "https://httpbin.org/html",
    "https://news.ycombinator.com"
]

# Test prompts
TEST_PROMPTS = [
    "Extract the main title",
    "Get all product information",
    "Extract contact details"
]

# Expected responses
EXPECTED_RESPONSE_FORMAT = {
    "success": bool,
    "message": str,
    "data": dict,
    "filename": str
}
```

## Frontend Testing

### Running Frontend Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test ScrapeForm.test.tsx
```

### Component Testing

#### ScrapeForm Component Tests
```typescript
// Test form rendering
test('renders all form fields')

// Test form validation
test('validates required fields')
test('validates URL format')

// Test form submission
test('handles form submission')
test('displays loading state')

// Test error handling
test('displays error messages')
```

#### ResultPreview Component Tests
```typescript
// Test result display
test('displays scraping results')
test('shows download button')

// Test loading states
test('shows loading indicator')

// Test error states
test('displays error messages')
test('handles empty results')
```

### Frontend Test Examples
```typescript
// Basic component test
import { render, screen, fireEvent } from '@testing-library/react';
import ScrapeForm from '../src/components/ScrapeForm';

test('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<ScrapeForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText('URL'), {
        target: { value: 'https://example.com' }
    });
    
    fireEvent.click(screen.getByText('Scrape'));
    
    expect(mockSubmit).toHaveBeenCalledWith({
        url: 'https://example.com',
        prompt: expect.any(String),
        output_format: expect.any(String)
    });
});
```

## Integration Testing

### API Integration Tests
Test complete API workflows:

```python
@pytest.mark.integration
async def test_complete_scraping_workflow():
    """Test end-to-end scraping workflow."""
    # 1. Check status
    status_response = await client.get("/api/status")
    assert status_response.status_code == 200
    
    # 2. Submit scraping request
    scrape_response = await client.post("/api/scrape", json={
        "url": "https://example.com",
        "prompt": "Extract title",
        "output_format": "text"
    })
    assert scrape_response.status_code == 200
    
    # 3. Download result (if applicable)
    # Implementation depends on file handling approach
```

### Service Integration Tests
Test service layer interactions:

```python
async def test_llm_service_integration():
    """Test LLM service with real API calls."""
    llm_service = LLMService()
    
    # Test availability check
    available = await llm_service.check_availability()
    assert isinstance(available, bool)
    
    # Test content processing (with mock content)
    result = await llm_service.process_content(
        "Sample content", 
        "Extract key information"
    )
    assert isinstance(result, dict)
```

## Test Data and Scenarios

### Test URLs
```python
# Successful test cases
VALID_URLS = [
    "https://example.com",           # Simple HTML
    "https://httpbin.org/html",      # Test HTML content
    "https://jsonplaceholder.typicode.com/posts/1"  # JSON API
]

# Error test cases
INVALID_URLS = [
    "not-a-url",                     # Invalid format
    "https://nonexistent-domain.xyz", # 404 error
    "https://httpbin.org/status/500"  # Server error
]

# Edge cases
EDGE_CASE_URLS = [
    "https://httpbin.org/html",      # Minimal content
    "https://example.com/large-page", # Large content
    "https://example.com/redirect"    # Redirects
]
```

### Test Scenarios

#### Happy Path Testing
1. Valid URL + Clear prompt → Successful extraction
2. Different output formats → Correct file generation
3. Various content types → Appropriate processing

#### Error Handling Testing
1. Invalid URLs → Proper error messages
2. Network timeouts → Graceful failure
3. LLM API failures → Fallback behavior
4. Malformed responses → Error handling

#### Edge Case Testing
1. Very large web pages → Performance handling
2. Pages with no content → Empty result handling
3. Non-English content → Unicode handling
4. JavaScript-heavy sites → Content extraction limits

### Load Testing Scenarios
```python
# Concurrent requests
async def test_concurrent_scraping():
    """Test handling multiple simultaneous requests."""
    tasks = []
    for i in range(10):
        task = client.post("/api/scrape", json={
            "url": f"https://httpbin.org/html?id={i}",
            "prompt": "Extract content",
            "output_format": "text"
        })
        tasks.append(task)
    
    results = await asyncio.gather(*tasks)
    assert all(r.status_code == 200 for r in results)
```

## Performance Testing

### Backend Performance Tests
```python
import time
import asyncio

async def test_response_time():
    """Test API response times."""
    start_time = time.time()
    
    response = await client.post("/api/scrape", json={
        "url": "https://example.com",
        "prompt": "Extract title",
        "output_format": "text"
    })
    
    end_time = time.time()
    response_time = end_time - start_time
    
    assert response.status_code == 200
    assert response_time < 30.0  # Max 30 seconds
```

### Load Testing with Locust
Create `locustfile.py`:
```python
from locust import HttpUser, task, between

class WebScraperUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def scrape_page(self):
        self.client.post("/api/scrape", json={
            "url": "https://example.com",
            "prompt": "Extract title",
            "output_format": "text"
        })
    
    @task(3)
    def check_status(self):
        self.client.get("/api/status")
```

Run load test:
```bash
pip install locust
locust -f locustfile.py --host=http://localhost:8000
```

## Security Testing

### Input Validation Tests
```python
async def test_sql_injection_prevention():
    """Test SQL injection attempts."""
    malicious_inputs = [
        "'; DROP TABLE users; --",
        "<script>alert('xss')</script>",
        "../../etc/passwd"
    ]
    
    for malicious_input in malicious_inputs:
        response = await client.post("/api/scrape", json={
            "url": malicious_input,
            "prompt": "test",
            "output_format": "text"
        })
        # Should return validation error, not crash
        assert response.status_code in [400, 422]
```

### API Security Tests
```python
async def test_rate_limiting():
    """Test rate limiting functionality."""
    # Make many rapid requests
    responses = []
    for _ in range(100):
        response = await client.get("/api/status")
        responses.append(response)
    
    # Should eventually get rate limited
    rate_limited = any(r.status_code == 429 for r in responses)
    # Uncomment when rate limiting is implemented
    # assert rate_limited
```

## Test Automation

### CI/CD Pipeline Tests
Create `.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    - name: Run tests
      run: |
        cd backend
        pytest --cov=app

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: 16
    - name: Install dependencies
      run: |
        cd frontend
        npm install
    - name: Run tests
      run: |
        cd frontend
        npm test
```

### Pre-commit Hooks
Install pre-commit hooks:
```bash
pip install pre-commit
pre-commit install
```

Create `.pre-commit-config.yaml`:
```yaml
repos:
-   repo: https://github.com/psf/black
    rev: 22.3.0
    hooks:
    -   id: black
        language_version: python3
-   repo: https://github.com/pycqa/flake8
    rev: 4.0.1
    hooks:
    -   id: flake8
```

## Bug Reporting

### Bug Report Template
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to...
2. Click on...
3. Enter...
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10, macOS 11.6, Ubuntu 20.04]
- Browser: [e.g., Chrome 95, Firefox 94]
- Python version: [e.g., 3.9.7]
- Node.js version: [e.g., 16.13.0]

## Screenshots/Logs
Add screenshots or relevant log output

## Additional Context
Any other relevant information
```

### Test Result Documentation
Document test results in standardized format:

```markdown
## Test Execution Report

**Date**: 2024-01-20
**Tester**: [Name]
**Environment**: Development
**Test Suite**: Backend API Tests

### Summary
- Total Tests: 45
- Passed: 42
- Failed: 2
- Skipped: 1

### Failed Tests
1. `test_large_content_handling` - Timeout after 30s
2. `test_pdf_generation` - Missing dependency

### Notes
- PDF generation requires additional setup
- Large content test needs optimization
```

### Testing Checklist
```markdown
## Pre-Release Testing Checklist

### Backend
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] API documentation is current
- [ ] Error handling works correctly
- [ ] Performance meets requirements

### Frontend
- [ ] Component tests pass
- [ ] UI renders correctly on different screen sizes
- [ ] Form validation works
- [ ] Error messages are user-friendly
- [ ] Loading states work correctly

### Integration
- [ ] End-to-end user workflows work
- [ ] File downloads work correctly
- [ ] API communication is stable
- [ ] Error handling across full stack

### Security
- [ ] Input validation is comprehensive
- [ ] No sensitive data in logs
- [ ] API keys are properly protected
- [ ] XSS and injection attacks prevented

### Performance
- [ ] Response times are acceptable
- [ ] Memory usage is reasonable
- [ ] Concurrent requests handled properly
- [ ] Large files processed successfully
```
