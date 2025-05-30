import React, { useState, useEffect } from 'react';
import { Bot, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import ScrapeForm from '../components/ScrapeForm';
import ResultPreview from '../components/ResultPreview';
import { apiService } from '../services/api';
import { FormData, ScrapingState, StatusResponse } from '../types';

const Home: React.FC = () => {
  const [scrapingState, setScrapingState] = useState<ScrapingState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const [apiStatus, setApiStatus] = useState<StatusResponse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const status = await apiService.getStatus();
      setApiStatus(status);
      
      if (!status.llm_available) {
        toast.error('LLM service is not available. Please check your configuration.');
      }
    } catch (error) {
      console.error('Failed to check API status:', error);
      toast.error('Failed to connect to the API server.');
    }
  };

  const handleScrapeSubmit = async (formData: FormData) => {
    setScrapingState({
      isLoading: true,
      result: null,
      error: null,
    });

    try {
      const result = await apiService.scrapeWebpage({
        url: formData.url,
        prompt: formData.prompt,
        output_format: formData.outputFormat,
      });

      setScrapingState({
        isLoading: false,
        result,
        error: null,
      });

      toast.success('Scraping completed successfully!');
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      
      setScrapingState({
        isLoading: false,
        result: {
          success: false,
          message: errorMessage,
        },
        error: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const handleDownload = async (filename: string) => {
    setIsDownloading(true);

    try {
      const blob = await apiService.downloadFile(filename);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('File downloaded successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download file');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dartisan AI Web Scraper</h1>
                <p className="text-sm text-gray-500">Intelligent data extraction powered by AI</p>
              </div>
            </div>
            
            {/* API Status Indicator */}
            <div className="flex items-center space-x-2">
              {apiStatus ? (
                <div className="flex items-center space-x-2">
                  {apiStatus.llm_available ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        {apiStatus.llm_provider.toUpperCase()} Ready
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm text-yellow-700 font-medium">
                        LLM Unavailable
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-gray-400 animate-pulse" />
                  <span className="text-sm text-gray-500">Checking status...</span>
                </div>
              )}
              
              <button
                onClick={checkApiStatus}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <ScrapeForm
              onSubmit={handleScrapeSubmit}
              isLoading={scrapingState.isLoading}
            />

            {/* Instructions */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">How to Use</h3>
              </div>
              <div className="card-content">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                    <p>Enter the URL of the webpage you want to scrape</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                    <p>Describe what data you want to extract using natural language</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                    <p>Choose your preferred output format</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">4</span>
                    <p>Click "Start Scraping" and wait for the AI to process the data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {scrapingState.result && (
              <ResultPreview
                result={scrapingState.result}
                onDownload={handleDownload}
                isDownloading={isDownloading}
              />
            )}

            {/* Loading State */}
            {scrapingState.isLoading && (
              <div className="card">
                <div className="card-content">
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full border-4 border-primary-200"></div>
                      <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-900">Processing your request...</p>
                      <p className="text-sm text-gray-600">This may take up to 30 seconds</p>
                    </div>
                    
                    <div className="w-full max-w-sm space-y-2">
                      <div className="text-xs text-gray-500 text-center">Progress</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!scrapingState.result && !scrapingState.isLoading && (
              <div className="card">
                <div className="card-content">
                  <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                    <Bot className="h-16 w-16 text-gray-300" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Ready to scrape</h3>
                      <p className="text-gray-600">Enter a URL and prompt to get started</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Dartisan Inc | AI Web Scraper v1.0.0 - Powered by {apiStatus?.llm_provider || 'AI'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
