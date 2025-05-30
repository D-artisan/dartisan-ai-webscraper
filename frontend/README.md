# AI Web Scraper Frontend

## Overview

Modern React frontend for the AI Web Scraper application. Built with Vite, TypeScript, and Tailwind CSS for a responsive and intuitive user experience.

## Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **TypeScript**: Full type safety and excellent developer experience
- **Real-time Feedback**: Toast notifications and loading states
- **Form Validation**: Client-side validation with helpful error messages
- **File Downloads**: Direct download of generated output files
- **Status Monitoring**: Real-time API and LLM service status

## Tech Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast development and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **React Hot Toast**: Beautiful toast notifications
- **Lucide React**: Beautiful icon library
- **Vitest**: Fast unit testing framework

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:8000

### Installation

1. **Install dependencies**
   ```powershell
   npm install
   ```

2. **Environment Setup (Optional)**
   Create `.env` file for custom API URL:
   ```
   VITE_API_URL=http://localhost:8000
   ```

3. **Development Server**
   ```powershell
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Auto-proxy to backend API

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ScrapeForm.tsx  # Main scraping form
│   └── ResultPreview.tsx # Results display
├── pages/              # Page components
│   └── Home.tsx        # Main application page
├── services/           # API and external services
│   └── api.ts          # Backend API client
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── App.tsx             # Root component
└── main.tsx            # Application entry point
```

## Component Overview

### ScrapeForm
- URL input with validation
- Prompt textarea with examples
- Output format selection
- Form validation and error handling

### ResultPreview
- Success/error status display
- Data preview with formatting
- File download functionality
- Troubleshooting tips for errors

### Home
- Main application layout
- API status monitoring
- State management for scraping operations
- Toast notifications

## API Integration

The frontend communicates with the FastAPI backend through:

- **POST /api/scrape** - Submit scraping requests
- **GET /api/status** - Check API and LLM service status
- **GET /api/download/{filename}** - Download generated files

## Styling

Uses Tailwind CSS with custom component classes:

- `btn`, `btn-primary`, `btn-secondary` - Button styles
- `input`, `textarea` - Form input styles
- `card`, `card-header`, `card-content` - Card layouts

## Testing

Comprehensive test suite with Vitest and React Testing Library:

```powershell
npm test
```

Tests cover:
- Component rendering
- Form validation
- User interactions
- API integration mocking
- Error handling

## Build & Deploy

```powershell
npm run build
```

Generates optimized production build in `dist/` directory.

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: http://localhost:8000)
