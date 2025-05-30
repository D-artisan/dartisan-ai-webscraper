import React, { useState } from 'react';
import { Globe, Send, AlertCircle } from 'lucide-react';
import { FormData } from '../types';

interface ScrapeFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const ScrapeForm: React.FC<ScrapeFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    url: '',
    prompt: '',
    outputFormat: 'text',
  });

  const [errors, setErrors] = useState<{
    url?: string;
    prompt?: string;
  }>({});  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // URL validation
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        const urlObj = new URL(formData.url);
        // Check if the parsed URL has a valid http/https protocol AND a non-empty hostname.
        if (['http:', 'https:'].includes(urlObj.protocol) && urlObj.hostname && urlObj.hostname !== '') {
          // URL is structurally valid, uses http or https, and has a non-empty hostname. No error.
        } else {
          // Protocol is not http/https, or hostname is missing or empty.
          newErrors.url = 'please enter a valid url';
        }
      } catch (error) {
        // This block executes if new URL() constructor throws an error.
        newErrors.url = 'please enter a valid url';
      }
    }

    // Prompt validation
    if (!formData.prompt.trim()) {
      newErrors.prompt = 'Prompt is required';
    } else if (formData.prompt.trim().length < 10) {
      newErrors.prompt = 'Prompt must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const examplePrompts = [
    "Extract all product names and their prices in a table format",
    "Get contact information including email addresses and phone numbers",
    "Find all article titles and their publication dates",
    "Extract company information, services, and location details",
    "List all job openings with their requirements and descriptions"
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <Globe className="h-6 w-6 text-primary-600" />
          <h2 className="card-title">Web Scraping Configuration</h2>
        </div>
        <p className="text-sm text-gray-600">
          Enter a URL and describe what data you want to extract
        </p>
      </div>
      
      <div className="card-content">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium text-gray-700">
              Target URL *
            </label>            <input
              id="url"
              type="text"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://example.com"
              className={`input ${errors.url ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.url && (
              <div className="flex items-center space-x-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.url}</span>
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium text-gray-700">
              Extraction Instructions *
            </label>
            <textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => handleInputChange('prompt', e.target.value)}
              placeholder="Describe what data you want to extract from the webpage..."
              className={`textarea ${errors.prompt ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              rows={4}
              disabled={isLoading}
            />
            {errors.prompt && (
              <div className="flex items-center space-x-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.prompt}</span>
              </div>
            )}
            
            {/* Example Prompts */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Example prompts:</p>
              <div className="grid gap-2">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleInputChange('prompt', prompt)}
                    className="text-left text-sm text-primary-600 hover:text-primary-800 hover:underline transition-colors"
                    disabled={isLoading}
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output Format Selection */}
          <div className="space-y-2">
            <label htmlFor="outputFormat" className="text-sm font-medium text-gray-700">
              Output Format
            </label>
            <select
              id="outputFormat"
              value={formData.outputFormat}
              onChange={(e) => handleInputChange('outputFormat', e.target.value)}
              className="input"
              disabled={isLoading}
            >
              <option value="text">Text (.txt)</option>
              <option value="word">Word Document (.docx)</option>
              <option value="excel">Excel Spreadsheet (.xlsx)</option>
              <option value="pdf">PDF Document (.pdf)</option>
            </select>
            <p className="text-sm text-gray-500">
              Choose the format for your extracted data
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Scraping in progress...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Start Scraping</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScrapeForm;
