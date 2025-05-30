import React from 'react';
import { Download, FileText, FileSpreadsheet, FileImage, CheckCircle, AlertCircle } from 'lucide-react';
import { ScrapeResponse } from '../types';

interface ResultPreviewProps {
  result: ScrapeResponse;
  onDownload: (filename: string) => void;
  isDownloading: boolean;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ 
  result, 
  onDownload, 
  isDownloading 
}) => {
  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'xlsx':
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case 'pdf':
        return <FileImage className="h-5 w-5 text-red-600" />;
      case 'txt':
        return <FileText className="h-5 w-5 text-gray-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatData = (data: any): string => {
    if (typeof data === 'string') {
      return data;
    }
    
    if (typeof data === 'object' && data !== null) {
      try {
        return JSON.stringify(data, null, 2);
      } catch {
        return String(data);
      }
    }
    
    return String(data);
  };

  const renderDataPreview = (data: any) => {
    if (!data) return null;

    // If it's a simple object with extracted_text, show it nicely
    if (data.extracted_text) {
      return (
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-md">
            {data.extracted_text}
          </pre>
        </div>
      );
    }

    // If it's structured data, try to display it in a table format
    if (typeof data === 'object' && !Array.isArray(data)) {
      return (
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="border-b border-gray-200 pb-2">
              <h4 className="font-medium text-gray-900 capitalize">
                {key.replace(/_/g, ' ')}
              </h4>
              {Array.isArray(value) ? (
                <div className="mt-2 space-y-1">
                  {value.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600 pl-4">
                      {typeof item === 'object' ? (
                        <pre className="text-xs bg-gray-50 p-2 rounded">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      ) : (
                        <span>• {String(item)}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : typeof value === 'object' ? (
                <pre className="text-xs bg-gray-50 p-2 rounded mt-2">
                  {JSON.stringify(value, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-gray-600 mt-1">{String(value)}</p>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Fallback to formatted JSON
    return (
      <pre className="text-sm bg-gray-50 p-4 rounded-md overflow-auto">
        {formatData(data)}
      </pre>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          {result.success ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-red-600" />
          )}
          <h2 className="card-title">
            {result.success ? 'Scraping Results' : 'Scraping Failed'}
          </h2>
        </div>
        <p className="text-sm text-gray-600">{result.message}</p>
      </div>

      <div className="card-content">
        {result.success ? (
          <div className="space-y-6">
            {/* Download Section */}
            {result.filename && (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(result.filename)}
                  <div>
                    <p className="font-medium text-green-900">{result.filename}</p>
                    <p className="text-sm text-green-700">File ready for download</p>
                  </div>
                </div>
                <button
                  onClick={() => onDownload(result.filename!)}
                  disabled={isDownloading}
                  className="btn-primary"
                >
                  {isDownloading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Downloading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </div>
                  )}
                </button>
              </div>
            )}

            {/* Data Preview */}
            {result.data && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
                <div className="max-h-96 overflow-auto border border-gray-200 rounded-lg p-4">
                  {renderDataPreview(result.data)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">Error Details</p>
            </div>
            <p className="text-red-700 mt-2">{result.message}</p>
            
            <div className="mt-4 text-sm text-red-600">
              <p className="font-medium">Troubleshooting tips:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Verify the URL is accessible and publicly available</li>
                <li>Check if the website allows automated access</li>
                <li>Try a different prompt or simplify your request</li>
                <li>Ensure your API keys are properly configured</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPreview;
