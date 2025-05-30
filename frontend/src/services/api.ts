import axios from 'axios';
import { ScrapeRequest, ScrapeResponse, StatusResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for scraping requests
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Scrape a webpage
  async scrapeWebpage(request: ScrapeRequest): Promise<ScrapeResponse> {
    try {
      const response = await api.post<ScrapeResponse>('/api/scrape', request);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to scrape webpage. Please try again.');
    }
  },

  // Get API status
  async getStatus(): Promise<StatusResponse> {
    try {
      const response = await api.get<StatusResponse>('/api/status');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to get API status.');
    }
  },

  // Download a file
  async downloadFile(filename: string): Promise<Blob> {
    try {
      const response = await api.get(`/api/download/${filename}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to download file.');
    }
  },

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error: any) {
      throw new Error('API is not available.');
    }
  },
};

export default api;
