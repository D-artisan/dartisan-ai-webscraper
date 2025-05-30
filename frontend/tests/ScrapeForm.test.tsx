import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import userEvent from '@testing-library/user-event'
import ScrapeForm from '../src/components/ScrapeForm'

describe('ScrapeForm', () => {
  const mockOnSubmit = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form with all required fields', () => {
    render(<ScrapeForm onSubmit={mockOnSubmit} isLoading={false} />)
    
    expect(screen.getByLabelText(/target url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/extraction instructions/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/output format/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start scraping/i })).toBeInTheDocument()
  })
  it('shows validation errors for empty fields', async () => {
    render(<ScrapeForm onSubmit={mockOnSubmit} isLoading={false} />)
    
    const submitButton = screen.getByRole('button', { name: /start scraping/i })
    await act(async () => {
      await user.click(submitButton)
    })
    
    expect(screen.getByText(/url is required/i)).toBeInTheDocument()
    expect(screen.getByText(/prompt is required/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('validates URL format', async () => {
    render(<ScrapeForm onSubmit={mockOnSubmit} isLoading={false} />)
    
    const urlInput = screen.getByLabelText(/target url/i)
    const promptInput = screen.getByLabelText(/extraction instructions/i)
    const submitButton = screen.getByRole('button', { name: /start scraping/i })
    
    await act(async () => {
      await user.type(urlInput, 'http://')
      await user.type(promptInput, 'This is a valid prompt') // Add a valid prompt
      await user.click(submitButton)
    })

    // Expecting the specific URL validation error
    const errorMessage = await screen.findByText(/please enter a valid url/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('validates prompt length', async () => {
    render(<ScrapeForm onSubmit={mockOnSubmit} isLoading={false} />)
    
    const urlInput = screen.getByLabelText(/target url/i)
    const promptInput = screen.getByLabelText(/extraction instructions/i)
    const submitButton = screen.getByRole('button', { name: /start scraping/i })
    
    await act(async () => {
      await user.type(urlInput, 'https://example.com')
      await user.type(promptInput, 'short')
      await user.click(submitButton)
    })
    
    expect(screen.getByText(/prompt must be at least 10 characters long/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('submits valid form data', async () => {
    render(<ScrapeForm onSubmit={mockOnSubmit} isLoading={false} />)
    
    const urlInput = screen.getByLabelText(/target url/i)
    const promptInput = screen.getByLabelText(/extraction instructions/i)
    const formatSelect = screen.getByLabelText(/output format/i)
    const submitButton = screen.getByRole('button', { name: /start scraping/i })
    
    await act(async () => {
      await user.type(urlInput, 'https://example.com')
      await user.type(promptInput, 'Extract product names and prices')
      await user.selectOptions(formatSelect, 'excel')
      await user.click(submitButton)
    })
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      url: 'https://example.com',
      prompt: 'Extract product names and prices',
      outputFormat: expect.any(String)
    })
  })

  it('disables form when loading', () => {
    render(<ScrapeForm onSubmit={mockOnSubmit} isLoading={true} />)
    
    const urlInput = screen.getByLabelText(/target url/i)
    const promptInput = screen.getByLabelText(/extraction instructions/i)
    const formatSelect = screen.getByLabelText(/output format/i)
    const submitButton = screen.getByRole('button', { name: /scraping in progress/i })
    
    expect(urlInput).toBeDisabled()
    expect(promptInput).toBeDisabled()
    expect(formatSelect).toBeDisabled()
    expect(submitButton).toBeDisabled()
  })

  it('fills prompt when example is clicked', async () => {
    render(<ScrapeForm onSubmit={mockOnSubmit} isLoading={false} />)
    
    const exampleButton = screen.getByText(/"Extract all product names and their prices in a table format"/i)
    await act(async () => {
      await user.click(exampleButton)
    })
    
    const promptInput = screen.getByLabelText(/extraction instructions/i) as HTMLTextAreaElement
    expect(promptInput.value).toBe('Extract all product names and their prices in a table format')
  })

  it('clears errors when user starts typing', async () => {
    render(<ScrapeForm onSubmit={mockOnSubmit} isLoading={false} />)
    
    // Trigger validation errors
    const submitButton = screen.getByRole('button', { name: /start scraping/i })
    await act(async () => {
      await user.click(submitButton)
    })
    
    expect(screen.getByText(/url is required/i)).toBeInTheDocument()
    
    // Start typing in URL field
    const urlInput = screen.getByLabelText(/target url/i)
    await act(async () => {
      await user.type(urlInput, 'h')
    })
    
    // Error should be cleared
    expect(screen.queryByText(/url is required/i)).not.toBeInTheDocument()
  })
})
