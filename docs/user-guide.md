# User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Using the Web Interface](#using-the-web-interface)
3. [Understanding Output Formats](#understanding-output-formats)
4. [Writing Effective Prompts](#writing-effective-prompts)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)
7. [FAQ](#faq)
8. [Examples](#examples)

## Getting Started

### What is AI Web Scraper?
AI Web Scraper is an intelligent tool that extracts specific information from web pages using artificial intelligence. Instead of getting raw HTML, you describe what information you want in plain English, and the AI extracts exactly what you need.

### Quick Start
1. **Open the Application**: Navigate to the web interface
2. **Enter a URL**: Paste the web page URL you want to scrape
3. **Describe What You Want**: Write a prompt describing the information to extract
4. **Choose Output Format**: Select how you want the results (Text, Word, PDF, or Excel)
5. **Click "Scrape"**: Wait for the AI to process and extract your data
6. **Download Results**: Get your formatted file with the extracted information

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- JavaScript enabled

## Using the Web Interface

### Main Interface Components

#### 1. URL Input Field
- **Purpose**: Enter the web page URL you want to scrape
- **Accepted Formats**: 
  - `https://example.com`
  - `http://example.com`
  - `https://subdomain.example.com/page`
- **Tips**: Make sure the URL is accessible publicly (not behind login)

#### 2. Prompt Input Area
- **Purpose**: Describe what information you want to extract
- **Format**: Natural language description
- **Examples**:
  - "Extract all product names and prices"
  - "Get the main article title and author"
  - "Find contact information including phone and email"

#### 3. Output Format Selector
Choose how you want your results formatted:
- **Text**: Simple text file (.txt)
- **Word**: Microsoft Word document (.docx)
- **PDF**: Portable Document Format (.pdf)
- **Excel**: Spreadsheet format (.xlsx)

#### 4. Action Buttons
- **Scrape**: Start the extraction process
- **Clear**: Reset all fields
- **Download**: Get your results (appears after successful scraping)

### Step-by-Step Workflow

#### Step 1: Enter the URL
```
1. Copy the URL from your browser
2. Paste it into the "URL" field
3. Ensure it starts with http:// or https://
```

#### Step 2: Write Your Prompt
```
1. Think about what specific information you need
2. Write it in clear, simple English
3. Be specific about format if needed
```

#### Step 3: Select Output Format
```
1. Choose based on how you plan to use the data:
   - Text: Simple viewing or further processing
   - Word: Professional documents or reports
   - PDF: Sharing or printing
   - Excel: Data analysis or spreadsheets
```

#### Step 4: Execute and Download
```
1. Click "Scrape" button
2. Wait for processing (usually 10-30 seconds)
3. Click "Download" when results are ready
```

## Understanding Output Formats

### Text Format (.txt)
**Best for**: Quick viewing, copying text, simple data processing

**Example Output**:
```
Title: Sample Article Title
Author: John Doe
Date: January 20, 2024
Content: This is the main article content...

Key Points:
- Point 1
- Point 2
- Point 3
```

### Word Format (.docx)
**Best for**: Professional reports, formatted documents, sharing with colleagues

**Features**:
- Professional formatting
- Headers and sections
- Bullet points and numbering
- Tables for structured data

### PDF Format (.pdf)
**Best for**: Final reports, printing, archiving, sharing

**Features**:
- Fixed formatting
- Professional appearance
- Easy sharing and printing
- Searchable text

### Excel Format (.xlsx)
**Best for**: Data analysis, creating charts, database import

**Features**:
- Structured data in rows and columns
- Multiple sheets for different data types
- Easy sorting and filtering
- Formula-ready format

**Example Structure**:
```
Sheet 1: Products
Name        | Price  | Category | In Stock
Widget A    | $19.99 | Tools    | Yes
Widget B    | $24.99 | Tools    | No

Sheet 2: Contact Info
Type    | Value
Email   | contact@example.com
Phone   | (555) 123-4567
```

## Writing Effective Prompts

### Basic Prompt Structure
A good prompt clearly states what information you want and how it should be organized.

#### Template:
```
"Extract [specific information] from this page and organize it as [structure]"
```

### Prompt Examples by Use Case

#### E-commerce Product Information
```
✅ Good: "Extract product name, price, description, and availability status for each product"

❌ Poor: "Get product info"
```

#### News Articles
```
✅ Good: "Extract the headline, author name, publication date, and main article content"

❌ Poor: "Get the article"
```

#### Contact Information
```
✅ Good: "Find all contact information including email addresses, phone numbers, physical address, and social media links"

❌ Poor: "Get contacts"
```

#### Event Details
```
✅ Good: "Extract event name, date, time, location, ticket price, and description for each event listed"

❌ Poor: "Get events"
```

#### Restaurant Information
```
✅ Good: "Extract restaurant name, cuisine type, address, phone number, hours of operation, and average price range"

❌ Poor: "Get restaurant details"
```

### Advanced Prompt Techniques

#### Specify Data Structure
```
"Extract product information and organize as:
- Product Name
- Price
- Features (as bullet points)
- Customer Rating
- Availability"
```

#### Request Specific Formats
```
"Extract all dates in MM/DD/YYYY format and all prices in USD with dollar signs"
```

#### Filter Information
```
"Extract only products that are currently in stock with prices under $100"
```

#### Multiple Categories
```
"Separate the extracted information into two categories:
1. Basic Information: name, price, category
2. Detailed Information: description, specifications, reviews"
```

## Troubleshooting

### Common Issues and Solutions

#### "Invalid URL" Error
**Problem**: The URL format is not recognized
**Solutions**:
- Ensure URL starts with `http://` or `https://`
- Check for typos in the URL
- Verify the website is accessible in your browser

#### "No Content Found" Error
**Problem**: The page has no extractable content
**Solutions**:
- Check if the page requires JavaScript (some content may not be accessible)
- Verify the page isn't behind a login
- Try a different page from the same website

#### "Processing Failed" Error
**Problem**: The AI couldn't process your request
**Solutions**:
- Simplify your prompt
- Try a more specific prompt
- Check if the page has the type of content you're requesting

#### Slow Processing
**Problem**: Scraping takes a long time
**Causes**:
- Large web pages take longer to process
- Complex prompts require more AI processing
- High server load

**Solutions**:
- Be patient for large pages
- Simplify your prompt if possible
- Try again during off-peak hours

#### Empty or Incomplete Results
**Problem**: The output doesn't contain expected information
**Solutions**:
- Make your prompt more specific
- Check if the information actually exists on the page
- Try different wording in your prompt

### Error Messages Explained

| Error Message | Meaning | Solution |
|---------------|---------|----------|
| "Invalid URL format" | URL doesn't follow proper format | Add http:// or https:// |
| "Page not accessible" | Website is down or blocked | Try a different URL |
| "Content extraction failed" | No readable content found | Check if page requires login |
| "AI processing error" | LLM service unavailable | Try again in a few minutes |
| "Output generation failed" | File creation error | Contact support |

## Best Practices

### Choosing the Right Websites
- **Public websites**: Work best (no login required)
- **Static content**: More reliable than dynamic content
- **Well-structured pages**: Easier for AI to understand
- **Avoid**: Login-protected, heavily JavaScript-dependent sites

### Writing Better Prompts
1. **Be Specific**: Instead of "get prices", use "extract product prices in USD format"
2. **Mention Structure**: Request bullet points, tables, or specific organization
3. **Include Context**: If the page has multiple sections, specify which one
4. **Use Examples**: "Extract emails like user@domain.com format"

### Optimizing for Different Output Formats

#### For Text Output
- Request simple, linear information
- Ask for clear separators between items
- Good for copying and pasting

#### For Word/PDF Output
- Request structured information with headers
- Ask for organized sections
- Perfect for reports and documentation

#### For Excel Output
- Request tabular data
- Specify column names
- Good for lists and data analysis

### Handling Large Websites
- **Focus on specific sections**: "Extract information from the main content area only"
- **Limit scope**: "Get the first 10 products listed"
- **Break into parts**: Process different pages separately

## FAQ

### General Questions

**Q: What types of websites work best?**
A: Public websites with clear, static content work best. News sites, e-commerce product pages, business directories, and informational sites are ideal.

**Q: Can I scrape password-protected content?**
A: No, the scraper can only access publicly available content that doesn't require login.

**Q: How long does scraping take?**
A: Typically 10-30 seconds, depending on page size and prompt complexity.

**Q: Is there a limit to how much content I can extract?**
A: The system works best with typical web pages. Very large pages may take longer or need simplified prompts.

### Technical Questions

**Q: What happens to my data?**
A: URLs and prompts are processed temporarily and not stored permanently. Generated files are automatically cleaned up after download.

**Q: Can I scrape multiple pages at once?**
A: Currently, the system processes one page at a time. You'll need to submit separate requests for multiple pages.

**Q: What if the website blocks scraping?**
A: Some websites may block automated access. If you encounter this, try accessing the page in your browser first to verify it's available.

### Output Questions

**Q: Can I customize the formatting of output files?**
A: The system uses professional default formatting. For specific formatting needs, use the text output and reformat manually.

**Q: Why is my Excel file not opening correctly?**
A: Ensure you have a compatible spreadsheet application. The files are generated in standard .xlsx format.

**Q: Can I get the data in JSON format?**
A: Currently, JSON output isn't available through the web interface, but extracted data is internally structured as JSON.

## Examples

### Example 1: E-commerce Product Scraping

**URL**: `https://example-store.com/products/laptop`

**Prompt**: "Extract the product name, price, key specifications, customer rating, and availability status"

**Expected Output** (Text format):
```
Product: Gaming Laptop Pro 15"
Price: $1,299.99
Specifications:
- 16GB RAM
- 512GB SSD
- NVIDIA RTX 3060
- Intel i7 processor
Customer Rating: 4.5/5 stars
Availability: In Stock
```

### Example 2: News Article Extraction

**URL**: `https://news-site.com/article/tech-trends-2024`

**Prompt**: "Extract the headline, author, publication date, and summarize the main points in bullet format"

**Expected Output** (Word format):
```
# Tech Trends 2024

**Author**: Jane Smith
**Published**: January 15, 2024

## Main Points:
• Artificial Intelligence integration in everyday apps
• Remote work technology improvements
• Sustainable tech initiatives
• Cybersecurity advances
• Virtual reality mainstream adoption
```

### Example 3: Event Listing Extraction

**URL**: `https://city-events.com/upcoming`

**Prompt**: "Extract event name, date, time, venue, and ticket price for each event listed"

**Expected Output** (Excel format):
```
Event Name          | Date       | Time     | Venue           | Price
Concert in the Park | 2024-02-15 | 7:00 PM  | Central Park    | Free
Tech Conference     | 2024-02-20 | 9:00 AM  | Convention Ctr  | $150
Art Exhibition      | 2024-02-25 | 10:00 AM | City Gallery    | $15
```

### Example 4: Restaurant Information

**URL**: `https://restaurant-finder.com/downtown-bistro`

**Prompt**: "Get restaurant name, cuisine type, address, phone, hours, average price, and customer reviews summary"

**Expected Output** (PDF format):
```
Downtown Bistro

Cuisine: Italian-American
Address: 123 Main Street, Downtown
Phone: (555) 123-4567

Hours:
Monday-Thursday: 11:00 AM - 10:00 PM
Friday-Saturday: 11:00 AM - 11:00 PM
Sunday: 12:00 PM - 9:00 PM

Average Price: $25-35 per person

Customer Reviews Summary:
- Excellent pasta dishes and wine selection
- Great atmosphere for date nights
- Service can be slow during peak hours
- Highly recommended tiramisu
```

### Example 5: Job Listing Extraction

**URL**: `https://job-board.com/software-developer-remote`

**Prompt**: "Extract job title, company name, location, salary range, required skills, and application deadline"

**Expected Output** (Text format):
```
Job Title: Senior Software Developer
Company: Tech Innovation Inc.
Location: Remote (US only)
Salary: $80,000 - $120,000 annually

Required Skills:
- Python programming
- React/JavaScript
- Database design (PostgreSQL)
- AWS cloud services
- 5+ years experience

Application Deadline: February 28, 2024
```

### Tips for Success

1. **Start Simple**: Begin with basic prompts and gradually make them more specific
2. **Test Different Formats**: Try various output formats to see which works best for your needs
3. **Refine Prompts**: If results aren't perfect, adjust your prompt and try again
4. **Check Source**: Always verify the original webpage has the information you're requesting
5. **Save Successful Prompts**: Keep track of prompts that work well for future use

Remember: The AI Web Scraper is designed to save you time by automatically extracting and formatting web content. With practice, you'll become more effective at writing prompts and choosing the right output formats for your needs.
