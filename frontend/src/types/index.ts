// API types
export interface ScrapeRequest {
  url: string;
  prompt: string;
  output_format: 'word' | 'pdf' | 'excel' | 'text';
}

export interface ScrapeResponse {
  success: boolean;
  message: string;
  data?: any;
  download_url?: string;
  filename?: string;
}

export interface StatusResponse {
  status: string;
  llm_provider: string;
  llm_available: boolean;
  version: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}

// UI types
export interface FormData {
  url: string;
  prompt: string;
  outputFormat: 'word' | 'pdf' | 'excel' | 'text';
}

export interface ScrapingState {
  isLoading: boolean;
  result: ScrapeResponse | null;
  error: string | null;
}
