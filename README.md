# AI Web Scraper

An AI-powered web scraper application that leverages free LLM providers to perform intelligent web scraping based on user prompts. The system allows users to input scraping instructions via a user-friendly UI, process web data using LLM APIs, and output results in professional formats.

## Features

- 🌐 **Intelligent Web Scraping**: Uses AI to understand and extract data based on natural language prompts
- 🎨 **Modern UI**: Responsive React frontend with TypeScript and Tailwind CSS
- ⚡ **Fast Backend**: High-performance FastAPI backend with async support
- 📄 **Multiple Output Formats**: Generate results in Word, PDF, Excel, or text formats
- 🔐 **Secure**: API keys stored securely in environment variables
- 🧪 **Well-Tested**: Comprehensive test suite with high coverage
- 📚 **Well-Documented**: Complete guides for developers, testers, and users

## Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python
- **LLM Integration**: OpenRouter/OpenAI APIs
- **Output Generation**: python-docx, reportlab, openpyxl
- **Testing**: Pytest (backend), Vitest (frontend)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-webscraper
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # On Windows
   pip install -r requirements.txt
   
   # Copy .env.example to .env and add your API keys
   copy .env.example .env
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Run the Application**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Documentation

- [Developer Guide](docs/developer-guide.md)
- [Tester Guide](docs/tester-guide.md)
- [User Guide](docs/user-guide.md)

## Project Structure

```
ai-webscraper/
├── backend/          # FastAPI backend
├── frontend/         # Vite React frontend
├── docs/            # Documentation
└── README.md        # This file
```

## License

MIT License
