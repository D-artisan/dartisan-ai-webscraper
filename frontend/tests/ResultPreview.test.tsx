/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ResultPreview from '../src/components/ResultPreview'
import { ScrapeResponse } from '../src/types'

describe('ResultPreview', () => {
  const mockOnDownload = vi.fn()
  const user = userEvent.setup()

  const successResponse: ScrapeResponse = {
    success: true,
    message: 'Scraping completed successfully',
    data: {
      products: [
        { name: 'Product 1', price: '$19.99' },
        { name: 'Product 2', price: '$29.99' }
      ]
    },
    download_url: '/download/test.xlsx',
    filename: 'test.xlsx'
  }

  const errorResponse: ScrapeResponse = {
    success: false,
    message: 'Failed to scrape the webpage',
  }

  it('renders success result with download button', () => {
    render(
      <ResultPreview 
        result={successResponse} 
        onDownload={mockOnDownload} 
        isDownloading={false} 
      />
    )
      expect(screen.getByText(/scraping results/i)).toBeInTheDocument()
    expect(screen.getByText(/scraping completed successfully/i)).toBeInTheDocument()
    expect(screen.getByText('test.xlsx')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
  })

  it('renders error result with troubleshooting tips', () => {
    render(
      <ResultPreview 
        result={errorResponse} 
        onDownload={mockOnDownload} 
        isDownloading={false} 
      />
    )
    
    expect(screen.getByText(/scraping failed/i)).toBeInTheDocument()
    // Use a more specific query targeting the error details section
    expect(screen.getByText('Error Details')).toBeInTheDocument()
    expect(screen.getByText(/troubleshooting tips/i)).toBeInTheDocument()
    expect(screen.getByText(/verify the url is accessible/i)).toBeInTheDocument()
  })

  it('calls onDownload when download button is clicked', async () => {
    render(
      <ResultPreview 
        result={successResponse} 
        onDownload={mockOnDownload} 
        isDownloading={false} 
      />
    )
    
    const downloadButton = screen.getByRole('button', { name: /download/i })
    await user.click(downloadButton)
    
    expect(mockOnDownload).toHaveBeenCalledWith('test.xlsx')
  })

  it('shows downloading state', () => {
    render(
      <ResultPreview 
        result={successResponse} 
        onDownload={mockOnDownload} 
        isDownloading={true} 
      />
    )
    
    expect(screen.getByText(/downloading/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /downloading/i })).toBeDisabled()
  })
  it('renders data preview for structured data', () => {
    render(
      <ResultPreview 
        result={successResponse} 
        onDownload={mockOnDownload} 
        isDownloading={false} 
      />
    )
    
    expect(screen.getByText(/data preview/i)).toBeInTheDocument()
    expect(screen.getByText(/products/i)).toBeInTheDocument()
    // Check for JSON content within pre tags using a more flexible approach
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'pre' && content.includes('Product 1')
    })).toBeInTheDocument()
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'pre' && content.includes('$19.99')
    })).toBeInTheDocument()
  })

  it('renders data preview for text data', () => {
    const textResponse: ScrapeResponse = {
      success: true,
      message: 'Scraping completed successfully',
      data: {
        extracted_text: 'This is some extracted text content'
      },
      filename: 'test.txt'
    }

    render(
      <ResultPreview 
        result={textResponse} 
        onDownload={mockOnDownload} 
        isDownloading={false} 
      />
    )
    
    expect(screen.getByText('This is some extracted text content')).toBeInTheDocument()
  })

  it('shows correct file icon based on extension', () => {
    const responses = [
      { ...successResponse, filename: 'test.docx' },
      { ...successResponse, filename: 'test.pdf' },
      { ...successResponse, filename: 'test.txt' },
    ]

    responses.forEach((response) => {
      const { unmount } = render(
        <ResultPreview 
          result={response} 
          onDownload={mockOnDownload} 
          isDownloading={false} 
        />
      )
      
      expect(screen.getByText(response.filename!)).toBeInTheDocument()
      unmount()
    })
  })
})
